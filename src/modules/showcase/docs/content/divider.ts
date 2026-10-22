import type { ComponentDoc } from '../types';
import { DividerDemo } from './layoutDemos';

export const dividerDoc: ComponentDoc = {
  slug: 'divider',
  name: 'Divider',
  category: 'layout',
  importStatement: "import { Divider } from 'shared/components/ui';",
  figmaUrl: 'https://www.figma.com/design/ThLaTINM5dmzPW4AsB8dnF/?node-id=9928-9752',
  component: DividerDemo,
  codeName: 'Divider',
  defaults: { orientation: 'horizontal', appearance: 'subtle' },
  baseProps: { orientation: 'horizontal', appearance: 'subtle' },
  controls: [
    { prop: 'orientation', kind: 'select', options: ['horizontal', 'vertical'] },
    { prop: 'appearance', kind: 'select', options: ['subtle', 'default', 'strong'] },
  ],
  figmaMapping: [
    { id: 'styles', figma: 'Divider styles (mode)', values: 'subtle, default, strong', prop: 'appearance' },
    { id: 'thickness', figma: 'Thickness (Size)', values: 'stroke 1', prop: '— (CSS)' },
  ],
  examples: [
    {
      id: 'styles',
      variants: ['subtle', 'default', 'strong'].map((a) => ({ label: a, props: { appearance: a } })),
    },
  ],
  props: [
    { id: 'orientation', name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'" },
    { id: 'appearance', name: 'appearance', type: "'subtle' | 'default' | 'strong'", default: "'subtle'" },
    { id: 'testId', name: 'testId', type: 'string' },
  ],
  tokens: ['--wds-stroke-subtle', '--wds-stroke-default', '--wds-stroke-strong', '--wds-sz-divider-thickness'].map(
    (name) => ({ name }),
  ),
};
