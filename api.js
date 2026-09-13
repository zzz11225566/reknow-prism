(function () {
  "use strict";

  var DATA = window.RK_DATA;
  var delay = function (ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function normalize(text) {
    return String(text || "").trim().toLowerCase();
  }

  var api = {
    mode: "mock",

    connectAccount: async function () {
      await delay(420);
      return clone(DATA.account);
    },

    syncCollections: async function () {
      await delay(900);
      return {
        syncedAt: new Date().toISOString(),
        themes: clone(DATA.themes),
        articles: clone(DATA.articles),
      };
    },

    classifyThemes: async function () {
      await delay(520);
      return clone(DATA.themes);
    },

    decomposeArticle: async function (articleId) {
      await delay(460);
      var article = DATA.articles.find(function (item) {
        return item.id === articleId;
      });
      if (!article) throw new Error("找不到这篇文章");
      return clone(article.analysis);
    },

    searchZhihu: async function (query) {
      await delay(360);
      var q = normalize(query);
      if (!q) return clone(DATA.searchSeeds);
      var matches = DATA.searchSeeds.filter(function (item) {
        var haystack = [
          item.title,
          item.excerpt,
          item.author,
          item.themeId,
          (item.tags || []).join(" "),
        ].join(" ");
        return normalize(haystack).indexOf(q) !== -1;
      });
      return clone(matches.length ? matches : DATA.searchSeeds.slice(0, 3));
    },

    openZhihuSearch: function (query) {
      var url =
        "https://www.zhihu.com/search?type=content&q=" +
        encodeURIComponent(String(query || "").trim());
      window.open(url, "_blank", "noopener,noreferrer");
    },
  };

  window.RK_API = api;
})();
