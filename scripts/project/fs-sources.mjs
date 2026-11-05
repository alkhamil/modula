/* Muat sumber template dari disk (Node): base, design system Modula, dan pack.
 * Dipakai skrip verifikasi; builder browser memakai import.meta.glob dengan peta yang sama. */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const IGNORED = new Set(['.DS_Store', 'node_modules']);

/** Baca folder rekursif → { path relatif folder (posix): isi }. */
export function readTree(dir, prefix = '') {
  if (!existsSync(dir)) return {};
  const out = {};
  const walk = (current) => {
    for (const name of readdirSync(current)) {
      if (IGNORED.has(name)) continue;
      const full = join(current, name);
      if (statSync(full).isDirectory()) walk(full);
      else out[prefix + relative(dir, full).split('\\').join('/')] = readFileSync(full, 'utf8');
    }
  };
  walk(dir);
  return out;
}

export function loadBase() {
  return readTree(join(ROOT, 'templates/base-project'));
}

/** Design system = satu-satunya sumber komponen: `src/shared/**`, stylesheet, favicon. */
export function loadDesignSystem() {
  return {
    ...readTree(join(ROOT, 'src/shared'), 'src/shared/'),
    'src/index.css': readFileSync(join(ROOT, 'src/index.css'), 'utf8'),
    'public/favicon.svg': readFileSync(join(ROOT, 'public/favicon.svg'), 'utf8'),
  };
}

/** Pack `generator` mengambil langsung dari `src/modules/generator/**` + `vite-plugin/**` (single source of truth). */
function loadPackFiles(dir, id) {
  if (id === 'generator') {
    return {
      ...readTree(join(ROOT, 'src/modules/generator'), 'src/modules/generator/'),
      ...readTree(join(ROOT, 'vite-plugin'), 'vite-plugin/'),
    };
  }
  return readTree(join(dir, id, 'files'));
}

/** Pack urutan: `templates/packs/order.json` bila ada, selain itu alfabet. */
export function loadPacks() {
  const dir = join(ROOT, 'templates/packs');
  const orderFile = join(dir, 'order.json');
  const ids = existsSync(orderFile)
    ? JSON.parse(readFileSync(orderFile, 'utf8'))
    : readdirSync(dir).filter((name) => statSync(join(dir, name)).isDirectory());
  return ids.map((id) => ({
    manifest: JSON.parse(readFileSync(join(dir, id, 'pack.json'), 'utf8')),
    files: loadPackFiles(dir, id),
  }));
}
