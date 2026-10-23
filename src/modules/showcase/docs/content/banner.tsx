import { fn, raw, type ComponentDoc } from '../types';
import { BannerDemo } from './layoutDemos';

const VARIANTS = ['info', 'success', 'warning', 'danger', 'default'];

const ACTION = raw("{ label: 'Button CTA', onClick }", { label: 'Button CTA' });
const SECONDARY = raw("{ label: 'Secondary', onClick }", { label: 'Secondary' });

export const bannerDoc: ComponentDoc = {
  slug: 'banner',
  name: 'Banner',
  category: 'feedback',
  importStatement: "import { Banner } from 'shared/components/ui';",
  figmaUrl: 'https://www.figma.com/design/ThLaTINM5dmzPW4AsB8dnF/?node-id=9928-6721',
  component: BannerDemo,
  codeName: 'Banner',
  defaults: { variant: 'info' },
  baseProps: {
    variant: 'info',
    title: 'Banner title',
    message: 'Brief description providing additional context about this message.',
    action: ACTION,
    onClose: fn('handleClose'),
  },
  controls: [
    { prop: 'variant', kind: 'select', label: 'Banner style', options: VARIANTS },
    { prop: 'size', kind: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    { prop: 'message', kind: 'text', label: 'Banner text' },
    { prop: 'title', kind: 'text', label: 'Title' },
    { prop: 'title', kind: 'toggle', label: 'Show title', onValue: 'Banner title' },
    { prop: 'icon', kind: 'toggle', label: 'Show icon', onValue: undefined, offValue: raw('false', false) },
    { prop: 'action', kind: 'toggle', label: 'Action-1', onValue: ACTION },
    { prop: 'secondaryAction', kind: 'toggle', label: 'Action-2', onValue: SECONDARY },
    { prop: 'onClose', kind: 'toggle', label: 'Close', onValue: fn('handleClose') },
  ],
  figmaMapping: [
    { id: 'text', figma: 'Banner text (TEXT)', values: 'free text', prop: 'message' },
    { id: 'title', figma: 'Title (TEXT)', values: 'free text', prop: 'title' },
    { id: 'showTitle', figma: 'Show title (BOOLEAN)', values: 'true, false', prop: 'title (empty = hidden)' },
    { id: 'showIcon', figma: 'Show Icon (BOOLEAN)', values: 'true, false', prop: 'icon={false}' },
    { id: 'action1', figma: 'Action-1 (BOOLEAN)', values: 'true, false', prop: 'action' },
    { id: 'action2', figma: 'Action-2 (BOOLEAN)', values: 'true, false', prop: 'secondaryAction' },
    { id: 'close', figma: 'Close (BOOLEAN)', values: 'true, false', prop: 'onClose' },
    { id: 'styles', figma: 'Banner style (mode)', values: VARIANTS.join(', '), prop: 'variant' },
    { id: 'size', figma: 'Size Modes', values: 'xs, sm, md, lg, xl', prop: 'size' },
  ],
  examples: [
    { id: 'styles', variants: VARIANTS.map((v) => ({ label: v, props: { variant: v } })) },
    {
      id: 'actions',
      variants: [
        {
          label: 'action + close',
          props: { title: 'Update', action: raw("{ label: 'Refresh', onClick }", { label: 'Refresh' }), onClose: fn('handleClose') },
        },
      ],
    },
  ],
  props: [
    { id: 'variant', name: 'variant', type: "'info' | 'success' | 'warning' | 'danger' | 'default'", default: "'info'" },
    { id: 'message', name: 'title · message', type: 'ReactNode' },
    { id: 'action', name: 'action · secondaryAction', type: '{ label: string; onClick?: () => void }' },
    { id: 'size', name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'" },
    { id: 'onClose', name: 'onClose', type: '() => void' },
    { id: 'icon', name: 'icon', type: 'ReactNode' },
    { id: 'testId', name: 'testId', type: 'string' },
  ],
  tokens: [
    '--wds-bg-info-subtle',
    '--wds-stroke-info-subtle',
    '--wds-icons-info',
    '--wds-bg-brand',
    '--wds-text-primary',
    '--wds-text-secondary',
    '--wds-sz-banner-padding-top',
    '--wds-sz-banner-gap',
  ].map((name) => ({ name })),
};
