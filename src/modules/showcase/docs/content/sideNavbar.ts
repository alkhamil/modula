import type { ComponentDoc } from '../types';
import { SideNavbarDemo } from './layoutDemos';

export const sideNavbarDoc: ComponentDoc = {
  slug: 'side-navbar',
  name: 'SideNavbar',
  category: 'layout',
  importStatement: "import { SideNavbar } from 'shared/components/layout';",
  component: SideNavbarDemo,
  codeName: 'SideNavbar',
  codeExtra: ['items={navItems}', 'collapsed={collapsed}', 'onToggle={toggle}', 'mobileOpen={false}', 'onMobileClose={close}'],
  baseProps: { appName: 'Modula' },
  controls: [
    { prop: 'appName', kind: 'text' },
    { prop: 'collapsed', kind: 'boolean' },
  ],
  figmaMapping: [
    { id: 'styles', figma: 'Side navbar styles (mode)', values: 'default', prop: '— (CSS)' },
    { id: 'navItem', figma: 'Nav item states', values: 'default, hover, focused, current', prop: '— (route + interaction)' },
    { id: 'logo', figma: 'Logo', values: 'node', prop: 'logo · appName' },
  ],
  examples: [],
  props: [
    { id: 'items', name: 'items · permissions', type: 'NavItemType[] · string[]' },
    { id: 'collapsed', name: 'collapsed · onToggle', type: 'boolean · () => void' },
    { id: 'mobile', name: 'mobileOpen · onMobileClose', type: 'boolean · () => void' },
    { id: 'logo', name: 'logo · appName', type: 'ReactNode · string' },
    { id: 'testId', name: 'testId', type: 'string' },
  ],
  tokens: [
    '--wds-bg-brand-pressed',
    '--wds-bg-brand',
    '--wds-text-on-brand',
    '--wds-icons-on-brand',
    '--wds-sz-side-navbar-padding-top',
    '--wds-sz-side-navbar-nav-gap',
    '--wds-sz-nav-item-padding-top',
    '--wds-sz-nav-item-gap',
  ].map((name) => ({ name })),
};
