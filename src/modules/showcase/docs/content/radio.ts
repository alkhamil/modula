import { RadioDemo } from './selectionDemos';
import { selectionDoc } from './selectionDoc';

export const radioDoc = selectionDoc({
  slug: 'radio-button',
  name: 'Radio Button',
  node: '9930-12554',
  component: RadioDemo,
  real: 'RadioButton',
  labelProp: 'label',
  codeExtra: ['value="option"', 'checked={checked}', 'onChange={setValue}'],
  appearance: true,
  valueProp: 'checked',
  valueType: 'boolean',
  onChangeType: '(value: string) => void',
  figma: [
    { id: 'label', figma: 'Label (TEXT)', values: 'free text', prop: 'label' },
    { id: 'supporting', figma: 'Supporting / error (TEXT)', values: 'free text', prop: 'hint · error' },
    { id: 'style', figma: 'Style (variant)', values: 'Outline, Solid', prop: 'appearance' },
    { id: 'states', figma: 'RadioButton btn states (mode)', values: 'default, selected, disabled-off, disabled-on, error, focused…', prop: 'checked · disabled · error' },
    { id: 'size', figma: 'Size (mode)', values: 'xs, sm, md, lg, xl', prop: 'size' },
    { id: 'types', figma: 'RadioButton btn types (mode)', values: 'default, icon only', prop: 'label' },
    { id: 'modes', figma: 'RadioButton btn modes (mode)', values: 'Hint, No Hint', prop: 'hint' },
  ],
});
