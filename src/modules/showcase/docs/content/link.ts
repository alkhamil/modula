import { icon, type ComponentDoc } from '../types';
import { LinkDemo } from './layoutDemos';

export const linkDoc: ComponentDoc = {
  slug: 'link',
  name: 'Link',
  category: 'navigation',
  importStatement: "import { Link } from 'shared/components/ui';",
  figmaUrl: 'https://www.figma.com/design/ThLaTINM5dmzPW4AsB8dnF/?node-id=10050-1041',
  component: LinkDemo,
  codeName: 'Link',
  codeExtra: ['href="/docs"'],
  baseProps: { appearance: 'default' },
  baseChildren: 'Read the docs',
  controls: [
    { prop: 'size', kind: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    { prop: 'appearance', kind: 'select', options: ['default', 'underline'] },
    { prop: 'disabled', kind: 'boolean' },
    { prop: 'leadingIcon', kind: 'icon', options: ['InfoCircle', 'Download'] },
    { prop: 'trailingIcon', kind: 'icon', options: ['AltArrowRight', 'Download'] },
  ],
  figmaMapping: [
    { id: 'styles', figma: 'Link styles (mode)', values: 'default, underline', prop: 'appearance' },
    { id: 'states', figma: 'Link states', values: 'default, pressed, disabled, hover, focused', prop: 'disabled · interaction' },
    { id: 'icons', figma: 'Leading / trailing icon', values: 'icon', prop: 'leadingIcon · trailingIcon' },
  ],
  examples: [
    {
      id: 'styles',
      variants: [
        { label: 'default', props: { appearance: 'default' } },
        { label: 'underline', props: { appearance: 'underline' } },
        { label: 'icon', props: { trailingIcon: icon('AltArrowRight') } },
        { label: 'disabled', props: { disabled: true } },
      ],
    },
  ],
  props: [
    { id: 'size', name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'" },
    { id: 'appearance', name: 'appearance', type: "'default' | 'underline'", default: "'default'" },
    { id: 'disabled', name: 'disabled', type: 'boolean', default: 'false' },
    { id: 'icons', name: 'leadingIcon · trailingIcon', type: 'ReactNode' },
    { id: 'anchor', name: '…anchor attributes', type: 'AnchorHTMLAttributes' },
    { id: 'testId', name: 'testId', type: 'string' },
  ],
  tokens: [
    '--wds-text-link',
    '--wds-text-link-pressed',
    '--wds-text-disabled',
    '--wds-icons-link',
    '--wds-icons-link-pressed',
    '--wds-sz-link-gap',
    '--wds-sz-link-icon-size',
  ].map((name) => ({ name })),
};
