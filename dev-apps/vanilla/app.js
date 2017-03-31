document.addEventListener("DOMContentLoaded", function(event) {
  materialComponents.init();
});

materialComponents.controller('AppController', function (model) {
  model.$assign('name', 'Ben Rubin');
  model.$assign('showit', false);
  var list = getList();
  model.$assign('list', list);

  setTimeout(function () {
    model.$assign('name', 'Ben Rubin 1');
    list.push({
      id: 100000000,
      name: '100000000'
    });
    model.$assign('list', list);
  }, 1000);
  setTimeout(function () {
    model.$assign('name', 'Ben Rubin 2');
    list[0].name = 'rename';
    model.$assign('list', list);
  }, 2000);
  setTimeout(function () {
    // list.pop();
    // model.$assign('list', list);
  }, 3000);

  setTimeout(function () {
    model.$assign('showit', true);
  }, 1000);

  setTimeout(function () {
    model.$assign('showit', false);
  }, 2000);

  setTimeout(function () {
    model.$assign('showit', true);
  }, 3000);
});


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
