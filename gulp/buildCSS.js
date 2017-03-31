var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var paths = require('./config').paths;

const SASS_AUTOPREFIXER_OPTIONS = {
  browsers: [
    'last 2 versions',
    'not ie <= 10',
    'not ie_mob <= 10',
  ],
  cascade: false
};


module.exports = {
  debug: debug
};


function debug() {
  return function () {
    return gulp.src(paths.styles.all)
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(autoprefixer(SASS_AUTOPREFIXER_OPTIONS))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(paths.dev.root));
  };
}
