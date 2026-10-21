import { Button } from '../../../../shared/components/ui';
import { icon, type ComponentDoc } from '../types';

const HIERARCHIES = ['primary', 'secondary', 'tertiary', 'text', 'tonal', 'elevated'];
const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'];
const ICONS = ['AddCircle', 'Download', 'Pen', 'TrashBinTrash', 'Magnifer'];
const STATE_COLUMNS = [
  { label: 'Default', props: {} },
  { label: 'Hover', props: { 'data-wds-state': 'hover' } },
  { label: 'Pressed', props: { 'data-wds-state': 'pressed' } },
  { label: 'Focused', props: { 'data-wds-state': 'focused' } },
  { label: 'Disabled', props: { disabled: true } },
];

export const buttonDoc: ComponentDoc = {
  slug: 'button',
  name: 'Button',
  category: 'actions',
  importStatement: "import { Button } from 'shared/components/ui';",
  figmaUrl: 'https://www.figma.com/design/ThLaTINM5dmzPW4AsB8dnF/?node-id=9928-8763',
  component: Button,
  defaults: { size: 'md', shape: 'box' },
  baseProps: { hierarchy: 'primary', size: 'md', shape: 'box' },
  baseChildren: 'Button CTA',
  controls: [
    { prop: 'hierarchy', kind: 'select', options: HIERARCHIES },
    { prop: 'size', kind: 'select', options: SIZES },
    { prop: 'shape', kind: 'select', options: ['box', 'rounded'] },
    { prop: 'destructive', kind: 'boolean' },
    { prop: 'disabled', kind: 'boolean' },
    { prop: 'iconOnly', kind: 'boolean' },
    { prop: 'leadingIcon', kind: 'icon', options: ICONS },
    { prop: 'trailingIcon', kind: 'icon', options: ICONS },
  ],
  figmaMapping: [
    { id: 'label', figma: 'Label (TEXT)', values: 'free text', prop: 'children' },
    { id: 'destructive', figma: 'Destructive (variant)', values: 'No, Yes', prop: 'destructive' },
    { id: 'hierarchy', figma: 'Button hierarchy (mode)', values: HIERARCHIES.join(', '), prop: 'hierarchy' },
    { id: 'size', figma: 'Size (mode)', values: SIZES.join(', '), prop: 'size' },
    { id: 'shape', figma: 'Button styles (mode)', values: 'box, rounded', prop: 'shape' },
    { id: 'icons', figma: 'Show icons (mode)', values: 'off, leading, trailing, only, both', prop: 'leadingIcon · trailingIcon · iconOnly' },
    { id: 'states', figma: 'Button states (mode)', values: 'default, hover, pressed, focused, disabled', prop: '— (CSS)' },
    { id: 'focus', figma: 'Focus indicator', values: '1px stroke outside, 2px gap', prop: '— (CSS)' },
  ],
  examples: [
    { id: 'hierarchy', variants: HIERARCHIES.map((h) => ({ label: h, props: { hierarchy: h } })) },
    { id: 'destructive', variants: HIERARCHIES.map((h) => ({ label: h, props: { hierarchy: h, destructive: true } })) },
    { id: 'sizes', variants: SIZES.map((s) => ({ label: s, props: { size: s } })) },
    {
      id: 'shapes',
      variants: [
        { label: 'box', props: { shape: 'box' } },
        { label: 'rounded', props: { shape: 'rounded' } },
      ],
    },
    {
      id: 'icons',
      variants: [
        { label: 'leading', props: { leadingIcon: icon('AddCircle') } },
        { label: 'trailing', props: { trailingIcon: icon('Download') } },
        { label: 'both', props: { leadingIcon: icon('AddCircle'), trailingIcon: icon('Download') } },
        { label: 'only', props: { iconOnly: true, leadingIcon: icon('Pen'), 'aria-label': 'Edit' } },
      ],
    },
  ],
  matrices: [
    {
      id: 'hierarchyStates',
      rows: HIERARCHIES.map((h) => ({ label: h, props: { hierarchy: h } })),
      columns: STATE_COLUMNS,
      children: 'Button',
    },
    {
      id: 'destructiveStates',
      rows: HIERARCHIES.map((h) => ({ label: h, props: { hierarchy: h, destructive: true } })),
      columns: STATE_COLUMNS,
      children: 'Button',
    },
  ],
  props: [
    { id: 'hierarchy', name: 'hierarchy', type: "'primary' | 'secondary' | 'tertiary' | 'text' | 'tonal' | 'elevated'", default: 'variant' },
    { id: 'destructive', name: 'destructive', type: 'boolean', default: 'false' },
    { id: 'size', name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'" },
    { id: 'shape', name: 'shape', type: "'box' | 'rounded'", default: "'box'" },
    { id: 'leadingIcon', name: 'leadingIcon', type: 'ReactNode' },
    { id: 'trailingIcon', name: 'trailingIcon', type: 'ReactNode' },
    { id: 'iconOnly', name: 'iconOnly', type: 'boolean', default: 'false' },
    { id: 'variant', name: 'variant', type: "'primary' | 'secondary' | 'danger' | 'custom'", default: "'primary'" },
    { id: 'iconLegacy', name: 'icon / iconPosition', type: "ReactNode / 'left' | 'right'", default: "— / 'left'" },
    { id: 'disabled', name: 'disabled', type: 'boolean', default: 'false' },
    { id: 'testId', name: 'testId', type: 'string' },
    { id: 'rest', name: '…button props', type: 'ButtonHTMLAttributes' },
  ],
  tokens: [
    '--wds-bg-brand',
    '--wds-bg-brand-hover',
    '--wds-bg-brand-pressed-strong',
    '--wds-bg-danger',
    '--wds-text-on-brand',
    '--wds-stroke-brand',
    '--wds-stroke-focus',
    '--wds-bg-disabled',
    '--wds-text-disabled',
    '--wds-sz-padding-left',
    '--wds-sz-padding-top',
    '--wds-sz-radius-all',
    '--wds-sz-gap',
    '--wds-sz-icon-size',
    '--wds-sz-text-label-font-size',
    '--wds-sz-width',
    '--wds-sz-focus-stroke',
  ].map((name) => ({ name })),
};
