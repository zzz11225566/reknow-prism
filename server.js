"use strict";

var http = require("http");
var fs = require("fs");
var path = require("path");
var URL = require("url").URL;

var root = path.resolve(process.env.RK_ROOT || __dirname);
var port = Number(process.env.PORT || 4173);
var host = process.env.HOST || "127.0.0.1";

var mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
};

function sendJson(response, status, payload) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(JSON.stringify(payload));
}

function sendFile(response, filePath) {
  fs.readFile(filePath, function (error, content) {
    if (error) {
      if (error.code === "ENOENT") {
        response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        response.end("404 Not Found");
        return;
      }
      response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("500 Internal Server Error");
      return;
    }
    response.writeHead(200, {
      "Content-Type":
        mimeTypes[path.extname(filePath).toLowerCase()] ||
        "application/octet-stream",
      "Cache-Control": "no-cache",
      "X-Content-Type-Options": "nosniff",
    });
    response.end(content);
  });
}

var server = http.createServer(function (request, response) {
  var requestUrl = new URL(request.url, "http://" + (request.headers.host || "localhost"));
  if (requestUrl.pathname === "/api/health") {
    sendJson(response, 200, {
      ok: true,
      service: "reknow-prism",
      mode: "frontend-mock",
      root: root,
    });
    return;
  }

  var pathname;
  try {
    pathname = decodeURIComponent(requestUrl.pathname);
  } catch (error) {
    response.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("400 Bad Request");
    return;
  }

  var relativePath = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  var filePath = path.resolve(root, relativePath);
  if (filePath !== root && filePath.indexOf(root + path.sep) !== 0) {
    response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("403 Forbidden");
    return;
  }

  fs.stat(filePath, function (error, stats) {
    if (!error && stats.isDirectory()) {
      sendFile(response, path.join(filePath, "index.html"));
      return;
    }
    sendFile(response, filePath);
  });
});

server.listen(port, host, function () {
  console.log("ReKnow Prism running at http://" + host + ":" + port);
  console.log("Static root: " + root);
});
