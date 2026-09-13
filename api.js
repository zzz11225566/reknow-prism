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

    articleChat: async function (article, message) {
      await delay(520);
      var text = String(message || "").trim();
      var challenge =
        article.analysis.ideal.counterexample ||
        "如果换一个完全不同的情境，这个结论还成立吗？";
      if (/我学会了|学会了|懂了/.test(text)) {
        return (
          "先别急着说学会。你刚才的结论是：“" +
          article.analysis.surface.conclusion +
          "”。\n\n" +
          "我来抬杠：请你举出一个它可能失效的场景，并说明失效发生在哪个前提。如果举不出来，我们再回到“追问根基”和“反例检验”。"
        );
      }
      if (/为什么|凭什么|怎么证明/.test(text)) {
        return (
          "不要从结论开始辩护，先回到公理：“" +
          article.analysis.first.axiom +
          "”。\n\n" +
          "请只用这条公理，重新推一遍作者的核心结论。中间缺了哪一步，就说明你还没真正掌握哪一步。"
        );
      }
      if (/反例|边界|不成立/.test(text)) {
        return "可以。文章给出的反例是：“" + challenge + "”\n\n现在请再补一个你自己的反例，不能重复原文。";
      }
      return (
        "我先把你的问题压缩成一个可验证的判断：“" +
        article.analysis.surface.conclusion +
        "”。\n\n" +
        "请回答我：这个判断依赖的关键假设是什么？如果这个假设不成立，会出现什么反例？"
      );
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
