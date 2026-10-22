import type { ComponentDoc } from '../types';
import { StepperDemo } from './layoutDemos';

export const stepperDoc: ComponentDoc = {
  slug: 'stepper',
  name: 'Stepper',
  category: 'navigation',
  importStatement: "import { Stepper } from 'shared/components/ui';",
  component: StepperDemo,
  codeName: 'Stepper',
  codeExtra: ['steps={steps}'],
  defaults: { orientation: 'horizontal' },
  baseProps: { current: 1, orientation: 'horizontal' },
  controls: [
    { prop: 'current', kind: 'text' },
    { prop: 'orientation', kind: 'select', options: ['horizontal', 'vertical'] },
  ],
  figmaMapping: [
    { id: 'states', figma: 'Step states', values: 'upcoming, current, completed, error', prop: 'current · steps[].status' },
    { id: 'text', figma: 'Title · supporting text', values: 'free text', prop: 'steps[].title · description' },
  ],
  examples: [
    {
      id: 'orientation',
      variants: [
        { label: 'horizontal', props: { orientation: 'horizontal' } },
        { label: 'vertical', props: { orientation: 'vertical' } },
      ],
    },
  ],
  props: [
    { id: 'steps', name: 'steps', type: 'StepItem[] ({ title, description?, status? })' },
    { id: 'current', name: 'current', type: 'number (0-based)' },
    { id: 'orientation', name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'" },
    { id: 'testId', name: 'testId', type: 'string' },
  ],
  tokens: [
    '--wds-bg-brand',
    '--wds-bg-success',
    '--wds-bg-danger',
    '--wds-stroke-subtle',
    '--wds-text-inverse',
    '--wds-sz-stepper-indicator-size',
    '--wds-sz-stepper-connector-thickness',
    '--wds-sz-stepper-gap',
  ].map((name) => ({ name })),
};
