export default {
  addEventListener: document.addEventListener,
  adoptNode: document.adoptNode,
  createElement: document.createElement,
  createFromMarkup: createFromMarkup,
  documentElement: document.documentElement,
  removeEventListener: document.removeEventListener
};


function createFromMarkup(markup) {
  var parser = document.createElement('div');
  parser.innerHTML = markup;
  return parser.firstChild;
}
