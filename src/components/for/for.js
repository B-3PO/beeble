import * as component from '../../core/component';
import { doNotParse } from '../../core/parser';
import { equal, clone, getElementUid } from '../../core/util';
import { bindModelToElement, Create as CreateModel } from '../../core/model';
import { parse } from '../../core/parser';

component.define({
  selector: '[for]',
  priority: 99,
  model: false,
  compile: compile,
  controller: controller
});

function compile(element) {
  doNotParse(element);
}

function controller(element, attrs, model) {
  var list = [];
  var elements = {};
  var attrValue = element.getAttribute('for');
  var parent = element.parentNode;
  var match = attrValue.match(/^\s*([\s\S]+?)\s+of\s+([\s\S]+?)\s*$/);
  var itemName = match[1];
  var listName = match[2];
  var elementClone = element.cloneNode(true);
  elementClone.removeAttribute('for');
  var placeholder = document.createComment(' for="'+attrValue+'" ');
  placeholder.uid = element.uid;
  placeholder.mcplaceholder = true;
  parent.insertBefore(placeholder, element);
  element.remove();

  model.$observe(listName, function (value) {
    if (list.length !== value.length || !equal(list, value)) { updateList(value); }
  });

  function updateList(value) {
    var tempList = [];
    var newElements = [];
    // remove items
    Object.keys(elements).filter(function (key) {
      if (value.indexOf(elements[key].item) === -1) { destroy(key); }
      else {
        tempList.push(elements[key].item);
        // trigger model if item has changed
        if (!equal(elements[key].item, elements[key].model[itemName])) {
          elements[key].model.$assign(itemName, clone(elements[key].item));
        }
      }
    });

    // add items
    value.forEach(function (item) {
      if (tempList.indexOf(item) === -1) { newElements.push(create(item)); }
    });

    if (newElements.length) {
      var nextSibling = tempList.length ? tempList[tempList.length-1].nextSibling : placeholder.nextSibling;
      addSection(newElements, nextSibling)

      // setTimeout(function () {
      //   var frag = domFragmentFromElements(newElements);
      //   parse(frag);
      //   parse(frag);
      //   parent.insertBefore(frag, nextSibling);
      // }, 0);
    }

    list = clone(value);
  }

  // render in sections of 400 to get items on the screen faster
  function addSection(arr, nextSibling) {
    if (!arr.length) { return; }
    var sectionArr = arr.splice(0, 200);

    setTimeout(function () {
      var frag = domFragmentFromElements(sectionArr);
      parse(frag);
      parse(frag);
      parent.insertBefore(frag, nextSibling);
      addSection(arr, sectionArr[sectionArr.length-1].nextSibling);
    }, 0);
  }

  function create(item) {
    var el = elementClone.cloneNode(true);
    var uid = getElementUid(el);
    var elModel = CreateModel();
    elements[uid] = {
      element: el,
      item: item,
      model: elModel
    };
    elModel.$assign(itemName, clone(item));
    bindModelToElement(el, elModel);
    return el;
  }

  function destroy(uid) {
    elements[uid].element.remove();
    elements[uid].model.$$destroy();
    delete elements[uid];
  }

  function domFragmentFromElements(elements) {
    var fragment = document.createDocumentFragment();
    elements.forEach(function(el) {
      fragment.appendChild(el);
    });
    return fragment;
  }
}
