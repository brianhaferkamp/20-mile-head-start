//---------------------------------------
// variables
//---------------------------------------
const browsersync = require("browser-sync").create();
const del = require("del");
const gulp = require("gulp");
const concat = require("gulp-concat"); // combine multiple .js files into one
const deporder = require("gulp-deporder");
const htmlclean = require("gulp-htmlclean"); // extreme minification
const jshint = require("gulp-jshint"); // error reporting in js
const newer = require("gulp-newer");
const pleeease = require("gulp-pleeease");
const plumber = require("gulp-plumber");
const pug = require("gulp-pug"); // process .pug files into .html
const sass = require("gulp-sass"); // process .sass files into .css
const size = require("gulp-size"); // calculate file sizes
const stripdebug = require("gulp-strip-debug"); // debugger
const uglify = require("gulp-uglify"); // minify .js files

//---------------------------------------
// file paths
//---------------------------------------
const files = {
  sassPath: 'source/sass/**/*.sass',
  jsPath: 'source/assets/js/*.js',
  pugPath: 'source/views/**/*.pug',
  imgPath: 'source/assets/img/*',
  downloadsPath: 'source/assets/downloads/*'
}

//---------------------------------------
// remove files from /build folder
//---------------------------------------
function clean() {
  return del([
    'build/*'
  ]);
}

exports.clean = clean;

//---------------------------------------
// SASS Task
//---------------------------------------
function sassTask() {
  return gulp.src(files.sassPath)
    .pipe(plumber())
    .pipe(sass())
    .pipe(size({title: 'Styles In Size'}))
    .pipe(pleeease())
    .pipe(size({title: 'Styles Out Size'}))
    .pipe(gulp.dest('./build/assets/css'))
    .pipe(browsersync.stream())
}

//---------------------------------------
// JS Task
//---------------------------------------
function js() {
  return gulp.src(files.jsPath)
    .pipe(plumber())
    .pipe(newer(files.jsPath))
    .pipe(jshint())
    .pipe(deporder())
    .pipe(concat('app.js'))
    .pipe(size({title: 'Javascript In Size'}))
    .pipe(stripdebug())
    .pipe(uglify())
    .pipe(size({title: 'Javascript Out Size'}))
    .pipe(gulp.dest('./build/assets/js'))
}

//---------------------------------------
// pugjs sassTask
//---------------------------------------
function pugTask() {
  return gulp.src(files.pugPath)
    .pipe(plumber())
    .pipe(newer(files.pugPath))
    .pipe(pug())
    .pipe(htmlclean())
    .pipe(gulp.dest('./build'))
    .pipe(browsersync.stream());
    browsersync.reload
}

//---------------------------------------
// compile images from /source to /build
//---------------------------------------
function images() {
  return gulp.src(files.imgPath)
    .pipe(newer(files.imgPath))
    .pipe(gulp.dest('./build/assets/img'));
}

//---------------------------------------
// move downloads from /source to /build
//---------------------------------------
function downloads() {
  return gulp.src(files.downloadsPath)
    .pipe(newer(files.downloadsPath))
    .pipe(gulp.dest('./build/assets/downloads'));
}


//---------------------------------------
// Watch for changes in the code
//---------------------------------------
function watch() {
  gulp.watch([files.pugPath, files.sassPath, files.jsPath, files.imgPath, files.downloadsPath],
    gulp.series(pugTask, sassTask, js, images, downloads))

  // gulp.parallel(pugTask, sassTask, js, images, downloads)

  // initiate BrowserSync
  browsersync.init({
      server: {
          // serve files from the /build folder
          baseDir: "./build"
      }
  });

  // watch for SASS changes
  gulp.watch(files.sassPath, sassTask);
  // watch for changes in the HTML
  gulp.watch(files.pugPath).on('change', browsersync.reload);
  // watch for image changes
  gulp.watch(files.imgPath).on('change', browsersync.reload);
}

//---------------------------------------
// type 'gulp start' to run the build
//---------------------------------------
exports.start = gulp.series(
  gulp.parallel(pugTask, sassTask, js, images, downloads),
  watch
)
