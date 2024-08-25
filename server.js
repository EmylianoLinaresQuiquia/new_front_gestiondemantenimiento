"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = app;
var express_1 = require("express");
var node_url_1 = require("node:url");
var node_path_1 = require("node:path");
var common_1 = require("@angular/common");
var ssr_1 = require("@angular/ssr");
var main_server_1 = require("./src/main.server");
var __dirname = (0, node_path_1.dirname)((0, node_url_1.fileURLToPath)(import.meta.url));
function app() {
    var server = (0, express_1.default)();
    var browserDistFolder = (0, node_path_1.resolve)(__dirname, '../dist/f-gestiondemantenimiento');
    var indexHtml = (0, node_path_1.join)(browserDistFolder, 'index.html');
    var commonEngine = new ssr_1.CommonEngine();
    server.set('view engine', 'html');
    server.set('views', browserDistFolder);
    // Serve static files from the root of the dist directory
    server.get('**', express_1.default.static(browserDistFolder, {
        maxAge: '1y',
        index: 'index.html',
    }));
    // All regular routes use the Angular engine
    server.get('**', function (req, res, next) {
        var protocol = req.protocol, originalUrl = req.originalUrl, baseUrl = req.baseUrl, headers = req.headers;
        commonEngine
            .render({
            bootstrap: main_server_1.default,
            documentFilePath: indexHtml,
            url: "".concat(protocol, "://").concat(headers.host).concat(originalUrl),
            publicPath: browserDistFolder,
            providers: [{ provide: common_1.APP_BASE_HREF, useValue: baseUrl }],
        })
            .then(function (html) { return res.send(html); })
            .catch(function (err) { return next(err); });
    });
    return server;
}
function run() {
    var port = process.env['PORT'] || 4000;
    var server = app();
    server.listen(port, function () {
        console.log("Node Express server listening on http://localhost:".concat(port));
    });
}
run();
