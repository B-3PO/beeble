import * as component from '../../core/component';

component.define({
  selector: 'mc-expander',
  controller: Controller
});

function Controller(element, attrs, helper) {
  var expanded;

  this.element = element;
  this.toggle = function () {
    expanded.toggle();
    setOpenAttr();
  };

  helper.findChild('mc-expander-expanded', function (ctrl) {
    expanded = ctrl;
    if (element.hasAttribute('open')) { toggle(element.getAttribute('open')); }
  });

  attrs.$observe('open', function (value) {
    if (!expanded) { return; }
    if (value.toBoolean()) { expanded.open(); }
    else { expanded.close(); }
  });

  function setOpenAttr() {
    element.setAttribute('open', expanded.isOpen().toString());
  }
}
