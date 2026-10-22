import type { ComponentDoc } from '../types';
import { ProgressDemo } from './layoutDemos';

export const progressDoc: ComponentDoc = {
  slug: 'progress',
  name: 'Progress',
  category: 'feedback',
  importStatement: "import { Progress } from 'shared/components/ui';",
  figmaUrl: 'https://www.figma.com/design/ThLaTINM5dmzPW4AsB8dnF/?node-id=9930-754',
  component: ProgressDemo,
  codeName: 'Progress',
  defaults: { appearance: 'default', showLabel: false },
  baseProps: { value: 60, appearance: 'default', 'aria-label': 'Upload progress' },
  controls: [
    { prop: 'value', kind: 'text' },
    { prop: 'appearance', kind: 'select', options: ['default', 'success', 'danger'] },
    { prop: 'showLabel', kind: 'boolean' },
  ],
  figmaMapping: [
    { id: 'styles', figma: 'Progress styles (mode)', values: 'default, success, danger', prop: 'appearance' },
    { id: 'label', figma: 'Label (visible)', values: 'boolean', prop: 'showLabel' },
  ],
  examples: [
    {
      id: 'styles',
      variants: [
        { label: 'default', props: { value: 40, showLabel: true } },
        { label: 'success', props: { value: 100, appearance: 'success', showLabel: true } },
        { label: 'danger', props: { value: 25, appearance: 'danger', showLabel: true } },
      ],
    },
  ],
  props: [
    { id: 'value', name: 'value', type: 'number (0–100)' },
    { id: 'appearance', name: 'appearance', type: "'default' | 'success' | 'danger'", default: "'default'" },
    { id: 'showLabel', name: 'showLabel', type: 'boolean', default: 'false' },
    { id: 'aria-label', name: 'aria-label', type: 'string' },
    { id: 'testId', name: 'testId', type: 'string' },
  ],
  tokens: [
    '--wds-bg-subtle',
    '--wds-bg-brand',
    '--wds-bg-success',
    '--wds-bg-danger',
    '--wds-text-primary',
    '--wds-sz-progress-linear-height',
    '--wds-sz-progress-gap',
  ].map((name) => ({ name })),
};
