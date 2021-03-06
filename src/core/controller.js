import { getElementUid } from './util';
import {
    Create as CreateModel,
    bindModelToElement
  } from './model';

var controllers = {};
var elements = {};
var noop = function () {};

// add controllers
// these controllers can be bound to elements using the `controller` attribute
export function add(name, func) {
  if (!name || typeof name !== 'string') {
    throw Error('`name` parameter required');
  }
  if (typeof func !== 'function') {
    throw Error('requires a function as  the second parmater');
  }
  controllers[name] = func;
}

export function bind(element, ctrl, inject) {
  var uid = getElementUid(element);
  elements[uid] = compile(element, ctrl, inject);
  return elements[uid];
}

export function compile(element, ctrl, inject) {
  if (!element.uid) { return; }
  if (elements[element.uid]) { return elements[element.uid]; }
  var controller = find(ctrl || element.getAttribute('controller'));
  if (!controller) { return; }
  inject = inject || {};

  // create model is not passed in
  // bind model to elemnt by uid
  // prep controller for injection
  if (!inject.model) { inject.model = CreateModel(); }
  bindModelToElement(element, inject.model);
  var compiled = false;
  var linker = injectCtrl(controller, inject);
  var createController = function () {
    if (compiled) { return; } // prevent from running more than once
    var newCtrl = new linker();
    Object.defineProperty(newCtrl, '$model', {
      value: inject.model,
      enumerable: false,
      configurable: false,
      writable: false
    });
    elements[element.uid] = newCtrl;
    compiled = true;
    return newCtrl;
  };
  // createController.priority = 100;
  // createController.destroy = destroy;
  return createController;
}

export function findController(node) {
  if (!node) { return; }
  return elements[node.uid];
}

// if a string is passed in this will lookup the controller function and return it
// if a function is passed in then it will return that function
function find(ctrl) {
  if (typeof ctrl === 'function') { return ctrl; }
  if (!controllers[ctrl]) {
    console.error('Could not find controller named "' + ctrl + '"');
    return;
  }
  return controllers[ctrl];
}

// make inectables available as function arguments
function injectCtrl(func, inject) {
  var args = [];
  var deps;
  // convert array to deps and func. asosume func is last item in array
  if (func instanceof Array) {
    deps = func;
    func = deps.pop();
  } else {
    // parse function as string into deps arr
    deps = func.toString().match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m)[1].replace(/ /g, '').split(',');
  }

  // return functional that will applay an arrya or args from the inject obj, based on the strings int deps arr
  return function () {
    var arr = Array.prototype.slice.call(arguments, 0);
    deps.forEach(function (item, pos) {
      if (func.$inject) { args.push(func.$inject[pos]); }
      else { args.push(inject[item]); }
    });
    func.apply(this, args);
  };
}
