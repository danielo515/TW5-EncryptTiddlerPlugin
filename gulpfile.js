const gulp = require("gulp");
const Sass = require("gulp-sass");
const through = require("through2");
const Vinyl = require("vinyl");
const path = require("path");

Sass.compiler = require("sass");
const author = "danielo515";
const pluginName = "encryptTiddler";
const sources = {
  sass: "./src/**/*.scss",
  tiddlers: "./src/**/*.tid",
  js: "./src/**/*.js",
  pluginInfo: "./src/plugin.info",
  output: `./plugins/${pluginName}`,
};

const tiddlywikiFiles = {
  tiddlers: [],
};

const wikiFile = (name) => ({
  file: name,
  fields: {
    type: "text/vnd.tiddlywiki",
    title: `$:/plugins/${author}/${pluginName}/styles/${name}`,
    tags: "[[$:/tags/Stylesheet]]",
  },
});

const stringify = (o) => JSON.stringify(o, null, 2);

/**
 * Generates a `tiddlywiki.files` for each css file that is on the stream where this is added.
 * `tiddlywiki.files` is a metadata file that  allows tiddlywiki to
 * load normal files (ej css) as if they were tiddlers.
 * For now, it only generates one file per file and folder, meaning that
 * multiple css files on the same folder will overwrite each other.
 */
const annotateCss = () => {
  const cssFiles = {};
  function iterate(file, enc, next) {
    const folder = file.dirname;
    cssFiles[folder] = cssFiles[folder] || { tiddlers: [] };
    cssFiles[folder].tiddlers.push(wikiFile(file.relative));
    console.info("Registering css file: ", file.relative);
    next(null, file);
  }
  function flush(done) {
    console.info("Tiddliwiki.files to generate: ", stringify(cssFiles));
    Object.entries(cssFiles).forEach(([folder, tiddlyfiles]) => {
      const dest = path.join(folder, "tiddlywiki.files");
      console.info("Writting tiddlywiki.files: ", dest);
      const file = new Vinyl({
        base: folder,
        path: dest,
        contents: Buffer.from(stringify(tiddlyfiles)),
      });
      this.push(file);
    });
    done();
  }
  return through.obj(iterate, flush);
};

function sass() {
  return gulp
    .src(sources.sass)
    .pipe(Sass().on("error", Sass.logError))
    .pipe(annotateCss())
    .pipe(gulp.dest(sources.output));
}

function tiddlers() {
  return gulp.src(sources.tiddlers).pipe(gulp.dest(sources.output));
}

function js() {
  return gulp.src(sources.js).pipe(gulp.dest(sources.output));
}

function pluginInfo() {
  return gulp.src(sources.pluginInfo).pipe(gulp.dest(sources.output));
}

const defaultTask = gulp.parallel(tiddlers, js, sass, pluginInfo);

function watch(){
  return gulp.watch('./src/**', defaultTask)
}

module.exports = {
  tiddlers,
  sass,
  watch,
  default:defaultTask, 
};
