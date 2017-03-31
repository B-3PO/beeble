import { NODE_TYPES } from '../constants';
import { getElementUid } from '../util';
import DOM from '../dom';
import buildAttrs from './attributes';
import * as pipeline from '../pipeline';
import {
    findController,
    bind as bindController
  } from '../controller';
import {
    Create as CreateModel,
    bindModelToElement,
    getElementModel
  } from '../model';


var components = {};
var elements = {};

export function define(options) {
  validateOptions(options);
  options.selector.split(',').forEach(function (sel) {
    components[sel] = {
      attrs: options.attrs,
      compile: options.compile,
      controller: options.controller,
      // default model to false if no controller, default it to true if there is a controller
      model: options.model === false || (!options.controller && options.model !== true) ? false : true,
      priority: options.priority || 0,
      replace: options.replace,
      select: function (_sel) { return sel === _sel; },
      selector: sel,
      template: options.template,
      transfer: options.transfer
    };
  });
}

export function bindElement(element, parentingElement, rootNode) {
  var component = find(element);
  if (!component) { return; }
  var uid = getElementUid(element);
  return compileElement({
    uid: element.uid,
    component: component,
    originalNode: element,
    parentingElement: parentingElement,
    rootNode: rootNode
  });
}

export function bindAttribute(attr, element, parentingElement, rootNode) {
  var component = find(attr);
  if (!component) { return; }
  var uid = getElementUid(element);
  attr.uid = uid;
  return compileAttribute(attr, element, component, parentingElement, rootNode);
}

export function compileAttribute(attr, element, component, parentingElement, rootNode) {
  if (element && !element.uid) { return; }
  var selector = formatSelector(attr);
  if (elements[attr.uid] && elements[attr.uid][selector]) { return elements[attr.uid][selector]; }
  if (!component) { return; }
  elements[element.uid] = elements[element.uid] || {};
  if (component.compile) {
    component.compile(element);
  }

  var fn = function () {
    if (elements[element.uid][selector]) {
      getElementModel(element).$$enable();
      return;
    }
    rootNode = rootNode || document.body;
    if (!rootNode.contains(element)) { return; }
    var model;
    var parentModel = getElementModel(parentingElement);
    if (component.model) { model = CreateModel(); }
    else if (parentModel) { model = parentModel.$$copy(); }
    else { model = CreateModel(); }
    bindModelToElement(element, model);
    if (component.controller) {
      bindController(element, component.controller, { model: model, element: element, attrs: buildAttrs(component.attrs, element)})();
    }
    elements[element.uid][selector] = fn;
  };
  fn.priority = component.priority || 0;
  fn.$element = element;
  return fn;
}

export function compileElement(options) {
  if (!options || !options.uid) { return; }
  var selector;
  if (options.nodeType === NODE_TYPES.ELEMENT_NODE) {
    selector = formatSelector(options);
    if (elements[options.uid] && elements[options.uid][selector]) { return elements[options.uid][selector]; }
    return;
  }
  selector = formatSelector(options.originalNode);
  if (elements[options.uid] && elements[options.uid][selector]) { return elements[options.uid][selector]; }

  elements[options.uid] = elements[options.uid] || {};
  var frag = document.createDocumentFragment(); // component fragment
  options.originalNode.originalNode = true;
  options.node = frag;
  if (options.component.compile) {
    options.component.compile(options.originalNode);
  }

  var fn = function () {
    if (elements[options.uid][selector]) {
      if (options.model) { options.model.$$enable(); }
      return;
    }
    options.rootNode = options.rootNode || document.body;
    if (!options.rootNode.contains(options.originalNode)) { return; }
    // model
    var model;
    var parentModel = getElementModel(options.parentingElement);
    if (options.component.model) { model = CreateModel(); }
    else if (parentModel) { model = parentModel.$$copy(); }
    else { model = CreateModel(); }
    bindModelToElement(options.originalNode, model);


    // Tempalte
    if (options.component.template) {
      options.node.appendChild(compileTemplate(options.originalNode, options.component));
    } else {
      options.node.appendChild(options.originalNode.cloneNode());
      var child;
      while (child = options.originalNode.firstChild) {
        options.node.firstChild.append(child);
      }
    }

    // replace original node and set component node
    if (!options.component.template) {
      var nodeCount = options.node.childNodes.length;
      options.originalNode.parentNode.insertBefore(options.node, options.originalNode);
      if (nodeCount === 1) { options.node = options.originalNode; }
      else { // handle multiple root nodes
        options.node = [];
        var lastNode = options.originalNode;
        while (nodeCount) {
          lastNode = lastNode.nextSibling;
          options.node.push(lastNode)
          nodeCount--;
        }
      }
      options.originalNode.remove();
    } else {
      var parent = options.originalNode.parentNode;
      options.originalNode.parentNode.insertBefore(options.node, options.originalNode);
      options.node = options.originalNode.previousSibling;
      options.originalNode.remove();
    }
    options.node.uid = options.uid;

    var nodes = [].concat(options.node);
    nodes.forEach(function (sub) {
      // sub.classList.remove('mc-cloak');
      // if selector is the node name then add it as a classname
      if (options.component.selector === sub.nodeName.toLowerCase()) {
        sub.classList.add(options.node.nodeName.toLowerCase());
      }
    });

    if (options.component.controller) {
      options.attrs = buildAttrs(options.component.attrs, options.node);
      options.controller = bindController(options.node, options.component.controller, { model: model, element: options.node, attrs: options.attrs})();
    }

    // if ((linker.node[0] || linker.node).getAttribute('register')) { register(linker); }
    // pipeline.postCompile(options);
    elements[options.uid][selector] = fn;
  };
  fn.priority = options.component.priority || 0;
  fn.$element = options.node;
  return fn;
}

