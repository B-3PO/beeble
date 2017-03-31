import { define } from '../../core/component';

define({
  selector: 'mc-button, button[mc-button]',
  template: '<button class="mc-button"><mc-transpose></mc-transpose></button>',
  replace: true,
  transfer: true
});
