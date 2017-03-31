import * as component from '../../core/component';
import parse from '../../core/parser';
import { compileExpression } from '../../core/expression';

component.define({
  selector: '[if]',
  priority: 100,
  model: false,
  controller: controller
});

function controller(element, attrs, model) {
  var active = true;
  var parent = element.parentNode;
  var ifExpression = compileExpression(attrs.getAttribute('if'));
  var placeholder = document.createComment(' if="'+element.getAttribute('if')+'" ');
  placeholder.uid = element.uid;
  placeholder.mcplaceholder = true;

  model.$observe(function () {
    if (ifExpression(model).toBoolean()) { add(); }
    else { remove(); }
  });

  function remove() {
    if (!active) { return; }
    parent.insertBefore(placeholder, element);
    component.disableOnRemove(element);
    model.$$forceEnable = true;
    element.remove();
    active = false;
  }

  function add() {
    if (active) { return; }
    parent.insertBefore(element, placeholder.nextSibling);
    placeholder.remove();
    model.$$forceEnable = false;
    active = true;
  }
}
