import { Button } from '../../../../shared/components/ui';
import { icon, raw, type ComponentDoc } from '../types';
import { EmptyStateDemo } from './surfaceDemos';

export const emptyStateDoc: ComponentDoc = {
  slug: 'empty-state',
  name: 'EmptyState',
  category: 'data',
  importStatement: "import { EmptyState } from 'shared/components/ui';",
  component: EmptyStateDemo,
  codeName: 'EmptyState',
  baseProps: {
    title: 'No results found',
    description: 'Try adjusting your search or filters.',
    illustration: icon('Magnifer'),
  },
  controls: [
    { prop: 'title', kind: 'text' },
    { prop: 'description', kind: 'text' },
    { prop: 'illustration', kind: 'icon', options: ['Magnifer', 'Database', 'InfoCircle', 'DangerTriangle'] },
  ],
  figmaMapping: [
    { id: 'title', figma: 'Title (TEXT)', values: 'free text', prop: 'title' },
    { id: 'supporting', figma: 'Supporting text (TEXT)', values: 'free text', prop: 'description' },
    { id: 'illustration', figma: 'Illustration (slot)', values: 'icon / image', prop: 'illustration' },
    { id: 'actions', figma: 'Actions (slot)', values: 'buttons', prop: 'actions' },
  ],
  examples: [
    {
      id: 'actions',
      variants: [
        {
          label: 'with action',
          props: { actions: raw('<Button>Add record</Button>', <Button>Add record</Button>) },
        },
      ],
    },
  ],
  props: [
    { id: 'title', name: 'title', type: 'string' },
    { id: 'description', name: 'description', type: 'ReactNode' },
    { id: 'illustration', name: 'illustration', type: 'ReactNode' },
    { id: 'actions', name: 'actions', type: 'ReactNode' },
    { id: 'testId', name: 'testId', type: 'string' },
  ],
  tokens: [
    '--wds-text-primary',
    '--wds-text-secondary',
    '--wds-icons-secondary',
    '--wds-sz-empty-state-gap',
    '--wds-sz-empty-state-text-gap',
    '--wds-sz-empty-state-actions-gap',
    '--wds-sz-empty-state-illustration-size',
  ].map((name) => ({ name })),
};
