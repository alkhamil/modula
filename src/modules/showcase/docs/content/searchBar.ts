import type { ComponentDoc } from '../types';
import { SearchBarDemo } from './layoutDemos';

export const searchBarDoc: ComponentDoc = {
  slug: 'search-bar',
  name: 'SearchBar',
  category: 'forms',
  importStatement: "import { SearchBar } from 'shared/components/ui';",
  figmaUrl: 'https://www.figma.com/design/ThLaTINM5dmzPW4AsB8dnF/?node-id=9930-12864',
  component: SearchBarDemo,
  codeName: 'SearchBar',
  codeExtra: ['value={query}', 'onChange={setQuery}'],
  defaults: { appearance: 'box', clearable: true },
  baseProps: { appearance: 'box', placeholder: 'Search' },
  controls: [
    { prop: 'appearance', kind: 'select', options: ['box', 'pill'] },
    { prop: 'placeholder', kind: 'text' },
    { prop: 'size', kind: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    { prop: 'voice', kind: 'boolean' },
    { prop: 'clearable', kind: 'boolean' },
    { prop: 'disabled', kind: 'boolean' },
  ],
  figmaMapping: [
    { id: 'styles', figma: 'Search bar styles (mode)', values: 'box, pill', prop: 'appearance' },
    { id: 'states', figma: 'Search bar states', values: 'default, selected, typing, filled, disabled, focused', prop: 'value · disabled · focus' },
    { id: 'clear', figma: 'Clear (visible)', values: 'boolean', prop: 'clearable' },
    { id: 'voice', figma: 'Voice search', values: 'boolean', prop: 'voice' },
    { id: 'size', figma: 'Size Modes', values: 'xs, sm, md, lg, xl', prop: 'size' },
  ],
  examples: [
    { id: 'styles', variants: ['box', 'pill'].map((a) => ({ label: a, props: { appearance: a } })) },
  ],
  props: [
    { id: 'value', name: 'value · onChange', type: 'string · (value: string) => void' },
    { id: 'appearance', name: 'appearance', type: "'box' | 'pill'", default: "'box'" },
    { id: 'size', name: 'size · voice', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' · boolean", default: "'md' · false" },
    { id: 'clearable', name: 'clearable', type: 'boolean', default: 'true' },
    { id: 'disabled', name: 'disabled · placeholder', type: 'boolean · string' },
    { id: 'testId', name: 'testId', type: 'string' },
  ],
  tokens: [
    '--wds-bg-surface',
    '--wds-bg-subtle',
    '--wds-bg-disabled',
    '--wds-stroke-default',
    '--wds-stroke-focus',
    '--wds-text-primary',
    '--wds-text-placeholder',
    '--wds-icons-secondary',
  ].map((name) => ({ name })),
};
