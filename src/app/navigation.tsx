import { useMemo } from 'react';
import type { NavItemType } from '../shared/types/navigation';
import {
  NavDashboardIcon,
  NavMasterDataIcon,
  NavSettingsIcon,
} from '../shared/components/icons';
import { useDynamicDefinitions } from '../modules/generator/runtime/hooks';
import { buildDynamicNavItems } from '../modules/generator/runtime/dynamicNav';

export const navItems: NavItemType[] = [
  {
    label: 'Dashboard',
    path: '/',
    icon: <NavDashboardIcon className="h-5 w-5" />,
  },
  {
    label: 'Generator',
    path: '/generator',
    icon: <NavSettingsIcon className="h-5 w-5" />,
  },
  {
    label: 'Component',
    icon: <NavMasterDataIcon className="h-5 w-5" />,
    children: [
      { label: 'Typography', path: '/components/typography' },
      { label: 'Colors', path: '/components/colors' },
      { label: 'Icons', path: '/components/icons' },
      { label: 'UI', path: '/components/ui' },
    ],
  },
];

/** Item nav dari definisi published (flat untuk root, group per parent). */
export function useDynamicNavItems(): NavItemType[] {
  const { data } = useDynamicDefinitions('published');
  return useMemo(() => (data ? buildDynamicNavItems(data) : []), [data]);
}
