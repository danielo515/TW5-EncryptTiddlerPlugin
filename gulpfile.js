const gulp = require("gulp");
const sass = require("gulp-sass");
const through = require("through2");
const Vinyl = require("vinyl");
const path = require("path");

sass.compiler = require("sass");
const author = "danielo515";
const plugin = "encryptTiddler";

const tiddlywikiFiles = {
  tiddlers: [],
};

const wikiFile = (name) => ({
  file: name,
  fields: {
    type: "text/vnd.tiddlywiki",
    title: `$:/plugins/${author}/${plugin}/styles/${name}`,
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
    next(null,file);
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

gulp.task("sass", function () {
  return gulp
    .src("./src/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(annotateCss())
    .pipe(gulp.dest("./plugins/encryptTiddler/styles"));
});

gulp.task("sass:watch", function () {
  gulp.watch("./sass/**/*.scss", ["sass"]);
});
