import type { ComponentDoc } from '../types';
import { AvatarDemo } from './layoutDemos';

const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'];

export const avatarDoc: ComponentDoc = {
  slug: 'avatar',
  name: 'Avatar',
  category: 'layout',
  importStatement: "import { Avatar } from 'shared/components/ui';",
  figmaUrl: 'https://www.figma.com/design/ThLaTINM5dmzPW4AsB8dnF/?node-id=9928-6417',
  component: AvatarDemo,
  codeName: 'Avatar',
  defaults: { size: 'md', appearance: 'default' },
  codeOmit: ['type'],
  baseProps: { name: 'Olivia Rhye', type: 'initials', size: 'md', appearance: 'default', online: true },
  controls: [
    { prop: 'type', kind: 'select', options: ['photo', 'initials', 'icon'] },
    { prop: 'name', kind: 'text' },
    { prop: 'size', kind: 'select', options: SIZES },
    { prop: 'appearance', kind: 'select', options: ['default', 'rounded'] },
    { prop: 'online', kind: 'boolean' },
  ],
  figmaMapping: [
    { id: 'type', figma: 'Type (variant)', values: 'Photo, Initials, Icons', prop: 'src · name · icon (or type)' },
    { id: 'online', figma: 'Online indicator (BOOLEAN)', values: 'boolean', prop: 'online' },
    { id: 'styles', figma: 'Avatar style (mode)', values: 'default, rounded', prop: 'appearance' },
    { id: 'size', figma: 'Size Modes', values: 'xs, sm, md, lg, xl', prop: 'size' },
  ],
  examples: [
    { id: 'sizes', variants: SIZES.map((s) => ({ label: s, props: { size: s, name: 'Ayu' } })) },
    {
      id: 'styles',
      variants: [
        { label: 'default', props: { name: 'Ayu', online: true } },
        { label: 'rounded', props: { name: 'Ayu', appearance: 'rounded', online: true } },
      ],
    },
  ],
  props: [
    { id: 'name', name: 'name', type: 'string' },
    { id: 'src', name: 'src · icon', type: 'string · ReactNode' },
    { id: 'type', name: 'type', type: "'photo' | 'initials' | 'icon'" },
    { id: 'size', name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'" },
    { id: 'appearance', name: 'appearance', type: "'default' | 'rounded'", default: "'default'" },
    { id: 'online', name: 'online', type: 'boolean', default: 'false' },
    { id: 'testId', name: 'testId', type: 'string' },
  ],
  tokens: [
    '--wds-bg-brand-subtle',
    '--wds-text-brand',
    '--wds-icons-brand',
    '--wds-icons-success',
    '--wds-icons-inverse',
    '--wds-sz-avatar-online-indicator',
    '--wds-sz-avatar-online-indicator-stroke',
  ].map((name) => ({ name })),
};
