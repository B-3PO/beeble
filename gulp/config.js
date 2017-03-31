var srcPath = 'src/';
var distPath = 'dist/';
var devPath = 'dev/';
var testApps = 'dev-apps/';


exports.names = {
  file: 'material-components',
  module: 'materialComponents',
  styles: 'material-components'
};

exports.paths = {
  src: srcPath,
  testApps: {
    root: testApps
  },
  dist: {
    root: distPath
  },
  dev: {
    root: devPath,
    all: devPath + '**/*',
    scripts: devPath + '**/*.js',
    styles: devPath + '**/*.css'
  },
  scripts: {
    root: srcPath,
    all: srcPath + '**/*.js',
    entry: srcPath + 'index.js'
  },
  styles: {
    root: srcPath,
    all: srcPath + '**/*.scss'
  },
  vanilla: {
    root: testApps + 'vanilla/',
    index: testApps + 'vanilla/index.html'
  },
  angular1x: {
    root: testApps + 'angular-1.x/',
    index: testApps + 'angular-1.x/index.html'
  }
};
