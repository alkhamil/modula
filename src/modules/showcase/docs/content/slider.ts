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
  controls: [
    { prop: 'range', kind: 'boolean' },
    { prop: 'size', kind: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    { prop: 'disabled', kind: 'boolean' },
  ],
  figmaMapping: [
    { id: 'states', figma: 'Slider states', values: 'default, pressed, disabled', prop: 'disabled · interaction' },
    { id: 'range', figma: 'Range (boolean)', values: 'single, range', prop: 'range' },
    { id: 'size', figma: 'Size Modes', values: 'xs, sm, md, lg, xl', prop: 'size' },
  ],
  examples: [],
  props: [
    { id: 'value', name: 'value · onChange', type: 'number · (value: number) => void ([number, number] when range)' },
    { id: 'rangeProp', name: 'range', type: 'boolean', default: 'false' },
    { id: 'size', name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'" },
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
