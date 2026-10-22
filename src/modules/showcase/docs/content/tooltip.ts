import { icon, type ComponentDoc } from '../types';
import { TooltipDemo } from './feedbackDemos';

const PLACEMENTS = ['top', 'bottom', 'left', 'right'];

export const tooltipDoc: ComponentDoc = {
  slug: 'tooltip',
  name: 'Tooltip',
  category: 'feedback',
  importStatement: "import { Tooltip } from 'shared/components/ui';",
  figmaUrl: 'https://www.figma.com/design/ThLaTINM5dmzPW4AsB8dnF/?node-id=9930-14944',
  component: TooltipDemo,
  codeName: 'Tooltip',
  codeChildren: '<Button>Hover me</Button>',
  defaults: { placement: 'top' },
  baseProps: { content: 'Helpful contextual information.', placement: 'top' },
  controls: [
    { prop: 'size', kind: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    { prop: 'content', kind: 'text' },
    { prop: 'placement', kind: 'select', options: PLACEMENTS },
    { prop: 'leading', kind: 'icon', options: ['InfoCircle', 'QuestionCircle', 'CheckCircle'] },
  ],
  figmaMapping: [
    { id: 'text', figma: 'Text (TEXT)', values: 'free text', prop: 'content' },
    { id: 'position', figma: 'Position (variant)', values: 'Bottom, Top, Left, Right', prop: 'placement' },
    { id: 'leading', figma: 'Show leading · Leading (slot)', values: 'boolean + icon', prop: 'leading' },
    { id: 'styles', figma: 'Tooltip styles (mode)', values: 'default', prop: '— (CSS)' },
  ],
  examples: [
    { id: 'placements', variants: PLACEMENTS.map((p) => ({ label: p, props: { placement: p } })) },
    { id: 'leading', variants: [{ label: 'leading', props: { leading: icon('InfoCircle') } }] },
  ],
  props: [
    { id: 'size', name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'" },
    { id: 'content', name: 'content', type: 'ReactNode' },
    { id: 'placement', name: 'placement', type: "'top' | 'bottom' | 'left' | 'right'", default: "'top'" },
    { id: 'leading', name: 'leading', type: 'ReactNode' },
    { id: 'maxWidth', name: 'maxWidth · minWidth', type: 'number', default: '300 / —' },
    { id: 'open', name: 'open', type: 'boolean' },
    { id: 'className', name: 'className', type: 'string' },
    { id: 'testId', name: 'testId', type: 'string' },
  ],
  tokens: [
    '--wds-bg-brand',
    '--wds-text-on-brand',
    '--wds-sz-tooltip-padding-left',
    '--wds-sz-tooltip-padding-top',
    '--wds-sz-tooltip-radius',
    '--wds-sz-tooltip-gap',
    '--wds-sz-tooltip-arrow-size',
    '--wds-sz-text-body-font-size',
  ].map((name) => ({ name })),
};
