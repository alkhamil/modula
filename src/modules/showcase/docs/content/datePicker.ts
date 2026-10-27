import type { ComponentDoc } from '../types';
import { DatePickerDemo } from './pickerDemos';

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
      'value': '2025-03-15'
    }
  },
  {
    'label': 'Disabled',
    'props': {
      'disabled': true,
      'value': '2025-03-15'
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
      'value': '2025-03-15'
    }
  },
  {
    'label': 'Read only',
    'props': {
      'readOnly': true,
      'value': '2025-03-15'
    }
  },
  {
    'label': 'Focused',
    'props': {
      'data-wds-state': 'focused'
    }
  }
];

export const datePickerDoc: ComponentDoc = {
  slug: 'date-picker',
  name: 'Date Picker',
  category: 'forms',
  importStatement: "import { DatePicker } from 'shared/components/ui';",
  figmaUrl: 'https://www.figma.com/design/ThLaTINM5dmzPW4AsB8dnF/?node-id=9928-9537',
  component: DatePickerDemo,
  codeName: 'DatePicker',
  codeExtra: ['value={value}', 'onChange={setValue}'],
  codeOmit: ['value'],
  defaults: { size: 'md', appearance: 'box' },
  baseProps: { value: '', range: false, appearance: 'box', size: 'md', className: 'w-72' },
  controls: [
    { prop: 'range', kind: 'boolean' },
    { prop: 'value', kind: 'text' },
    { prop: 'appearance', kind: 'select', options: ['box', 'underline'] },
    { prop: 'size', kind: 'select', options: SIZES },
    { prop: 'showTime', kind: 'boolean' },
    { prop: 'clearable', kind: 'boolean' },
    { prop: 'disabled', kind: 'boolean' },
    { prop: 'readOnly', kind: 'boolean' },
    { prop: 'hint', kind: 'text' },
    { prop: 'error', kind: 'text' },
  ],
  figmaMapping: [
    { id: 'label', figma: 'Show label · Label text', values: 'boolean + text', prop: 'FormItem label' },
    { id: 'description', figma: 'Show description · Description', values: 'boolean + text', prop: 'FormItem description' },
    { id: 'placeholder', figma: 'Date / placeholder (TEXT)', values: 'free text', prop: 'placeholder · value' },
    { id: 'hint', figma: 'Show hint · Helper / error (TEXT)', values: 'boolean + text', prop: 'hint · error' },
    { id: 'layout', figma: 'Layout (variant)', values: 'Vertical, Horizontal', prop: 'FormItem layout' },
    { id: 'styles', figma: 'Date Picker styles (mode)', values: 'box, underline', prop: 'appearance' },
    { id: 'states', figma: 'Date Picker states (mode)', values: 'default, selected, filled, disabled, error-empty, error-filled, read-only, focused', prop: 'value · disabled · readOnly · error' },
    { id: 'rangeMode', figma: 'Date range (Calendar)', values: 'single, range', prop: 'range' },
    { id: 'calendar', figma: 'Calendar · Day cell states', values: 'default, selected, today, disabled, empty', prop: '— (CSS)' },
    { id: 'size', figma: 'Size (mode)', values: SIZES.join(', '), prop: 'size' },
    { id: 'focus', figma: 'Focus indicator', values: '1px stroke outside, 2px gap', prop: '— (CSS)' },
  ],
  examples: [
    { id: 'appearance', variants: [{ label: 'box', props: { appearance: 'box' } }, { label: 'underline', props: { appearance: 'underline' } }] },
    { id: 'sizes', variants: SIZES.map((s) => ({ label: s, props: { size: s } })) },
    { id: 'range', variants: [{ label: 'range', props: { range: true } }] },
    { id: 'validation', variants: [{ label: 'hint', props: { hint: 'Format dd/mm/yyyy' } }, { label: 'error', props: { error: 'This field is required' } }] },
  ],
  matrices: [
    {
      id: 'states',
      rows: ['box', 'underline'].map((a) => ({ label: a, props: { appearance: a, placeholder: 'Select date', className: 'w-44' } })),
      columns: COLUMNS,
    },
  ],
  props: [
    { id: 'value', name: 'value', type: "string (ISO 'yyyy-mm-dd'; range: 'start,end')" },
    { id: 'onChange', name: 'onChange', type: '(value: string) => void' },
    { id: 'placeholder', name: 'placeholder', type: 'string' },
    { id: 'appearance', name: 'appearance', type: "'box' | 'underline'", default: "'box'" },
    { id: 'size', name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'" },
    { id: 'showTime', name: 'showTime', type: 'boolean', default: 'false' },
    { id: 'limits', name: 'minDate · maxDate', type: 'Date' },
    { id: 'range', name: 'range', type: 'boolean', default: 'false' },
    { id: 'maxRange', name: 'maxRangeDays', type: 'number (range only)' },
    { id: 'clearable', name: 'clearable', type: 'boolean', default: 'true' },
    { id: 'hint', name: 'hint', type: 'ReactNode' },
    { id: 'error', name: 'error', type: 'string' },
    { id: 'disabled', name: 'disabled · readOnly', type: 'boolean', default: 'false' },
  ],
  tokens: [
    '--wds-bg-page',
    '--wds-text-placeholder',
    '--wds-text-primary',
    '--wds-text-secondary',
    '--wds-text-inverse',
    '--wds-text-disabled',
    '--wds-icons-secondary',
    '--wds-icons-primary',
    '--wds-stroke-default',
    '--wds-stroke-focus',
    '--wds-stroke-danger',
    '--wds-stroke-subtle',
    '--wds-bg-brand',
    '--wds-bg-brand-subtle',
    '--wds-radius-12',
  ].map((name) => ({ name })),
};
