var path = require('path');
var gulp = require('gulp');
var gutil = require('gulp-util');
var gulpClean = require('gulp-clean');
var gulpSequence = require('gulp-sequence');
var nodemon = require('gulp-nodemon');
var paths = require('./gulp/config').paths;
var sassDebugTask = require('./gulp/buildCSS').debug;
var jsDebugTask = require('./gulp/buildJS').debug;
var gulpInject = require('gulp-inject');
var webmake = require('gulp-webmake');
var gulpTap = require("gulp-tap");
var gulpStrip = require('gulp-strip-comments');

gulp.task('default', gulpSequence('build:dev:clean', ['build:dev:js', 'build:dev:scss', 'es6-template-strings'], 'build:dev:inject', ['watch', 'nodemon']));

gulp.task('build:dev:clean', cleanTask(paths.dev.root));
gulp.task('build:dev:scss', sassDebugTask());
gulp.task('build:dev:js', jsDebugTask());
gulp.task('build:dev:inject', function () {
  gulp.src(paths.vanilla.index)
    .pipe(gulpInject(gulp.src([paths.dev.root+'template-strings/*.js', paths.dev.scripts, paths.dev.styles], {read: false}), {
      relative: true,
      ignorePath: '../../dev',
      addPrefix: '..',
    }))
    .pipe(gulp.dest(paths.vanilla.root));

  gulp.src(paths.angular1x.index)
    .pipe(gulpInject(gulp.src([paths.dev.scripts, paths.dev.styles], {read: false}), {
      relative: true,
      ignorePath: '../../dev',
      addPrefix: '..',
    }))
    .pipe(gulp.dest(paths.angular1x.root));
});


gulp.task('nodemon', function () {
  return nodemon({
    script: 'testApps/server.js',
    ignore: ['src/', 'src_old/', 'gulp/', 'bower_components/', 'testApps']
  });
});

gulp.task('watch', function (e) {
  gulp.watch(paths.scripts.all, ['build:dev:js', 'build:dev:inject']);
  gulp.watch(paths.styles.all, ['build:dev:scss', 'build:dev:inject']);
});



function cleanTask(src) {
  return function () {
    gulp.src(src, { read: false }).pipe(gulpClean(null));
  }
}


gulp.task('es6-template-strings', function () {
  gulp.src([
    'node_modules/es6-template-strings/index.js',
    'node_modules/es6-template-strings/compile.js',
    'node_modules/es6-template-strings/resolve-to-string.js'
  ])
  .pipe(webmake())
  .pipe(gulpStrip())
  .pipe(gulpTap(function(file) {
    var moduleName = 'template-strings-'+path.basename(file.path, '.js');
    file.contents = Buffer.concat([
        new Buffer('window["'+moduleName+'"] = '),
        file.contents
    ]);
  }))
  .pipe(gulp.dest('dev/template-strings/'));
});
