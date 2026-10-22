import { Button } from '../../../../shared/components/ui';
import { raw, type ComponentDoc } from '../types';
import { DrawerDemo } from './feedbackDemos';

const FOOTER = raw(
  `<>
  <Button hierarchy="secondary">Cancel</Button>
  <Button>Save</Button>
</>`,
  <>
    <Button hierarchy="secondary">Cancel</Button>
    <Button>Save</Button>
  </>,
);

export const drawerDoc: ComponentDoc = {
  slug: 'drawer',
  name: 'Drawer',
  category: 'feedback',
  importStatement: "import { Drawer } from 'shared/components/ui';",
  figmaUrl: 'https://www.figma.com/design/ThLaTINM5dmzPW4AsB8dnF/?node-id=9928-9816',
  component: DrawerDemo,
  codeName: 'Drawer',
  codeExtra: ['open={open}', 'onClose={() => setOpen(false)}'],
  defaults: { width: 'md', modal: true },
  baseProps: { title: 'Edit details', width: 'md', modal: true, footer: FOOTER },
  baseChildren: 'Drawer content goes here.',
  controls: [
    { prop: 'title', kind: 'text' },
    { prop: 'width', kind: 'select', options: ['sm', 'md', 'lg'] },
    { prop: 'modal', kind: 'boolean' },
  ],
  figmaMapping: [
    { id: 'title', figma: 'Title (TEXT)', values: 'free text', prop: 'title' },
    { id: 'styles', figma: 'Drawer styles (mode)', values: 'default', prop: '— (CSS)' },
    { id: 'gap', figma: 'Section gap (Size)', values: 'spacing 4–10', prop: '— (CSS)' },
  ],
  examples: [],
  props: [
    { id: 'open', name: 'open · onClose', type: 'boolean · () => void' },
    { id: 'title', name: 'title', type: 'string' },
    { id: 'children', name: 'children', type: 'ReactNode' },
    { id: 'footer', name: 'footer', type: 'ReactNode' },
    { id: 'width', name: 'width', type: "'sm' | 'md' | 'lg'", default: "'md'" },
    { id: 'modal', name: 'modal', type: 'boolean', default: 'true' },
    { id: 'dismiss', name: 'closeOnBackdropClick · closeOnEscape', type: 'boolean', default: 'true' },
    { id: 'testId', name: 'testId', type: 'string' },
  ],
  tokens: [
    '--wds-bg-elevated',
    '--wds-text-primary',
    '--wds-icons-primary',
    '--wds-stroke-subtle',
    '--wds-sz-drawer-section-gap',
    '--wds-sz-dialog-header-padding-top',
    '--wds-sz-dialog-actions-gap',
  ].map((name) => ({ name })),
};
