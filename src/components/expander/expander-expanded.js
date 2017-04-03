import * as component from '../../core/component';

component.define({
  selector: 'mc-expander-expanded',
  controller: Controller
});

function Controller(element, attrs, helper) {
  var expanded = false;
  var expander;

  this.toggle = toggle;
  this.open = open;
  this.close = close;
  this.isOpen = isOpen;


  helper.findParent('mc-expander', function (ctrl) {
    expander = ctrl;
  });

  function toggle(value) {
    if (expanded) { close(); }
    else { open(); }
  }

  function open() {
    expander.element.classList.add('mc-open');
    element.classList.add('mc-show');
    TweenLite.to(element, 0.2, {ease: Expo.easeOut, height: getHeight()});
    expanded = true;
  }

  function close() {
    expander.element.classList.remove('mc-open');
    TweenLite.to(element, 0.2, {ease: Expo.easeOut, height: 0, onComplete: function () {
      element.classList.remove('mc-show');
    }});
    expanded = false;
  }

  function getHeight() {
    var height = element.getAttribute('height');
    if (height) {
      return height.replace('px', '') + 'px';
    } else {
      return element.scrollHeight + 'px';
    }
  }

  function isOpen() {
    return expanded;
  }
}
