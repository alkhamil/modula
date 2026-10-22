import type { ComponentDoc } from '../types';
import { AccordionDemo } from './layoutDemos';

export const accordionDoc: ComponentDoc = {
  slug: 'accordion',
  name: 'Accordion',
  category: 'data',
  importStatement: "import { Accordion } from 'shared/components/ui';",
  component: AccordionDemo,
  codeName: 'Accordion',
  codeExtra: ['items={items}'],
  defaults: { appearance: 'box', multiple: false },
  baseProps: { appearance: 'box' },
  controls: [
    { prop: 'appearance', kind: 'select', options: ['box', 'underline'] },
    { prop: 'multiple', kind: 'boolean' },
  ],
  figmaMapping: [
    { id: 'styles', figma: 'Accordion styles (mode)', values: 'box, underline', prop: 'appearance' },
    { id: 'states', figma: 'Accordion states', values: 'default, hover, pressed, disabled, focused', prop: 'items[].disabled · interaction' },
    { id: 'supporting', figma: 'Supporting text', values: 'free text', prop: 'items[].description' },
  ],
  examples: [
    { id: 'styles', variants: ['box', 'underline'].map((a) => ({ label: a, props: { appearance: a } })) },
  ],
  props: [
    { id: 'items', name: 'items', type: 'AccordionItem[] ({ value, title, description?, content, disabled? })' },
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
