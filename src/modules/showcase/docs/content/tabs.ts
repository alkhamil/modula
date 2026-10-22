import type { ComponentDoc } from '../types';
import { TabsDemo } from './layoutDemos';

const APPEARANCES = ['default', 'box', 'underline', 'segmented'];

export const tabsDoc: ComponentDoc = {
  slug: 'tabs',
  name: 'Tabs',
  category: 'navigation',
  importStatement: "import { Tabs } from 'shared/components/ui';",
  figmaUrl: 'https://www.figma.com/design/ThLaTINM5dmzPW4AsB8dnF/?node-id=9930-14293',
  component: TabsDemo,
  codeName: 'Tabs',
  codeExtra: ['items={items}', 'value={value}', 'onChange={setValue}'],
  defaults: { appearance: 'default' },
  baseProps: { appearance: 'underline' },
  controls: [
    { prop: 'appearance', kind: 'select', options: APPEARANCES },
    { prop: 'size', kind: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    { prop: 'fullWidth', kind: 'boolean' },
  ],
  figmaMapping: [
    { id: 'styles', figma: 'Navigation styles (mode)', values: 'default, box, underline, segmented-filled', prop: 'appearance' },
    { id: 'states', figma: 'Navigation states', values: 'inactive, active', prop: 'value' },
    { id: 'item', figma: 'Tab item (icon · label · badge)', values: 'item', prop: 'items[].icon · label · badge' },
  ],
  examples: [{ id: 'styles', variants: APPEARANCES.map((a) => ({ label: a, props: { appearance: a } })) }],
  props: [
    { id: 'items', name: 'items', type: 'TabItem[] ({ value, label, icon?, badge?, disabled? })' },
    { id: 'value', name: 'value · onChange', type: 'string · (value) => void' },
    { id: 'appearance', name: 'appearance', type: "'default' | 'box' | 'underline' | 'segmented'", default: "'default'" },
    { id: 'size', name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'" },
    { id: 'fullWidth', name: 'fullWidth', type: 'boolean', default: 'false' },
    { id: 'testId', name: 'testId', type: 'string' },
  ],
  tokens: [
    '--wds-text-tertiary',
    '--wds-text-brand',
    '--wds-bg-brand-subtle',
    '--wds-stroke-brand',
    '--wds-stroke-subtle',
    '--wds-bg-subtle-2',
    '--wds-bg-elevated',
    '--wds-sz-segmented-control-root-padding-top',
  ].map((name) => ({ name })),
};
