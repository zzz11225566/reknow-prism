(function () {
  "use strict";

  var APP = window.RK_APP;
  var DATA = window.RK_DATA;
  var API = window.RK_API;
  var THREE = window.THREE;

  var canvas;
  var renderer;
  var scene;
  var camera;
  var clock;
  var raycaster;
  var pointer;
  var frameId = 0;
  var active = false;
  var initialized = false;
  var resizeHandler;
  var eventController = false;
  var sceneObjects = [];
  var pickMeshes = [];
  var planetMap = {};
  var themeMap = {};
  var edgeLines = [];
  var glowTexture;
  var selectedTheme = null;
  var selectedPlanet = null;
  var currentSearchMode = "zhihu";
  var searchQuery = "";
  var dragging = false;
  var pointerStates = new Map();
  var touchGesture = null;
  var galaxyFocusMode = false;
  var starClickTimes = {};

  var cameraState = {
    yaw: 0.72,
    pitch: 0.58,
    distance: 30,
    target: null,
  };

  var cameraGoal = {
    yaw: 0.72,
    pitch: 0.58,
    distance: 30,
    target: null,
  };

  function $(id) {
    return document.getElementById(id);
  }

  function icon(name) {
    return APP ? APP.icon(name) : "";
  }

  function escapeHtml(value) {
    return APP ? APP.escapeHtml(value) : String(value || "");
  }

  function state() {
    return APP && APP.getState ? APP.getState() : APP.state;
  }

  function getArticles() {
    return APP && APP.getArticles ? APP.getArticles() : DATA.articles;
  }

  function getArticle(id) {
    return getArticles().find(function (article) {
      return article.id === id;
    });
  }

  function getTheme(id) {
    return getThemes().find(function (theme) {
      return theme.id === id;
    });
  }

  function getThemes() {
    return APP && APP.getThemes ? APP.getThemes() : DATA.themes;
  }

  function universeSettings() {
    var appState = state();
    return appState.settings ? appState.settings.universe : {};
  }

  function galaxyOverride(themeId) {
    var appState = state();
    return (appState.settings && appState.settings.small.galaxies[themeId]) || {};
  }

  function visibleUniverseArticles(themeId) {
    var appState = state();
    return getArticles().filter(function (article) {
      var lifecycle = APP.getArticleState(article.id);
      return (
        lifecycle.status !== "seed" &&
        Boolean(appState.universeItems[article.id]) &&
        (!themeId || article.themeId === themeId)
      );
    });
  }

  function disposeObject(object) {
    if (!object) return;
    object.traverse(function (child) {
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        var materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach(function (material) {
          if (material.map && material.map !== glowTexture) material.map.dispose();
          material.dispose();
        });
      }
    });
  }

  function clearSceneObjects() {
    sceneObjects.forEach(function (object) {
      scene.remove(object);
      disposeObject(object);
    });
    sceneObjects = [];
    pickMeshes = [];
    planetMap = {};
    themeMap = {};
    edgeLines = [];
  }

  function createGlowTexture() {
    if (glowTexture) return glowTexture;
    var canvasTexture = document.createElement("canvas");
    canvasTexture.width = 128;
    canvasTexture.height = 128;
    var context = canvasTexture.getContext("2d");
    var gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, "rgba(255,255,255,.95)");
    gradient.addColorStop(0.18, "rgba(255,255,255,.52)");
    gradient.addColorStop(0.55, "rgba(255,255,255,.12)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 128, 128);
    glowTexture = new THREE.CanvasTexture(canvasTexture);
    glowTexture.colorSpace = THREE.SRGBColorSpace;
    return glowTexture;
  }

  function makeLabelSprite(text, color, scale) {
    var labelCanvas = document.createElement("canvas");
    labelCanvas.width = 512;
    labelCanvas.height = 128;
    var context = labelCanvas.getContext("2d");
    context.clearRect(0, 0, 512, 128);
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "600 44px Microsoft YaHei, PingFang SC, sans-serif";
    context.shadowColor = "rgba(0,0,0,.9)";
    context.shadowBlur = 14;
    context.fillStyle = color;
    context.fillText(text, 256, 64);
    var texture = new THREE.CanvasTexture(labelCanvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    var material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
      depthTest: false,
    });
    var sprite = new THREE.Sprite(material);
    sprite.scale.set(4.2 * scale, 1.05 * scale, 1);
    return sprite;
  }

  function makePlanetLabelSprite(text, color) {
    var labelCanvas = document.createElement("canvas");
    labelCanvas.width = 640;
    labelCanvas.height = 150;
    var context = labelCanvas.getContext("2d");
    var title = String(text || "");
    var firstLine = title.slice(0, 13);
    var secondLine = title.length > 13 ? title.slice(13, 26) : "";
    context.clearRect(0, 0, 640, 150);
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "600 34px Microsoft YaHei, PingFang SC, sans-serif";
    context.shadowColor = "rgba(0,0,0,.95)";
    context.shadowBlur = 12;
    context.fillStyle = color || "#e6edf9";
    context.fillText(firstLine, 320, secondLine ? 50 : 75);
    if (secondLine) context.fillText(secondLine, 320, 96);
    var texture = new THREE.CanvasTexture(labelCanvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    var sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
        depthTest: false,
      }),
    );
    sprite.scale.set(3.7, 0.86, 1);
    sprite.visible = false;
    return sprite;
  }

  function layoutThemes() {
    var themes = state().addedThemes.map(getTheme).filter(Boolean);
    var count = themes.length;
    var radius = count <= 1 ? 0 : count === 2 ? 7.6 : 10.2;
    return themes.map(function (theme, index) {
      var angle = -Math.PI / 2 + (index / Math.max(1, count)) * Math.PI * 2;
      var x = count <= 1 ? 0 : Math.cos(angle) * radius;
      var y = count <= 2 ? 0 : Math.sin(angle) * radius * 0.62;
      var z = count <= 1 ? 0 : Math.sin(angle * 1.7) * 2.2;
      return {
        theme: theme,
        index: index,
        center: new THREE.Vector3(x, y, z),
        rotation: (index - (count - 1) / 2) * 0.16,
      };
    });
  }

  function createGalaxy(group, layout) {
    var theme = layout.theme;
    var override = galaxyOverride(theme.id);
    var galaxyColor = override.color || theme.color;
    var settings = universeSettings();
    var disk = new THREE.Group();
    disk.rotation.x = -0.58 + layout.rotation;
    disk.rotation.z = layout.rotation * 0.55;
    group.add(disk);

    var coreColor = new THREE.Color(galaxyColor);
    var coreMaterial = new THREE.MeshStandardMaterial({
      color: coreColor,
      emissive: coreColor,
      emissiveIntensity: selectedTheme === theme.id ? 2.3 : 1.15,
      roughness: 0.42,
      metalness: 0.1,
    });
    var core = new THREE.Mesh(new THREE.SphereGeometry(0.58, 28, 20), coreMaterial);
    core.position.set(0, 0.1, 0);
    core.userData = { themeId: theme.id, kind: "star" };
    disk.add(core);
    pickMeshes.push(core);

    var haloMaterial = new THREE.SpriteMaterial({
      map: createGlowTexture(),
      color: coreColor,
      transparent: true,
      opacity: 0.72,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    var halo = new THREE.Sprite(haloMaterial);
    halo.scale.set(4.8, 4.8, 1);
    disk.add(halo);

    var starLight = new THREE.PointLight(coreColor, 1.4, 11);
    starLight.position.set(0, 0, 0);
    disk.add(starLight);

    var ring = new THREE.Mesh(
      new THREE.TorusGeometry(3.55, selectedTheme === theme.id ? 0.035 : 0.018, 10, 120),
      new THREE.MeshBasicMaterial({
        color: selectedTheme === theme.id ? 0xe0b461 : galaxyColor,
        transparent: true,
        opacity: selectedTheme === theme.id ? 0.78 : 0.34,
        depthWrite: false,
      }),
    );
    ring.rotation.x = Math.PI / 2;
    disk.add(ring);

    var dustGeometry = new THREE.BufferGeometry();
    var dustPositions = [];
    var dustCount = settings.highPerformance ? 70 : 180;
    for (var i = 0; i < dustCount; i += 1) {
      var angle = Math.random() * Math.PI * 2;
      var distance = 1.1 + Math.pow(Math.random(), 0.72) * 4.1;
      var armOffset = Math.sin(angle * 2 + distance * 2.2) * 0.28;
      dustPositions.push(
        Math.cos(angle + armOffset) * distance,
        (Math.random() - 0.5) * 0.22,
        Math.sin(angle + armOffset) * distance,
      );
    }
    dustGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(dustPositions, 3),
    );
    var dust = new THREE.Points(
      dustGeometry,
      new THREE.PointsMaterial({
        color: galaxyColor,
        size: 0.045,
        transparent: true,
        opacity: 0.42,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    disk.add(dust);

    var label = makeLabelSprite(theme.name, "#f3f6ff", 1);
    label.position.set(0, 2.05, 0);
    group.add(label);

    group.userData = {
      themeId: theme.id,
      disk: disk,
      ring: ring,
      core: core,
      halo: halo,
      dust: dust,
      color: galaxyColor,
    };
  }

  function articleOrder(articles) {
    var appState = state();
    var order = appState.preferences.universeOrder;
    return articles.slice().sort(function (a, b) {
      var aState = APP.getArticleState(a.id);
      var bState = APP.getArticleState(b.id);
      if (order === "mastery") return bState.mastery - aState.mastery;
      if (order === "recent") {
        return (
          ((appState.universeItems[b.id] || {}).addedAt || 0) -
          ((appState.universeItems[a.id] || {}).addedAt || 0)
        );
      }
      return b.votes - a.votes;
    });
  }

  function createPlanet(group, disk, article, index, count, galaxyLayout) {
    var theme = getTheme(article.themeId);
    var override = galaxyOverride(theme.id);
    var settings = universeSettings();
    var lifecycle = APP.getArticleState(article.id);
    var mastered = lifecycle.status === "lit";
    var baseColor = new THREE.Color(override.color || theme.color);
    var radius = 0.25 + Math.min(0.16, article.votes / 70000);
    var detail = settings.highPerformance ? 12 : 24;
    var geometry = new THREE.SphereGeometry(radius, detail, Math.max(10, detail - 6));
    var material = new THREE.MeshStandardMaterial({
      color: mastered ? baseColor : baseColor.clone().multiplyScalar(0.72),
      emissive: baseColor,
      emissiveIntensity: mastered ? 0.74 : 0.18,
      roughness: 0.42,
      metalness: 0.08,
    });
    var planet = new THREE.Mesh(geometry, material);
    var t = (index + 1) / Math.max(2, count + 1);
    var orbitRadius = 1.25 + t * 3.4;
    var orbitAngle = t * Math.PI * 2 * 2.25;
    var baseY = 0.15 + ((index % 3) - 1) * 0.24;
    var speedKey = override.orbitSpeed || "standard";
    var speedMultiplier =
      speedKey === "slow" ? 0.45 : speedKey === "fast" ? 2.2 : 1;
    var orbitSpeed = settings.showEffects === false ? 0 : 0.035 * speedMultiplier;
    planet.position.set(
      Math.cos(orbitAngle) * orbitRadius,
      baseY,
      Math.sin(orbitAngle) * orbitRadius,
    );
    planet.userData = {
      articleId: article.id,
      themeId: theme.id,
      baseScale: 1,
      phase: Math.random() * Math.PI * 2,
      mastered: mastered,
      radius: radius,
      orbitRadius: orbitRadius,
      orbitAngle: orbitAngle,
      orbitSpeed: orbitSpeed,
      baseY: baseY,
    };
    disk.add(planet);
    pickMeshes.push(planet);

    var glow = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: createGlowTexture(),
        color: baseColor,
        transparent: true,
        opacity: mastered ? 0.72 : 0.26,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    glow.scale.set(radius * (mastered ? 8 : 5.5), radius * (mastered ? 8 : 5.5), 1);
    planet.add(glow);

    var planetLabel = makePlanetLabelSprite(
      article.title,
      "#e7efff",
    );
    planetLabel.position.set(
      planet.position.x,
      planet.position.y + radius + 0.46,
      planet.position.z,
    );
    disk.add(planetLabel);

    if (selectedTheme === article.themeId) {
      var orbit = new THREE.Mesh(
        new THREE.TorusGeometry(orbitRadius, 0.009, 8, 96),
        new THREE.MeshBasicMaterial({
          color: override.color || theme.color,
          transparent: true,
          opacity: 0.13,
          depthWrite: false,
        }),
      );
      orbit.rotation.x = Math.PI / 2;
      disk.add(orbit);
    }

    planetMap[article.id] = {
      article: article,
      mesh: planet,
      label: planetLabel,
      galaxy: galaxyLayout,
      worldPosition: planet.position.clone(),
      radius: radius,
    };
  }

  function updatePlanetPositions(time) {
    Object.keys(planetMap).forEach(function (id) {
      var entry = planetMap[id];
      var orbit = entry.mesh.userData;
      var angle = orbit.orbitAngle + time * orbit.orbitSpeed;
      entry.mesh.position.set(
        Math.cos(angle) * orbit.orbitRadius,
        orbit.baseY + Math.sin(time * 0.35 + orbit.phase) * 0.025,
        Math.sin(angle) * orbit.orbitRadius,
      );
      entry.label.position.set(
        entry.mesh.position.x,
        entry.mesh.position.y + orbit.radius + 0.46,
        entry.mesh.position.z,
      );
    });
  }

  function updatePlanetLabels() {
    var settings = universeSettings();
    Object.keys(planetMap).forEach(function (id) {
      var entry = planetMap[id];
      var override = galaxyOverride(entry.article.themeId);
      var mode = override.labelMode || settings.labelMode || "automatic";
      if (
        mode === "always" ||
        (galaxyFocusMode && selectedTheme === entry.article.themeId)
      ) {
        entry.label.visible = true;
        return;
      }
      var worldPosition = entry.mesh.getWorldPosition(new THREE.Vector3());
      var distance = camera.position.distanceTo(worldPosition);
      var pixelSize =
        (entry.radius * window.innerHeight) /
        Math.max(0.1, 2 * distance * Math.tan((camera.fov * Math.PI) / 360));
      var threshold =
        mode === "near" ? 13 : mode === "early" ? 7 : 9;
      entry.label.visible = pixelSize >= threshold || selectedPlanet === id;
    });
  }

  function createEdges() {
    var appState = state();
    if (appState.settings.universe.showLinks === false) return;
    var visible = visibleUniverseArticles();
    var index = {};
    visible.forEach(function (article) {
      index[article.id] = article;
    });
    visible.forEach(function (article) {
      (article.relations || []).forEach(function (relatedId) {
        if (!index[relatedId] || article.id > relatedId) return;
        var a = planetMap[article.id];
        var b = planetMap[relatedId];
        if (!a || !b) return;
        var positions = new Float32Array(6);
        var geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        var bothMastered =
          APP.getArticleState(article.id).status === "lit" &&
          APP.getArticleState(relatedId).status === "lit";
        var line = new THREE.Line(
          geometry,
          new THREE.LineBasicMaterial({
            color: bothMastered ? 0xdfb65f : 0x6687bc,
            transparent: true,
            opacity: bothMastered ? 0.42 : 0.18,
            depthWrite: false,
          }),
        );
        edgeLines.push({
          line: line,
          a: article.id,
          b: relatedId,
        });
        scene.add(line);
        sceneObjects.push(line);
      });
    });
  }

  function updateEdges() {
    edgeLines.forEach(function (edge) {
      var a = planetMap[edge.a];
      var b = planetMap[edge.b];
      if (!a || !b) return;
      a.worldPosition = a.mesh.getWorldPosition(new THREE.Vector3());
      b.worldPosition = b.mesh.getWorldPosition(new THREE.Vector3());
      var positions = edge.line.geometry.attributes.position.array;
      positions[0] = a.worldPosition.x;
      positions[1] = a.worldPosition.y;
      positions[2] = a.worldPosition.z;
      positions[3] = b.worldPosition.x;
      positions[4] = b.worldPosition.y;
      positions[5] = b.worldPosition.z;
      edge.line.geometry.attributes.position.needsUpdate = true;
    });
  }

  function buildUniverse() {
    if (!scene) return;
    clearSceneObjects();
    var layouts = layoutThemes();
    layouts.forEach(function (layout) {
      var group = new THREE.Group();
      group.position.copy(layout.center);
      scene.add(group);
      sceneObjects.push(group);
      themeMap[layout.theme.id] = { group: group, layout: layout };
      createGalaxy(group, layout);
      var articles = articleOrder(
        visibleUniverseArticles(layout.theme.id),
      );
      articles.forEach(function (article, index) {
        createPlanet(group, group.userData.disk, article, index, articles.length, layout);
      });
    });
    updatePlanetPositions(0);
    scene.updateMatrixWorld(true);
    createEdges();
    updateEdges();
    updatePlanetLabels();
    renderCounter();
    renderBreadcrumb();
    renderEmptyState();
  }

  function renderCounter() {
    var info = APP.levelInfo();
    $("universeCounter").textContent =
      String(state().addedThemes.length) +
      " 个星系 · " +
      String(info.planets) +
      " 颗行星";
  }

  function renderBreadcrumb() {
    var html =
      '<button class="breadcrumb-button" data-universe-action="reset-camera" type="button">全部星域</button>' +
      "<span>/</span>";
    if (selectedTheme) {
      var theme = getTheme(selectedTheme);
      html +=
        '<button class="breadcrumb-button" type="button">' +
        escapeHtml(theme.name) +
        "</button>" +
        '<button class="breadcrumb-button" data-universe-action="open-galaxy-settings" type="button" aria-label="星系小设置" title="星系小设置">' +
        icon("settings") +
        "</button>";
    } else {
      html +=
        '<span style="color:rgba(216,228,249,.48);font-size:10px">选择星系，进入主题内部</span>';
    }
    $("universeBreadcrumb").innerHTML = html;
  }

  function renderEmptyState() {
    var hasVisible = state().addedThemes.length > 0;
    $("universeEmpty").hidden = hasVisible;
    $("universeEmpty").innerHTML = hasVisible
      ? ""
      : "<strong>星海还没有行星</strong><p>从收藏拆解中完成一篇文章，再把它加入主题星系。</p>" +
        '<button class="button" data-universe-action="go-workspace" type="button">' +
        icon("library") +
        "去收藏拆解" +
        "</button>";
  }

  function showPlanetCard(articleId) {
    var article = getArticle(articleId);
    if (!article) return;
    var lifecycle = APP.getArticleState(article.id);
    var theme = getTheme(article.themeId);
    selectedPlanet = article.id;
    highlightPlanet(article.id);
    $("planetCard").hidden = false;
    $("planetCard").innerHTML =
      '<div class="planet-card-head">' +
      "<div>" +
      '<span class="panel-kicker" style="color:' +
      theme.color +
      '">' +
      escapeHtml(theme.name) +
      " · 行星</span>" +
      "<h3>" +
      escapeHtml(article.title) +
      "</h3>" +
      '<div class="planet-meta">' +
      '<span class="planet-tag' +
      (lifecycle.status === "lit" ? " lit" : "") +
      '">' +
      escapeHtml(APP.statusLabel(lifecycle.status)) +
      "</span>" +
      '<span class="planet-tag">' +
      APP.formatVotes(article.votes) +
      " 赞同</span>" +
      '<span class="planet-tag">' +
      escapeHtml(String(lifecycle.mastery)) +
      "% 掌握度</span>" +
      "</div>" +
      "</div>" +
      '<button class="universe-icon-button" data-universe-action="close-planet-card" type="button" aria-label="关闭">' +
      icon("x") +
      "</button>" +
      "</div>" +
      "<p>" +
      escapeHtml(article.analysis.transfer.personalQuestion) +
      "</p>" +
      '<div class="card-actions">' +
      '<button class="universe-button primary" data-universe-action="open-article" data-article-id="' +
      article.id +
      '" type="button">' +
      "继续拆解" +
      "</button>" +
      (lifecycle.status !== "lit"
        ? '<button class="universe-button" data-universe-action="mastered" data-article-id="' +
          article.id +
          '" type="button">点亮星球</button>' +
          '<button class="universe-button" data-universe-action="unlearn" data-article-id="' +
          article.id +
          '" type="button">改为未学会</button>'
        : '<button class="universe-button" data-universe-action="unlight" data-article-id="' +
          article.id +
          '" type="button">改为未点亮</button>') +
      '<button class="universe-button" data-universe-action="open-zhihu" data-query="' +
      escapeHtml(article.question) +
      '" type="button">打开知乎</button>' +
      "</div>";
  }

  function highlightPlanet(articleId) {
    Object.keys(planetMap).forEach(function (id) {
      var entry = planetMap[id];
      entry.mesh.material.emissiveIntensity =
        id === articleId ? 1.4 : entry.mesh.userData.mastered ? 0.74 : 0.18;
      entry.mesh.userData.baseScale = id === articleId ? 1.22 : 1;
    });
  }

  function updateThemeRings() {
    Object.keys(themeMap).forEach(function (themeId) {
      var entry = themeMap[themeId];
      var theme = getTheme(themeId);
      var override = galaxyOverride(themeId);
      var galaxyColor = override.color || theme.color;
      entry.group.userData.ring.material.color.set(
        selectedTheme === themeId ? 0xe0b461 : galaxyColor,
      );
      entry.group.userData.ring.material.opacity =
        selectedTheme === themeId ? 0.78 : 0.34;
      entry.group.userData.core.material.emissiveIntensity =
        selectedTheme === themeId ? 2.25 : 1.15;
      entry.group.userData.disk.rotation.y += selectedTheme === themeId ? 0.0002 : 0;
    });
  }

  function updateCamera(delta) {
    if (!cameraState.target) return;
    cameraState.yaw += (cameraGoal.yaw - cameraState.yaw) * Math.min(1, delta * 4);
    cameraState.pitch +=
      (cameraGoal.pitch - cameraState.pitch) * Math.min(1, delta * 4);
    cameraState.distance +=
      (cameraGoal.distance - cameraState.distance) * Math.min(1, delta * 4);
    cameraState.target.lerp(cameraGoal.target, Math.min(1, delta * 3.5));

    var horizontal = Math.cos(cameraState.pitch) * cameraState.distance;
    camera.position.set(
      cameraState.target.x + Math.sin(cameraState.yaw) * horizontal,
      cameraState.target.y + Math.sin(cameraState.pitch) * cameraState.distance,
      cameraState.target.z + Math.cos(cameraState.yaw) * horizontal,
    );
    camera.lookAt(cameraState.target);
  }

  function animate() {
    if (!active || !renderer) return;
    frameId = requestAnimationFrame(animate);
    var delta = Math.min(0.05, clock.getDelta());
    var time = clock.elapsedTime;
    updateCamera(delta);
    updateThemeRings();
    updatePlanetPositions(time);
    scene.updateMatrixWorld(true);
    updateEdges();
    updatePlanetLabels();
    Object.keys(planetMap).forEach(function (id) {
      var entry = planetMap[id];
      var targetScale =
        entry.mesh.userData.baseScale +
        Math.sin(time * 1.35 + entry.mesh.userData.phase) * 0.025;
      entry.mesh.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        Math.min(1, delta * 5),
      );
      entry.mesh.rotation.y += delta * (entry.mesh.userData.mastered ? 0.22 : 0.12);
    });
    renderer.render(scene, camera);
  }

  function resize() {
    if (!renderer || !camera) return;
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  function pointerToNdc(event) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
      y: -((event.clientY - rect.top) / rect.height) * 2 + 1,
    };
  }

  function pickPlanet(event) {
    if (!camera || !raycaster) return null;
    var point = pointerToNdc(event);
    pointer.set(point.x, point.y);
    raycaster.setFromCamera(pointer, camera);
    var intersections = raycaster.intersectObjects(pickMeshes, false);
    return intersections.length ? intersections[0].object : null;
  }

  function bindCanvasEvents() {
    if (eventController) return;
    eventController = true;
    var sensitivity = function () {
      var value = universeSettings().sensitivity || "standard";
      return value === "gentle" ? 0.65 : value === "quick" ? 1.45 : 1;
    };
    var panCamera = function (dx, dy) {
      var factor = sensitivity();
      var panScale = cameraGoal.distance * 0.0018;
      var right = new THREE.Vector3().setFromMatrixColumn(camera.matrix, 0);
      var up = new THREE.Vector3().setFromMatrixColumn(camera.matrix, 1);
      cameraGoal.target.addScaledVector(right, -dx * panScale * factor);
      cameraGoal.target.addScaledVector(up, dy * panScale * factor);
    };
    canvas.addEventListener("pointerdown", function (event) {
      dragging = false;
      pointerStates.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY,
        mode:
          event.pointerType === "mouse" &&
          (event.button === 1 || event.button === 2)
            ? "pan"
            : "rotate",
      });
      canvas.setPointerCapture(event.pointerId);
      if (event.pointerType === "mouse" && event.button !== 0) {
        event.preventDefault();
      }
    });
    canvas.addEventListener("pointermove", function (event) {
      var previous = pointerStates.get(event.pointerId);
      if (!previous) return;
      var current = { x: event.clientX, y: event.clientY, mode: previous.mode };
      pointerStates.set(event.pointerId, current);
      var dx = current.x - previous.x;
      var dy = current.y - previous.y;
      if (Math.abs(dx) + Math.abs(dy) > 4) dragging = true;
      if (pointerStates.size === 1) {
        if (!dragging) return;
        if (current.mode === "pan") {
          panCamera(dx, dy);
        } else {
          var factor = sensitivity();
          cameraGoal.yaw -= dx * 0.004 * factor;
          cameraGoal.pitch = Math.max(
            -0.62,
            Math.min(1.12, cameraGoal.pitch + dy * 0.0038 * factor),
          );
        }
        return;
      }
      if (pointerStates.size >= 2) {
        var points = Array.from(pointerStates.values()).slice(0, 2);
        var midpoint = {
          x: (points[0].x + points[1].x) / 2,
          y: (points[0].y + points[1].y) / 2,
        };
        var distance = Math.hypot(
          points[0].x - points[1].x,
          points[0].y - points[1].y,
        );
        if (touchGesture) {
          panCamera(
            midpoint.x - touchGesture.midpoint.x,
            midpoint.y - touchGesture.midpoint.y,
          );
          if (touchGesture.distance > 0 && distance > 0) {
            cameraGoal.distance = Math.max(
              7,
              Math.min(
                58,
                cameraGoal.distance * (touchGesture.distance / distance),
              ),
            );
          }
        }
        touchGesture = { midpoint: midpoint, distance: distance };
        dragging = true;
      }
    });
    canvas.addEventListener("pointerup", function (event) {
      if (!dragging && pointerStates.size === 1) {
        var mesh = pickPlanet(event);
        if (mesh && mesh.userData.kind === "star") {
          handleStarClick(mesh.userData.themeId);
        } else if (mesh && mesh.userData.articleId) {
          showPlanetCard(mesh.userData.articleId);
        }
      }
      pointerStates.delete(event.pointerId);
      if (pointerStates.size < 2) touchGesture = null;
      dragging = false;
    });
    canvas.addEventListener("pointercancel", function (event) {
      pointerStates.delete(event.pointerId);
      if (pointerStates.size < 2) touchGesture = null;
      dragging = false;
    });
    canvas.addEventListener("contextmenu", function (event) {
      event.preventDefault();
    });
    canvas.addEventListener(
      "wheel",
      function (event) {
        event.preventDefault();
        cameraGoal.distance = Math.max(
          7,
          Math.min(
            58,
            cameraGoal.distance *
              Math.exp(event.deltaY * 0.0012 * sensitivity()),
          ),
        );
      },
      { passive: false },
    );
  }

  function resetCamera(instant) {
    selectedTheme = null;
    selectedPlanet = null;
    galaxyFocusMode = false;
    cameraGoal.yaw = 0.72;
    cameraGoal.pitch = 0.58;
    cameraGoal.distance = 30;
    cameraGoal.target.set(0, 0, 0);
    if (instant && cameraState.target) {
      cameraState.yaw = cameraGoal.yaw;
      cameraState.pitch = cameraGoal.pitch;
      cameraState.distance = cameraGoal.distance;
      cameraState.target.copy(cameraGoal.target);
    }
    $("planetCard").hidden = true;
    highlightPlanet(null);
    updateThemeRings();
    renderBreadcrumb();
  }

  function focusTheme(themeId, instant) {
    if (!themeMap[themeId]) {
      showToast("这个主题还没有加入宇宙");
      return;
    }
    selectedTheme = themeId;
    selectedPlanet = null;
    galaxyFocusMode = true;
    cameraGoal.target.copy(themeMap[themeId].layout.center);
    cameraGoal.distance = 8.2;
    cameraGoal.pitch = 0.45;
    cameraGoal.yaw = 0.82;
    if (instant && cameraState.target) {
      cameraState.yaw = cameraGoal.yaw;
      cameraState.pitch = cameraGoal.pitch;
      cameraState.distance = cameraGoal.distance;
      cameraState.target.copy(cameraGoal.target);
    }
    $("planetCard").hidden = true;
    highlightPlanet(null);
    updateThemeRings();
    renderBreadcrumb();
  }

  function handleStarClick(themeId) {
    var now = Date.now();
    var previous = starClickTimes[themeId] || 0;
    if (now - previous < 420) {
      starClickTimes[themeId] = 0;
      if (APP.openGalaxySettings) APP.openGalaxySettings(themeId);
      return;
    }
    starClickTimes[themeId] = now;
    focusTheme(themeId);
  }

  function focusArticle(articleId) {
    var article = getArticle(articleId);
    if (!article) return;
    var appState = state();
    if (!appState.universeItems[articleId]) return;
    focusTheme(article.themeId);
    setTimeout(function () {
      showPlanetCard(articleId);
    }, 650);
  }

  function showToast(message, type) {
    if (APP && APP.showToast) APP.showToast(message, type);
  }

  function renderLoading(hidden) {
    $("universeLoading").classList.toggle("is-hidden", Boolean(hidden));
  }

  function initThree() {
    if (initialized) return true;
    if (!THREE) {
      showToast("3D 引擎未加载，宇宙将以静态模式展示", "warning");
      renderLoading(true);
      return false;
    }
    canvas = $("universeCanvas");
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch (error) {
      console.warn("WebGL unavailable", error);
      showToast("当前环境无法开启 WebGL，宇宙已切换为兼容模式", "warning");
      renderLoading(true);
      return false;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
    renderer.setClearColor(0x05070d, 1);
    if ("outputColorSpace" in renderer) {
      renderer.outputColorSpace = THREE.SRGBColorSpace;
    }
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05070d, 0.014);
    camera = new THREE.PerspectiveCamera(45, 1, 0.1, 200);
    cameraState.target = new THREE.Vector3();
    cameraGoal.target = new THREE.Vector3();
    clock = new THREE.Clock();
    raycaster = new THREE.Raycaster();
    pointer = new THREE.Vector2();

    scene.add(new THREE.AmbientLight(0x8da3cf, 0.58));
    var key = new THREE.PointLight(0x7fa3ff, 2.2, 80);
    key.position.set(10, 14, 16);
    scene.add(key);
    var warm = new THREE.PointLight(0xe0b461, 2, 60);
    warm.position.set(-12, -4, 8);
    scene.add(warm);

    var starGeometry = new THREE.BufferGeometry();
    var starPositions = [];
    for (var i = 0; i < 820; i += 1) {
      var radius = 28 + Math.random() * 48;
      var theta = Math.random() * Math.PI * 2;
      var phi = Math.acos(2 * Math.random() - 1);
      starPositions.push(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta),
      );
    }
    starGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(starPositions, 3),
    );
    var starfield = new THREE.Points(
      starGeometry,
      new THREE.PointsMaterial({
        color: 0xc8d8ff,
        size: 0.08,
        transparent: true,
        opacity: 0.55,
        sizeAttenuation: true,
        depthWrite: false,
      }),
    );
    scene.add(starfield);

    resizeHandler = resize;
    window.addEventListener("resize", resizeHandler);
    bindCanvasEvents();
    resize();
    resetCamera(true);
    initialized = true;
    return true;
  }

  function enter() {
    active = true;
    renderLoading(false);
    if (initThree()) {
      buildUniverse();
      resize();
      clock.start();
      setTimeout(function () {
        renderLoading(true);
      }, 420);
      if (frameId) cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(animate);
    }
  }

  function exit() {
    active = false;
    if (frameId) cancelAnimationFrame(frameId);
    frameId = 0;
    $("universePanel").classList.remove("is-open");
    $("planetCard").hidden = true;
  }

  function refresh() {
    if (!initialized) return;
    buildUniverse();
  }

  function openPanel(kicker, title) {
    $("universePanelKicker").textContent = kicker;
    $("universePanelTitle").textContent = title;
    $("universePanel").classList.add("is-open");
  }

  function renderZhihuResults(query) {
    openPanel("知乎搜索", query ? "找到这些可炼化内容" : "近期优质知识");
    $("universePanelBody").innerHTML =
      '<div class="universe-empty" style="position:static;transform:none;width:auto;text-align:left">正在检索知乎内容…</div>';
    API.searchZhihu(query).then(function (results) {
      $("universePanelBody").innerHTML = results
        .map(function (result) {
          var theme = getTheme(result.themeId);
          return (
            '<article class="search-result">' +
            "<h4>" +
            escapeHtml(result.title) +
            "</h4><p>" +
            escapeHtml(result.excerpt) +
            "</p>" +
            '<div class="result-meta"><span>' +
            escapeHtml(result.author) +
            " · " +
            APP.formatVotes(result.votes) +
            " 赞同</span><span style=\"color:" +
            theme.color +
            '">' +
            escapeHtml(theme.name) +
            "</span></div>" +
            '<div class="result-actions">' +
            '<button class="universe-button primary" data-universe-action="import-search" data-search-id="' +
            result.id +
            '" type="button">加入待拆解</button>' +
            '<button class="universe-button" data-universe-action="open-zhihu" data-query="' +
            escapeHtml(result.title) +
            '" type="button">打开知乎</button>' +
            "</div>" +
            "</article>"
          );
        })
        .join("");
    });
  }

  function renderMineResults(query) {
    var normalized = String(query || "").trim().toLowerCase();
    var articles = visibleUniverseArticles().filter(function (article) {
      if (!normalized) return true;
      return [
        article.title,
        article.question,
        article.author,
        article.tags.join(" "),
      ]
        .join(" ")
        .toLowerCase()
        .indexOf(normalized) !== -1;
    });
    openPanel("我的宇宙", normalized ? "匹配的星球" : "全部行星");
    if (!articles.length) {
      $("universePanelBody").innerHTML =
        '<div style="padding:28px 8px;text-align:center;color:rgba(216,228,249,.55);font-size:11px">没有匹配的星球。试试搜索主题或答主。</div>';
      return;
    }
    $("universePanelBody").innerHTML = articles
      .map(function (article) {
        var lifecycle = APP.getArticleState(article.id);
        var theme = getTheme(article.themeId);
        return (
          '<article class="mine-result">' +
          "<h4>" +
          escapeHtml(article.title) +
          "</h4><p>" +
          escapeHtml(theme.name) +
          " · " +
          escapeHtml(APP.statusLabel(lifecycle.status)) +
          " · " +
          escapeHtml(String(lifecycle.mastery)) +
          "% 掌握度</p>" +
          '<div class="result-actions">' +
          '<button class="universe-button primary" data-universe-action="focus-article" data-article-id="' +
          article.id +
          '" type="button">定位星球</button>' +
          '<button class="universe-button" data-universe-action="open-article" data-article-id="' +
          article.id +
          '" type="button">继续拆解</button>' +
          "</div>" +
          "</article>"
        );
      })
      .join("");
  }

  function runSearch() {
    searchQuery = $("universeSearch").value.trim();
    if (currentSearchMode === "mine") renderMineResults(searchQuery);
    else renderZhihuResults(searchQuery);
  }

  function importSearchResult(id) {
    var result = DATA.searchSeeds.find(function (item) {
      return item.id === id;
    });
    if (!result) return;
    if (!APP.importSearchResult) {
      showToast("已标记为待拆解内容", "success");
      return;
    }
    APP.importSearchResult(result);
    showToast("已加入“" + getTheme(result.themeId).name + "”的待拆解队列", "success");
  }

  function handleAction(event) {
    var button = event.target.closest("[data-universe-action]");
    if (!button) return;
    var action = button.getAttribute("data-universe-action");
    if (action === "reset-camera") resetCamera();
    if (action === "go-workspace") APP.setView("workspace");
    if (action === "close-planet-card") {
      $("planetCard").hidden = true;
      selectedPlanet = null;
      highlightPlanet(null);
    }
    if (action === "open-article") APP.openArticle(button.getAttribute("data-article-id"));
    if (action === "mastered") {
      var id = button.getAttribute("data-article-id");
      APP.markMasteredById(id);
      refresh();
      showPlanetCard(id);
    }
    if (action === "unlearn") {
      var unlearnId = button.getAttribute("data-article-id");
      APP.resetLearningById(unlearnId, "unlearn");
      refresh();
      selectedPlanet = null;
      $("planetCard").hidden = true;
    }
    if (action === "unlight") {
      var unlightId = button.getAttribute("data-article-id");
      APP.resetLearningById(unlightId, "unlight");
      refresh();
      showPlanetCard(unlightId);
    }
    if (action === "open-zhihu") API.openZhihuSearch(button.getAttribute("data-query"));
    if (action === "focus-article") focusArticle(button.getAttribute("data-article-id"));
    if (action === "import-search") importSearchResult(button.getAttribute("data-search-id"));
    if (action === "open-galaxy-settings" && selectedTheme) {
      APP.openGalaxySettings(selectedTheme);
    }
  }

  function bindUniverseEvents() {
    $("runUniverseSearch").addEventListener("click", runSearch);
    $("universeSearch").addEventListener("keydown", function (event) {
      if (event.key === "Enter") runSearch();
    });
    $("universeMode").addEventListener("click", function (event) {
      var button = event.target.closest("[data-mode]");
      if (!button) return;
      currentSearchMode = button.getAttribute("data-mode");
      state().universeMode = currentSearchMode;
      APP.saveState();
      Array.prototype.forEach.call(
        $("universeMode").querySelectorAll("button"),
        function (item) {
          item.classList.toggle("is-active", item === button);
        },
      );
      runSearch();
    });
    $("resetUniverseCamera").addEventListener("click", function () {
      resetCamera();
    });
    $("closeUniversePanel").addEventListener("click", function () {
      $("universePanel").classList.remove("is-open");
    });
    $("universeHud").addEventListener("click", handleAction);
    window.addEventListener("rk:statechange", function () {
      if (initialized && active) refresh();
    });
  }

  function init() {
    var appState = state();
    currentSearchMode = appState.universeMode || "zhihu";
    var modeButtons = $("universeMode").querySelectorAll("button");
    Array.prototype.forEach.call(modeButtons, function (button) {
      button.classList.toggle(
        "is-active",
        button.getAttribute("data-mode") === currentSearchMode,
      );
    });
    $("closeUniversePanel").innerHTML = icon("x");
    $("resetUniverseCamera").innerHTML = icon("maximize");
    $("closeUniverse").innerHTML = icon("x");
    bindUniverseEvents();
    renderBreadcrumb();
  }

  window.RK_UNIVERSE = {
    init: init,
    enter: enter,
    exit: exit,
    refresh: refresh,
    focusArticle: focusArticle,
    focusTheme: focusTheme,
    resetCamera: resetCamera,
  };
})();
