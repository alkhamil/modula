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
  defaults: { appearance: 'box', multiple: false },
  baseProps: { appearance: 'box' },
  controls: [
    { prop: 'appearance', kind: 'select', options: ['box', 'underline'] },
    { prop: 'size', kind: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    { prop: 'flipIcon', kind: 'boolean' },
    { prop: 'multiple', kind: 'boolean' },
  ],
  figmaMapping: [
    { id: 'styles', figma: 'Accordion styles (mode)', values: 'box, underline', prop: 'appearance' },
    { id: 'states', figma: 'Accordion states', values: 'default, hover, pressed, disabled, focused', prop: 'items[].disabled · interaction' },
    { id: 'supporting', figma: 'Description', values: 'free text', prop: 'items[].description' },
    { id: 'leading', figma: 'Leading icon', values: 'boolean + icon', prop: 'items[].icon' },
    { id: 'flip', figma: 'Flip icon', values: 'boolean', prop: 'flipIcon' },
    { id: 'size', figma: 'Size Modes', values: 'xs, sm, md, lg, xl', prop: 'size' },
  ],
  examples: [
    { id: 'styles', variants: ['box', 'underline'].map((a) => ({ label: a, props: { appearance: a } })) },
  ],
  props: [
    { id: 'items', name: 'items', type: 'AccordionItem[] ({ value, title, description?, icon?, content, disabled? })' },
    { id: 'size', name: 'size · flipIcon', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' · boolean", default: "'md' · false" },
    { id: 'appearance', name: 'appearance', type: "'box' | 'underline'", default: "'box'" },
    { id: 'multiple', name: 'multiple', type: 'boolean', default: 'false' },
    { id: 'defaultOpen', name: 'defaultOpen', type: 'string[]', default: '[]' },
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