export function find(node) {
  return components[formatSelector(node)];
}

export function disableOnRemove(element) {
  element.destroy = false;
}

export function destroy(node) {
  if (!node.uid) { return; }
  var component = elements[node.uid];
  if (!component) { return; }

  if (node.destroy === false) {
    disable(node);
    return;
  }

  // destroy
  // TODO remove event listeners
  // TODO dispatch destroy event
  var model = getElementModel(node);
  // if (model) { model.$$destroy(); }
}

export function disable(node) {
  if (!node.uid) { return; }
  var component = elements[node.uid];
  if (!component) { return; }
  var model = getElementModel(component.$element);
  if (model) { model.$$disable(); }
  // TODO disable event listeners
  // TODO dispatch disable event
  delete node.destroy;
}

function compileTemplate(node, component) {
  var componentNode;
  var templateElement = DOM.createFromMarkup(component.template);
  if (component.replace === true) {
    componentNode = templateElement;
    transfer(component.transfer, node, componentNode);
  } else {
    componentNode.appendChild(templateElement);
  }
  transpose(node, templateElement);
  return componentNode;
}

/**
 * options: true
 * or
 * options: {
 *   attributes: true,
 *   classes: true
 * }
 */
function transfer(options, node, template) {
  if (!options || options === null) { return; }

  // transfer sttributes
  if (options === true || options.attributes === true) {
    Array.prototype.slice.call(node.attributes).forEach(function (attr) {
      if (attr.name === 'class') {
        template.setAttribute(attr.name, template.getAttribute(attr.name)+' '+attr.value);
      } else {
        template.setAttribute(attr.name, attr.value);
      }
    });
  }

  // transfer class names
  if (options === true || options.classes === true) {
    template.classList.add.apply(template.classList, Array.prototype.slice.call(node.classList));
  }
}

/**
 * Transpose HTML
 * you can transpose multiple
 * ```html
 * <mc-button>Button</mc-button>
 * <mc-button>
 *   <mc-transpose>Button</mc-transpose>
 * </mc-button>
 * <mc-button>
 *   <mc-transpose name="one">Button one</mc-transpose>
 *   <span></span>
 *   <mc-transpose name="two">Button two</mc-transpose>
 * </mc-button>
 * ```
 */
function transpose(node, templateElement) {
  var child;
  var componentTransposes = Array.prototype.slice.call(node.querySelectorAll('mc-transpose'));
  var templateTransposes = Array.prototype.slice.call(templateElement.querySelectorAll('mc-transpose'));
  if (!componentTransposes.length) {
    templateTransposes = templateElement.querySelector('mc-transpose');
    if (templateTransposes) {
      while (child = node.firstChild) {
        templateTransposes.parentNode.insertBefore(child, templateTransposes);
      }
      templateTransposes.remove();
    }
  } else {
    componentTransposes.forEach(function (item) {
      var r = templateElement.querySelector('mc-transpose, [name="'+item.getAttribute('name')+'"]');
      if (r) {
        while (child = node.firstChild) {
          r.parentNode.insertBefore(child, r);
        }
        r.remove();
      }
    });
  }
}

function formatSelector(node) {
  switch(node.nodeType) {
    case NODE_TYPES.ELEMENT_NODE:
      return node.nodeName.toLowerCase();
    case NODE_TYPES.ATTRIBUTE_NODE:
      return '\['+node.name+'\]';
  }
  return '';
}

function validateOptions(options) {
  if (typeof options !== 'object' || options === null) {
    throw Error('`Component` is expecting a object param');
  }

  if (typeof options.selector !== 'string' || options.selector === '') {
    throw Error('`options.selector must be a valid string`');
  }

  // TODO check individual selectors
  if (options.selector && components[options.selector] !== undefined) {
    throw Error('A component with these selectors "'+options.selector+'" already exists');
  }

  if (options.template && (typeof options.template !== 'string' || options.template === '')) {
    throw Error('`options.template must be a valid string`');
  }
}
