import type { ModuleRegistration } from '../src/modules/generator/types.ts';

export const ROUTER_IMPORTS_ANCHOR = '// __GENERATOR_IMPORTS__';
export const ROUTER_ROUTES_ANCHOR = '// __GENERATOR_ROUTES__';
export const NAV_IMPORTS_ANCHOR = '// __GENERATOR_NAV_IMPORTS__';
export const NAV_ENTRIES_ANCHOR = '// __GENERATOR_NAV_ENTRIES__';
export const PERMISSION_KEYS_ANCHOR = '// __PERMISSION_KEYS__';

const PERMISSION_ACTIONS = ['view', 'create', 'update', 'delete', 'bulk_upload', 'export'] as const;

export interface RouteRegistrationOutcome {
  source: string;
  addedRoutes: number;
}

export interface NavRegistrationOutcome {
  source: string;
  added: boolean;
}

export interface UnregisterOutcome {
  source: string;
  removed: number;
}

/** Indent (spasi/tab) baris yang memuat anchor. */
function anchorIndent(source: string, anchorIndex: number): string {
  const lineStart = source.lastIndexOf('\n', anchorIndex - 1) + 1;
  return /^[ \t]*/.exec(source.slice(lineStart, anchorIndex))?.[0] ?? '';
}

/** Sisipkan satu baris tepat di atas baris anchor, dengan indent yang sama. */
function insertLineBeforeAnchor(source: string, anchor: string, line: string, file: string): string {
  const index = source.indexOf(anchor);
  if (index === -1) throw new Error(`Anchor ${anchor} tidak ditemukan di ${file}.`);
  const lineStart = source.lastIndexOf('\n', index - 1) + 1;
  return `${source.slice(0, lineStart)}${anchorIndent(source, index)}${line}\n${source.slice(lineStart)}`;
}

function importLine(name: string, importPath: string): string {
  return `import { ${name} } from '${importPath}';`;
}

/** Ada import dari path ini (kutip tunggal/ganda). */
function hasImportFrom(source: string, importPath: string): boolean {
  return source.includes(`'${importPath}'`) || source.includes(`"${importPath}"`);
}

/** Hapus seluruh baris yang cocok pola; return jumlah baris terhapus. */
function removeLines(source: string, pattern: RegExp): { source: string; removed: number } {
  let removed = 0;
  const next = source
    .split('\n')
    .filter((line) => {
      if (!pattern.test(line)) return true;
      removed++;
      return false;
    })
    .join('\n');
  return { source: next, removed };
}

function escapeRe(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Daftarkan routes modul di `router.tsx`: satu import + satu `...xRoutes,`.
 * Idempoten: dilewati bila export sudah terdaftar.
 */
export function registerModuleRoutes(
  source: string,
  reg: ModuleRegistration,
): RouteRegistrationOutcome {
  if (!reg.hasPages) return { source, addedRoutes: 0 };
  const spread = `...${reg.routesExport},`;
  const hasSpread = new RegExp(`\\.\\.\\.${escapeRe(reg.routesExport)}\\s*,`).test(source);
  let next = source;
  if (!hasImportFrom(next, reg.routesImportPath)) {
    next = insertLineBeforeAnchor(
      next,
      ROUTER_IMPORTS_ANCHOR,
      importLine(reg.routesExport, reg.routesImportPath),
      'router.tsx',
    );
  }
  if (hasSpread) return { source: next, addedRoutes: 0 };
  next = insertLineBeforeAnchor(next, ROUTER_ROUTES_ANCHOR, spread, 'router.tsx');
  return { source: next, addedRoutes: 1 };
}

/**
 * Daftarkan nav modul di `navigation.tsx`: satu import + satu entri `xNav,`
 * di `moduleNavEntries`. Idempoten.
 */
export function registerModuleNav(
  source: string,
  reg: ModuleRegistration,
): NavRegistrationOutcome {
  if (!reg.hasPages) return { source, added: false };
  const hasEntry = new RegExp(`^\\s*${escapeRe(reg.navExport)}\\s*,\\s*$`, 'm').test(source);
  let next = source;
  if (!hasImportFrom(next, reg.navImportPath)) {
    next = insertLineBeforeAnchor(
      next,
      NAV_IMPORTS_ANCHOR,
      importLine(reg.navExport, reg.navImportPath),
      'navigation.tsx',
    );
  }
  if (hasEntry) return { source: next, added: false };
  next = insertLineBeforeAnchor(next, NAV_ENTRIES_ANCHOR, `${reg.navExport},`, 'navigation.tsx');
  return { source: next, added: true };
}

/** Hapus import + spread routes modul dari `router.tsx`. Idempoten. */
export function unregisterModuleRoutes(
  source: string,
  reg: ModuleRegistration,
): UnregisterOutcome {
  const imp = removeLines(
    source,
    new RegExp(`^\\s*import\\b.*from\\s*['"]${escapeRe(reg.routesImportPath)}['"]`),
  );
  const spread = removeLines(
    imp.source,
    new RegExp(`^\\s*\\.\\.\\.${escapeRe(reg.routesExport)}\\s*,\\s*$`),
  );
  return { source: spread.source, removed: spread.removed };
}

/** Hapus import + entri nav modul dari `navigation.tsx`. Idempoten. */
export function unregisterModuleNav(
  source: string,
  reg: ModuleRegistration,
): UnregisterOutcome {
  const imp = removeLines(
    source,
    new RegExp(`^\\s*import\\b.*from\\s*['"]${escapeRe(reg.navImportPath)}['"]`),
  );
  const entry = removeLines(
    imp.source,
    new RegExp(`^\\s*${escapeRe(reg.navExport)}\\s*,\\s*$`),
  );
  return { source: entry.source, removed: entry.removed };
}

/** Daftarkan permission keys modul di `permissions.ts` (bila anchor tersedia). Idempoten. */
export function registerModulePermissions(source: string, reg: ModuleRegistration): string {
  if (!source.includes(PERMISSION_KEYS_ANCHOR)) return source;
  const base = reg.permissionView.replace(/\.view$/, '');
  let next = source;
  for (const action of PERMISSION_ACTIONS) {
    const key = `${base}.${action}`;
    if (!next.includes(`'${key}'`) && !next.includes(`"${key}"`)) {
      next = insertLineBeforeAnchor(next, PERMISSION_KEYS_ANCHOR, `'${key}',`, 'permissions.ts');
    }
  }
  return next;
}

/** Hapus permission keys modul dari `permissions.ts`. Idempoten. */
export function unregisterModulePermissions(source: string, reg: ModuleRegistration): string {
  const base = reg.permissionView.replace(/\.view$/, '');
  return removeLines(
    source,
    new RegExp(`^\\s*['"]${escapeRe(base)}\\.(?:view|create|update|delete|bulk_upload|export)['"]\\s*,\\s*$`),
  ).source;
}

