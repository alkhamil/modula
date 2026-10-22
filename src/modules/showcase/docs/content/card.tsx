import { Button } from '../../../../shared/components/ui';
import { raw, type ComponentDoc } from '../types';
import { CardDemo } from './surfaceDemos';

const FOOTER = raw(
  `<>
  <Button hierarchy="secondary">Cancel</Button>
  <Button>Save</Button>
</>`,
  <>
    <Button hierarchy="secondary">Cancel</Button>
    <Button>Save</Button>
  </>,
);

export const cardDoc: ComponentDoc = {
  slug: 'card',
  name: 'Card',
  category: 'data',
  importStatement: "import { Card } from 'shared/components/ui';",
  figmaUrl: 'https://www.figma.com/design/ThLaTINM5dmzPW4AsB8dnF/?node-id=9928-8962',
  component: CardDemo,
  codeName: 'Card',
  defaults: { appearance: 'outlined', size: 'md' },
  baseProps: { title: 'Card title', appearance: 'outlined', size: 'md' },
  baseChildren: 'Card content goes here.',
  controls: [
    { prop: 'title', kind: 'text' },
    { prop: 'appearance', kind: 'select', options: ['outlined', 'filled'] },
    { prop: 'size', kind: 'select', options: ['md', 'sm'] },
    { prop: 'collapsible', kind: 'boolean' },
  ],
  figmaMapping: [
    { id: 'styles', figma: 'Card styles (mode)', values: 'outlined, filled', prop: 'appearance' },
    { id: 'title', figma: 'Title (TEXT)', values: 'free text', prop: 'title' },
    { id: 'actions', figma: 'Actions (slot)', values: 'buttons', prop: 'actions · footer' },
  ],
  examples: [
    {
      id: 'styles',
      variants: [
        { label: 'outlined', props: { appearance: 'outlined' } },
        { label: 'filled', props: { appearance: 'filled' } },
      ],
    },
    { id: 'footer', variants: [{ label: 'footer', props: { footer: FOOTER } }] },
  ],
  props: [
    { id: 'title', name: 'title · actions', type: 'string · ReactNode' },
    { id: 'children', name: 'children', type: 'ReactNode' },
    { id: 'footer', name: 'footer', type: 'ReactNode' },
    { id: 'appearance', name: 'appearance', type: "'outlined' | 'filled'", default: "'outlined'" },
    { id: 'size', name: 'size', type: "'md' | 'sm'", default: "'md'" },
    { id: 'collapsible', name: 'collapsible · defaultOpen · toggleIcon', type: 'boolean · boolean · ReactNode' },
    { id: 'testId', name: 'testId', type: 'string' },
  ],
  tokens: [
    '--wds-bg-surface',
    '--wds-bg-subtle',
    '--wds-stroke-subtle',
    '--wds-text-primary',
    '--wds-text-secondary',
    '--wds-sz-card-radius',
    '--wds-sz-card-padding-top',
    '--wds-sz-card-padding-left',
    '--wds-sz-card-actions-gap',
  ].map((name) => ({ name })),
};
