import type { ComponentDoc } from '../types';
import { AccordionDemo } from './layoutDemos';

export const accordionDoc: ComponentDoc = {
  slug: 'accordion',
  name: 'Accordion',
  category: 'data',
  importStatement: "import { Accordion } from 'shared/components/ui';",
  figmaUrl: 'https://www.figma.com/design/ThLaTINM5dmzPW4AsB8dnF/?node-id=9923-663',
  component: AccordionDemo,
  codeName: 'Accordion',
  codeExtra: ['items={items}'],
  defaults: { appearance: 'box' },
  baseProps: { appearance: 'box' },
  controls: [
    { prop: 'appearance', kind: 'select', options: ['box', 'underline'] },
    { prop: 'size', kind: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    { prop: 'showIcon', kind: 'boolean' },
    { prop: 'flipIcon', kind: 'boolean' },
  ],
  figmaMapping: [
    { id: 'title', figma: 'Title (TEXT)', values: 'free text', prop: 'items[].title' },
    { id: 'description', figma: 'Description (TEXT)', values: 'free text', prop: 'items[].content' },
    { id: 'leading', figma: 'Leading icon (BOOLEAN)', values: 'boolean + icon', prop: 'items[].icon' },
    { id: 'expand', figma: 'Expand (variant No / Yes)', values: 'No, Yes', prop: 'value · defaultOpen' },
    { id: 'flip', figma: 'Flip icon (variant No / Yes)', values: 'No, Yes', prop: 'flipIcon' },
    { id: 'styles', figma: 'Accordion styles (mode)', values: 'box, underline', prop: 'appearance' },
    { id: 'states', figma: 'Accordion states', values: 'default, hover, pressed, focused, disabled', prop: 'items[].disabled · interaction' },
    { id: 'size', figma: 'Size Modes', values: 'xs, sm, md, lg, xl', prop: 'size' },
  ],
  examples: [
    { id: 'styles', variants: ['box', 'underline'].map((a) => ({ label: a, props: { appearance: a } })) },
  ],
  props: [
    { id: 'items', name: 'items', type: 'AccordionItem[] ({ value, title, content, icon?, disabled? })' },
    { id: 'size', name: 'size · flipIcon', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' · boolean", default: "'md' · false" },
    { id: 'appearance', name: 'appearance', type: "'box' | 'underline'", default: "'box'" },
    { id: 'defaultOpen', name: 'defaultOpen · value · onChange', type: 'string[] · string[] · (value: string[]) => void', default: '[]' },
    { id: 'testId', name: 'testId', type: 'string' },
  ],
  tokens: [
    '--wds-bg-surface',
    '--wds-bg-subtle',
    '--wds-bg-subtle-2',
    '--wds-bg-disabled',
    '--wds-stroke-default',
    '--wds-text-primary',
    '--wds-text-secondary',
    '--wds-icons-primary',
    '--wds-sz-accordion-header-gap',
  ].map((name) => ({ name })),
};
