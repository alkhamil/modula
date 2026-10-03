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
  // __GENERATOR_NAV_ITEMS__
];

/** Item nav dari definisi published (flat untuk root, group per parent). */
export function useDynamicNavItems(): NavItemType[] {
  const { data } = useDynamicDefinitions('published');
  return useMemo(() => (data ? buildDynamicNavItems(data) : []), [data]);
}

/**
 * Gabung nav statis + dinamis tanpa duplikat: modul hasil generate-ke-repo
 * (statis, menutupi versi dinamis di route sama) menang — entri dinamis
 * dengan path yang sudah ada dilewati, anak grup digabung per path.
 * Tidak memutasi array statis.
 */
export function mergeNavItems(
  staticItems: NavItemType[],
  dynamicItems: NavItemType[],
): NavItemType[] {
  const merged: NavItemType[] = staticItems.map((item) => ({
    ...item,
    children: item.children ? [...item.children] : undefined,
  }));
  const usedPaths = new Set<string>();
  for (const item of merged) {
    if (item.path) usedPaths.add(item.path);
    for (const child of item.children ?? []) usedPaths.add(child.path);
  }
  for (const dyn of dynamicItems) {
    if (dyn.children) {
      const group = merged.find((item) => item.label === dyn.label && item.children);
      if (!group) {
        merged.push(dyn);
        for (const child of dyn.children) usedPaths.add(child.path);
        continue;
      }
      for (const child of dyn.children) {
        if (!usedPaths.has(child.path)) {
          group.children!.push(child);
          usedPaths.add(child.path);
        }
      }
      continue;
    }
    if (dyn.path && !usedPaths.has(dyn.path)) {
      merged.push(dyn);
      usedPaths.add(dyn.path);
    }
  }
  return merged;
}
