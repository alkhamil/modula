import { CheckboxDemo } from './selectionDemos';
import { selectionDoc } from './selectionDoc';

export const checkboxDoc = selectionDoc({
  slug: 'checkbox',
  name: 'Checkbox',
  node: '9928-9343',
  component: CheckboxDemo,
  real: 'Checkbox',
  labelProp: 'checkboxLabel',
  codeExtra: ['value={checked}', 'onChange={setChecked}'],
  appearance: true,
  indeterminate: true,
  valueProp: 'value',
  valueType: 'boolean',
  onChangeType: '(value: boolean) => void',
  figma: [
    { id: 'label', figma: 'Label (TEXT)', values: 'free text', prop: 'checkboxLabel' },
    { id: 'supporting', figma: 'Supporting / error (TEXT)', values: 'free text', prop: 'hint · error' },
    { id: 'style', figma: 'Style (variant)', values: 'Outline, Solid', prop: 'appearance' },
    { id: 'states', figma: 'Checkbox states (mode)', values: 'default, selected, indeterminate, disabled-off, disabled-on, error, focused…', prop: 'value · indeterminate · disabled · error' },
    { id: 'size', figma: 'Size (mode)', values: 'xs, sm, md, lg, xl', prop: 'size' },
    { id: 'types', figma: 'Checkbox types (mode)', values: 'default, icon only', prop: 'checkboxLabel' },
    { id: 'modes', figma: 'Checkbox modes (mode)', values: 'Hint, No Hint', prop: 'hint' },
  ],
});
