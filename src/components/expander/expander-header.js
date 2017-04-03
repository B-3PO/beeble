import * as component from '../../core/component';
component.define({
  selector: 'mc-expander-header',
  controller: controller
});


function controller(element, attrs, helper) {
  helper.findParent('mc-expander', function (ctrl) {
    element.addEventListener('click', ctrl.toggle);
  });
}
