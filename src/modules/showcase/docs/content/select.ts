import type { ComponentDoc } from '../types';
import { SelectDemo } from './pickerDemos';

const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'];
const COLUMNS = [
  {
    'label': 'Default',
    'props': {}
  },
  {
    'label': 'Selected',
    'props': {
      'data-wds-state': 'selected'
    }
  },
  {
    'label': 'Filled',
    'props': {
      'value': 'id'
    }
  },
  {
    'label': 'Disabled',
    'props': {
      'disabled': true,
      'value': 'id'
    }
  },
  {
    'label': 'Error empty',
    'props': {
      'error': 'Error'
    }
  },
  {
    'label': 'Error filled',
    'props': {
      'error': 'Error',
      'value': 'id'
    }
  },
  {
    'label': 'Read only',
    'props': {
      'readOnly': true,
      'value': 'id'
    }
  },
  {
    'label': 'Focused',
    'props': {
      'data-wds-state': 'focused'
    }
  }
];

export const selectDoc: ComponentDoc = {
  slug: 'select',
  name: 'Select',
  category: 'forms',
  importStatement: "import { Select } from 'shared/components/ui';",
  figmaUrl: 'https://www.figma.com/design/ThLaTINM5dmzPW4AsB8dnF/?node-id=9930-13229',
  component: SelectDemo,
  codeExtra: ['options={options}', 'value={value}', 'onChange={setValue}'],
  codeOmit: ['value'],
  defaults: { size: 'md', appearance: 'box' },
  baseProps: { value: '', multiple: false, placeholder: 'Select option', appearance: 'box', size: 'md', className: 'w-72' },
  controls: [
    { prop: 'multiple', kind: 'boolean' },
    { prop: 'value', kind: 'text' },
    { prop: 'placeholder', kind: 'text' },
    { prop: 'appearance', kind: 'select', options: ['box', 'underline'] },
    { prop: 'size', kind: 'select', options: SIZES },
    { prop: 'leadingIcon', kind: 'icon', options: ['Magnifer', 'Calendar', 'Pen', 'Download'] },
    { prop: 'trailingIcon', kind: 'icon', options: ['Magnifer', 'Calendar', 'Pen', 'Download'] },
    { prop: 'searchable', kind: 'boolean' },
    { prop: 'clearable', kind: 'boolean' },
    { prop: 'disabled', kind: 'boolean' },
    { prop: 'readOnly', kind: 'boolean' },
    { prop: 'hint', kind: 'text' },
    { prop: 'error', kind: 'text' },
  ],
  figmaMapping: [
    { id: 'label', figma: 'Show label · Label text', values: 'boolean + text', prop: 'FormItem label' },
    { id: 'description', figma: 'Show description · Description', values: 'boolean + text', prop: 'FormItem description' },
    { id: 'placeholder', figma: 'Placeholder / value (TEXT)', values: 'free text', prop: 'placeholder · value' },
    { id: 'hint', figma: 'Show hint · Helper / error (TEXT)', values: 'boolean + text', prop: 'hint · error' },
    { id: 'layout', figma: 'Layout (variant)', values: 'Vertical, Horizontal', prop: 'FormItem layout' },
    { id: 'modes', figma: 'Select modes (mode)', values: 'single, multiple', prop: 'multiple' },
    { id: 'styles', figma: 'Select styles (mode)', values: 'box, underline', prop: 'appearance' },
    { id: 'states', figma: 'Select states (mode)', values: 'default, selected, filled, disabled, error-empty, error-filled, read-only, focused', prop: 'value · disabled · readOnly · error' },
    { id: 'icons', figma: 'Icon configurations', values: 'off, leading, trailing, only, both', prop: 'leadingIcon · trailingIcon' },
    { id: 'size', figma: 'Size (mode)', values: SIZES.join(', '), prop: 'size' },
    { id: 'menu', figma: 'Dropdown / Menu · Menu Item', values: 'selected, pressed, disabled', prop: 'options · isOptionDisabled' },
    { id: 'focus', figma: 'Focus indicator', values: '1px stroke outside, 2px gap', prop: '— (CSS)' },
  ],
  examples: [
    { id: 'appearance', variants: [{ label: 'box', props: { appearance: 'box' } }, { label: 'underline', props: { appearance: 'underline' } }] },
    { id: 'sizes', variants: SIZES.map((s) => ({ label: s, props: { size: s } })) },
    { id: 'multiple', variants: [{ label: 'multiple', props: { multiple: true, value: 'id,sg' } }] },
    { id: 'searchable', variants: [{ label: 'searchable', props: { searchable: true } }] },
    { id: 'validation', variants: [{ label: 'hint', props: { hint: 'Pick one country' } }, { label: 'error', props: { error: 'This field is required' } }] },
  ],
  matrices: [
    {
      id: 'states',
      rows: ['box', 'underline'].map((a) => ({ label: a, props: { appearance: a, placeholder: 'Select', className: 'w-44' } })),
      columns: COLUMNS,
    },
  ],
  props: [
    { id: 'options', name: 'options', type: 'SelectOption[]' },
    { id: 'value', name: 'value', type: 'string (multiple: string[])' },
    { id: 'onChange', name: 'onChange', type: '(value) => void' },
    { id: 'placeholder', name: 'placeholder', type: 'string' },
    { id: 'appearance', name: 'appearance', type: "'box' | 'underline'", default: "'box'" },
    { id: 'size', name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'" },
    { id: 'icons', name: 'leadingIcon · trailingIcon', type: 'ReactNode' },
    { id: 'hint', name: 'hint', type: 'ReactNode' },
    { id: 'error', name: 'error', type: 'string' },
    { id: 'searchable', name: 'searchable', type: 'boolean', default: 'false' },
    { id: 'clearable', name: 'clearable', type: 'boolean', default: 'true' },
    { id: 'loadOptions', name: 'loadOptions · paginateOnScroll', type: 'LoadOptionsFn · boolean' },
    { id: 'disabled', name: 'disabled · readOnly', type: 'boolean', default: 'false' },
    { id: 'optionDisabled', name: 'isOptionDisabled', type: '(option) => boolean' },
    { id: 'multipleProps', name: 'multiple', type: 'boolean', default: 'false' },
    { id: 'multiple', name: 'chipsSummary · closeOnSelect · hideCheckBox · chipLabel', type: 'multiple only' },
  ],
  tokens: [
    '--wds-bg-surface',
    '--wds-bg-disabled',
    '--wds-text-placeholder',
    '--wds-text-primary',
    '--wds-text-tertiary',
    '--wds-text-danger',
    '--wds-icons-secondary',
    '--wds-stroke-default',
    '--wds-stroke-focus',
    '--wds-stroke-danger',
    '--wds-bg-elevated',
    '--wds-stroke-subtle',
    '--wds-bg-pressed',
    '--wds-bg-brand-subtle',
    '--wds-bg-subtle',
    '--wds-radius-12',
    '--wds-sz-select-tag-radius',
  ].map((name) => ({ name })),
};
