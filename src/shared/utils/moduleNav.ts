import type { ModuleNav, NavItemType } from '../types/navigation';

/**
 * Susun nav modul (entri tunggal atau array) menjadi `NavItemType[]`: tanpa parent → item flat,
 * dengan parent → anak group (group dibuat sekali per `parent.key`,
 * urutan group mengikuti kemunculan pertama).
 */
export function buildModuleNavItems(navs: ModuleNav[]): NavItemType[] {
  const items: NavItemType[] = [];
  const groups = new Map<string, NavItemType>();
  for (const { parent, icon, item } of navs.flat()) {
    if (!parent) {
      items.push({ ...item, icon });
      continue;
    }
    const existing = groups.get(parent.key);
    if (existing) {
      existing.children = [...(existing.children ?? []), item];
      continue;
    }
    const group: NavItemType = {
      label: parent.label,
      labelKey: parent.labelKey,
      icon: parent.icon,
      children: [item],
    };
    groups.set(parent.key, group);
    items.push(group);
  }
  return items;
}
