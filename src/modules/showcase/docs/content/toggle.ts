import { ToggleDemo } from './selectionDemos';
import { selectionDoc } from './selectionDoc';

export const toggleDoc = selectionDoc({
  slug: 'toggle',
  name: 'Toggle',
  node: '9930-14779',
  component: ToggleDemo,
  real: 'Toggle',
  labelProp: 'switchLabel',
  codeExtra: ['value={checked}', 'onChange={setChecked}'],
  appearance: false,
  valueProp: 'value',
  valueType: 'boolean',
  onChangeType: '(value: boolean) => void',
  figma: [
    { id: 'label', figma: 'Label (TEXT)', values: 'free text', prop: 'switchLabel · checkedLabel · uncheckedLabel' },
    { id: 'supporting', figma: 'Supporting / error (TEXT)', values: 'free text', prop: 'hint · error' },
    { id: 'tick', figma: 'Tick (variant)', values: 'Off, On', prop: 'value' },
    { id: 'states', figma: 'Toggle states (mode)', values: 'default, selected, disabled-off, disabled-on, error, focused…', prop: 'value · disabled · error' },
    { id: 'size', figma: 'Size (mode)', values: 'xs, sm, md, lg, xl', prop: 'size' },
    { id: 'types', figma: 'Toggle types (mode)', values: 'default, icon only', prop: 'switchLabel' },
    { id: 'modes', figma: 'Toggle modes (mode)', values: 'Hint, No Hint', prop: 'hint' },
  ],
});
