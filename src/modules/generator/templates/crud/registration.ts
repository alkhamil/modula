import type { TemplateContext } from '../../engine/context';
import { menuIconName, modulePages } from '../../engine/registration';
import { normalizeParentPath, prettifyParent } from '../../naming';

/** Prefix relatif dari file di root modul ke `src/` (`../` per level folder + 1). */
function srcPrefix(ctx: TemplateContext): string {
  const depth = ctx.names.dir.replace(/^src\/modules\//, '').split('/').filter(Boolean).length;
  return '../'.repeat(depth + 1);
}

/** `routes.tsx` modul: `RouteObject[]` siap di-spread ke `src/app/router.tsx`. */
export function routesTemplate(ctx: TemplateContext): string {
  const { names, config } = ctx;
  const base = config.permissionKey;
  const label = names.entityPlural;
  const listPath = `/${names.routeBase}`;
  const pages = modulePages(ctx);

  const crumbKey = (crumb: string): string => (crumb === 'list' ? 'list' : crumb.toLowerCase());
  const routes = pages.map((p) => {
    const breadcrumb =
      p.crumb === 'list'
        ? `[{ label: '${label}', labelKey: '${base}.breadcrumbs.list' }]`
        : `[\n` +
          `        { label: '${label}', labelKey: '${base}.breadcrumbs.list', path: '${listPath}' },\n` +
          `        { label: '${p.crumb}', labelKey: '${base}.breadcrumbs.${crumbKey(p.crumb)}' },\n` +
          `      ]`;
    return (
      `  {\n` +
      `    path: '${p.route}',\n` +
      `    element: <${p.page} />,\n` +
      `    handle: {\n` +
      `      breadcrumb: ${breadcrumb},\n` +
      `      requiredPermission: '${p.permission}',\n` +
      `    },\n` +
      `  },`
    );
  });

  return (
    `import type { RouteObject } from 'react-router';\n` +
    `import {\n${pages.map((p) => `  ${p.page},`).join('\n')}\n} from './index';\n\n` +
    `export const ${names.camel}Routes: RouteObject[] = [\n${routes.join('\n')}\n];\n`
  );
}

/** `navigation.tsx` modul: `ModuleNavEntry` siap didaftarkan ke `src/app/navigation.tsx`. */
export function navigationTemplate(ctx: TemplateContext): string {
  const { names, config, permissions } = ctx;
  const base = config.permissionKey;
  const label = names.entityPlural;
  const icon = menuIconName(config);
  const parentPath = normalizeParentPath(config.parentName);
  const parent = parentPath
    ? `  parent: {\n` +
      `    key: '${parentPath}',\n` +
      `    label: '${prettifyParent(parentPath)}',\n` +
      `    labelKey: '${base}.parentLabel',\n` +
      `    icon: <WdsIcon name="${icon}" className="h-5 w-5" />,\n` +
      `  },\n`
    : '';

  return (
    `import { WdsIcon } from '${srcPrefix(ctx)}shared/components/icons';\n` +
    `import type { ModuleNavEntry } from '${srcPrefix(ctx)}shared/types/navigation';\n\n` +
    `export const ${names.camel}Nav: ModuleNavEntry = {\n` +
    parent +
    `  icon: <WdsIcon name="${icon}" className="h-5 w-5" />,\n` +
    `  item: {\n` +
    `    label: '${label}',\n` +
    `    labelKey: '${base}.labelPlural',\n` +
    `    path: '/${names.routeBase}',\n` +
    `    permissionKey: '${permissions.view}',\n` +
    `  },\n` +
    `};\n`
  );
}
