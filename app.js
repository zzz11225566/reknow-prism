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
    "chevron-up":
      '<path d="m18 15-6-6-6 6"/>',
    "chevron-down":
      '<path d="m6 9 6 6 6-6"/>',
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
    home:
      '<path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/>',
    palette:
      '<path d="M12 3a9 9 0 0 0 0 18h1.5a2 2 0 0 0 0-4H12a2 2 0 0 1 0-4h4a5 5 0 0 0 0-10Z"/><circle cx="7.5" cy="10" r=".8"/><circle cx="10" cy="6.8" r=".8"/><circle cx="14" cy="6.8" r=".8"/><circle cx="16.3" cy="10" r=".8"/>',
    briefcase:
      '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 12h18"/><path d="M10 12v2h4v-2"/>',
    coins:
      '<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6"/><path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/>',
    gamepad:
      '<path d="M7 8h10a5 5 0 0 1 4.4 7.4l-1.1 2a2.4 2.4 0 0 1-4 .3L14.5 16h-5l-1.8 1.7a2.4 2.4 0 0 1-4-.3l-1.1-2A5 5 0 0 1 7 8Z"/><path d="M8 11v3"/><path d="M6.5 12.5h3"/><circle cx="16.5" cy="11.5" r=".7"/><circle cx="18" cy="14" r=".7"/>',
    "heart-pulse":
      '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/><path d="M3.5 12h5l1.5-3 2.5 6 1.8-3H20"/>',
    globe:
      '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18"/><path d="M12 3a14 14 0 0 0 0 18"/>',
    microscope:
      '<path d="M6 18h12"/><path d="M9 18a6 6 0 0 0 6-6"/><path d="M12 4h5l2 2-7 7-2-2Z"/><path d="m8 12 4 4"/><path d="M4 22h16"/>',
    music:
      '<path d="M9 18V5l10-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="16" cy="16" r="3"/>',
    camera:
      '<path d="M14 5h3l2 3h2v11H3V8h2l2-3h3"/><circle cx="12" cy="13" r="4"/>',
    dumbbell:
      '<path d="M6 7v10"/><path d="M3 9v6"/><path d="M18 7v10"/><path d="M21 9v6"/><path d="M6 12h12"/>',
    code:
      '<path d="m8 9-4 3 4 3"/><path d="m16 9 4 3-4 3"/><path d="m14 5-4 14"/>',
    plane:
      '<path d="m21 16-8-3V5a2 2 0 0 0-4 0v8l-6 3v2l6-2v4l-2 2v1l4-1 4 1v-1l-2-2v-4l8 2Z"/>',
    chef:
      '<path d="M6 11a4 4 0 1 1 2-7.5A4.5 4.5 0 0 1 12 2a4.5 4.5 0 0 1 4 1.5A4 4 0 1 1 18 11Z"/><path d="M6 11v9h12v-9"/><path d="M9 15h6"/>',
    utensils:
      '<path d="M7 2v20"/><path d="M4 2v5a3 3 0 0 0 3 3 3 3 0 0 0 3-3V2"/><path d="M16 2v20"/><path d="M16 2c3 2 4 5 4 8h-4"/>',
    "message-circle":
      '<path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9.8 9.8 0 0 1-4-.8L3 21l1.7-4.4A8.4 8.4 0 1 1 21 11.5Z"/>',
    bot:
      '<rect x="4" y="7" width="16" height="12" rx="3"/><path d="M12 3v4"/><circle cx="9" cy="13" r="1"/><circle cx="15" cy="13" r="1"/><path d="M9 17h6"/>',
    sliders:
      '<path d="M4 21v-7"/><path d="M4 10V3"/><path d="M12 21v-9"/><path d="M12 8V3"/><path d="M20 21v-5"/><path d="M20 12V3"/><path d="M1 14h6"/><path d="M9 8h6"/><path d="M17 16h6"/>',
    layout:
      '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/>',
    "mouse-pointer":
      '<path d="m4 3 7.5 17 2.2-6.3L20 11.5Z"/><path d="m13.7 13.7 4.8 4.8"/>',
    "sticky-note":
      '<path d="M4 3h16v13l-5 5H4Z"/><path d="M20 16h-5v5"/><path d="M8 8h8"/><path d="M8 12h5"/>',
    type:
      '<path d="M4 6V4h16v2"/><path d="M9 20h6"/><path d="M12 4v16"/>',
    square:
      '<rect x="4" y="4" width="16" height="16" rx="2"/>',
    pencil:
      '<path d="m14 4 6 6L8 22H2v-6Z"/><path d="m12 6 6 6"/>',
    eraser:
      '<path d="m18 13-5-5L4 17l3 3h7l4-4a2 2 0 0 0 0-3Z"/><path d="m14 9 3-3a2 2 0 0 1 3 0l1 1a2 2 0 0 1 0 3l-3 3"/>',
    undo:
      '<path d="M9 7 4 12l5 5"/><path d="M5 12h8a6 6 0 0 1 6 6v1"/>',
    move:
      '<path d="M5 9 2 12l3 3"/><path d="m9 5 3-3 3 3"/><path d="m15 19-3 3-3-3"/><path d="m19 9 3 3-3 3"/><path d="M2 12h20"/><path d="M12 2v20"/>',
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
    var theme = getThemes().find(function (item) {
      return item.id === id;
    });
    if (!theme) return null;
    var override = state.settings.small.themes[id] || {};
    return Object.assign({}, theme, {
      color: override.color || theme.color,
    });
  }

  function getThemes() {
    return DATA.themes.concat(state.customThemes || []);
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

  var STEP_DEFINITIONS = [
    {
      id: "surface",
      title: "看懂回答",
      short: "作者在回答什么",
      icon: "target",
      label: "问题与结论",
      intro:
        "先回答三个最小问题：作者在回答什么、最核心的结论是什么、这个结论对谁成立。",
    },
    {
      id: "evidence",
      title: "拆出依据",
      short: "结论靠什么支撑",
      icon: "link",
      label: "事实、经验与假设",
      intro:
        "把事实、案例、个人经验和没有说出口的假设分开。知乎回答最重要的不是观点，而是观点背后的证据结构。",
    },
    {
      id: "first",
      title: "追问根基",
      short: "为什么它能成立",
      icon: "layers",
      label: "第一性原理与边界",
      intro:
        "去掉术语和个案，找到最底层公理，再重建结论。同时寻找理想形态、现实偏差和反例。",
    },
    {
      id: "debate",
      title: "AI 抬杠",
      short: "让 AI 反过来问你",
      icon: "bot",
      label: "主动回忆与压力测试",
      intro:
        "你不需要写一篇总结。只要告诉 AI“我学会了”，它就会追问边界、反例和前提，直到你的理解经得住反驳。",
    },
    {
      id: "transfer",
      title: "化为己用",
      short: "放回你的现实",
      icon: "route",
      label: "迁移与行动",
      intro:
        "最后把知识从文章里拿出来，放回你的工作、学习和决策。只有产生迁移，收藏才算真正完成炼化。",
    },
  ];

  var THEME_ICON_OPTIONS = [
    "book-open",
    "brain",
    "briefcase",
    "coins",
    "code",
    "gamepad",
    "palette",
    "camera",
    "music",
    "heart-pulse",
    "globe",
    "microscope",
    "plane",
    "dumbbell",
    "chef",
    "home",
  ];

  var THEME_COLOR_OPTIONS = [
    "#4f73e8",
    "#149b8b",
    "#d28a2e",
    "#c45176",
    "#6c63c8",
    "#397a68",
    "#b35f35",
    "#3c7d9d",
    "#8b5fbf",
    "#7b6b43",
  ];

  function defaultSettings() {
    return {
      modules: {
        workspace: true,
        universe: true,
      },
      workspace: {
        layoutMode: "modules",
        defaultDepth: "deep",
        aiTone: "balanced",
        intakeMode: "manual",
        readingDensity: "comfortable",
        reduceMotion: false,
        stepOrder: ["surface", "evidence", "first", "debate", "transfer"],
        stepEnabled: {
          surface: true,
          evidence: true,
          first: true,
          debate: true,
          transfer: true,
        },
      },
      universe: {
        labelMode: "automatic",
        showLinks: true,
        showEffects: true,
        highPerformance: false,
        sensitivity: "standard",
      },
      small: {
        themes: {},
        articles: {},
        galaxies: {},
      },
    };
  }

  function mergeDeep(base, override) {
    var result = clone(base);
    Object.keys(override || {}).forEach(function (key) {
      var value = override[key];
      if (
        value &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        result[key] &&
        typeof result[key] === "object" &&
        !Array.isArray(result[key])
      ) {
        result[key] = mergeDeep(result[key], value);
      } else {
        result[key] = clone(value);
      }
    });
    return result;
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
            ? STEP_DEFINITIONS.map(function (step) {
                return step.id;
              })
            : article.initialStatus === "planet"
              ? ["surface", "first"]
              : [],
        notes: [],
        aiMessages: [],
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
      version: 3,
      currentView: "workspace",
      selectedTheme: "learning",
      selectedArticle: null,
      articleStep: "surface",
      statusFilter: "all",
      collectionSearch: "",
      lastArticle: "feynman",
      syncedAt: Date.now(),
      articles: articleState,
      importedArticles: {},
      customThemes: [],
      addedThemes: addedThemes,
      universeItems: universeItems,
      universeMode: "zhihu",
      preferences: clone(DATA.preferences),
      boards: {},
      settings: defaultSettings(),
      guideSeen: {
        workspace: false,
        universe: false,
      },
    };
  }

  function loadState() {
    var fallback = createDefaultState();
    try {
      var stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (!stored) return fallback;
      if (stored.version !== 1 && stored.version !== 2 && stored.version !== 3) {
        return fallback;
      }
      var merged = Object.assign(fallback, stored);
      merged.version = 3;
      merged.articles = Object.assign(fallback.articles, stored.articles || {});
      merged.importedArticles = Object.assign(
        fallback.importedArticles,
        stored.importedArticles || {},
      );
      merged.customThemes = stored.customThemes || [];
      merged.universeItems = Object.assign(
        fallback.universeItems,
        stored.universeItems || {},
      );
      merged.preferences = Object.assign(
        fallback.preferences,
        stored.preferences || {},
      );
      merged.settings = mergeDeep(fallback.settings, stored.settings || {});
      merged.guideSeen = Object.assign(
        fallback.guideSeen,
        stored.guideSeen || {},
      );
      merged.boards = Object.assign({}, stored.boards || {});
      if (typeof merged.articleStep === "number") {
        merged.articleStep =
          (STEP_DEFINITIONS[merged.articleStep - 1] || STEP_DEFINITIONS[0]).id;
      }
      Object.keys(merged.articles).forEach(function (id) {
        var articleState = merged.articles[id];
        if (!articleState || !Array.isArray(articleState.completedSteps)) return;
        articleState.completedSteps = articleState.completedSteps
          .map(function (step) {
            if (typeof step === "number") {
              return [
                "surface",
                "first",
                "ideal",
                "transfer",
                "transfer",
              ][step - 1];
            }
            return step === "ideal" ? "first" : step;
          })
          .filter(function (step, index, list) {
            return step && list.indexOf(step) === index;
          });
        if (articleState.status === "lit") {
          articleState.completedSteps = STEP_DEFINITIONS.map(function (step) {
            return step.id;
          });
        }
      });
      if (stored.version < 3) {
        var migratedOrder = [];
        (merged.settings.workspace.stepOrder || []).forEach(function (stepId) {
          var nextId = stepId === "ideal" ? "first" : stepId;
          if (migratedOrder.indexOf(nextId) === -1) migratedOrder.push(nextId);
        });
        ["surface", "evidence", "first", "debate", "transfer"].forEach(function (stepId) {
          if (migratedOrder.indexOf(stepId) === -1) migratedOrder.push(stepId);
        });
        merged.settings.workspace.stepOrder = migratedOrder;
        merged.settings.workspace.stepEnabled.evidence =
          merged.settings.workspace.stepEnabled.evidence !== false;
        merged.settings.workspace.stepEnabled.debate =
          merged.settings.workspace.stepEnabled.debate !== false;
        merged.settings.workspace.stepEnabled.first =
          merged.settings.workspace.stepEnabled.first !== false;
        delete merged.settings.workspace.stepEnabled.ideal;
      }
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
        aiMessages: [],
      };
    }
    if (!state.articles[id].aiMessages) state.articles[id].aiMessages = [];
    return state.articles[id];
  }

  function stepById(id) {
    return STEP_DEFINITIONS.find(function (step) {
      return step.id === id;
    });
  }

  function enabledStepIds(articleId) {
    var workspace = state.settings.workspace;
    var articleOverride =
      (state.settings.small.articles[articleId] || {}).stepEnabled || {};
    var order = workspace.stepOrder.filter(function (id) {
      return STEP_DEFINITIONS.some(function (step) {
        return step.id === id;
      });
    });
    STEP_DEFINITIONS.forEach(function (step) {
      if (order.indexOf(step.id) === -1) order.push(step.id);
    });
    var enabled = order.filter(function (id) {
      return (
        articleOverride[id] !== undefined
          ? articleOverride[id] !== false
          : workspace.stepEnabled[id] !== false
      );
    });
    return enabled.length ? enabled : [order[0] || "surface"];
  }

  function stepNumber(id, articleId) {
    var index = enabledStepIds(articleId).indexOf(id);
    return index === -1 ? 1 : index + 1;
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

  var navigationStack = [];
  var restoringNavigation = false;
  var themeCreateSelection = {
    icon: "book-open",
    color: THEME_COLOR_OPTIONS[0],
  };
  var smallSettingsContext = null;
  var settingsContext = "workspace";
  var boardThemeId = null;
  var boardTool = "select";
  var boardHistory = [];
  var boardDrawing = null;
  var suppressThemeClick = false;

  function setView(view, options) {
    var next = options || {};
    if (!restoringNavigation && state.currentView !== view) {
      navigationStack.push({
        view: state.currentView,
        selectedTheme: state.selectedTheme,
        selectedArticle: state.selectedArticle,
        articleStep: state.articleStep,
      });
      if (navigationStack.length > 30) navigationStack.shift();
    }
    state.currentView = view;

    $("workspaceView").classList.toggle("is-active", view === "workspace");
    $("collectionView").classList.toggle("is-active", view === "collection");
    $("articleView").classList.toggle("is-active", view === "article");
    $("universeView").classList.toggle("is-active", view === "universe");
    $("viewWorkspace").classList.toggle(
      "is-active",
      view === "workspace" || view === "collection" || view === "article",
    );
    $("viewUniverse").classList.toggle("is-active", view === "universe");
    document.body.classList.toggle("is-universe-open", view === "universe");
    $("appShell").classList.toggle("is-universe", view === "universe");

    if (view === "universe") {
      if (window.RK_UNIVERSE && window.RK_UNIVERSE.enter) {
        window.RK_UNIVERSE.enter();
      }
      if (!state.guideSeen.universe) {
        setTimeout(function () {
          openGuide("universe");
        }, 500);
      }
    } else if (window.RK_UNIVERSE && window.RK_UNIVERSE.exit) {
      window.RK_UNIVERSE.exit();
      if (view === "workspace") {
        renderWorkspace();
      }
    }

    if (view === "workspace") renderWorkspace();
    if (view === "collection") renderArticleList();
    if (view === "article") renderArticle(next.step);
    updateNavigationDock();
    saveState();
  }

  function currentModule() {
    return state.currentView === "universe" ? "universe" : "workspace";
  }

  function updateNavigationDock() {
    $("navPrevious").classList.toggle("is-disabled", navigationStack.length === 0);
    $("viewWorkspace").hidden = !state.settings.modules.workspace;
    $("viewUniverse").hidden = !state.settings.modules.universe;
  }

  function goBack() {
    if (!navigationStack.length) return;
    var previous = navigationStack.pop();
    restoringNavigation = true;
    state.selectedTheme = previous.selectedTheme;
    state.selectedArticle = previous.selectedArticle;
    state.articleStep = previous.articleStep;
    setView(previous.view, { step: previous.articleStep });
    restoringNavigation = false;
  }

  function goHome() {
    if (state.settings.modules.workspace) {
      setView("workspace");
    } else if (state.settings.modules.universe) {
      setView("universe");
    } else {
      state.settings.modules.workspace = true;
      setView("workspace");
    }
  }

  function renderStats() {
    var info = levelInfo();
    var countByTheme = {};
    getArticles().forEach(function (article) {
      countByTheme[article.themeId] = (countByTheme[article.themeId] || 0) + 1;
    });

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
    var themes = getThemes()
      .filter(function (theme) {
        var small = state.settings.small.themes[theme.id] || {};
        return small.visible !== false;
      })
      .slice()
      .sort(function (a, b) {
        var aOrder = (state.settings.small.themes[a.id] || {}).order;
        var bOrder = (state.settings.small.themes[b.id] || {}).order;
        var aValue = Number.isFinite(aOrder) ? aOrder : getThemes().indexOf(a);
        var bValue = Number.isFinite(bOrder) ? bOrder : getThemes().indexOf(b);
        return aValue - bValue;
      });
    $("themeGrid").innerHTML = themes
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
          '<span class="theme-drag-handle" data-drag-theme="' +
          theme.id +
          '" title="拖动主题">' +
          icon("move") +
          "</span>" +
          '<span class="theme-symbol">' +
          icon(themeIcon(theme.id)) +
          "</span>" +
          '<div style="display:flex;align-items:center;gap:6px">' +
          '<span class="theme-status' +
          (added ? " is-added" : "") +
          '">' +
          (added ? "已加入宇宙" : "未加入宇宙") +
          "</span>" +
          '<button class="theme-card-menu" data-theme-settings="' +
          theme.id +
          '" type="button" aria-label="主题小设置" title="主题小设置">' +
          icon("settings") +
          "</button>" +
          "</div>" +
          "</div>" +
          "<h3>" +
          escapeHtml(theme.name) +
          "</h3>" +
          "<p>" +
          escapeHtml(theme.description) +
          "</p>" +
          '<div class="theme-card-foot">' +
          "<span><strong>" +
          (counts[theme.id] || 0) +
          "</strong> 篇收藏 · " +
          mastered +
          " 篇掌握</span>" +
          '<div class="theme-card-actions">' +
          '<button class="theme-board-button" data-board-theme="' +
          theme.id +
          '" type="button" title="打开无边记" aria-label="打开无边记">' +
          icon("layout") +
          "</button>" +
          '<button class="universe-button ' +
          (added ? "" : "primary") +
          '" data-add-theme="' +
          theme.id +
          '" type="button">' +
          (added ? "查看星系" : "加入宇宙") +
          "</button>" +
          "</div>" +
          "</div>" +
          "</article>"
        );
      })
      .join("");
    var layoutMode = state.settings.workspace.layoutMode || "modules";
    $("themeGrid").className =
      "theme-grid layout-" +
      (layoutMode === "horizontal"
        ? "horizontal"
        : layoutMode === "free"
          ? "free"
          : "modules");
    if (layoutMode === "free") {
      Array.prototype.forEach.call($("themeGrid").children, function (card, index) {
        var themeId = card.getAttribute("data-theme-id");
        state.settings.small.themes[themeId] =
          state.settings.small.themes[themeId] || {};
        var position = state.settings.small.themes[themeId].position;
        if (!position) {
          position = {
            x: 18 + (index % 3) * 31.5,
            y: 18 + Math.floor(index / 3) * 230,
          };
          state.settings.small.themes[themeId].position = position;
        }
        card.style.left = position.x + "%";
        card.style.top = position.y + "px";
      });
    }
  }

  function themeIcon(themeId) {
    var theme = getThemes().find(function (item) {
      return item.id === themeId;
    });
    if (theme && theme.icon) return theme.icon;
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
      var hasAnyRows = getArticles().some(function (article) {
        return article.themeId === state.selectedTheme;
      });
      $("articleList").innerHTML =
        '<div class="empty-state"><div><strong>' +
        (hasAnyRows ? "没有匹配的文章" : "这个类别还没有文章") +
        "</strong><span>" +
        (hasAnyRows
          ? "换一个状态或关键词试试。"
          : "类别数据已经保留，后续同步或加入收藏后会显示在这里。") +
        "</span></div></div>";
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
    updateNavigationDock();
  }

  function getStepMeta(stepId) {
    return stepById(stepId) || STEP_DEFINITIONS[0];
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
      " / " +
      escapeHtml(String(enabledStepIds(article.id).length)) +
      " 步已拆 · " +
      escapeHtml(String(articleState.mastery)) +
      "% 掌握度";
  }

  function renderStepNav(article, articleState) {
    $("stepNav").innerHTML = enabledStepIds(article.id)
      .map(function (stepId, index) {
        var meta = getStepMeta(stepId);
        var done = articleState.completedSteps.indexOf(stepId) !== -1;
        return (
          '<button class="step-button' +
          (state.articleStep === stepId ? " is-active" : "") +
          (done ? " is-done" : "") +
          '" type="button" data-article-step="' +
          stepId +
          '">' +
          '<span class="step-index">' +
          (done ? icon("check") : String(index + 1).padStart(2, "0")) +
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

    if (state.articleStep === "surface") {
      content =
        '<div class="analysis-grid">' +
        '<section class="analysis-card is-wide"><h3>' +
        icon("message-circle") +
        "它正在回答什么</h3><p>" +
        escapeHtml(article.question) +
        "</p></section>" +
        '<section class="analysis-card is-wide"><h3>' +
        icon("target") +
        "作者的核心结论</h3><p>" +
        escapeHtml(analysis.surface.conclusion) +
        "</p></section>" +
        "</div>";
    }

    if (state.articleStep === "evidence") {
      content =
        '<div class="analysis-grid">' +
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

    if (state.articleStep === "first") {
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
        '<section class="analysis-card"><h3>' +
        icon("orbit") +
        "理想形态</h3><p>" +
        escapeHtml(analysis.ideal.idealForm) +
        "</p></section>" +
        '<section class="analysis-card"><h3>' +
        icon("scale") +
        "现实偏差</h3><p>" +
        escapeHtml(analysis.ideal.realityGap) +
        "</p></section>" +
        '<section class="analysis-card is-wide"><h3>' +
        icon("shield") +
        "反例检验</h3><p>" +
        escapeHtml(analysis.ideal.counterexample) +
        "</p></section>" +
        "</div>";
    }

    if (state.articleStep === "debate") {
      var messages = articleState.aiMessages || [];
      content =
        '<section class="debate-panel">' +
        '<div class="debate-header">' +
        icon("bot") +
        '<div><strong>AI 抬杠席</strong><small>输入“我学会了”开始压力测试</small></div></div>' +
        '<div class="debate-messages" id="debateMessages">' +
        (messages.length
          ? messages
              .map(function (message) {
                return (
                  '<div class="debate-message ' +
                  message.role +
                  '">' +
                  escapeHtml(message.text) +
                  "</div>"
                );
              })
              .join("")
          : '<div class="debate-message ai">先别急着总结。告诉我“我学会了”，我会用一个边界问题检验你是不是真的掌握了。</div>') +
        "</div>" +
        '<form class="debate-input" id="debateForm"><input id="debateInput" type="text" placeholder="输入你的回答，或直接发送“我学会了”" autocomplete="off"><button type="submit">发送</button></form>' +
        "</section>";
    }

    if (state.articleStep === "transfer") {
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
    var enabledSteps = enabledStepIds(article.id);
    var currentStepIndex = enabledSteps.indexOf(state.articleStep);
    if (currentStepIndex < enabledSteps.length - 1) {
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
          "点亮这颗星球" +
          "</button>" +
          '<button class="button button-quiet" data-action="unlearn" type="button">' +
          icon("refresh") +
          "改为未学会，再学一遍" +
          "</button>";
      } else {
        footer =
          '<button class="button button-primary" data-action="open-universe" type="button">' +
          icon("orbit") +
          "去宇宙查看已点亮星球" +
          "</button>" +
          '<button class="button button-quiet" data-action="unlight" type="button">' +
          icon("refresh") +
          "改为未点亮，再学一遍" +
          "</button>";
      }
    }

    $("analysisStage").innerHTML =
      '<header class="stage-heading" style="--theme-color:' +
      themeOf(article.themeId).color +
      '">' +
      '<span class="stage-label">' +
      "STEP " +
      String(currentStepIndex + 1).padStart(2, "0") +
      " · " +
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

  function renderArticleAi(articleState) {
    var response = $("articleAiResponse");
    var latest = articleState.aiMessages
      .slice()
      .reverse()
      .find(function (message) {
        return message.role === "ai";
      });
    response.hidden = !latest;
    response.textContent = latest ? latest.text : "";
  }

  async function submitArticleAi(message, source) {
    var text = String(message || "").trim();
    if (!text) return;
    var article = articleById(state.selectedArticle);
    if (!article) return;
    var articleState = getArticleState(article.id);
    articleState.aiMessages.push({ role: "user", text: text });
    if (source === "debate") renderArticle();
    else renderArticleAi(articleState);
    saveState();
    try {
      var answer = await API.articleChat(article, text);
      articleState.aiMessages.push({ role: "ai", text: answer });
      renderArticleAi(articleState);
      if (state.articleStep === "debate") renderArticle();
      saveState();
    } catch (error) {
      showToast("AI 暂时没有回应：" + error.message, "warning");
    }
  }

  function renderArticle(stepOverride) {
    var article = articleById(state.selectedArticle);
    if (!article) {
      setView("workspace");
      return;
    }
    if (
      stepOverride &&
      stepById(stepOverride) &&
      enabledStepIds(article.id).indexOf(stepOverride) !== -1
    ) {
      state.articleStep = stepOverride;
    }
    if (enabledStepIds(article.id).indexOf(state.articleStep) === -1) {
      state.articleStep = enabledStepIds(article.id)[0];
    }
    var articleState = getArticleState(article.id);
    renderArticleIdentity(article, articleState);
    renderStepNav(article, articleState);
    renderAnalysisStage(article, articleState);
    renderNotes(articleState);
    renderArticleAi(articleState);
    $("analysisStage").dataset.depth =
      state.settings.workspace.defaultDepth;
    $("analysisStage").dataset.density = state.settings.workspace.readingDensity;
    saveState();
  }

  function openArticle(id) {
    var article = articleById(id);
    if (!article) return;
    state.selectedArticle = id;
    state.lastArticle = id;
    state.selectedTheme = article.themeId;
    var articleState = getArticleState(id);
    var steps = enabledStepIds(id);
    var nextStep = steps.find(function (stepId) {
      return articleState.completedSteps.indexOf(stepId) === -1;
    });
    state.articleStep = nextStep || steps[steps.length - 1];
    setView("article");
  }

  function selectTheme(themeId) {
    if (!themeOf(themeId)) return;
    state.selectedTheme = themeId;
    setView("collection");
  }

  function openThemeCreate() {
    $("themeNameInput").value = "";
    themeCreateSelection = {
      icon: "book-open",
      color: THEME_COLOR_OPTIONS[0],
    };
    renderThemeCreateChoices();
    $("themeCreateDialog").showModal();
    document.body.classList.add("is-dialog-open");
  }

  function renderThemeCreateChoices() {
    $("themeIconChoices").innerHTML = THEME_ICON_OPTIONS.map(function (name) {
      return (
        '<button class="icon-choice' +
        (themeCreateSelection.icon === name ? " is-active" : "") +
        '" data-theme-icon="' +
        name +
        '" type="button" title="' +
        name +
        '">' +
        icon(name) +
        "</button>"
      );
    }).join("");
    $("themeColorChoices").innerHTML = THEME_COLOR_OPTIONS.map(function (color) {
      return (
        '<button class="color-choice' +
        (themeCreateSelection.color === color ? " is-active" : "") +
        '" data-theme-color="' +
        color +
        '" style="--choice-color:' +
        color +
        '" type="button" aria-label="选择颜色 ' +
        color +
        '"></button>'
      );
    }).join("");
  }

  function createCustomTheme() {
    var name = $("themeNameInput").value.trim();
    if (!name) {
      showToast("请先输入类别名称", "warning");
      return;
    }
    var id =
      "custom-" +
      Date.now().toString(36) +
      Math.floor(Math.random() * 1000).toString(36);
    state.customThemes.push({
      id: id,
      name: name,
      description: "自定义知识领域",
      color: themeCreateSelection.color,
      soft: "rgba(79,115,232,.12)",
      keywords: [name],
      icon: themeCreateSelection.icon,
      custom: true,
    });
    state.settings.small.themes[id] = {
      color: themeCreateSelection.color,
      order: getThemes().length - 1,
      visible: true,
    };
    state.selectedTheme = id;
    $("themeCreateDialog").close();
    document.body.classList.remove("is-dialog-open");
    renderWorkspace();
    saveState();
    showToast("已创建类别“" + name + "”", "success");
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
      showToast("先完成学习步骤，文章才会形成行星", "warning");
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
      articleState.mastery = Math.max(
        articleState.mastery,
        stepNumber(state.articleStep, state.selectedArticle) * 18,
      );
    }
    var steps = enabledStepIds(state.selectedArticle);
    var index = steps.indexOf(state.articleStep);
    state.articleStep = steps[Math.min(steps.length - 1, index + 1)];
    renderArticle();
    saveState();
  }

  function finishAnalysis() {
    var articleState = getArticleState(state.selectedArticle);
    enabledStepIds(state.selectedArticle).forEach(function (stepId) {
      if (articleState.completedSteps.indexOf(stepId) === -1) {
        articleState.completedSteps.push(stepId);
      }
    });
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
    enabledStepIds(state.selectedArticle).forEach(function (stepId) {
      if (articleState.completedSteps.indexOf(stepId) === -1) {
        articleState.completedSteps.push(stepId);
      }
    });
    showToast("这颗行星已经点亮，并纳入长期知识链", "success");
    renderArticle();
    renderWorkspace();
    saveState();
  }

  function resetLearningProgress(mode) {
    var articleState = getArticleState(state.selectedArticle);
    if (mode === "unlearn") {
      articleState.status = "seed";
      articleState.mastery = Math.min(articleState.mastery, 30);
      articleState.completedSteps = [];
      showToast("已改为未学会，笔记、AI 对话和设置都会保留", "success");
    } else {
      articleState.status = "planet";
      articleState.mastery = Math.min(
        Math.max(articleState.mastery, 60),
        86,
      );
      enabledStepIds(state.selectedArticle).forEach(function (stepId) {
        if (articleState.completedSteps.indexOf(stepId) === -1) {
          articleState.completedSteps.push(stepId);
        }
      });
      showToast("已改为未点亮，可以重新完成最后一步", "success");
    }
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

  function moduleToggleHtml(key, title, description) {
    return (
      '<div class="toggle-row"><span class="toggle-copy"><strong>' +
      escapeHtml(title) +
      "</strong><small>" +
      escapeHtml(description) +
      '</small></span><label class="switch"><input type="checkbox" data-module-toggle="' +
      key +
      '"' +
      (state.settings.modules[key] ? " checked" : "") +
      '><span></span></label></div>'
    );
  }

  function stepOrderHtml() {
    var order = state.settings.workspace.stepOrder.slice();
    STEP_DEFINITIONS.forEach(function (step) {
      if (order.indexOf(step.id) === -1) order.push(step.id);
    });
    return order
      .map(function (stepId, index) {
        var step = getStepMeta(stepId);
        var enabled = state.settings.workspace.stepEnabled[stepId] !== false;
        return (
          '<div class="step-order-item' +
          (enabled ? "" : " is-disabled") +
          '">' +
          '<span class="step-index">' +
          String(index + 1).padStart(2, "0") +
          "</span>" +
          "<strong>" +
          escapeHtml(step.title) +
          "</strong>" +
          '<div class="step-order-actions">' +
          '<button data-step-move="up" data-step-id="' +
          stepId +
          '" type="button" title="上移">' +
          icon("chevron-up") +
          "</button>" +
          '<button data-step-move="down" data-step-id="' +
          stepId +
          '" type="button" title="下移">' +
          icon("chevron-down") +
          "</button>" +
          '<label class="switch"><input type="checkbox" data-step-enabled="' +
          stepId +
          '"' +
          (enabled ? " checked" : "") +
          '><span></span></label>' +
          "</div>" +
          "</div>"
        );
      })
      .join("");
  }

  function openSettings(context) {
    settingsContext = context;
    $("settingsKicker").textContent = "中心设置";
    $("settingsTitle").textContent =
      context === "universe" ? "炼金宇宙" : "收藏拆解";
    $("centerSettingsBody").innerHTML =
      '<section class="settings-block"><div class="settings-block-title"><div><h3>模块开关</h3><p>关闭只隐藏入口，文章、进度、颜色和宇宙位置都会保留。</p></div></div>' +
      moduleToggleHtml("workspace", "收藏拆解", "主题归类、文章拆解与学习流程") +
      moduleToggleHtml("universe", "炼金宇宙", "主题星系、行星与知乎搜索") +
      "</section>" +
      (context === "universe"
        ? '<section class="settings-block"><div class="settings-block-title"><div><h3>宇宙默认设置</h3><p>单个星系和行星仍可在区域小设置中覆盖。</p></div></div>' +
          '<div class="settings-grid">' +
          '<label class="field"><span>文章名显示</span><select id="universeLabelSelect"><option value="automatic">缩放到比例后显示</option><option value="always">始终显示</option></select></label>' +
          '<label class="field"><span>视角灵敏度</span><select id="universeSensitivitySelect"><option value="gentle">舒缓</option><option value="standard">标准</option><option value="quick">灵敏</option></select></label>' +
          "</div>" +
          '<div style="margin-top:12px">' +
          '<div class="toggle-row"><span class="toggle-copy"><strong>关系链</strong><small>显示文章之间的知识连接</small></span><label class="switch"><input id="universeLinksToggle" type="checkbox"' +
          (state.settings.universe.showLinks ? " checked" : "") +
          "><span></span></label></div>" +
          '<div class="toggle-row"><span class="toggle-copy"><strong>沉浸效果</strong><small>星尘、光晕和轨道运动</small></span><label class="switch"><input id="universeEffectsToggle" type="checkbox"' +
          (state.settings.universe.showEffects ? " checked" : "") +
          "><span></span></label></div>" +
          '<div class="toggle-row"><span class="toggle-copy"><strong>高性能模式</strong><small>减少粒子和距离计算</small></span><label class="switch"><input id="universePerformanceToggle" type="checkbox"' +
          (state.settings.universe.highPerformance ? " checked" : "") +
          "><span></span></label></div>" +
          "</div></section>"
        : '<section class="settings-block"><div class="settings-block-title"><div><h3>学习步骤</h3><p>可以关闭不使用的步骤并调整先后顺序，数据不会删除。</p></div></div><div class="step-order-list">' +
          stepOrderHtml() +
          "</div></section>" +
          '<section class="settings-block"><div class="settings-block-title"><div><h3>学习默认值</h3><p>单篇文章和单个步骤可在区域小设置中临时覆盖。</p></div></div>' +
          '<div class="settings-grid">' +
          '<label class="field"><span>主题排列方式</span><select id="workspaceLayoutSelect"><option value="horizontal">横向并列</option><option value="modules">模块式</option><option value="free">随机可移动存放式</option></select></label>' +
          '<label class="field"><span>默认拆解深度</span><select id="workspaceDepthSelect"><option value="quick">快速定位</option><option value="standard">标准拆解</option><option value="deep">第一性深挖</option></select></label>' +
          '<label class="field"><span>AI 默认语气</span><select id="workspaceAiSelect"><option value="explain">解释型</option><option value="balanced">平衡型</option><option value="challenge">追问型</option><option value="counter">反例型</option></select></label>' +
          '<label class="field"><span>收藏进入方式</span><select id="workspaceIntakeSelect"><option value="manual">手动挑选</option><option value="assisted">AI 粗筛后确认</option><option value="automatic">自动进入待拆解</option></select></label>' +
          '<label class="field"><span>阅读密度</span><select id="workspaceDensitySelect"><option value="compact">紧凑</option><option value="comfortable">舒适</option><option value="spacious">宽松</option></select></label>' +
          '</div><div class="toggle-row"><span class="toggle-copy"><strong>减少动效</strong><small>降低页面动画和过渡</small></span><label class="switch"><input id="workspaceMotionToggle" type="checkbox"' +
          (state.settings.workspace.reduceMotion ? " checked" : "") +
          "><span></span></label></div></section>");

    if (context === "universe") {
      $("universeLabelSelect").value = state.settings.universe.labelMode;
      $("universeSensitivitySelect").value = state.settings.universe.sensitivity;
    } else {
      $("workspaceLayoutSelect").value =
        state.settings.workspace.layoutMode || "modules";
      $("workspaceDepthSelect").value = state.settings.workspace.defaultDepth;
      $("workspaceAiSelect").value = state.settings.workspace.aiTone;
      $("workspaceIntakeSelect").value = state.settings.workspace.intakeMode;
      $("workspaceDensitySelect").value = state.settings.workspace.readingDensity;
    }
    $("settingsDialog").showModal();
    document.body.classList.add("is-dialog-open");
  }

  function closeSettings() {
    document.body.classList.remove("is-dialog-open");
  }

  function saveCenterSettings() {
    var body = $("centerSettingsBody");
    body.querySelectorAll("[data-module-toggle]").forEach(function (input) {
      state.settings.modules[input.getAttribute("data-module-toggle")] = input.checked;
    });
    if (!state.settings.modules.workspace && !state.settings.modules.universe) {
      state.settings.modules.workspace = true;
      showToast("至少需要保留一个模块，已自动启用收藏拆解", "warning");
    }
    if (settingsContext === "universe") {
      state.settings.universe.labelMode = $("universeLabelSelect").value;
      state.settings.universe.sensitivity = $("universeSensitivitySelect").value;
      state.settings.universe.showLinks = $("universeLinksToggle").checked;
      state.settings.universe.showEffects = $("universeEffectsToggle").checked;
      state.settings.universe.highPerformance =
        $("universePerformanceToggle").checked;
    } else {
      state.settings.workspace.layoutMode = $("workspaceLayoutSelect").value;
      state.settings.workspace.defaultDepth = $("workspaceDepthSelect").value;
      state.settings.workspace.aiTone = $("workspaceAiSelect").value;
      state.settings.workspace.intakeMode = $("workspaceIntakeSelect").value;
      state.settings.workspace.readingDensity =
        $("workspaceDensitySelect").value;
      state.settings.workspace.reduceMotion = $("workspaceMotionToggle").checked;
    }
    document.documentElement.classList.toggle(
      "reduce-motion",
      state.settings.workspace.reduceMotion,
    );
    if (
      !state.settings.modules.workspace &&
      (state.currentView === "workspace" ||
        state.currentView === "collection" ||
        state.currentView === "article")
    ) {
      goHome();
    }
    if (!state.settings.modules.universe && state.currentView === "universe") {
      goHome();
    }
    renderWorkspace();
    saveState();
    if (window.RK_UNIVERSE && window.RK_UNIVERSE.refresh) {
      window.RK_UNIVERSE.refresh();
    }
    updateNavigationDock();
    showToast("中心设置已保存，原有数据保持不变", "success");
  }

  function openSmallSettings(context) {
    smallSettingsContext = context;
    var title = "当前区域";
    var html = "";
    if (context.type === "theme") {
      var theme = themeOf(context.id);
      var themeSmall = state.settings.small.themes[context.id] || {};
      title = theme.name + " · 主题设置";
      html =
        '<section class="settings-block"><div class="settings-block-title"><div><h3>显示与顺序</h3><p>只影响这个主题卡片，中心设置仍保持默认。</p></div></div>' +
        '<div class="toggle-row"><span class="toggle-copy"><strong>在归类页显示</strong><small>关闭后数据仍保留，可在小设置里重新开启</small></span><label class="switch"><input id="smallThemeVisible" type="checkbox"' +
        (themeSmall.visible !== false ? " checked" : "") +
        "><span></span></label></div>" +
        '<label class="field" style="margin-top:10px"><span>显示顺序</span><input id="smallThemeOrder" type="number" min="0" max="99" value="' +
        (Number.isFinite(themeSmall.order)
          ? themeSmall.order
          : getThemes().indexOf(theme)) +
        '"></label></section>' +
        '<section class="settings-block"><div class="settings-block-title"><div><h3>主题色</h3><p>只改变这个主题的视觉识别色。</p></div></div><div class="color-radio-grid">' +
        '<label class="color-radio"><input type="radio" name="smallThemeColor" value=""' +
        (!themeSmall.color ? " checked" : "") +
        '><span class="color-radio-swatch" style="--choice-color:' +
        theme.color +
        '"></span><small>继承</small></label>' +
        THEME_COLOR_OPTIONS.map(function (color) {
          return (
            '<label class="color-radio"><input type="radio" name="smallThemeColor" value="' +
            color +
            '"' +
            (themeSmall.color === color ? " checked" : "") +
            '><span class="color-radio-swatch" style="--choice-color:' +
            color +
            '"></span><small>' +
            color.replace("#", "").toUpperCase() +
            "</small></label>"
          );
        }).join("") +
        "</div></section>" +
        '<section class="settings-block danger-zone"><div><h3>删除星系</h3><p>只从炼金宇宙移除，收藏主题、文章和进度全部保留。</p></div><button class="button button-danger" id="deleteGalaxyButton" type="button">删除这个星系</button></section>';
    }
    if (context.type === "galaxy") {
      var galaxy = themeOf(context.id);
      var galaxySmall = state.settings.small.galaxies[context.id] || {};
      title = galaxy.name + " · 星系设置";
      html =
        '<section class="settings-block"><div class="settings-block-title"><div><h3>星系局部设置</h3><p>只覆盖这个星系，关闭再打开后仍会保留。</p></div></div>' +
        '<div class="settings-grid"><label class="field"><span>公转速度</span><select id="smallGalaxySpeed"><option value="">继承中心设置</option><option value="slow">舒缓</option><option value="standard">标准</option><option value="fast">明显</option></select></label>' +
        '<label class="field"><span>文章名显示</span><select id="smallGalaxyLabels"><option value="">继承中心设置</option><option value="near">更近时显示</option><option value="standard">达到比例显示</option><option value="early">较早显示</option></select></label></div></section>' +
        '<section class="settings-block"><div class="settings-block-title"><div><h3>星系色彩</h3></div></div><div class="color-radio-grid">' +
        '<label class="color-radio"><input type="radio" name="smallGalaxyColor" value=""' +
        (!galaxySmall.color ? " checked" : "") +
        '><span class="color-radio-swatch" style="--choice-color:' +
        galaxy.color +
        '"></span><small>继承</small></label>' +
        THEME_COLOR_OPTIONS.map(function (color) {
          return (
            '<label class="color-radio"><input type="radio" name="smallGalaxyColor" value="' +
            color +
            '"' +
            (galaxySmall.color === color ? " checked" : "") +
            '><span class="color-radio-swatch" style="--choice-color:' +
            color +
            '"></span><small>' +
            color.replace("#", "").toUpperCase() +
            "</small></label>"
          );
        }).join("") +
        "</div></section>";
    }
    if (context.type === "article") {
      var article = articleById(context.id);
      var articleSmall = state.settings.small.articles[context.id] || {};
      title = "文章学习步骤";
      html =
        '<section class="settings-block"><div class="settings-block-title"><div><h3>这篇文章使用哪些步骤</h3><p>只影响当前文章。关闭后数据保留，重新打开即可恢复。</p></div></div><div class="toggle-list">' +
        state.settings.workspace.stepOrder
          .map(function (stepId) {
            var step = getStepMeta(stepId);
            var inherited =
              state.settings.workspace.stepEnabled[stepId] !== false;
            var enabled =
              articleSmall.stepEnabled &&
              articleSmall.stepEnabled[stepId] !== undefined
                ? articleSmall.stepEnabled[stepId]
                : inherited;
            return (
              '<div class="toggle-row"><span class="toggle-copy"><strong>' +
              escapeHtml(step.title) +
              "</strong><small>" +
              escapeHtml(step.short) +
              '</small></span><label class="switch"><input type="checkbox" data-article-step-toggle="' +
              stepId +
              '"' +
              (enabled ? " checked" : "") +
              "><span></span></label></div>"
            );
          })
          .join("") +
        "</div></section>";
    }
    $("smallSettingsTitle").textContent = title;
    $("smallSettingsBody").innerHTML = html;
    if (context.type === "galaxy") {
      $("smallGalaxySpeed").value =
        (state.settings.small.galaxies[context.id] || {}).orbitSpeed || "";
      $("smallGalaxyLabels").value =
        (state.settings.small.galaxies[context.id] || {}).labelMode || "";
    }
    $("smallSettingsDialog").showModal();
    document.body.classList.add("is-dialog-open");
  }

  function saveSmallSettings() {
    if (!smallSettingsContext) return;
    var context = smallSettingsContext;
    if (context.type === "theme") {
      var themeOverride =
        state.settings.small.themes[context.id] || {};
      themeOverride.visible = $("smallThemeVisible").checked;
      themeOverride.order = Number($("smallThemeOrder").value) || 0;
      var selectedThemeColor = document.querySelector(
        'input[name="smallThemeColor"]:checked',
      );
      if (selectedThemeColor && selectedThemeColor.value) {
        themeOverride.color = selectedThemeColor.value;
        state.settings.small.galaxies[context.id] =
          state.settings.small.galaxies[context.id] || {};
        state.settings.small.galaxies[context.id].color =
          selectedThemeColor.value;
      } else {
        delete themeOverride.color;
      }
      state.settings.small.themes[context.id] = themeOverride;
    }
    if (context.type === "galaxy") {
      var galaxyOverride =
        state.settings.small.galaxies[context.id] || {};
      galaxyOverride.orbitSpeed = $("smallGalaxySpeed").value || undefined;
      galaxyOverride.labelMode = $("smallGalaxyLabels").value || undefined;
      var selectedGalaxyColor = document.querySelector(
        'input[name="smallGalaxyColor"]:checked',
      );
      if (selectedGalaxyColor && selectedGalaxyColor.value) {
        galaxyOverride.color = selectedGalaxyColor.value;
        state.settings.small.themes[context.id] =
          state.settings.small.themes[context.id] || {};
        state.settings.small.themes[context.id].color =
          selectedGalaxyColor.value;
      } else {
        delete galaxyOverride.color;
      }
      state.settings.small.galaxies[context.id] = galaxyOverride;
    }
    if (context.type === "article") {
      var articleOverride =
        state.settings.small.articles[context.id] || {};
      articleOverride.stepEnabled = articleOverride.stepEnabled || {};
      $("smallSettingsBody")
        .querySelectorAll("[data-article-step-toggle]")
        .forEach(function (input) {
          articleOverride.stepEnabled[input.getAttribute("data-article-step-toggle")] =
            input.checked;
        });
      state.settings.small.articles[context.id] = articleOverride;
    }
    renderWorkspace();
    if (context.type === "article" && state.selectedArticle === context.id) {
      renderArticle();
    }
    saveState();
    if (window.RK_UNIVERSE && window.RK_UNIVERSE.refresh) {
      window.RK_UNIVERSE.refresh();
    }
    showToast("区域设置已应用", "success");
  }

  function resetSmallSettings() {
    if (!smallSettingsContext) return;
    if (smallSettingsContext.type === "theme") {
      delete state.settings.small.themes[smallSettingsContext.id];
    }
    if (smallSettingsContext.type === "galaxy") {
      delete state.settings.small.galaxies[smallSettingsContext.id];
    }
    if (smallSettingsContext.type === "article") {
      delete state.settings.small.articles[smallSettingsContext.id];
    }
    saveState();
    $("smallSettingsDialog").close();
    document.body.classList.remove("is-dialog-open");
    renderWorkspace();
    if (
      smallSettingsContext.type === "article" &&
      state.selectedArticle === smallSettingsContext.id
    ) {
      renderArticle();
    }
    if (window.RK_UNIVERSE && window.RK_UNIVERSE.refresh) {
      window.RK_UNIVERSE.refresh();
    }
    showToast("已恢复为中心设置", "success");
  }

  function openGuide(module) {
    var detailedGuides = {
      workspace: {
        kicker: "收藏拆解 · 完整操作指南",
        title: "从收藏到真正理解的每一步",
        intro:
          "这个模块负责整理主题、拆解回答、与 AI 抬杠并记录自己的理解。第一次使用可以严格按下面顺序操作。",
        steps: [
          {
            title: "同步并归类收藏",
            text: "首页只显示主题归类。右上角可以同步收藏或创建新类别。",
            actions: [
              "点击“同步收藏”更新收藏数据。",
              "点击“新建类别”，填写名称并选择图标与主题色。",
              "点击主题卡片进入文章列表；点击卡片齿轮调整颜色、顺序和显示状态。",
            ],
          },
          {
            title: "选择主题排列方式",
            text: "点击模块右上角的中心设置图标，选择主题的摆放方式。",
            actions: [
              "横向并列适合快速横向浏览。",
              "模块式适合主题数量不多时集中查看。",
              "随机可移动存放式可以拖动卡片顶部手柄，位置自动保存。",
            ],
          },
          {
            title: "使用无边记",
            text: "每个主题都有独立无边记，用来摆放便签、文字、矩形和手绘内容。",
            actions: [
              "选择便签、文字或矩形后，在画布上点击创建。",
              "选择工具或直接拖动卡片可以移动内容。",
              "画布支持缩放、平移、画笔、橡皮和撤销，内容自动保存。",
            ],
          },
          {
            title: "理解文章页面",
            text: "左侧是学习步骤，右侧是内容与札记，顶部是 AI 问答栏和文章小设置。",
            actions: [
              "点击左侧步骤跳转，步骤名悬停一秒会显示简短说明。",
              "文章小设置只为当前文章开关学习步骤。",
              "AI 输入框可以围绕当前文章随时提问。",
            ],
          },
          {
            title: "看懂回答并拆出依据",
            text: "先还原作者的问题和结论，再区分事实、经验、假设和依赖条件。",
            actions: [
              "不要先判断对错，先确认作者究竟在回答什么。",
              "把可验证事实与个人经验分开。",
              "找出结论成立所依赖的前提和边界。",
            ],
          },
          {
            title: "追问根基并让 AI 抬杠",
            text: "找到基本公理后重建结论，再用反例和边界测试理解。",
            actions: [
              "在“AI 抬杠”中输入“我学会了”。",
              "AI 会追问前提、边界和反例。",
              "AI 对话会随文章保存，刷新后仍然存在。",
            ],
          },
          {
            title: "化为己用并回退状态",
            text: "把知识放回真实情境，再决定是否形成行星或点亮。",
            actions: [
              "已形成行星的文章可以改为未学会，重新学习。",
              "已点亮的文章可以改为未点亮，再次验证。",
              "改变状态不会删除笔记、AI 对话或设置。",
            ],
          },
        ],
        tip:
          "中心设置控制默认步骤。每篇文章的小设置只覆盖当前文章，因此同一套产品可以适应不同文章和不同学习习惯。",
      },
      universe: {
        kicker: "炼金宇宙 · 完整操作指南",
        title: "星系、行星与视角的每一步",
        intro:
          "主题是恒星，文章是行星。总览只显示主题名，进入星系或放大到一定程度后才显示文章名。",
        steps: [
          {
            title: "把主题加入宇宙",
            text: "在收藏拆解中点击“加入宇宙”，或在知乎搜索结果里加入待拆解内容。",
            actions: [
              "加入后生成中心恒星。",
              "文章完成拆解后成为行星。",
              "点亮后表示已经掌握。",
            ],
          },
          {
            title: "旋转与移动视角",
            text: "所有拖动都采用正向方向。",
            actions: [
              "鼠标左键或单指拖动：旋转视角。",
              "鼠标右键、中键或双指拖动：移动观察中心。",
              "先移动观察中心，再用滚轮或双指捏合缩放。",
            ],
          },
          {
            title: "让文章名出现",
            text: "总览默认只显示主题名，避免大量文字遮住星系。",
            actions: [
              "持续放大，行星达到屏幕比例后显示文章名。",
              "阈值按屏幕像素计算，桌面和手机一致。",
              "不需要放大到星系占满全屏。",
            ],
          },
          {
            title: "单击星系进入全屏",
            text: "单击中心恒星，镜头会平滑过渡到该星系占据整个画面的状态。",
            actions: [
              "进入后显示全部文章名。",
              "点击行星打开详情。",
              "点击“全部星域”返回总览。",
            ],
          },
          {
            title: "双击恒星打开小设置",
            text: "进入星系后再次双击中心恒星。",
            actions: [
              "修改星系颜色，恒星、行星和轨道统一变色。",
              "调整公转速度和文章名显示阈值。",
              "删除星系只会移出宇宙，收藏和进度全部保留。",
            ],
          },
          {
            title: "改变文章状态",
            text: "行星详情里可以随时回到学习状态。",
            actions: [
              "已点亮可以改为未点亮，再学一遍。",
              "已形成行星可以改为未学会，重新完成步骤。",
            ],
          },
        ],
        tip:
          "宇宙中心设置控制全部星系的标签、关系链、动效和性能；单个星系的小设置优先于中心设置。",
      },
    };
    var guide = detailedGuides[module] || detailedGuides.workspace;
    $("guideKicker").textContent = guide.kicker;
    $("guideTitle").textContent = guide.title;
    $("guideBody").innerHTML =
      '<p class="guide-intro">' +
      escapeHtml(guide.intro) +
      '</p><div class="guide-steps">' +
      guide.steps
        .map(function (step, index) {
          return (
            '<section class="guide-step"><span class="guide-step-index">' +
            String(index + 1).padStart(2, "0") +
            "</span><div><h3>" +
            escapeHtml(step.title) +
            "</h3><p>" +
            escapeHtml(step.text) +
            "</p><ul>" +
            (step.actions || [])
              .map(function (action) {
                return "<li>" + escapeHtml(action) + "</li>";
              })
              .join("") +
            "</ul></div></section>"
          );
        })
        .join("") +
      '</div><p class="guide-tip">' +
      escapeHtml(guide.tip) +
      "</p>";
    state.guideSeen[module] = true;
    saveState();
    $("guideDialog").showModal();
    document.body.classList.add("is-dialog-open");
  }

  function closeGuide() {
    $("guideDialog").close();
    document.body.classList.remove("is-dialog-open");
  }

  function getBoard() {
    if (!state.boards[boardThemeId]) {
      state.boards[boardThemeId] = {
        items: [],
        strokes: [],
        zoom: 1,
        panX: 0,
        panY: 0,
      };
    }
    return state.boards[boardThemeId];
  }

  function boardSnapshot() {
    return clone(getBoard());
  }

  function pushBoardHistory() {
    boardHistory.push(boardSnapshot());
    if (boardHistory.length > 30) boardHistory.shift();
  }

  function renderBoard() {
    if (!boardThemeId) return;
    var board = getBoard();
    var theme = themeOf(boardThemeId);
    $("boardTitle").textContent = theme.name + " · 无边记";
    $("boardCanvas").style.transform =
      "translate(" +
      board.panX +
      "px," +
      board.panY +
      "px) scale(" +
      board.zoom +
      ")";
    $("boardZoomLabel").textContent = Math.round(board.zoom * 100) + "%";
    $("boardCanvas").innerHTML =
      '<svg class="board-ink" aria-hidden="true">' +
      (board.strokes || [])
        .map(function (stroke) {
          return (
            '<polyline points="' +
            stroke.points
              .map(function (point) {
                return point[0] + "," + point[1];
              })
              .join(" ") +
            '" fill="none" stroke="' +
            stroke.color +
            '" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"></polyline>'
          );
        })
        .join("") +
      "</svg>" +
      (board.items || [])
        .map(function (item) {
          return (
            '<div class="board-item board-' +
            item.type +
            '" data-board-item="' +
            item.id +
            '" style="left:' +
            item.x +
            "px;top:" +
            item.y +
            "px;width:" +
            item.w +
            "px;height:" +
            item.h +
            "px;" +
            (item.color ? "background:" + item.color + ";" : "") +
            '">' +
            '<div class="board-item-text" contenteditable="true">' +
            escapeHtml(item.text) +
            "</div></div>"
          );
        })
        .join("") +
      (!board.items.length && !board.strokes.length
        ? '<div class="board-empty"><strong>从一个便签开始</strong><span>点击顶部便签、文本或矩形工具，然后在上方空白处落笔。</span></div>'
        : "");
  }

  function openBoard(themeId) {
    boardThemeId = themeId;
    boardTool = "select";
    boardHistory = [];
    renderBoard();
    $("boardDialog").showModal();
    document.body.classList.add("is-dialog-open");
  }

  function closeBoard() {
    $("boardDialog").close();
    document.body.classList.remove("is-dialog-open");
    saveState();
  }

  function boardCoordinates(event) {
    var board = getBoard();
    var rect = $("boardWorkspace").getBoundingClientRect();
    return {
      x: (event.clientX - rect.left - board.panX) / board.zoom,
      y: (event.clientY - rect.top - board.panY) / board.zoom,
    };
  }

  function addBoardItem(type, point) {
    pushBoardHistory();
    var id = "item-" + Date.now().toString(36);
    var defaults = {
      note: { w: 190, h: 140, text: "双击编辑便签", color: "#fff3bd" },
      text: { w: 220, h: 72, text: "双击输入文字", color: "" },
      rect: { w: 220, h: 150, text: "说明", color: "" },
    }[type];
    getBoard().items.push({
      id: id,
      type: type,
      x: Math.round(point.x - defaults.w / 2),
      y: Math.round(point.y - defaults.h / 2),
      w: defaults.w,
      h: defaults.h,
      text: defaults.text,
      color: defaults.color,
    });
    renderBoard();
    saveState();
  }

  function updateBoardItem(id, patch) {
    var item = getBoard().items.find(function (entry) {
      return entry.id === id;
    });
    if (!item) return;
    Object.assign(item, patch);
    saveState();
  }

  function undoBoard() {
    var previous = boardHistory.pop();
    if (!previous) return;
    state.boards[boardThemeId] = previous;
    renderBoard();
    saveState();
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

  function deleteGalaxyFromUniverse(themeId) {
    state.addedThemes = state.addedThemes.filter(function (id) {
      return id !== themeId;
    });
    getArticles().forEach(function (article) {
      if (article.themeId === themeId) delete state.universeItems[article.id];
    });
    $("smallSettingsDialog").close();
    document.body.classList.remove("is-dialog-open");
    saveState();
    if (window.RK_UNIVERSE && window.RK_UNIVERSE.refresh) {
      window.RK_UNIVERSE.refresh();
    }
    showToast("星系已从宇宙移除，收藏数据仍然保留", "success");
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
      button.innerHTML = icon("refresh") + "同步收藏";
    }
  }

  function bindEvents() {
    $("brandHome").addEventListener("click", goHome);
    $("viewWorkspace").addEventListener("click", function () {
      if (state.settings.modules.workspace) setView("workspace");
      else showToast("收藏拆解模块已在中心设置中关闭", "warning");
    });
    $("viewUniverse").addEventListener("click", function () {
      if (state.settings.modules.universe) setView("universe");
      else showToast("炼金宇宙模块已在中心设置中关闭", "warning");
    });
    $("closeUniverse").addEventListener("click", goHome);
    $("universeHome").addEventListener("click", goHome);
    $("syncCollections").addEventListener("click", syncCollections);
    $("newThemeButton").addEventListener("click", openThemeCreate);
    $("backToWorkspace").addEventListener("click", goBack);
    $("navPrevious").addEventListener("click", goBack);
    $("navHome").addEventListener("click", goHome);
    $("guideCompass").addEventListener("click", function () {
      openGuide(currentModule());
    });
    $("closeGuideButton").addEventListener("click", closeGuide);
    $("guideDialog").addEventListener("close", function () {
      document.body.classList.remove("is-dialog-open");
    });

    $("themeGrid").addEventListener("click", function (event) {
      if (suppressThemeClick) {
        suppressThemeClick = false;
        return;
      }
      var boardButton = event.target.closest("[data-board-theme]");
      if (boardButton) {
        openBoard(boardButton.getAttribute("data-board-theme"));
        return;
      }
      var settingsButton = event.target.closest("[data-theme-settings]");
      if (settingsButton) {
        openSmallSettings({
          type: "theme",
          id: settingsButton.getAttribute("data-theme-settings"),
        });
        return;
      }
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
    var themeDrag = null;
    $("themeGrid").addEventListener("pointerdown", function (event) {
      if (state.settings.workspace.layoutMode !== "free") return;
      var handle = event.target.closest("[data-drag-theme]");
      if (!handle) return;
      var card = handle.closest(".theme-card");
      var rect = $("themeGrid").getBoundingClientRect();
      themeDrag = {
        id: handle.getAttribute("data-drag-theme"),
        card: card,
        startX: event.clientX,
        startY: event.clientY,
        left: parseFloat(card.style.left) || 0,
        top: parseFloat(card.style.top) || 0,
        width: rect.width,
      };
      suppressThemeClick = false;
      $("themeGrid").setPointerCapture(event.pointerId);
      event.preventDefault();
    });
    $("themeGrid").addEventListener("pointermove", function (event) {
      if (!themeDrag) return;
      var x =
        themeDrag.left +
        ((event.clientX - themeDrag.startX) / themeDrag.width) * 100;
      var y = themeDrag.top + event.clientY - themeDrag.startY;
      x = Math.max(1, Math.min(76, x));
      y = Math.max(0, Math.min(900, y));
      themeDrag.card.style.left = x + "%";
      themeDrag.card.style.top = y + "px";
      suppressThemeClick = true;
      state.settings.small.themes[themeDrag.id] =
        state.settings.small.themes[themeDrag.id] || {};
      state.settings.small.themes[themeDrag.id].position = { x: x, y: y };
    });
    $("themeGrid").addEventListener("pointerup", function () {
      if (!themeDrag) return;
      themeDrag = null;
      saveState();
    });

    $("openThemeSettings").addEventListener("click", function () {
      openSmallSettings({ type: "theme", id: state.selectedTheme });
    });
    $("openThemeBoard").addEventListener("click", function () {
      openBoard(state.selectedTheme);
    });
    $("openArticleSettings").addEventListener("click", function () {
      openSmallSettings({ type: "article", id: state.selectedArticle });
    });
    $("articleAiForm").addEventListener("submit", function (event) {
      event.preventDefault();
      var input = $("articleAiInput");
      submitArticleAi(input.value, "top");
      input.value = "";
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
      state.articleStep = button.getAttribute("data-article-step");
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
      if (action === "unlearn") resetLearningProgress("unlearn");
      if (action === "unlight") resetLearningProgress("unlight");
    });
    $("analysisStage").addEventListener("submit", function (event) {
      if (event.target.id !== "debateForm") return;
      event.preventDefault();
      var input = $("debateInput");
      submitArticleAi(input.value, "debate");
      input.value = "";
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

    $("openSettings").addEventListener("click", function () {
      openSettings("workspace");
    });
    $("openUniverseSettings").addEventListener("click", function () {
      openSettings("universe");
    });
    $("closeSettingsButton").addEventListener("click", function () {
      closeSettings();
      $("settingsDialog").close();
    });
    $("settingsDialog").addEventListener("close", closeSettings);
    $("settingsForm").addEventListener("submit", function (event) {
      event.preventDefault();
      saveCenterSettings();
      closeSettings();
      $("settingsDialog").close();
    });
    $("centerSettingsBody").addEventListener("click", function (event) {
      var button = event.target.closest("[data-step-move]");
      if (!button) return;
      var stepId = button.getAttribute("data-step-id");
      var direction = button.getAttribute("data-step-move");
      var order = state.settings.workspace.stepOrder.slice();
      var index = order.indexOf(stepId);
      var nextIndex = direction === "up" ? index - 1 : index + 1;
      if (nextIndex < 0 || nextIndex >= order.length) return;
      order.splice(index, 1);
      order.splice(nextIndex, 0, stepId);
      state.settings.workspace.stepOrder = order;
      var item = button.closest(".step-order-item");
      var list = button.closest(".step-order-list");
      if (item && list) {
        var sibling = list.children[nextIndex];
        if (direction === "up") list.insertBefore(item, sibling);
        else list.insertBefore(item, sibling ? sibling.nextSibling : null);
        Array.prototype.forEach.call(list.children, function (row, rowIndex) {
          var indexNode = row.querySelector(".step-index");
          if (indexNode) indexNode.textContent = String(rowIndex + 1).padStart(2, "0");
        });
      }
    });
    $("centerSettingsBody").addEventListener("change", function (event) {
      var input = event.target.closest("[data-step-enabled]");
      if (!input) return;
      state.settings.workspace.stepEnabled[input.getAttribute("data-step-enabled")] =
        input.checked;
      var item = input.closest(".step-order-item");
      if (item) item.classList.toggle("is-disabled", !input.checked);
    });
    $("resetDemo").addEventListener("click", resetDemo);

    $("closeSmallSettingsButton").addEventListener("click", function () {
      $("smallSettingsDialog").close();
      document.body.classList.remove("is-dialog-open");
    });
    $("smallSettingsDialog").addEventListener("close", function () {
      document.body.classList.remove("is-dialog-open");
    });
    $("smallSettingsForm").addEventListener("submit", function (event) {
      event.preventDefault();
      saveSmallSettings();
      $("smallSettingsDialog").close();
      document.body.classList.remove("is-dialog-open");
    });
    $("resetSmallSettings").addEventListener("click", resetSmallSettings);
    $("smallSettingsBody").addEventListener("click", function (event) {
      if (!event.target.closest("#deleteGalaxyButton")) return;
      if (smallSettingsContext && smallSettingsContext.type === "galaxy") {
        deleteGalaxyFromUniverse(smallSettingsContext.id);
      }
    });

    $("boardClose").addEventListener("click", closeBoard);
    $("boardDialog").addEventListener("close", function () {
      document.body.classList.remove("is-dialog-open");
    });
    $("boardTools").addEventListener("click", function (event) {
      var button = event.target.closest("[data-board-tool]");
      if (!button) return;
      boardTool = button.getAttribute("data-board-tool");
      Array.prototype.forEach.call(
        $("boardTools").querySelectorAll("button"),
        function (item) {
          item.classList.toggle("is-active", item === button);
        },
      );
    });
    $("boardUndo").addEventListener("click", undoBoard);
    $("boardZoomOut").addEventListener("click", function () {
      getBoard().zoom = Math.max(0.45, getBoard().zoom - 0.1);
      renderBoard();
      saveState();
    });
    $("boardZoomIn").addEventListener("click", function () {
      getBoard().zoom = Math.min(2.2, getBoard().zoom + 0.1);
      renderBoard();
      saveState();
    });

    var boardDrag = null;
    $("boardWorkspace").addEventListener("pointerdown", function (event) {
      var board = getBoard();
      var itemNode = event.target.closest("[data-board-item]");
      if (boardTool === "erase") {
        pushBoardHistory();
        if (itemNode) {
          board.items = board.items.filter(function (item) {
            return item.id !== itemNode.getAttribute("data-board-item");
          });
        } else {
          var point = boardCoordinates(event);
          board.strokes = (board.strokes || []).filter(function (stroke) {
            return !stroke.points.some(function (strokePoint) {
              return (
                Math.hypot(strokePoint[0] - point.x, strokePoint[1] - point.y) <
                16 / board.zoom
              );
            });
          });
        }
        renderBoard();
        saveState();
        return;
      }
      if (itemNode && boardTool !== "pen") {
        boardDrag = {
          id: itemNode.getAttribute("data-board-item"),
          start: boardCoordinates(event),
        };
        $("boardWorkspace").setPointerCapture(event.pointerId);
        return;
      }
      if (["note", "text", "rect"].indexOf(boardTool) !== -1) {
        addBoardItem(boardTool, boardCoordinates(event));
        return;
      }
      if (boardTool === "pen") {
        pushBoardHistory();
        boardDrawing = { color: "#2f68e8", points: [] };
        var penPoint = boardCoordinates(event);
        boardDrawing.points.push([penPoint.x, penPoint.y]);
        getBoard().strokes.push(boardDrawing);
        renderBoard();
        return;
      }
      boardDrag = {
        pan: true,
        startX: event.clientX,
        startY: event.clientY,
        panX: board.panX,
        panY: board.panY,
      };
      $("boardWorkspace").setPointerCapture(event.pointerId);
    });
    $("boardWorkspace").addEventListener("pointermove", function (event) {
      if (!boardDrag && !boardDrawing) return;
      if (boardDrawing) {
        var point = boardCoordinates(event);
        boardDrawing.points.push([point.x, point.y]);
        renderBoard();
        return;
      }
      if (boardDrag.pan) {
        var board = getBoard();
        board.panX = boardDrag.panX + event.clientX - boardDrag.startX;
        board.panY = boardDrag.panY + event.clientY - boardDrag.startY;
        renderBoard();
        return;
      }
      var current = boardCoordinates(event);
      var item = getBoard().items.find(function (entry) {
        return entry.id === boardDrag.id;
      });
      if (item) {
        item.x += current.x - boardDrag.start.x;
        item.y += current.y - boardDrag.start.y;
        boardDrag.start = current;
        renderBoard();
      }
    });
    $("boardWorkspace").addEventListener("pointerup", function () {
      boardDrag = null;
      boardDrawing = null;
      saveState();
    });
    $("boardCanvas").addEventListener("blur", function (event) {
      var textNode = event.target.closest(".board-item-text");
      var itemNode = event.target.closest("[data-board-item]");
      if (!textNode || !itemNode) return;
      updateBoardItem(
        itemNode.getAttribute("data-board-item"),
        { text: textNode.textContent.trim() },
      );
    }, true);
    $("boardCanvas").addEventListener("dblclick", function (event) {
      var textNode = event.target.closest(".board-item-text");
      if (textNode) textNode.focus();
    });

    $("themeIconChoices").addEventListener("click", function (event) {
      var button = event.target.closest("[data-theme-icon]");
      if (!button) return;
      themeCreateSelection.icon = button.getAttribute("data-theme-icon");
      renderThemeCreateChoices();
    });
    $("themeColorChoices").addEventListener("click", function (event) {
      var button = event.target.closest("[data-theme-color]");
      if (!button) return;
      themeCreateSelection.color = button.getAttribute("data-theme-color");
      renderThemeCreateChoices();
    });
    $("themeCreateForm").addEventListener("submit", function (event) {
      event.preventDefault();
      createCustomTheme();
    });
    $("closeThemeCreateButton").addEventListener("click", function () {
      $("themeCreateDialog").close();
      document.body.classList.remove("is-dialog-open");
    });
    $("cancelThemeCreate").addEventListener("click", function () {
      $("themeCreateDialog").close();
      document.body.classList.remove("is-dialog-open");
    });
    $("themeCreateDialog").addEventListener("close", function () {
      document.body.classList.remove("is-dialog-open");
    });

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
    state.currentView = state.settings.modules.workspace ? "workspace" : "universe";
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
    document.documentElement.classList.toggle(
      "reduce-motion",
      state.settings.workspace.reduceMotion,
    );
    hydrateIcons(document);
    bindEvents();
    renderWorkspace();
    updateNavigationDock();
    if (window.RK_UNIVERSE && window.RK_UNIVERSE.init) {
      window.RK_UNIVERSE.init();
    }
    var requestedView = new URLSearchParams(window.location.search).get("view");
    var requestedArticle = new URLSearchParams(window.location.search).get("article");
    if (requestedArticle && articleById(requestedArticle)) {
      openArticle(requestedArticle);
    } else if (requestedView === "universe") {
      setView("universe");
    } else if (requestedView === "collection" && themeOf(state.selectedTheme)) {
      setView("collection");
    }
    var firstGuide = state.settings.modules.workspace ? "workspace" : "universe";
    if (!state.guideSeen[firstGuide]) {
      setTimeout(function () {
        openGuide(firstGuide);
      }, 700);
    }
  }

  window.RK_APP = {
    state: state,
    icon: icon,
    escapeHtml: escapeHtml,
    themeOf: themeOf,
    getThemes: getThemes,
    articleById: articleById,
    getArticles: getArticles,
    getState: function () {
      return state;
    },
    getArticleState: getArticleState,
    statusLabel: statusLabel,
    saveState: saveState,
    setView: setView,
    goHome: goHome,
    goBack: goBack,
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
    resetLearningById: function (articleId, mode) {
      if (!articleById(articleId)) return;
      state.selectedArticle = articleId;
      resetLearningProgress(mode);
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
    openGalaxySettings: function (themeId) {
      openSmallSettings({ type: "galaxy", id: themeId });
    },
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }
})();
