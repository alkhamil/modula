import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Database } from '../../../shared/components/icons';
import ModuleMenuIcon from '../components/ModuleMenuIcon';
import type { NavItemType } from '../../../shared/types/navigation';
import type { MenuIcon, ModuleDefinition } from '../definitions';
import { useDynamicDefinitions } from './hooks';
import { definitionPermissions } from './types';
import { moduleText, navLabelKey } from './moduleI18n';

/** `mater-data` → `Mater Data`; `finance/accounting` → `Finance / Accounting`. */
function prettifyParent(parentPath: string): string {
  return parentPath
    .split('/')
    .map((segment) =>
      segment
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
    )
    .join(' / ');
}

function menuIconNode(icon: MenuIcon | undefined): NavItemType['icon'] {
  if (!icon) return <Database className="h-5 w-5" />;
  return <ModuleMenuIcon name={icon.name} className="h-5 w-5" />;
}

/**
 * Item nav dari definisi published (flat untuk root, group per parent).
 * Ikon custom menempel di menu modul bila root, di grup parent bila
 * ber-parent (ikon grup = definisi pertama urut label yang mengaturnya).
 */
export function buildDynamicNavItems(definitions: ModuleDefinition[]): NavItemType[] {
  const flat: NavItemType[] = [];
  const groups = new Map<string, NavItemType>();
  const groupCustomIcon = new Set<string>();
  const sorted = [...definitions].sort((a, b) => a.label.localeCompare(b.label));
  for (const def of sorted) {
    if (!def.features.list) continue;
    const permissionKey = definitionPermissions(def.permissionKey).view;
    if (!def.parent) {
      flat.push({
        label: moduleText(def, navLabelKey(), def.label),
        path: `/${def.routeBase}`,
        icon: menuIconNode(def.menuIcon),
        permissionKey,
      });
      continue;
    }
    let group = groups.get(def.parent);
    if (!group) {
      group = {
        label: prettifyParent(def.parent),
        icon: <Database className="h-5 w-5" />,
        children: [],
      };
      groups.set(def.parent, group);
    }
    if (def.menuIcon && !groupCustomIcon.has(def.parent)) {
      group.icon = menuIconNode(def.menuIcon);
      groupCustomIcon.add(def.parent);
    }
    group.children?.push({
      label: moduleText(def, navLabelKey(), def.label),
      path: `/${def.routeBase}`,
      permissionKey,
    });
  }
  return [...groups.values(), ...flat];
}

/**
 * Gabung nav statis + dinamis tanpa duplikat: modul hasil generate-ke-repo
 * (statis, menutupi versi dinamis di route sama) menang — entri dinamis
 * dengan path yang sudah ada dilewati, anak grup digabung per path.
 * Tidak memutasi array statis.
 */
export function mergeDynamicNavItems(
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

/** Hook: gabungkan nav statis dengan item nav dari definisi published. */
export function useMergedDynamicNav(staticItems: NavItemType[]): NavItemType[] {
  const { i18n } = useTranslation();
  const { data } = useDynamicDefinitions('published');
  return useMemo(() => {
    const dyn = data ? buildDynamicNavItems(data) : [];
    return mergeDynamicNavItems(staticItems, dyn);
  }, [staticItems, data, i18n.language]);
}

