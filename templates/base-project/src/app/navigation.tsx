import type { ModuleNav, NavItemType } from '../shared/types/navigation';
import { buildModuleNavItems } from '../shared/utils/moduleNav';
import { dashboardNav } from '../modules/dashboard/navigation';
// __GENERATOR_NAV_IMPORTS__

/** Nav tiap modul, urutan = urutan menu. */
const moduleNavEntries: ModuleNav[] = [
  dashboardNav,
  // __GENERATOR_NAV_ENTRIES__
];

export const navItems: NavItemType[] = buildModuleNavItems(moduleNavEntries);
