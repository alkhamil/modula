import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { ModuleNav, NavItemType } from "../shared/types/navigation";
import { buildModuleNavItems } from "../shared/utils/moduleNav";
import { useDynamicDefinitions } from "../modules/generator/runtime/hooks";
import { buildDynamicNavItems } from "../modules/generator/runtime/dynamicNav";
import { dashboardNav } from "../modules/dashboard/navigation";
import { generatorNav } from "../modules/generator/navigation";
import { showcaseNav } from "../modules/showcase/navigation";
import { userNav } from "../modules/user-management/user/navigation";
import { roleNav } from "../modules/user-management/role/navigation";
import { settingsNav } from "../modules/settings/navigation";
// __GENERATOR_NAV_IMPORTS__

/** Nav tiap modul (statis + hasil Generate ke repo), urutan = urutan menu. */
const moduleNavEntries: ModuleNav[] = [
  dashboardNav,
  generatorNav,
  showcaseNav,
  userNav,
  roleNav,
  settingsNav,
  // __GENERATOR_NAV_ENTRIES__
];

export const navItems: NavItemType[] = buildModuleNavItems(moduleNavEntries);

/** Item nav dari definisi published (flat untuk root, group per parent). */
export function useDynamicNavItems(): NavItemType[] {
  const { i18n } = useTranslation();
  const { data } = useDynamicDefinitions("published");
  return useMemo(
    () => (data ? buildDynamicNavItems(data) : []),
    [data, i18n.language],
  );
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
      const group = merged.find(
        (item) => item.label === dyn.label && item.children,
      );
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
