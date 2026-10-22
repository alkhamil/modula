import type { ComponentDoc } from '../types';
import { RatingDemo } from './layoutDemos';

export const ratingDoc: ComponentDoc = {
  slug: 'rating',
  name: 'Rating',
  category: 'forms',
  importStatement: "import { Rating } from 'shared/components/ui';",
  figmaUrl: 'https://www.figma.com/design/ThLaTINM5dmzPW4AsB8dnF/?node-id=9930-12705',
  component: RatingDemo,
  codeName: 'Rating',
  codeExtra: ['value={value}', 'onChange={setValue}'],
  codeOmit: ['interactive'],
  baseProps: { interactive: true },
  controls: [{ prop: 'interactive', kind: 'boolean' }],
  figmaMapping: [
    { id: 'styles', figma: 'Rating styles (mode)', values: 'default', prop: '— (CSS)' },
    { id: 'size', figma: 'Star size · gap', values: 'Size tokens', prop: '— (CSS)' },
  ],
  examples: [],
  props: [
    { id: 'value', name: 'value', type: 'number' },
    { id: 'onChange', name: 'onChange', type: '(value: number) => void' },
    { id: 'max', name: 'max', type: 'number', default: '5' },
    { id: 'testId', name: 'testId', type: 'string' },
  ],
  tokens: ['--wds-icons-warning', '--wds-icons-disabled', '--wds-sz-rating-star-size', '--wds-sz-rating-gap'].map(
    (name) => ({ name }),
  ),
};
