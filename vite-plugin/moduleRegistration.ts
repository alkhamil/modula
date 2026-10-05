import { createRequire } from 'node:module';
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
 * Ikon final untuk snippet nav: nama dari engine bila dikenal lucide,
 * `Database` bila tidak (engine sudah menjamin bentuk identifier aman).
 */
export function resolveNavIconName(iconName: string): string {
  if (!/^[A-Z][A-Za-z0-9]{0,39}$/.test(iconName)) return 'Database';
  const known = knownIconNames();
  if (known !== null && !known.has(iconName)) return 'Database';
  return iconName;
}

/** Pastikan `import { <name> } from 'lucide-react'` ada di `navigation.tsx`. */
export function ensureLucideImport(source: string, name: string): string {
  const importRe = /import\s*\{([^}]*)\}\s*from\s*'lucide-react'/;
  const match = importRe.exec(source);
  if (!match) return `import { ${name} } from 'lucide-react';\n${source}`;
  const members = match[1] as string;
  if (members.split(',').map((part) => part.trim()).includes(name)) return source;
  const updated = match[0].replace(/\{([^}]*)\}/, (_, inner: string) => {
    const trimmed = (inner as string).trim();
    return `{ ${trimmed === '' ? name : `${trimmed}, ${name}`} }`;
  });
  return source.replace(match[0], updated);
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

  const icon = resolveNavIconName(reg.iconName);
  const withIcon = (code: string): string =>
    icon === reg.iconName
      ? code
      : code.split(`<${reg.iconName} className="h-5 w-5" />`).join(`<${icon} className="h-5 w-5" />`);

  if (!reg.parentPath) {
    const next = insertBeforeAnchor(source, NAV_ITEMS_ANCHOR, withIcon(reg.navItemCode), 'navigation.tsx');
    return { source: ensureLucideImport(next, icon), added: true };
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

  const next = insertBeforeAnchor(source, NAV_ITEMS_ANCHOR, withIcon(reg.navSnippet), 'navigation.tsx');
  return { source: ensureLucideImport(next, icon), added: true };
}
