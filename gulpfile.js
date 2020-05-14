const gulp = require("gulp");
const gtw = require("gulp-tw");

const author = "danielo515";
const pluginName = "encryptTiddler";
const sources = {
    sass: "./src/**/*.scss",
    tiddlers: "./src/**/*.tid",
    js: "./src/**/*.js",
    pluginInfo: "./src/plugin.info",
    output: `./plugins/${pluginName}`,
};

const gulpTw = gtw({ author, pluginName, sources });

// ==================================================
// ====================== TASKS =====================
// ==================================================

module.exports = {
    ...gulpTw
};
