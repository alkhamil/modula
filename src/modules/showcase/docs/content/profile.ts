import type { ComponentDoc } from '../types';
import { ProfileDemo } from './layoutDemos';

export const profileDoc: ComponentDoc = {
  slug: 'profile',
  name: 'Profile',
  category: 'layout',
  importStatement: "import { Profile } from 'shared/components/layout';",
  figmaUrl: 'https://www.figma.com/design/ThLaTINM5dmzPW4AsB8dnF/?node-id=11287-683',
  component: ProfileDemo,
  codeName: 'Profile',
  codeExtra: ["user={{ name: 'Ayu Lestari', roleName: 'Admin' }}", 'onLogout={logout}'],
  defaults: { showAvatar: true },
  baseProps: { showAvatar: true },
  controls: [{ prop: 'showAvatar', kind: 'boolean' }],
  figmaMapping: [
    { id: 'states', figma: 'Profile states', values: 'default, hover, active', prop: '— (interaction)' },
    { id: 'user', figma: 'Avatar · title · supporting text', values: 'user', prop: 'user' },
    { id: 'avatar', figma: 'Avatar (instance, optional)', values: 'boolean', prop: 'showAvatar' },
  ],
  examples: [],
  props: [
    { id: 'user', name: 'user', type: '{ name: string; roleName?: string } | null' },
    { id: 'showAvatar', name: 'showAvatar', type: 'boolean', default: 'true' },
    { id: 'onLogout', name: 'onLogout', type: '() => void' },
    { id: 'settings', name: 'settingsPath · settingsLabel · logoutLabel', type: 'string' },
    { id: 'testId', name: 'testId', type: 'string' },
  ],
  tokens: [
    '--wds-bg-brand-subtle',
    '--wds-text-primary',
    '--wds-text-secondary',
    '--wds-icons-tertiary',
    '--wds-bg-elevated',
    '--wds-stroke-subtle',
    '--wds-sz-profile-padding-top',
    '--wds-sz-profile-padding-left',
    '--wds-sz-profile-gap',
  ].map((name) => ({ name })),
};
