angular.module('testApp', [
  'ngRoute',
  'ngMaterial'
  // 'material-components'
]);
  // .config(configApp);


configApp.$inject = ['$routeProvider'];
function configApp($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'pages/home/home.html',
      controller: 'HomeController',
      controllerAs: 'vm'
    })
    .otherwise('/');
}
