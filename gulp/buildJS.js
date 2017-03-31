var gulp = require('gulp');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var jshint = require('gulp-jshint');
var rollupBetter = require('gulp-better-rollup');
var buble = require('rollup-plugin-buble');
var nodeResolve = require('rollup-plugin-node-resolve');
var gulpPlumber = require('gulp-plumber');

// var rename = require('gulp-rename');
// var cleanup = require('rollup-plugin-cleanup');
// var uglify = require('rollup-plugin-uglify');
// var strip = require('rollup-plugin-strip');

var paths = require('./config').paths;
var names = require('./config').names;


module.exports = {
  debug: debug
};


function debug() {
  return function () {
    return gulp.src(paths.scripts.entry)
      .pipe(gulpPlumber())
      .pipe(jshint({esversion: 6}))
      .pipe(jshint.reporter('default'))
      .pipe(sourcemaps.init())
      .pipe(rollupBetter({
        moduleName: names.module,
        moduleId: true,
        plugins: [
          nodeResolve({
            jsnext: true
          }),
          buble()
        ]
      }, 'iife'))
      .pipe(sourcemaps.write(''))
      .pipe(gulp.dest(paths.dev.root));
  }
}



//
// function debug() {
//   return gulp.src(paths.scripts)
//     .pipe(jshint({esversion: 6}))
//     .pipe(jshint.reporter('default'))
//     .pipe(sourcemaps.init())
//     .pipe(rollup({
//       entry: './src/index.js',
//       moduleName: names.module,
//       moduleId: true,
//       format: 'iife',
//       plugins: [
//         nodeResolve(),
//         buble()
//       ]
//     }))
//     .pipe(sourcemaps.write())
//     .pipe(rename(names.file+'.js'))
//     .pipe(gulp.dest(paths.dist))
//     .on('end', function() {
//       gutil.log(gutil.colors.green('✔ JS Dev'), 'Finished');
//     });
// }
//
// function release() {
//   return gulp.src(paths.scripts)
//     .pipe(jshint({esversion: 6}))
//     .pipe(jshint.reporter('default'))
//     .pipe(jshint.reporter('fail'))
//     .pipe(rollup({
//       entry: './src/index.js',
//       moduleName: names.module,
//       moduleId: true,
//       format: 'iife',
//       plugins: [
//         nodeResolve(),
//         buble(),
//         cleanup(),
//         strip(),
//         uglify()
//       ]
//     }))
//     .pipe(rename(names.file+'.min.js'))
//     .pipe(gulp.dest(paths.dist))
//     .on('end', function() {
//       gutil.log(gutil.colors.green('✔ JS Dev'), 'Finished');
//     });
// }
