import type { ComponentDoc } from '../types';
import { SegmentedControlDemo } from './layoutDemos';

export const segmentedControlDoc: ComponentDoc = {
  slug: 'segmented-control',
  name: 'SegmentedControl',
  category: 'forms',
  importStatement: "import { SegmentedControl } from 'shared/components/ui';",
  figmaUrl: 'https://www.figma.com/design/ThLaTINM5dmzPW4AsB8dnF/?node-id=9930-13059',
  component: SegmentedControlDemo,
  codeName: 'SegmentedControl',
  codeExtra: ['options={options}', 'value={value}', 'onChange={setValue}'],
  baseProps: {},
  controls: [{ prop: 'fullWidth', kind: 'boolean' }],
  figmaMapping: [
    { id: 'styles', figma: 'Segmented control styles (mode)', values: 'default', prop: '— (CSS)' },
    { id: 'items', figma: 'Segments', values: 'label · icon', prop: 'options' },
  ],
  examples: [],
  props: [
    { id: 'options', name: 'options', type: 'SegmentedOption[] ({ value, label, icon?, disabled? })' },
    { id: 'value', name: 'value · onChange', type: 'string · (value: string) => void' },
    { id: 'fullWidth', name: 'fullWidth', type: 'boolean', default: 'false' },
    { id: 'testId', name: 'testId', type: 'string' },
  ],
  tokens: [
    '--wds-bg-subtle-2',
    '--wds-bg-elevated',
    '--wds-text-tertiary',
    '--wds-text-primary',
    '--wds-sz-segmented-control-root-padding-top',
    '--wds-sz-segmented-control-root-radius',
  ].map((name) => ({ name })),
};
