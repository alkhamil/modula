import { fn, raw, type ComponentDoc } from '../types';
import { BannerDemo } from './layoutDemos';

const VARIANTS = ['info', 'success', 'warning', 'danger', 'default'];

export const bannerDoc: ComponentDoc = {
  slug: 'banner',
  name: 'Banner',
  category: 'feedback',
  importStatement: "import { Banner } from 'shared/components/ui';",
  figmaUrl: 'https://www.figma.com/design/ThLaTINM5dmzPW4AsB8dnF/?node-id=9928-6721',
  component: BannerDemo,
  codeName: 'Banner',
  defaults: { variant: 'info' },
  baseProps: { variant: 'info', message: 'A new version is available.' },
  controls: [
    { prop: 'variant', kind: 'select', options: VARIANTS },
    { prop: 'size', kind: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    { prop: 'title', kind: 'text' },
    { prop: 'message', kind: 'text' },
  ],
  figmaMapping: [
    { id: 'styles', figma: 'Banner styles (mode)', values: VARIANTS.join(', '), prop: 'variant' },
    { id: 'content', figma: 'Title · supporting text', values: 'free text', prop: 'title · message' },
    { id: 'actions', figma: 'Action-1 · Action-2 · Close', values: 'buttons, icon', prop: 'action · secondaryAction · onClose' },
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
