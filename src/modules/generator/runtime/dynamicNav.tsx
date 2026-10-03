import { NavMasterDataIcon, SvgIcon } from '../../../shared/components/icons';
import type { NavItemType } from '../../../shared/types/navigation';
import type { MenuIcon, ModuleDefinition } from '../definitions';
import { definitionPermissions } from './types';

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
  if (!icon) return <NavMasterDataIcon className="h-5 w-5" />;
  return <SvgIcon svg={icon.svg} className="h-5 w-5" name={icon.name} />;
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
        label: def.label,
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
        icon: <NavMasterDataIcon className="h-5 w-5" />,
        children: [],
      };
      groups.set(def.parent, group);
    }
    if (def.menuIcon && !groupCustomIcon.has(def.parent)) {
      group.icon = menuIconNode(def.menuIcon);
      groupCustomIcon.add(def.parent);
    }
    group.children?.push({ label: def.label, path: `/${def.routeBase}`, permissionKey });
  }
  return [...groups.values(), ...flat];
}
