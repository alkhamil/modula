import type { ModuleRegistration } from '../src/modules/generator/types.ts';

export const ROUTER_IMPORTS_ANCHOR = '// __GENERATOR_IMPORTS__';
export const ROUTER_ROUTES_ANCHOR = '// __GENERATOR_ROUTES__';
export const NAV_ITEMS_ANCHOR = '// __GENERATOR_NAV_ITEMS__';

export function parentMarker(parentPath: string): string {
  return `// __GENERATOR_PARENT ${parentPath}__`;
}

export interface RouteRegistrationOutcome {
  source: string;
  addedRoutes: number;
}

export interface NavRegistrationOutcome {
  source: string;
  added: boolean;
}

function insertBeforeAnchor(source: string, anchor: string, block: string, file: string): string {
  const index = source.indexOf(anchor);
  if (index === -1) throw new Error(`Anchor ${anchor} tidak ditemukan di ${file}.`);
  // Sisip sebelum baris anchor; indent blok diselaraskan ke indent baris anchor.
  const lineStart = source.lastIndexOf('\n', index - 1) + 1;
  const anchorIndent = /^ */.exec(source.slice(lineStart, index))?.[0] ?? '';
  const lines = block.split('\n');
  const minIndent = lines
    .filter((line) => line.trim() !== '')
    .reduce((min, line) => Math.min(min, /^ */.exec(line)?.[0].length ?? 0), Infinity);
  const base = minIndent === Infinity ? 0 : minIndent;
  const aligned = lines
    .map((line) => (line.trim() === '' ? line : anchorIndent + line.slice(base)))
    .join('\n');
  return `${source.slice(0, lineStart)}${aligned}\n${source.slice(lineStart)}`;
}

/**
 * Sisipkan import + routes modul ke `router.tsx`. Idempoten: entri yang
 * path-nya sudah ada dilewati.
 */
export function registerModuleRoutes(
  source: string,
  reg: ModuleRegistration,
): RouteRegistrationOutcome {
  let next = source;
  let addedRoutes = 0;

  const newRoutes = reg.routes.filter((route) => !next.includes(`path: '${route.path}'`));
  if (newRoutes.length === 0) return { source, addedRoutes: 0 };

  if (reg.importBlock.trim() !== '' && !next.includes(`from '${reg.moduleImportPath}'`)) {
    next = insertBeforeAnchor(next, ROUTER_IMPORTS_ANCHOR, reg.importBlock, 'router.tsx');
  }
  next = insertBeforeAnchor(
    next,
    ROUTER_ROUTES_ANCHOR,
    newRoutes.map((route) => route.code).join('\n'),
    'router.tsx',
  );
  addedRoutes = newRoutes.length;
  return { source: next, addedRoutes };
}

/**
 * Sisipkan item nav modul ke `navigation.tsx`. Idempoten: dilewati bila
 * nav path sudah ada. Modul ber-parent masuk ke group marker parent
 * (dibuat bila belum ada).
 */
export function registerModuleNav(
  source: string,
  reg: ModuleRegistration,
): NavRegistrationOutcome {
  if (reg.routes.length === 0) return { source, added: false };
  if (source.includes(`path: '${reg.navPath}'`)) return { source, added: false };

  if (!reg.parentPath) {
    return {
      source: insertBeforeAnchor(source, NAV_ITEMS_ANCHOR, reg.navItemCode, 'navigation.tsx'),
      added: true,
    };
  }

  const marker = parentMarker(reg.parentPath);
  const markerIndex = source.indexOf(marker);
  if (markerIndex !== -1) {
    const childrenIndex = source.indexOf('children: [', markerIndex);
    if (childrenIndex === -1) {
      throw new Error(`Blok ${marker} rusak (children tidak ditemukan).`);
    }
    const closeIndex = source.indexOf('\n    ],', childrenIndex);
    if (closeIndex === -1) {
      throw new Error(`Blok ${marker} rusak (penutup children tidak ditemukan).`);
    }
    const next = `${source.slice(0, closeIndex)}\n${reg.navItemCode}${source.slice(closeIndex)}`;
    return { source: next, added: true };
  }

  return {
    source: insertBeforeAnchor(source, NAV_ITEMS_ANCHOR, reg.navSnippet, 'navigation.tsx'),
    added: true,
  };
}
