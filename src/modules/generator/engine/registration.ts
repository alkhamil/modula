import type { GeneratorConfig, ModuleRegistration } from '../types';
import { MENU_ICON_NAME_RE } from '../types';
import { normalizeConfig } from '../parser';
import { buildContext, type TemplateContext } from './context';
import { normalizeParentPath, prettifyParent } from '../naming';

/** Satu halaman modul yang didaftarkan sebagai route. */
export interface ModulePage {
  page: string;
  route: string;
  /** `list` | `Create` | `Detail` | `Edit` — kunci breadcrumb. */
  crumb: string;
  permission: string;
}

/** Halaman modul sesuai fitur aktif (urutan: list, create, detail, edit). */
export function modulePages(ctx: TemplateContext): ModulePage[] {
  const { names, features, permissions } = ctx;
  const pages: ModulePage[] = [];
  if (features.list) {
    pages.push({
      page: `${names.entity}ListPage`,
      route: names.routeBase,
      crumb: 'list',
      permission: permissions.view,
    });
  }
  if (features.create) {
    pages.push({
      page: `${names.entity}CreatePage`,
      route: `${names.routeBase}/create`,
      crumb: 'Create',
      permission: permissions.create,
    });
  }
  if (features.detail) {
    pages.push({
      page: `${names.entity}ViewPage`,
      route: `${names.routeBase}/:${names.paramId}/view`,
      crumb: 'Detail',
      permission: permissions.view,
    });
  }
  if (features.edit) {
    pages.push({
      page: `${names.entity}EditPage`,
      route: `${names.routeBase}/:${names.paramId}/edit`,
      crumb: 'Edit',
      permission: permissions.update,
    });
  }
  return pages;
}

/** Nama ikon lucide menu: dari config bila identifier valid, selain itu `Database`. */
export function menuIconName(config: GeneratorConfig): string {
  const rawIcon = config.menuIcon?.name.trim() ?? '';
  return MENU_ICON_NAME_RE.test(rawIcon) ? rawIcon : 'Database';
}

export function buildRegistration(raw: GeneratorConfig): ModuleRegistration {
  const config = normalizeConfig(raw);
  const ctx = buildContext(config);
  const { names, permissions } = ctx;
  const parentPath = normalizeParentPath(config.parentName);
  const moduleImportPath = `../${names.dir.replace(/^src\//, '').replace(/\/$/, '')}`;

  return {
    moduleDir: names.dir.replace(/\/$/, ''),
    routesImportPath: `${moduleImportPath}/routes`,
    routesExport: `${names.camel}Routes`,
    navImportPath: `${moduleImportPath}/navigation`,
    navExport: `${names.camel}Nav`,
    hasPages: modulePages(ctx).length > 0,
    navPath: `/${names.routeBase}`,
    parentPath,
    parentLabel: parentPath ? prettifyParent(parentPath) : null,
    label: names.entityPlural,
    iconName: menuIconName(config),
    permissionView: permissions.view,
  };
}
