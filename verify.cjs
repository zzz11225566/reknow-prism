"use strict";

var fs = require("fs");
var path = require("path");
var vm = require("vm");

var root = process.env.RK_ROOT || __dirname;
var errors = [];
var scripts = ["data.js", "api.js", "app.js", "universe.js", "server.js"];
var requiredIds = [
  "workspaceView",
  "articleView",
  "universeView",
  "universeCanvas",
  "themeGrid",
  "articleList",
  "analysisStage",
  "settingsDialog",
];

scripts.forEach(function (file) {
  try {
    var filePath = path.join(root, file);
    var source = fs.readFileSync(filePath, "utf8");
    if (file === "server.js") {
      new vm.Script("(function(require,module,exports,__dirname,__filename){" + source + "\n})");
    } else {
      new vm.Script(source, { filename: file });
    }
    console.log("PASS syntax " + file);
  } catch (error) {
    errors.push(file + ": " + error.message);
  }
});

try {
  var html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  ["vendor/three.min.js", "data.js", "api.js", "app.js", "universe.js"].forEach(
    function (source) {
      if (html.indexOf(source) === -1) {
        errors.push("index.html missing script: " + source);
      }
    },
  );
  requiredIds.forEach(function (id) {
    if (html.indexOf('id="' + id + '"') === -1) {
      errors.push("index.html missing id: " + id);
    }
  });
  if (!errors.length) console.log("PASS index.html structure");
} catch (error) {
  errors.push("index.html: " + error.message);
}

try {
  var three = fs.statSync(path.join(root, "vendor", "three.min.js"));
  if (three.size < 100000) errors.push("vendor/three.min.js is unexpectedly small");
  else console.log("PASS vendor/three.min.js");
} catch (error) {
  errors.push("vendor/three.min.js: " + error.message);
}

if (errors.length) {
  console.error("\nFAILED");
  errors.forEach(function (error) {
    console.error("- " + error);
  });
  process.exit(1);
}

console.log("\nAll frontend checks passed.");
