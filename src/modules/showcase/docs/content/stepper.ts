import type { ComponentDoc } from '../types';
import { StepperDemo } from './layoutDemos';

export const stepperDoc: ComponentDoc = {
  slug: 'stepper',
  name: 'Stepper',
  category: 'navigation',
  importStatement: "import { Stepper } from 'shared/components/ui';",
  figmaUrl: 'https://www.figma.com/design/ThLaTINM5dmzPW4AsB8dnF/?node-id=9930-13644',
  component: StepperDemo,
  codeName: 'Stepper',
  codeExtra: ['steps={steps}'],
  defaults: { orientation: 'horizontal' },
  baseProps: { current: 1, orientation: 'horizontal' },
  controls: [
    { prop: 'current', kind: 'text' },
    { prop: 'orientation', kind: 'select', options: ['horizontal', 'vertical'] },
    { prop: 'size', kind: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
  ],
  figmaMapping: [
    { id: 'states', figma: 'Step states', values: 'upcoming, current, completed, error', prop: 'current · steps[].status' },
    { id: 'text', figma: 'Label · title · supporting text', values: 'free text', prop: 'steps[].label · title · description' },
    { id: 'badge', figma: 'Show badge', values: 'boolean + badge', prop: 'steps[].badge' },
    { id: 'size', figma: 'Size Modes', values: 'xs, sm, md, lg, xl', prop: 'size' },
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
    { id: 'steps', name: 'steps', type: 'StepItem[] ({ title, label?, description?, badge?, status? })' },
    { id: 'current', name: 'current', type: 'number (0-based)' },
    { id: 'size', name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'" },
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
