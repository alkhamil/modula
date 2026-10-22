import type { ComponentDoc } from '../types';
import { SliderDemo } from './layoutDemos';

export const sliderDoc: ComponentDoc = {
  slug: 'slider',
  name: 'Slider',
  category: 'forms',
  importStatement: "import { Slider } from 'shared/components/ui';",
  figmaUrl: 'https://www.figma.com/design/ThLaTINM5dmzPW4AsB8dnF/?node-id=9930-13523',
  component: SliderDemo,
  codeName: 'Slider',
  codeExtra: ['value={value}', 'onChange={setValue}'],
  baseProps: {},
  controls: [{ prop: 'disabled', kind: 'boolean' }],
  figmaMapping: [
    { id: 'states', figma: 'Slider states', values: 'default, pressed, disabled', prop: 'disabled · interaction' },
    { id: 'range', figma: 'Min · max · step', values: 'numbers', prop: 'min · max · step' },
  ],
  examples: [],
  props: [
    { id: 'value', name: 'value · onChange', type: 'number · (value: number) => void' },
    { id: 'range', name: 'min · max · step', type: 'number', default: '0 · 100 · 1' },
    { id: 'disabled', name: 'disabled', type: 'boolean', default: 'false' },
    { id: 'testId', name: 'testId', type: 'string' },
  ],
  tokens: [
    '--wds-bg-subtle-3',
    '--wds-bg-brand',
    '--wds-bg-brand-pressed',
    '--wds-stroke-brand',
    '--wds-sz-slider-track-height',
    '--wds-sz-slider-thumb-size',
  ].map((name) => ({ name })),
};
