(function () {
  "use strict";

  var DATA = window.RK_DATA;
  var API = window.RK_API;
  var STORAGE_KEY = "reknow-prism-v1";

  var ICON_PATHS = {
    library:
      '<path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/><path d="M2 20h20"/>',
    orbit:
      '<circle cx="12" cy="12" r="3"/><circle cx="19" cy="5" r="2"/><path d="M10.4 21.9a10 10 0 0 0 9.5-12.3"/><path d="M3.1 16.4A10 10 0 0 0 8.7 21.8"/><path d="M5.1 4.6a10 10 0 0 0-1.8 5.2"/>',
    flame:
      '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2-1-3 3 1 4 4 4 6a4 4 0 1 1-8 0c0-1.2.4-2.1 1-3 .4 .7 1 1.5 1.5 2.5Z"/><path d="M14 5c3.5 3.1 6 6.4 6 10a8 8 0 0 1-16 0c0-3 1.4-5.6 4-8"/>',
    settings:
      '<path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5v.2h-4v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3v-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.5V3h4v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.1v4h-.1a1.7 1.7 0 0 0-1.5 1Z"/>',
    refresh:
      '<path d="M20 6v5h-5"/><path d="M4 18v-5h5"/><path d="M5.5 9A7 7 0 0 1 18 6l2 5"/><path d="M18.5 15A7 7 0 0 1 6 18l-2-5"/>',
    play:
      '<path d="m8 5 11 7-11 7Z"/>',
    search:
      '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    "arrow-left":
      '<path d="m15 18-6-6 6-6"/><path d="M9 12h10"/>',
    "arrow-right":
      '<path d="m9 18 6-6-6-6"/><path d="M5 12h10"/>',
    sparkles:
      '<path d="m12 3-1.2 3.3L7.5 7.5l3.3 1.2L12 12l1.2-3.3 3.3-1.2-3.3-1.2Z"/><path d="m5 14-.8 2.2L2 17l2.2.8L5 20l.8-2.2L8 17l-2.2-.8Z"/><path d="m19 13-1 2.8-2.8 1 2.8 1L19 21l1-3.2 2.8-1-2.8-1Z"/>',
    plus:
      '<path d="M12 5v14"/><path d="M5 12h14"/>',
    check:
      '<path d="m20 6-11 11-5-5"/>',
    "book-open":
      '<path d="M2 5.5A3.5 3.5 0 0 1 5.5 2H11v18H5.5A3.5 3.5 0 0 0 2 23.5Z"/><path d="M22 5.5A3.5 3.5 0 0 0 18.5 2H13v18h5.5a3.5 3.5 0 0 1 3.5 3.5Z"/>',
    brain:
      '<path d="M9.5 4A3.5 3.5 0 0 0 6 7.5v.6a3.5 3.5 0 0 0-1 6.4 3.5 3.5 0 0 0 4 4.6V20a2 2 0 0 0 4 0v-1.3a3.5 3.5 0 0 0 2.8-4.5 3.5 3.5 0 0 0-.8-6.7A3.5 3.5 0 0 0 9.5 4Z"/><path d="M9.5 4v16"/><path d="M13 7.5a3.5 3.5 0 0 0-3.5 3.5"/><path d="M6 12.5A3.5 3.5 0 0 0 9.5 16"/>',
    route:
      '<circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h5a4 4 0 0 0 4-4V9"/><path d="M5 7h5a4 4 0 0 1 4 4v2"/>',
    compass:
      '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5Z"/>',
    layers:
      '<path d="m12 2 9 5-9 5-9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/>',
    external:
      '<path d="M15 3h6v6"/><path d="m10 14 11-11"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    clock:
      '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    target:
      '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    trash:
      '<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="m19 6-1 15H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>',
    "chevron-right":
      '<path d="m9 18 6-6-6-6"/>',
    lightbulb:
      '<path d="M9 18h6"/><path d="M10 22h4"/><path d="M8.5 14.5A6 6 0 1 1 16 14c-.9.7-1.5 1.5-1.5 2.5h-5c0-1-.5-1.8-1-2Z"/>',
    link:
      '<path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.2 1.2"/><path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.2-1.2"/>',
    x:
      '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    maximize:
      '<path d="M8 3H3v5"/><path d="M16 3h5v5"/><path d="M21 16v5h-5"/><path d="M3 16v5h5"/>',
    shield:
      '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
    scale:
      '<path d="m16 16 3-8 3 8a5 5 0 0 1-6 0Z"/><path d="m2 16 3-8 3 8a5 5 0 0 1-6 0Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h18"/>',
    network:
      '<circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="M12 7v4"/><path d="m10.5 12.5-4 4"/><path d="m13.5 12.5 4 4"/><path d="M7 17h10"/>',
    signpost:
      '<path d="M12 3v18"/><path d="M5 5h12l2 3-2 3H5Z"/><path d="M19 15H7l-2-3 2-3"/>',
  };

  function icon(name) {
    var path = ICON_PATHS[name] || ICON_PATHS.sparkles;
    return (
      '<span class="icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" ' +
      'stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
      path +
      "</svg></span>"
    );
  }

  function hydrateIcons(root) {
    (root || document).querySelectorAll("[data-icon]").forEach(function (node) {
      if (node.querySelector("svg")) return;
      var name = node.getAttribute("data-icon");
      var path = ICON_PATHS[name] || ICON_PATHS.sparkles;
      node.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
        'stroke-linecap="round" stroke-linejoin="round">' +
        path +
        "</svg>";
    });
  }

  function $(id) {
    return document.getElementById(id);
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      }[char];
    });
  }

  function formatVotes(value) {
    if (value >= 10000) return (value / 10000).toFixed(value >= 100000 ? 0 : 1) + " 万";
    if (value >= 1000) return (value / 1000).toFixed(1) + "k";
    return String(value || 0);
  }

  function themeOf(id) {
    return DATA.themes.find(function (theme) {
      return theme.id === id;
    });
  }

  function articleById(id) {
    var builtIn = DATA.articles.find(function (article) {
      return article.id === id;
    });
    if (builtIn) return builtIn;
    return Object.keys(state.importedArticles || {})
      .map(function (key) {
        return state.importedArticles[key];
      })
      .find(function (article) {
        return article.id === id;
      });
  }

  function getArticles() {
    return DATA.articles.concat(
      Object.keys(state.importedArticles || {}).map(function (key) {
        return state.importedArticles[key];
      }),
    );
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function createDefaultState() {
    var articleState = {};
    DATA.articles.forEach(function (article) {
      articleState[article.id] = {
        status: article.initialStatus,
        mastery: article.mastery,
        completedSteps:
          article.initialStatus === "lit"
            ? [1, 2, 3, 4]
            : article.initialStatus === "planet"
              ? [1, 2]
              : [],
        notes: [],
      };
    });

    var addedThemes = ["learning", "ai", "work"];
    var universeItems = {};
    DATA.articles.forEach(function (article) {
      if (addedThemes.indexOf(article.themeId) !== -1) {
        universeItems[article.id] = {
          addedAt: Date.now() - Math.floor(Math.random() * 86400000),
        };
      }
    });

    return {
      version: 1,
      currentView: "workspace",
      selectedTheme: "learning",
      selectedArticle: null,
      articleStep: 1,
      statusFilter: "all",
      collectionSearch: "",
      lastArticle: "feynman",
      syncedAt: Date.now(),
      articles: articleState,
      importedArticles: {},
      addedThemes: addedThemes,
      universeItems: universeItems,
      universeMode: "zhihu",
      preferences: clone(DATA.preferences),
    };
  }

  function loadState() {
    var fallback = createDefaultState();
    try {
      var stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (!stored || stored.version !== 1) return fallback;
      var merged = Object.assign(fallback, stored);
      merged.articles = Object.assign(fallback.articles, stored.articles || {});
      merged.importedArticles = Object.assign(
        fallback.importedArticles,
        stored.importedArticles || {},
      );
      merged.universeItems = Object.assign(
        fallback.universeItems,
        stored.universeItems || {},
      );
      merged.preferences = Object.assign(
        fallback.preferences,
        stored.preferences || {},
      );
      return merged;
    } catch (error) {
      return fallback;
    }
  }

  var state = loadState();

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn("Unable to save ReKnow state", error);
    }
    window.dispatchEvent(new CustomEvent("rk:statechange", { detail: state }));
  }

  function getArticleState(id) {
    if (!state.articles[id]) {
      state.articles[id] = {
        status: "seed",
        mastery: 0,
        completedSteps: [],
        notes: [],
      };
    }
    return state.articles[id];
  }

  function statusLabel(status) {
    return {
      seed: "待拆解星胚",
      planet: "已形成行星",
      lit: "已掌握",
    }[status];
  }

  function levelInfo() {
    var planets = Object.keys(state.universeItems).filter(function (id) {
      return getArticleState(id).status !== "seed";
    }).length;
    var mastered = getArticles().filter(function (article) {
      return getArticleState(article.id).status === "lit";
    }).length;
    var xp = planets * 18 + mastered * 34;
    var levels = [
      { min: 0, name: "炼金学徒" },
      { min: 40, name: "知识炼金师" },
      { min: 100, name: "星图构建者" },
      { min: 190, name: "宇宙炼金师" },
      { min: 310, name: "知识星主" },
    ];
    var index = 0;
    levels.forEach(function (level, levelIndex) {
      if (xp >= level.min) index = levelIndex;
    });
    var next = levels[index + 1];
    var current = levels[index];
    var progress = next
      ? Math.round(((xp - current.min) / (next.min - current.min)) * 100)
      : 100;
    return {
      xp: xp,
      name: current.name,
      progress: Math.max(4, Math.min(100, progress)),
      mastered: mastered,
      planets: planets,
    };
  }

  function showToast(message, type) {
    var region = $("toastRegion");
    var toast = document.createElement("div");
    toast.className = "toast " + (type || "");
    toast.innerHTML = icon(type === "success" ? "check" : "sparkles") + "<span>" + escapeHtml(message) + "</span>";
    region.appendChild(toast);
    setTimeout(function () {
      toast.classList.add("is-leaving");
      setTimeout(function () {
        toast.remove();
      }, 240);
    }, 2800);
  }

  function setView(view, options) {
    var next = options || {};
    state.currentView = view;

    $("workspaceView").classList.toggle("is-active", view === "workspace");
    $("articleView").classList.toggle("is-active", view === "article");
    $("universeView").classList.toggle("is-active", view === "universe");
    $("viewWorkspace").classList.toggle("is-active", view === "workspace" || view === "article");
    $("viewUniverse").classList.toggle("is-active", view === "universe");
    document.body.classList.toggle("is-universe-open", view === "universe");
    $("appShell").classList.toggle("is-universe", view === "universe");

    if (view === "universe") {
      if (window.RK_UNIVERSE && window.RK_UNIVERSE.enter) {
        window.RK_UNIVERSE.enter();
      }
    } else if (window.RK_UNIVERSE && window.RK_UNIVERSE.exit) {
      window.RK_UNIVERSE.exit();
      if (view === "workspace") {
        renderWorkspace();
      }
    }

    if (view === "workspace") renderWorkspace();
    if (view === "article") renderArticle(options && options.step);
    saveState();
  }

  function renderStats() {
    var info = levelInfo();
    var countByTheme = {};
    getArticles().forEach(function (article) {
      countByTheme[article.themeId] = (countByTheme[article.themeId] || 0) + 1;
    });

    $("metricThemes").textContent = String(DATA.themes.length);
    $("metricPlanets").textContent = String(info.planets);
    $("metricMastered").textContent = String(info.mastered);
    $("metricMasteredHint").textContent = info.mastered
      ? "已形成稳定知识链"
      : "继续炼化收藏";
    $("levelLabel").textContent = info.name;
    $("levelBar").style.width = info.progress + "%";
    $("syncTime").textContent = formatRelativeTime(state.syncedAt);
    $("universeCounter").textContent =
      String(state.addedThemes.length) +
      " 个星系 · " +
      String(info.planets) +
      " 颗行星";

    return countByTheme;
  }

  function formatRelativeTime(value) {
    if (!value) return "尚未同步";
    var diff = Date.now() - Number(value);
    if (diff < 60000) return "刚刚";
    if (diff < 3600000) return Math.floor(diff / 60000) + " 分钟前";
    if (diff < 86400000) return Math.floor(diff / 3600000) + " 小时前";
    return Math.floor(diff / 86400000) + " 天前";
  }

  function renderThemes(countByTheme) {
    var counts = countByTheme || {};
    $("themeGrid").innerHTML = DATA.themes
      .map(function (theme) {
        var articles = getArticles().filter(function (article) {
          return article.themeId === theme.id;
        });
        var mastered = articles.filter(function (article) {
          return getArticleState(article.id).status === "lit";
        }).length;
        var added = state.addedThemes.indexOf(theme.id) !== -1;
        return (
          '<article class="theme-card' +
          (state.selectedTheme === theme.id ? " is-active" : "") +
          '" data-theme-id="' +
          theme.id +
          '" style="--theme-color:' +
          theme.color +
          '">' +
          '<div class="theme-card-top">' +
          '<span class="theme-symbol">' +
          icon(themeIcon(theme.id)) +
          "</span>" +
          '<span class="theme-status' +
          (added ? " is-added" : "") +
          '">' +
          (added ? "已加入宇宙" : "未加入宇宙") +
          "</span>" +
          "</div>" +
          "<h3>" +
          escapeHtml(theme.name) +
          "</h3>" +
          "<p>" +
          escapeHtml(theme.description) +
          "</p>" +
          '<div class="theme-card-foot">' +
          "<span><strong>" +
          counts[theme.id] +
          "</strong> 篇收藏 · " +
          mastered +
          " 篇掌握</span>" +
          '<button class="universe-button ' +
          (added ? "" : "primary") +
          '" data-add-theme="' +
          theme.id +
          '" type="button">' +
          (added ? "查看星系" : "加入宇宙") +
          "</button>" +
          "</div>" +
          "</article>"
        );
      })
      .join("");
  }

  function themeIcon(themeId) {
    return {
      learning: "book-open",
      ai: "brain",
      work: "signpost",
      decision: "scale",
      mind: "compass",
    }[themeId];
  }

  function renderArticleList() {
    var theme = themeOf(state.selectedTheme);
    var query = state.collectionSearch.trim().toLowerCase();
    var rows = getArticles().filter(function (article) {
      return article.themeId === state.selectedTheme;
    });

    if (state.statusFilter !== "all") {
      rows = rows.filter(function (article) {
        return getArticleState(article.id).status === state.statusFilter;
      });
    }

    if (query) {
      rows = rows.filter(function (article) {
        return [
          article.title,
          article.question,
          article.author,
          article.tags.join(" "),
        ]
          .join(" ")
          .toLowerCase()
          .indexOf(query) !== -1;
      });
    }

    $("collectionKicker").textContent = theme ? theme.name : "当前主题";
    $("collectionHeading").textContent = theme ? theme.name + " · 收藏文章" : "收藏文章";

    if (!rows.length) {
      $("articleList").innerHTML =
        '<div class="empty-state"><div><strong>没有匹配的文章</strong><span>换一个状态或关键词试试。</span></div></div>';
      return;
    }

    $("articleList").innerHTML = rows
      .map(function (article) {
        var articleState = getArticleState(article.id);
        var articleTheme = themeOf(article.themeId);
        var progress =
          articleState.status === "lit"
            ? 100
            : articleState.status === "planet"
              ? Math.max(52, articleState.mastery)
              : Math.min(32, articleState.completedSteps.length * 12);
        return (
          '<article class="article-row" data-article-id="' +
          article.id +
          '" style="--theme-color:' +
          articleTheme.color +
          '">' +
          '<div class="article-main">' +
          '<div class="article-meta">' +
          '<span class="theme-name">' +
          escapeHtml(articleTheme.name) +
          "</span>" +
          "<span>" +
          escapeHtml(article.author) +
          "</span>" +
          "<span>" +
          escapeHtml(article.savedAt) +
          "收藏</span>" +
          "<span>" +
          escapeHtml(article.reading + " 分钟") +
          "</span>" +
          "</div>" +
          "<h3>" +
          escapeHtml(article.title) +
          "</h3>" +
          '<p class="article-question">' +
          escapeHtml(article.question) +
          "</p>" +
          "</div>" +
          '<div class="article-tags">' +
          article.tags
            .map(function (tag) {
              return '<span class="tag">' + escapeHtml(tag) + "</span>";
            })
            .join("") +
          "</div>" +
          '<div class="article-progress">' +
          '<span class="status-badge ' +
          articleState.status +
          '">' +
          (articleState.status === "lit" ? icon("check") : "") +
          statusLabel(articleState.status) +
          "</span>" +
          '<div class="progress-meta"><span>掌握度</span><strong>' +
          progress +
          "%</strong></div>" +
          '<div class="progress-track"><i style="width:' +
          progress +
          '%"></i></div>' +
          "</div>" +
          '<button class="article-enter" data-open-article="' +
          article.id +
          '" aria-label="打开文章" type="button">' +
          icon("chevron-right") +
          "</button>" +
          "</article>"
        );
      })
      .join("");
  }

  function renderWorkspace() {
    var counts = renderStats();
    renderThemes(counts);
    renderArticleList();
  }

  function getStepMeta(step) {
    return [
      {
        title: "定位主张",
        short: "看懂作者在说什么",
        icon: "target",
        label: "STEP 01 · 表层拆解",
        intro:
          "先不急着认同或反对。把结论、事实、隐含假设和依赖条件分开，才知道这篇内容究竟建立在什么之上。",
      },
      {
        title: "第一性根基",
        short: "追问为什么成立",
        icon: "layers",
        label: "STEP 02 · FIRST PRINCIPLES",
        intro:
          "去掉术语与经验判断，只保留基本公理，再从公理重新推回结论。能重建的推理，才真正属于你。",
      },
      {
        title: "理想型与偏差",
        short: "寻找本质形态",
        icon: "orbit",
        label: "STEP 03 · IDEAL FORM",
        intro:
          "把文章中的方法抽象为理想形态，再比较它和现实之间为什么会偏差。理解边界，比记住答案更重要。",
      },
      {
        title: "迁移与行动",
        short: "变成自己的方法",
        icon: "route",
        label: "STEP 04 · TRANSFER",
        intro:
          "最后把知识从文章里拿出来，放回你的工作、学习和决策。只有产生迁移，收藏才算真正完成炼化。",
      },
    ][step - 1];
  }

  function renderArticleIdentity(article, articleState) {
    var theme = themeOf(article.themeId);
    $("articleIdentity").innerHTML =
      '<div class="article-identity" style="--theme-color:' +
      theme.color +
      '">' +
      '<span class="theme-name">' +
      escapeHtml(theme.name) +
      "</span>" +
      "<h2>" +
      escapeHtml(article.title) +
      "</h2>" +
      "<p>" +
      escapeHtml(article.author) +
      " · " +
      escapeHtml(article.authorMeta) +
      " · " +
      formatVotes(article.votes) +
      " 赞同</p>" +
      '<div class="identity-reading"><span>' +
      escapeHtml(article.reading + " 分钟阅读") +
      "</span><span>" +
      statusLabel(articleState.status) +
      "</span></div>" +
      "</div>";

    $("articleTopMeta").innerHTML =
      icon("clock") +
      " " +
      escapeHtml(String(articleState.completedSteps.length)) +
      " / 4 步已拆 · " +
      escapeHtml(String(articleState.mastery)) +
      "% 掌握度";
  }

  function renderStepNav(article, articleState) {
    $("stepNav").innerHTML = [1, 2, 3, 4]
      .map(function (step) {
        var meta = getStepMeta(step);
        var done = articleState.completedSteps.indexOf(step) !== -1;
        return (
          '<button class="step-button' +
          (state.articleStep === step ? " is-active" : "") +
          (done ? " is-done" : "") +
          '" type="button" data-article-step="' +
          step +
          '">' +
          '<span class="step-index">' +
          (done ? icon("check") : String(step).padStart(2, "0")) +
          "</span>" +
          '<span class="step-copy"><strong>' +
          escapeHtml(meta.title) +
          "</strong><small>" +
          escapeHtml(meta.short) +
          "</small></span>" +
          '<span class="step-state">' +
          (done ? "完成" : "") +
          "</span>" +
          "</button>"
        );
      })
      .join("");
  }

  function listHtml(items) {
    return "<ul>" + items.map(function (item) {
      return "<li>" + escapeHtml(item) + "</li>";
    }).join("") + "</ul>";
  }

  function renderAnalysisStage(article, articleState) {
    var analysis = article.analysis;
    var meta = getStepMeta(state.articleStep);
    var content = "";

    if (state.articleStep === 1) {
      content =
        '<div class="analysis-grid">' +
        '<section class="analysis-card is-wide"><h3>' +
        icon("target") +
        "作者的核心结论</h3><p>" +
        escapeHtml(analysis.surface.conclusion) +
        "</p></div>" +
        '<section class="analysis-card"><h3>' +
        icon("check") +
        "可验证的事实</h3>" +
        listHtml(analysis.surface.facts) +
        "</section>" +
        '<section class="analysis-card"><h3>' +
        icon("layers") +
        "隐含假设</h3>" +
        listHtml(analysis.surface.assumptions) +
        "</section>" +
        '<section class="analysis-card is-wide"><h3>' +
        icon("link") +
        "成立所依赖的条件</h3><div class=\"article-tags\">" +
        analysis.surface.dependencies
          .map(function (item) {
            return '<span class="tag">' + escapeHtml(item) + "</span>";
          })
          .join("") +
        "</div></section>" +
        "</div>";
    }

    if (state.articleStep === 2) {
      content =
        '<div class="analysis-grid">' +
        '<section class="analysis-card is-wide"><h3>' +
        icon("sparkles") +
        "最底层公理</h3><div class=\"axiom-callout\">" +
        escapeHtml(analysis.first.axiom) +
        "</div></section>" +
        '<section class="analysis-card is-wide"><h3>' +
        icon("route") +
        "从公理重建结论</h3><div class=\"reason-chain\">" +
        analysis.first.chain
          .map(function (item) {
            return '<div class="reason-step">' + escapeHtml(item) + "</div>";
          })
          .join("") +
        "</div></section>" +
        '<section class="analysis-card is-wide"><h3>' +
        icon("shield") +
        "边界条件</h3><p>" +
        escapeHtml(analysis.first.boundary) +
        "</p></section>" +
        "</div>";
    }

    if (state.articleStep === 3) {
      content =
        '<div class="analysis-grid">' +
        '<section class="analysis-card"><h3>' +
        icon("orbit") +
        "本质定义</h3><p>" +
        escapeHtml(analysis.ideal.essence) +
        "</p></section>" +
        '<section class="analysis-card"><h3>' +
        icon("target") +
        "理想形态</h3><p>" +
        escapeHtml(analysis.ideal.idealForm) +
        "</p></section>" +
        '<section class="analysis-card"><h3>' +
        icon("scale") +
        "现实偏差</h3><p>" +
        escapeHtml(analysis.ideal.realityGap) +
        "</p></section>" +
        '<section class="analysis-card"><h3>' +
        icon("shield") +
        "反例检验</h3><p>" +
        escapeHtml(analysis.ideal.counterexample) +
        "</p></section>" +
        "</div>";
    }

    if (state.articleStep === 4) {
      content =
        '<div class="analysis-grid">' +
        '<section class="analysis-card is-wide"><h3>' +
        icon("route") +
        "把知识带回现实</h3><div class=\"reason-chain\">" +
        analysis.transfer.actions
          .map(function (item) {
            return '<div class="reason-step">' + escapeHtml(item) + "</div>";
          })
          .join("") +
        "</div></section>" +
        '<section class="analysis-card is-wide"><h3>' +
        icon("lightbulb") +
        "带走这个问题</h3><div class=\"axiom-callout\">" +
        escapeHtml(analysis.transfer.personalQuestion) +
        "</div></section>" +
        "</div>";
    }

    var footer = "";
    var complete = articleState.completedSteps.indexOf(state.articleStep) !== -1;
    if (state.articleStep < 4) {
      footer =
        '<button class="button ' +
        (complete ? "button-quiet" : "button-primary") +
        '" data-action="complete-step" type="button">' +
        icon(complete ? "arrow-right" : "check") +
        (complete ? "继续下一步" : "这一步已理解，继续") +
        "</button>";
    } else {
      if (articleState.status === "seed") {
        footer =
          '<button class="button button-primary" data-action="finish-analysis" type="button">' +
          icon("sparkles") +
          "完成拆解，形成行星" +
          "</button>";
      } else if (articleState.status === "planet") {
        var inUniverse = Boolean(state.universeItems[article.id]);
        footer =
          (inUniverse
            ? '<button class="button button-quiet" data-action="open-universe" type="button">' +
              icon("orbit") +
              "去宇宙看它" +
              "</button>"
            : '<button class="button button-primary" data-action="add-to-universe" type="button">' +
              icon("orbit") +
              "加入主题星系" +
              "</button>") +
          '<button class="button button-primary" data-action="mark-mastered" type="button">' +
          icon("check") +
          "标记为已掌握" +
          "</button>";
      } else {
        footer =
          '<button class="button button-primary" data-action="open-universe" type="button">' +
          icon("orbit") +
          "去宇宙查看已点亮星球" +
          "</button>";
      }
    }

    $("analysisStage").innerHTML =
      '<header class="stage-heading" style="--theme-color:' +
      themeOf(article.themeId).color +
      '">' +
      '<span class="stage-label">' +
      escapeHtml(meta.label) +
      "</span>" +
      "<h1>" +
      escapeHtml(meta.title) +
      "</h1>" +
      "<p>" +
      escapeHtml(meta.intro) +
      "</p>" +
      "</header>" +
      content +
      '<footer class="stage-footer">' +
      footer +
      "</footer>";
  }

  function renderNotes(articleState) {
    if (!articleState.notes.length) {
      $("notesList").innerHTML =
        '<div class="empty-state" style="min-height:110px;padding:12px"><div><strong>还没有札记</strong><span>写下你真正关心的问题。</span></div></div>';
      return;
    }

    $("notesList").innerHTML = articleState.notes
      .slice()
      .reverse()
      .map(function (note) {
        return (
          '<div class="note-item"><p>' +
          escapeHtml(note.text) +
          "</p><time>" +
          escapeHtml(note.time) +
          "</time></div>"
        );
      })
      .join("");
  }

  function renderArticle(stepOverride) {
    var article = articleById(state.selectedArticle);
    if (!article) {
      setView("workspace");
      return;
    }
    if (stepOverride) {
      state.articleStep = Math.max(1, Math.min(4, Number(stepOverride)));
    }
    var articleState = getArticleState(article.id);
    renderArticleIdentity(article, articleState);
    renderStepNav(article, articleState);
    renderAnalysisStage(article, articleState);
    renderNotes(articleState);
    saveState();
  }

  function openArticle(id) {
    var article = articleById(id);
    if (!article) return;
    state.selectedArticle = id;
    state.lastArticle = id;
    state.selectedTheme = article.themeId;
    var articleState = getArticleState(id);
    state.articleStep =
      articleState.completedSteps.length < 4
        ? Math.min(4, articleState.completedSteps.length + 1)
        : 4;
    setView("article");
  }

  function selectTheme(themeId) {
    if (!themeOf(themeId)) return;
    state.selectedTheme = themeId;
    renderWorkspace();
    saveState();
  }

  function addThemeToUniverse(themeId) {
    var theme = themeOf(themeId);
    if (!theme) return;
    if (state.addedThemes.indexOf(themeId) === -1) {
      state.addedThemes.push(themeId);
      getArticles().forEach(function (article) {
        if (article.themeId === themeId && !state.universeItems[article.id]) {
          state.universeItems[article.id] = { addedAt: Date.now() };
        }
      });
      showToast("“" + theme.name + "”已加入炼金宇宙", "success");
    } else {
      showToast("这个主题星系已经在你的宇宙里");
    }
    renderWorkspace();
    saveState();
  }

  function addArticleToUniverse(articleId) {
    var article = articleById(articleId);
    if (!article) return;
    var articleState = getArticleState(articleId);
    if (articleState.status === "seed") {
      showToast("先完成四步拆解，文章才会形成行星", "warning");
      return;
    }
    if (state.addedThemes.indexOf(article.themeId) === -1) {
      state.addedThemes.push(article.themeId);
    }
    state.universeItems[articleId] = { addedAt: Date.now() };
    showToast("文章已加入“" + themeOf(article.themeId).name + "”星系", "success");
    renderArticle();
    saveState();
  }

  function completeStep() {
    var articleState = getArticleState(state.selectedArticle);
    if (articleState.completedSteps.indexOf(state.articleStep) === -1) {
      articleState.completedSteps.push(state.articleStep);
      articleState.mastery = Math.max(articleState.mastery, state.articleStep * 18);
    }
    state.articleStep = Math.min(4, state.articleStep + 1);
    renderArticle();
    saveState();
  }

  function finishAnalysis() {
    var articleState = getArticleState(state.selectedArticle);
    articleState.completedSteps = [1, 2, 3, 4];
    articleState.status = "planet";
    articleState.mastery = Math.max(articleState.mastery, 62);
    showToast("拆解完成，文章已经形成行星", "success");
    renderArticle();
    saveState();
  }

  function markMastered() {
    var articleState = getArticleState(state.selectedArticle);
    articleState.status = "lit";
    articleState.mastery = Math.max(articleState.mastery, 88);
    articleState.completedSteps = [1, 2, 3, 4];
    showToast("这颗行星已经点亮，并纳入长期知识链", "success");
    renderArticle();
    renderWorkspace();
    saveState();
  }

  function openUniverseForArticle() {
    setView("universe");
    if (window.RK_UNIVERSE && window.RK_UNIVERSE.focusArticle) {
      window.RK_UNIVERSE.focusArticle(state.selectedArticle);
    }
  }

  function renderSettings() {
    $("interestChoices").innerHTML = DATA.themes
      .map(function (theme) {
        var active = state.preferences.interests.indexOf(theme.name) !== -1;
        return (
          '<button class="choice-chip' +
          (active ? " is-active" : "") +
          '" data-interest="' +
          escapeHtml(theme.name) +
          '" type="button">' +
          escapeHtml(theme.name) +
          "</button>"
        );
      })
      .join("");
    $("goalSelect").value = state.preferences.goal;
    $("depthSelect").value = state.preferences.depth;
    $("angleSelect").value = state.preferences.angle;
    $("orderSelect").value = state.preferences.universeOrder;
  }

  function openSettings() {
    renderSettings();
    $("settingsDialog").showModal();
    document.body.classList.add("is-dialog-open");
  }

  function closeSettings() {
    document.body.classList.remove("is-dialog-open");
  }

  function savePreferences() {
    state.preferences.goal = $("goalSelect").value;
    state.preferences.depth = $("depthSelect").value;
    state.preferences.angle = $("angleSelect").value;
    state.preferences.universeOrder = $("orderSelect").value;
    saveState();
    if (window.RK_UNIVERSE && window.RK_UNIVERSE.refresh) {
      window.RK_UNIVERSE.refresh();
    }
    showToast("炼金配方已保存", "success");
  }

  function resetDemo() {
    localStorage.removeItem(STORAGE_KEY);
    state = createDefaultState();
    if (window.RK_APP) window.RK_APP.state = state;
    saveState();
    closeSettings();
    setView("workspace");
    showToast("演示数据已恢复", "success");
  }

  async function syncCollections() {
    var button = $("syncCollections");
    button.classList.add("is-loading");
    button.innerHTML = icon("refresh") + "正在同步…";
    try {
      var result = await API.syncCollections();
      state.syncedAt = new Date(result.syncedAt).getTime();
      renderWorkspace();
      saveState();
      showToast("已同步 " + DATA.articles.length + " 篇收藏并完成主题聚类", "success");
    } catch (error) {
      showToast("同步失败：" + error.message, "warning");
    } finally {
      button.classList.remove("is-loading");
      button.innerHTML = icon("refresh") + "重新同步收藏";
    }
  }

  function continueLearning() {
    var id = state.lastArticle;
    var articleState = id ? getArticleState(id) : null;
    if (!id || !articleById(id) || (articleState && articleState.status === "lit")) {
      var unfinished = getArticles().find(function (article) {
        return getArticleState(article.id).status !== "lit";
      });
      id = unfinished ? unfinished.id : getArticles()[0].id;
    }
    openArticle(id);
  }

  function bindEvents() {
    $("brandHome").addEventListener("click", function () {
      setView("workspace");
    });
    $("viewWorkspace").addEventListener("click", function () {
      setView("workspace");
    });
    $("viewUniverse").addEventListener("click", function () {
      setView("universe");
    });
    $("closeUniverse").addEventListener("click", function () {
      setView("workspace");
    });
    $("universeHome").addEventListener("click", function () {
      setView("workspace");
    });
    $("syncCollections").addEventListener("click", syncCollections);
    $("continueLearning").addEventListener("click", continueLearning);
    $("backToWorkspace").addEventListener("click", function () {
      setView("workspace");
    });

    $("themeGrid").addEventListener("click", function (event) {
      var addButton = event.target.closest("[data-add-theme]");
      if (addButton) {
        var themeId = addButton.getAttribute("data-add-theme");
        if (state.addedThemes.indexOf(themeId) !== -1) {
          state.selectedTheme = themeId;
          setView("universe");
          if (window.RK_UNIVERSE && window.RK_UNIVERSE.focusTheme) {
            window.RK_UNIVERSE.focusTheme(themeId);
          }
        } else {
          addThemeToUniverse(themeId);
        }
        return;
      }
      var card = event.target.closest("[data-theme-id]");
      if (card) selectTheme(card.getAttribute("data-theme-id"));
    });

    $("articleList").addEventListener("click", function (event) {
      var row = event.target.closest("[data-article-id]");
      if (row) openArticle(row.getAttribute("data-article-id"));
    });

    $("collectionSearch").addEventListener("input", function (event) {
      state.collectionSearch = event.target.value;
      renderArticleList();
    });

    $("statusFilter").addEventListener("click", function (event) {
      var button = event.target.closest("[data-status]");
      if (!button) return;
      state.statusFilter = button.getAttribute("data-status");
      Array.prototype.forEach.call(
        $("statusFilter").querySelectorAll("button"),
        function (item) {
          item.classList.toggle("is-active", item === button);
        },
      );
      renderArticleList();
    });

    $("stepNav").addEventListener("click", function (event) {
      var button = event.target.closest("[data-article-step]");
      if (!button) return;
      state.articleStep = Number(button.getAttribute("data-article-step"));
      renderArticle();
      saveState();
    });

    $("analysisStage").addEventListener("click", function (event) {
      var button = event.target.closest("[data-action]");
      if (!button) return;
      var action = button.getAttribute("data-action");
      if (action === "complete-step") completeStep();
      if (action === "finish-analysis") finishAnalysis();
      if (action === "mark-mastered") markMastered();
      if (action === "add-to-universe") addArticleToUniverse(state.selectedArticle);
      if (action === "open-universe") openUniverseForArticle();
    });

    $("noteForm").addEventListener("submit", function (event) {
      event.preventDefault();
      var text = $("noteInput").value.trim();
      if (!text) return;
      var articleState = getArticleState(state.selectedArticle);
      articleState.notes.push({
        text: text,
        time: new Date().toLocaleString("zh-CN", {
          month: "numeric",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
      $("noteInput").value = "";
      renderNotes(articleState);
      saveState();
      showToast("已加入炼金札记", "success");
    });

    $("clearNotes").addEventListener("click", function () {
      var articleState = getArticleState(state.selectedArticle);
      if (!articleState.notes.length) return;
      articleState.notes = [];
      renderNotes(articleState);
      saveState();
      showToast("已清空本篇札记");
    });

    $("openSettings").addEventListener("click", openSettings);
    $("closeSettingsButton").addEventListener("click", function () {
      closeSettings();
      $("settingsDialog").close();
    });
    $("settingsDialog").addEventListener("close", closeSettings);
    $("settingsForm").addEventListener("submit", function (event) {
      event.preventDefault();
      savePreferences();
      closeSettings();
      $("settingsDialog").close();
    });
    $("interestChoices").addEventListener("click", function (event) {
      var button = event.target.closest("[data-interest]");
      if (!button) return;
      var value = button.getAttribute("data-interest");
      var index = state.preferences.interests.indexOf(value);
      if (index === -1) state.preferences.interests.push(value);
      else state.preferences.interests.splice(index, 1);
      renderSettings();
    });
    $("resetDemo").addEventListener("click", resetDemo);

    window.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && state.currentView === "universe") {
        if ($("universePanel").classList.contains("is-open")) {
          $("universePanel").classList.remove("is-open");
        } else if (!$("planetCard").hidden) {
          $("planetCard").hidden = true;
        } else {
          setView("workspace");
        }
      }
    });
  }

  function initialize() {
    state.currentView = "workspace";
    $("collectionSearch").value = state.collectionSearch || "";
    Array.prototype.forEach.call(
      $("statusFilter").querySelectorAll("button"),
      function (button) {
        button.classList.toggle(
          "is-active",
          button.getAttribute("data-status") === state.statusFilter,
        );
      },
    );
    hydrateIcons(document);
    bindEvents();
    renderWorkspace();
    renderSettings();
    if (window.RK_UNIVERSE && window.RK_UNIVERSE.init) {
      window.RK_UNIVERSE.init();
    }
    var requestedView = new URLSearchParams(window.location.search).get("view");
    var requestedArticle = new URLSearchParams(window.location.search).get("article");
    if (requestedArticle && articleById(requestedArticle)) {
      openArticle(requestedArticle);
    } else if (requestedView === "universe") {
      setView("universe");
    }
  }

  window.RK_APP = {
    state: state,
    icon: icon,
    escapeHtml: escapeHtml,
    themeOf: themeOf,
    articleById: articleById,
    getArticles: getArticles,
    getState: function () {
      return state;
    },
    getArticleState: getArticleState,
    statusLabel: statusLabel,
    saveState: saveState,
    setView: setView,
    openArticle: openArticle,
    renderWorkspace: renderWorkspace,
    renderArticle: renderArticle,
    showToast: showToast,
    addThemeToUniverse: addThemeToUniverse,
    addArticleToUniverse: addArticleToUniverse,
    markMastered: markMastered,
    markMasteredById: function (articleId) {
      if (!articleById(articleId)) return;
      state.selectedArticle = articleId;
      markMastered();
    },
    importSearchResult: function (result) {
      var id = "imported-" + result.id;
      if (articleById(id)) return id;
      var theme = themeOf(result.themeId) || DATA.themes[0];
      var article = {
        id: id,
        themeId: theme.id,
        question: result.title,
        title: result.title,
        author: result.author,
        authorMeta: "来自知乎搜索",
        votes: result.votes,
        savedAt: "刚刚",
        reading: 6,
        initialStatus: "seed",
        mastery: 0,
        tags: result.tags || ["知乎搜索"],
        focus: "从知乎搜索加入的待拆解内容",
        quote: result.excerpt,
        relations: [],
        analysis: {
          surface: {
            conclusion: result.excerpt,
            facts: [
              "这条内容来自知乎搜索，需结合原文进一步核验。",
              "当前摘录只保留可确认的核心主张，不替代原文上下文。",
            ],
            assumptions: [
              "搜索结果与原问题、作者表达意图保持一致。",
              "需要补充原文后才能完成严格的第一性分析。",
            ],
            dependencies: ["知乎原文", "作者上下文", "反例检验"],
          },
          first: {
            axiom: "任何结论都建立在尚未说出的前提之上。",
            chain: [
              "先确认搜索结果对应的真实问题。",
              "提取作者得出结论所依赖的事实。",
              "检查是否存在被忽略的约束或反例。",
              "回到原文补全推理链。",
            ],
            boundary: "仅凭搜索摘要，不足以确认文章的全部事实与适用边界。",
          },
          ideal: {
            essence: "把搜索结果转换为可验证、可追问的知识对象。",
            idealForm: "原文、问题和作者论证能够形成清晰且可追溯的结构。",
            realityGap: "搜索摘要容易脱离上下文，产生片面理解。",
            counterexample: "只看标题就认为已经掌握作者观点。",
          },
          transfer: {
            actions: [
              "打开知乎原文并核对关键段落。",
              "把最有价值的观点单独写成待验证命题。",
              "补充一个现实案例，检验它是否成立。",
            ],
            personalQuestion: "这条搜索结果补充了我原有知识结构中的哪一块？",
          },
        },
      };
      state.importedArticles[id] = article;
      state.articles[id] = {
        status: "seed",
        mastery: 0,
        completedSteps: [],
        notes: [],
      };
      state.selectedTheme = theme.id;
      renderWorkspace();
      saveState();
      return id;
    },
    levelInfo: levelInfo,
    formatVotes: formatVotes,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }
})();
