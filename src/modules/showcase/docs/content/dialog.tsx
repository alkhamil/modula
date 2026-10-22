import { Button } from '../../../../shared/components/ui';
import { icon, raw, type ComponentDoc } from '../types';
import { DialogDemo } from './feedbackDemos';

const FOOTER = raw(
  `<>
  <Button hierarchy="secondary">Cancel</Button>
  <Button>Confirm</Button>
</>`,
  <>
    <Button hierarchy="secondary">Cancel</Button>
    <Button>Confirm</Button>
  </>,
);

export const dialogDoc: ComponentDoc = {
  slug: 'dialog',
  name: 'Dialog',
  category: 'feedback',
  importStatement: "import { Dialog } from 'shared/components/ui';",
  figmaUrl: 'https://www.figma.com/design/ThLaTINM5dmzPW4AsB8dnF/?node-id=9928-11741',
  component: DialogDemo,
  codeName: 'Dialog',
  codeExtra: ['open={open}', 'onClose={() => setOpen(false)}'],
  baseProps: {
    title: 'Delete record?',
    description: 'This action cannot be undone.',
    footer: FOOTER,
  },
  controls: [
    { prop: 'title', kind: 'text' },
    { prop: 'description', kind: 'text' },
    { prop: 'icon', kind: 'icon', options: ['InfoCircle', 'DangerTriangle', 'CheckCircle'] },
    { prop: 'hideCloseButton', kind: 'boolean' },
    { prop: 'disableCloseButton', kind: 'boolean' },
  ],
  figmaMapping: [
    { id: 'title', figma: 'Title (TEXT)', values: 'free text', prop: 'title' },
    { id: 'supporting', figma: 'Supporting text (TEXT)', values: 'free text', prop: 'description' },
    { id: 'styles', figma: 'Dialog styles (mode)', values: 'default, icon', prop: 'icon' },
    { id: 'types', figma: 'Dialog types (mode)', values: 'alert, confirm', prop: 'footer' },
    { id: 'size', figma: 'Size (mode)', values: 'xs, sm, md, lg, xl', prop: 'size' },
  ],
  examples: [
    {
      id: 'icon',
      variants: [{ label: 'icon', props: { icon: icon('InfoCircle') } }],
    },
    {
      id: 'types',
      variants: [
        {
          label: 'alert',
          props: { footer: raw('<Button>OK</Button>', <Button>OK</Button>) },
        },
        { label: 'confirm', props: {} },
      ],
    },
  ],
  props: [
    { id: 'open', name: 'open · onClose', type: 'boolean · () => void' },
    { id: 'title', name: 'title', type: 'string' },
    { id: 'description', name: 'description', type: 'ReactNode' },
    { id: 'icon', name: 'icon', type: 'ReactNode' },
    { id: 'children', name: 'children', type: 'ReactNode' },
    { id: 'footer', name: 'footer', type: 'ReactNode' },
    { id: 'maxWidth', name: 'maxWidth', type: "'sm' | 'md' | 'lg' | 'xl' | '2xl'", default: "'md'" },
    { id: 'size', name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'" },
    { id: 'close', name: 'hideCloseButton · disableCloseButton', type: 'boolean', default: 'false' },
    { id: 'dismiss', name: 'closeOnBackdropClick · closeOnEscape', type: 'boolean', default: 'true' },
    { id: 'testId', name: 'testId', type: 'string' },
  ],
  tokens: [
    '--wds-bg-elevated',
    '--wds-text-primary',
    '--wds-text-secondary',
    '--wds-icons-primary',
    '--wds-stroke-subtle',
    '--wds-radius-12',
    '--wds-sz-dialog-header-padding-top',
    '--wds-sz-dialog-heading-and-optional-visual-gap',
    '--wds-sz-dialog-text-gap',
    '--wds-sz-dialog-icon-size',
    '--wds-sz-dialog-actions-gap',
    '--wds-sz-dialog-footer-actions-padding-top',
  ].map((name) => ({ name })),
};
