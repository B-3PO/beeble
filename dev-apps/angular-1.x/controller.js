angular
  .module('testApp')
  .controller('HomeController', HomeController);


function HomeController($scope, $timeout) {
  $scope.name = 'Ben Rubin';
  $scope.isDisabled = false;
  $scope.expanderOpen = false;
  $scope.showit = false;
  $scope.toggleDisabled = function () {
    $scope.expanderOpen = !$scope.expanderOpen;
    $scope.isDisabled = !$scope.isDisabled;
  };

  $scope.list = getList();

  $timeout(function () {
    $scope.name = 'Ben Rubin 1';
    $scope.list.push({
      id: 100000000,
      name: '100000000'
    });
  }, 1000);
  $timeout(function () {
    $scope.name = 'Ben Rubin 2';
    $scope.list[0].name = 'rename';
  }, 2000);
  $timeout(function () {
    // $scope.list.pop();
  }, 3000);

  $timeout(function () {
    $scope.showit = true;
  }, 1000);

  $timeout(function () {
    $scope.showit = false;
  }, 2000);

  $timeout(function () {
    $scope.showit = true;
  }, 3000);
}


function getList() {
  var arr = [];
  var i = 0;
  while (i < 10000) {
    arr.push({
      id: i,
      name: i+'_name'
    });
    i++;
  }
  return arr;
}
