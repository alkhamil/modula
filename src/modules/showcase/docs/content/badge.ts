import { Badge } from '../../../../shared/components/ui';
import { fn, icon, type ComponentDoc } from '../types';

const STYLES = ['neutral', 'primary', 'info', 'success', 'warning', 'danger'];
const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'];
const ICONS = ['InfoCircle', 'CheckCircle', 'Pen', 'Download', 'Calendar'];

export const badgeDoc: ComponentDoc = {
  slug: 'badge',
  name: 'Badge',
  category: 'feedback',
  importStatement: "import { Badge } from 'shared/components/ui';",
  figmaUrl: 'https://www.figma.com/design/ThLaTINM5dmzPW4AsB8dnF/?node-id=9928-6526',
  component: Badge,
  defaults: { size: 'md' },
  baseProps: { variant: 'info', size: 'md' },
  baseChildren: 'Label',
  controls: [
    { prop: 'variant', kind: 'select', options: STYLES },
    { prop: 'size', kind: 'select', options: SIZES },
    { prop: 'dot', kind: 'boolean' },
    { prop: 'counter', kind: 'text' },
    { prop: 'leadingIcon', kind: 'icon', options: ICONS },
    { prop: 'trailingIcon', kind: 'icon', options: ICONS },
    { prop: 'iconOnly', kind: 'boolean' },
  ],
  figmaMapping: [
    { id: 'label', figma: 'Label (TEXT)', values: 'free text', prop: 'children' },
    { id: 'styles', figma: 'Badge styles (mode)', values: STYLES.join(', '), prop: 'variant' },
    { id: 'types', figma: 'Badge types (mode)', values: 'default, dot, counter, x close, icon left, icon right, icon only', prop: 'dot · counter · leadingIcon · trailingIcon · onRemove · iconOnly' },
    { id: 'size', figma: 'Size (mode)', values: SIZES.join(', '), prop: 'size' },
  ],
  examples: [
    { id: 'styles', variants: STYLES.map((v) => ({ label: v, props: { variant: v } })) },
    { id: 'sizes', variants: SIZES.map((s) => ({ label: s, props: { size: s } })) },
    {
      id: 'types',
      variants: [
        { label: 'dot', props: { dot: true, variant: 'success' } },
        { label: 'counter', props: { counter: 12, variant: 'primary' } },
        { label: 'icon left', props: { leadingIcon: icon('InfoCircle') } },
        { label: 'icon right', props: { trailingIcon: icon('Calendar') } },
        { label: 'x close', props: { onRemove: fn('handleRemove'), variant: 'neutral' } },
        { label: 'icon only', props: { iconOnly: true, leadingIcon: icon('CheckCircle'), variant: 'success', 'aria-label': 'Done' } },
      ],
    },
  ],
  props: [
    { id: 'variant', name: 'variant', type: "'neutral' | 'primary' | 'info' | 'success' | 'warning' | 'danger'", default: "'info'" },
    { id: 'legacy', name: 'variant (lama)', type: "'error' | 'secondary' | 'custom'" },
    { id: 'size', name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'" },
    { id: 'dot', name: 'dot', type: 'boolean', default: 'false' },
    { id: 'counter', name: 'counter', type: 'ReactNode' },
    { id: 'icons', name: 'leadingIcon · trailingIcon', type: 'ReactNode' },
    { id: 'onRemove', name: 'onRemove', type: '() => void' },
    { id: 'iconOnly', name: 'iconOnly', type: 'boolean', default: 'false' },
    { id: 'testId', name: 'testId', type: 'string' },
  ],
  tokens: [
    '--wds-bg-subtle',
    '--wds-bg-brand-subtle',
    '--wds-bg-success-subtle',
    '--wds-bg-danger-subtle',
    '--wds-text-secondary',
    '--wds-text-brand',
    '--wds-text-success',
    '--wds-text-danger',
    '--wds-text-inverse',
    '--wds-sz-badge-padding-left',
    '--wds-sz-badge-padding-top',
    '--wds-sz-badge-gap',
    '--wds-sz-text-badge-font-size',
  ].map((name) => ({ name })),
};
