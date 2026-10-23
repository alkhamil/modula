import { fn, raw, type ComponentDoc } from '../types';
import { AlertDemo } from './feedbackDemos';

const STYLES = ['info', 'success', 'warning', 'danger'];
const APPEARANCES = ['basic', 'solid', 'light', 'left-stroke'];

export const alertDoc: ComponentDoc = {
  slug: 'alert',
  name: 'Alert',
  category: 'feedback',
  importStatement: "import { Alert } from 'shared/components/ui';",
  figmaUrl: 'https://www.figma.com/design/ThLaTINM5dmzPW4AsB8dnF/?node-id=9928-6148',
  component: AlertDemo,
  codeName: 'Alert',
  defaults: { appearance: 'light' },
  baseProps: { variant: 'info', appearance: 'light', message: 'This is the alert text' },
  controls: [
    { prop: 'size', kind: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    { prop: 'variant', kind: 'select', options: STYLES },
    { prop: 'appearance', kind: 'select', options: APPEARANCES },
    { prop: 'title', kind: 'text' },
    { prop: 'message', kind: 'text' },
  ],
  figmaMapping: [
    { id: 'message', figma: 'Alert text (TEXT)', values: 'free text', prop: 'message' },
    { id: 'title', figma: 'Title (TEXT) · Show title (BOOLEAN)', values: 'text + boolean', prop: 'title' },
    { id: 'styles', figma: 'Alert style (mode)', values: STYLES.join(', '), prop: 'variant' },
    { id: 'variant', figma: 'Alert variant (mode)', values: APPEARANCES.join(', '), prop: 'appearance' },
    { id: 'types', figma: 'Alert type (mode)', values: 'default, action, close', prop: 'action · onClose' },
    { id: 'size', figma: 'Size Modes', values: 'xs, sm, md, lg, xl', prop: 'size' },
  ],
  examples: [
    { id: 'styles', variants: STYLES.map((v) => ({ label: v, props: { variant: v } })) },
    { id: 'appearances', variants: APPEARANCES.map((a) => ({ label: a, props: { appearance: a } })) },
    { id: 'title', variants: [{ label: 'title', props: { title: 'Alert title', variant: 'success' } }] },
    {
      id: 'actions',
      variants: [
        { label: 'action', props: { action: raw("{ label: 'Undo', onClick }", { label: 'Undo' }), variant: 'warning' } },
        { label: 'close', props: { onClose: fn('handleClose'), variant: 'danger' } },
      ],
    },
  ],
  props: [
    { id: 'size', name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'" },
    { id: 'variant', name: 'variant', type: "'info' | 'success' | 'warning' | 'danger'" },
    { id: 'legacy', name: 'variant (lama)', type: "'error'" },
    { id: 'message', name: 'message', type: 'ReactNode' },
    { id: 'title', name: 'title', type: 'ReactNode' },
    { id: 'appearance', name: 'appearance', type: "'basic' | 'solid' | 'light' | 'left-stroke'", default: "'light'" },
    { id: 'action', name: 'action', type: '{ label: string; onClick?: () => void }' },
    { id: 'onClose', name: 'onClose', type: '() => void' },
    { id: 'testId', name: 'testId', type: 'string' },
  ],
  tokens: [
    '--wds-bg-info-subtle',
    '--wds-bg-info',
    '--wds-bg-surface',
    '--wds-stroke-info-subtle',
    '--wds-stroke-info',
    '--wds-icons-info',
    '--wds-text-primary',
    '--wds-text-secondary',
    '--wds-text-inverse',
    '--wds-text-info',
    '--wds-icons-secondary',
    '--wds-radius-8',
  ].map((name) => ({ name })),
};
