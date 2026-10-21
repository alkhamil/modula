import { createRequire } from 'node:module';
import type { ModuleRegistration } from '../src/modules/generator/types.ts';

export const ROUTER_IMPORTS_ANCHOR = '// __GENERATOR_IMPORTS__';
export const ROUTER_ROUTES_ANCHOR = '// __GENERATOR_ROUTES__';
export const NAV_IMPORTS_ANCHOR = '// __GENERATOR_NAV_IMPORTS__';
export const NAV_ENTRIES_ANCHOR = '// __GENERATOR_NAV_ENTRIES__';

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

/** Daftar nama ikon lucide bila pustaka bisa dimuat di Node; null = tak bisa dicek. */
function knownIconNames(): Set<string> | null {
  try {
    const require = createRequire(import.meta.url);
    const mod = require('lucide-react') as { icons?: Record<string, unknown> };
    if (!mod || typeof mod.icons !== 'object' || mod.icons === null) return null;
    return new Set(Object.keys(mod.icons));
  } catch {
    return null;
  }
}

/**
 * Ikon final untuk nav: nama dari engine bila dikenal lucide, `Database`
 * bila tidak (engine sudah menjamin bentuk identifier aman).
 */
export function resolveNavIconName(iconName: string): string {
  if (!/^[A-Z][A-Za-z0-9]{0,39}$/.test(iconName)) return 'Database';
  const known = knownIconNames();
  if (known !== null && !known.has(iconName)) return 'Database';
  return iconName;
}

/**
 * Pastikan `navigation.tsx` modul hanya memakai ikon lucide yang ada: nama
 * tak dikenal diganti `Database` (import + semua JSX). Isi lain tak disentuh.
 */
export function sanitizeModuleNavIcon(content: string): string {
  const match = /import\s*\{\s*([A-Za-z0-9]+)\s*\}\s*from\s*'lucide-react';/.exec(content);
  if (!match) return content;
  const name = match[1] as string;
  const resolved = resolveNavIconName(name);
  if (resolved === name) return content;
  return content
    .replace(match[0], `import { ${resolved} } from 'lucide-react';`)
    .split(`<${name} `)
    .join(`<${resolved} `);
}
