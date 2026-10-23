import type { ComponentDoc } from '../types';
import { BreadcrumbsDemo } from './layoutDemos';

export const breadcrumbsDoc: ComponentDoc = {
  slug: 'breadcrumbs',
  name: 'Breadcrumbs',
  category: 'navigation',
  importStatement: "import { Breadcrumbs } from 'shared/components/ui';",
  figmaUrl: 'https://www.figma.com/design/ThLaTINM5dmzPW4AsB8dnF/?node-id=9928-8401',
  component: BreadcrumbsDemo,
  codeName: 'Breadcrumbs',
  codeExtra: ["items={[{ label: 'Menu', to: '/', icon: <Database /> }, …]}"],
  codeOmit: ['levels'],
  defaults: { showIcons: 'leading' },
  baseProps: { showIcons: 'leading', levels: '3' },
  controls: [
    { prop: 'truncated', kind: 'boolean', label: 'Truncated' },
    { prop: 'levels', kind: 'select', label: 'No. of Menu', options: ['3', '4', '5'] },
    { prop: 'showIcons', kind: 'select', label: 'Show icons', options: ['off', 'leading', 'trailing', 'only', 'both'] },
    { prop: 'size', kind: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
  ],
  figmaMapping: [
    { id: 'states', figma: 'Breadcrumbs states', values: 'default, hover, pressed, active, disabled', prop: 'items[].to · disabled' },
    { id: 'truncated', figma: 'Truncated (variant No / Yes)', values: 'No, Yes', prop: 'truncated' },
    { id: 'levels', figma: 'No. of Menu (mode)', values: '3, 4, 5', prop: 'items.length' },
    { id: 'showIcons', figma: 'Show icons (mode)', values: 'off, leading, trailing, only, both', prop: 'showIcons · items[].icon' },
    { id: 'chevron', figma: 'Chevron separator', values: 'icon', prop: '— (CSS)' },
  ],
  examples: [],
  props: [
    { id: 'truncated', name: 'truncated', type: 'boolean', default: 'false' },
    { id: 'showIcons', name: 'showIcons', type: "'off' | 'leading' | 'trailing' | 'only' | 'both'", default: "'leading'" },
    { id: 'size', name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'" },
    { id: 'items', name: 'items', type: 'BreadcrumbsItem[] ({ label, to?, icon?, disabled? })' },
    { id: 'testId', name: 'testId', type: 'string' },
  ],
  tokens: [
    '--wds-text-tertiary',
    '--wds-text-brand',
    '--wds-text-brand-pressed',
    '--wds-text-disabled',
    '--wds-icons-tertiary',
    '--wds-sz-breadcrumbs-gap',
    '--wds-sz-link-gap',
  ].map((name) => ({ name })),
};
