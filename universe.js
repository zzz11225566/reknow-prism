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
  var lastPointer = null;
  var pointerDown = null;
  var dragging = false;

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
    return DATA.themes.find(function (theme) {
      return theme.id === id;
    });
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
    var disk = new THREE.Group();
    disk.rotation.x = -0.58 + layout.rotation;
    disk.rotation.z = layout.rotation * 0.55;
    group.add(disk);

    var coreColor = new THREE.Color(theme.color);
    var coreMaterial = new THREE.MeshStandardMaterial({
      color: coreColor,
      emissive: coreColor,
      emissiveIntensity: selectedTheme === theme.id ? 2.3 : 1.15,
      roughness: 0.42,
      metalness: 0.1,
    });
    var core = new THREE.Mesh(new THREE.SphereGeometry(0.58, 28, 20), coreMaterial);
    core.position.set(0, 0.1, 0);
    disk.add(core);

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

    var ring = new THREE.Mesh(
      new THREE.TorusGeometry(3.55, selectedTheme === theme.id ? 0.035 : 0.018, 10, 120),
      new THREE.MeshBasicMaterial({
        color: selectedTheme === theme.id ? 0xe0b461 : theme.color,
        transparent: true,
        opacity: selectedTheme === theme.id ? 0.78 : 0.34,
        depthWrite: false,
      }),
    );
    ring.rotation.x = Math.PI / 2;
    disk.add(ring);

    var dustGeometry = new THREE.BufferGeometry();
    var dustPositions = [];
    for (var i = 0; i < 180; i += 1) {
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
        color: theme.color,
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
    };
  }

  function planetPosition(index, count) {
    var turns = 2.25;
    var t = (index + 1) / Math.max(2, count + 1);
    var angle = t * Math.PI * 2 * turns;
    var radius = 1.25 + t * 3.4;
    return new THREE.Vector3(
      Math.cos(angle) * radius,
      0.15 + ((index % 3) - 1) * 0.24,
      Math.sin(angle) * radius,
    );
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
    var lifecycle = APP.getArticleState(article.id);
    var mastered = lifecycle.status === "lit";
    var baseColor = new THREE.Color(mastered ? "#e3b45d" : theme.color);
    var radius = 0.25 + Math.min(0.16, article.votes / 70000);
    var geometry = new THREE.SphereGeometry(radius, 24, 18);
    var material = new THREE.MeshStandardMaterial({
      color: mastered ? baseColor : baseColor.clone().multiplyScalar(0.72),
      emissive: baseColor,
      emissiveIntensity: mastered ? 0.74 : 0.18,
      roughness: 0.42,
      metalness: 0.08,
    });
    var planet = new THREE.Mesh(geometry, material);
    var position = planetPosition(index, count);
    planet.position.copy(position);
    planet.userData = {
      articleId: article.id,
      themeId: theme.id,
      baseScale: 1,
      phase: Math.random() * Math.PI * 2,
      mastered: mastered,
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

    if (selectedTheme === article.themeId) {
      var orbit = new THREE.Mesh(
        new THREE.TorusGeometry(position.length(), 0.009, 8, 96),
        new THREE.MeshBasicMaterial({
          color: theme.color,
          transparent: true,
          opacity: 0.13,
          depthWrite: false,
        }),
      );
      orbit.rotation.x = Math.PI / 2;
      disk.add(orbit);
    }

    var worldPosition = position.clone();
    planetMap[article.id] = {
      article: article,
      mesh: planet,
      galaxy: galaxyLayout,
      worldPosition: worldPosition,
    };
  }

  function createEdges() {
    var appState = state();
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
        a.worldPosition = a.mesh.getWorldPosition(new THREE.Vector3());
        b.worldPosition = b.mesh.getWorldPosition(new THREE.Vector3());
        var positions = new Float32Array([
          a.worldPosition.x,
          a.worldPosition.y,
          a.worldPosition.z,
          b.worldPosition.x,
          b.worldPosition.y,
          b.worldPosition.z,
        ]);
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
        edgeLines.push(line);
        scene.add(line);
        sceneObjects.push(line);
      });
    });
    if (appState.preferences.universeOrder === "mastery") return;
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
    scene.updateMatrixWorld(true);
    createEdges();
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
        "</button>";
    } else {
      html +=
        '<span style="color:rgba(216,228,249,.48);font-size:10px">选择星系，进入主题内部</span>';
    }
    $("universeBreadcrumb").innerHTML = html;
  }

  function renderEmptyState() {
    var hasVisible = visibleUniverseArticles().length > 0;
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
          '" type="button">标记已掌握</button>'
        : "") +
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
      entry.group.userData.ring.material.color.set(
        selectedTheme === themeId ? 0xe0b461 : theme.color,
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
    canvas.addEventListener("pointerdown", function (event) {
      pointerDown = { x: event.clientX, y: event.clientY };
      dragging = false;
      canvas.setPointerCapture(event.pointerId);
    });
    canvas.addEventListener("pointermove", function (event) {
      if (!pointerDown) return;
      var dx = event.clientX - pointerDown.x;
      var dy = event.clientY - pointerDown.y;
      if (Math.abs(dx) + Math.abs(dy) > 5) dragging = true;
      if (!dragging) return;
      cameraGoal.yaw -= dx * 0.004;
      cameraGoal.pitch = Math.max(
        -0.62,
        Math.min(1.12, cameraGoal.pitch - dy * 0.0038),
      );
      pointerDown = { x: event.clientX, y: event.clientY };
    });
    canvas.addEventListener("pointerup", function (event) {
      if (!dragging) {
        var mesh = pickPlanet(event);
        if (mesh && mesh.userData.articleId) {
          showPlanetCard(mesh.userData.articleId);
        }
      }
      pointerDown = null;
      dragging = false;
    });
    canvas.addEventListener(
      "wheel",
      function (event) {
        event.preventDefault();
        cameraGoal.distance = Math.max(
          7,
          Math.min(58, cameraGoal.distance * Math.exp(event.deltaY * 0.0012)),
        );
      },
      { passive: false },
    );
  }

  function resetCamera(instant) {
    selectedTheme = null;
    selectedPlanet = null;
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
    cameraGoal.target.copy(themeMap[themeId].layout.center);
    cameraGoal.distance = 14;
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
    if (action === "open-zhihu") API.openZhihuSearch(button.getAttribute("data-query"));
    if (action === "focus-article") focusArticle(button.getAttribute("data-article-id"));
    if (action === "import-search") importSearchResult(button.getAttribute("data-search-id"));
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
