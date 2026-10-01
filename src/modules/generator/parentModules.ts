/**
 * Daftar parent module: direktori di `src/modules/` yang memiliki minimal satu
 * submodul. Deteksi build-time via `import.meta.glob` dengan marker
 * `permissions.ts` (setiap modul hasil generate memilikinya di root modul).
 * Hanya kunci path yang dipakai — file tidak pernah di-import.
 *
 * Modul ini khusus UI (bergantung pada Vite) — jangan di-import dari
 * parser/engine agar keduanya tetap murni dan bisa jalan di Node.
 */

const level2 = import.meta.glob('../*/*/permissions.ts');
const level3 = import.meta.glob('../*/*/*/permissions.ts');
const level4 = import.meta.glob('../*/*/*/*/permissions.ts');

/** Nilai sentinel select saat user memilih "Parent baru". */
export const NEW_PARENT_VALUE = '__new__';

/** `../admin/region/permissions.ts`, depth 1 → `admin`. */
function dirOf(key: string, depth: number): string {
  return key
    .split('/')
    .slice(1, -1)
    .slice(0, depth)
    .join('/');
}

/** Daftar parent (path relatif `src/modules/`, mis. `admin`, `finance/accounting`). */
export function getParentModuleOptions(): string[] {
  const parents = new Set<string>();
  for (const key of Object.keys(level2)) parents.add(dirOf(key, 1));
  for (const key of Object.keys(level3)) parents.add(dirOf(key, 2));
  for (const key of Object.keys(level4)) parents.add(dirOf(key, 3));
  return [...parents].sort();
}
