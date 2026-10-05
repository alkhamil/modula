/** Ubah teks bebas menjadi kebab-case (`Master Data` → `master-data`). */
export function toKebabCase(value: string): string {
  return value
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-zA-Z0-9/-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

/** Ubah teks bebas menjadi PascalCase (`region` → `Region`). */
export function toPascalCase(value: string): string {
  return value
    .trim()
    .split(/[\s_/-]+/)
    .flatMap((part) => part.replace(/([a-z0-9])([A-Z])/g, '$1 $2').split(' '))
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('');
}

/** Ubah teks bebas menjadi camelCase (`Region Name` → `regionName`). */
export function toCamelCase(value: string): string {
  const pascal = toPascalCase(value);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

/**
 * Turunkan permission key dari nama modul (`Doc File` → `doc_file`).
 * Hasil selalu cocok `^[a-z][a-z0-9_]*$` (atau '' bila tak bisa diturunkan).
 */
export function toPermissionKey(moduleName: string): string {
  return moduleName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .replace(/^[^a-z]+/, '');
}

/** Plural naif untuk URL/route (`region` → `regions`). */
export function toPluralKebab(kebab: string): string {
  if (kebab.endsWith('y') && !/[aeiou]y$/.test(kebab)) return `${kebab.slice(0, -1)}ies`;
  if (/(s|x|z|ch|sh)$/.test(kebab)) return `${kebab}es`;
  return `${kebab}s`;
}

export function toPluralPascal(pascal: string): string {
  if (pascal.endsWith('y') && !/[aeiou]y$/.test(pascal)) return `${pascal.slice(0, -1)}ies`;
  if (/(s|x|z|ch|sh)$/.test(pascal)) return `${pascal}es`;
  return `${pascal}s`;
}

/** Normalisasi path parent (`Master Data` → `master-data`, kosong → null). */
export function normalizeParentPath(parentName: string | null): string | null {
  if (!parentName || parentName.trim() === '') return null;
  const normalized = parentName
    .split('/')
    .map((part) => toKebabCase(part))
    .filter(Boolean)
    .join('/');
  return normalized === '' ? null : normalized;
}

/** `master-data` → `Master Data`; `finance/accounting` → `Finance / Accounting`. */
export function prettifyParent(parentPath: string): string {
  return parentPath
    .split('/')
    .map((segment) =>
      toKebabCase(segment)
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
    )
    .join(' / ');
}

/**
 * Resolve folder modul. Parent kosong/null → root.
 * `administration` + `region` → `src/modules/administration/region/`
 * `finance/accounting` + `journal` → `src/modules/finance/accounting/journal/`
 */
export function resolveModulePath(parentName: string | null, moduleName: string): string {
  const mod = toKebabCase(moduleName);
  if (!parentName || parentName.trim() === '') return `src/modules/${mod}/`;
  const parent = parentName
    .split('/')
    .map((part) => toKebabCase(part))
    .filter(Boolean)
    .join('/');
  return parent ? `src/modules/${parent}/${mod}/` : `src/modules/${mod}/`;
}

/** Seluruh turunan nama yang dipakai template dari satu nama modul. */
export interface ResolvedNames {
  /** PascalCase entitas: `Region`. */
  entity: string;
  /** Plural PascalCase: `Regions`. */
  entityPlural: string;
  /** camelCase entitas: `region`. */
  camel: string;
  /** kebab-case: `region`. */
  kebab: string;
  /** Kebab plural untuk URL: `regions`. */
  pluralKebab: string;
  /**
   * Basis path route frontend (tanpa leading slash): parent + plural module.
   * `mater-data` + `company` → `mater-data/companies`; root → `regions`.
   */
  routeBase: string;
  /** Nama param route: `regionId`. */
  paramId: string;
  /** Prefix testId: `region`. */
  testId: string;
  /** Folder output: `src/modules/.../region/`. */
  dir: string;
  /** Prefix import ke shared dari file modul (`../../../` sesuai kedalaman parent). */
  sharedPrefix: string;
  /** Tipe list: `RegionListItem`. */
  listItem: string;
  /** Payload: `CreateRegionPayload`. */
  payload: string;
  /** Params: `GetRegionsParams`. */
  params: string;
  /** Hasil mutasi: `RegionMutationResult`. */
  mutationResult: string;
}

export function resolveNames(parentName: string | null, moduleName: string): ResolvedNames {
  const entity = toPascalCase(moduleName);
  const kebab = toKebabCase(moduleName);
  const dir = resolveModulePath(parentName, moduleName);
  const segments = dir
    .replace(/^src\/modules\//, '')
    .split('/')
    .filter(Boolean);
  const depth = segments.length;
  const routeBase = [...segments.slice(0, -1), toPluralKebab(kebab)].join('/');
  return {
    entity,
    entityPlural: toPluralPascal(entity),
    camel: toCamelCase(moduleName),
    kebab,
    pluralKebab: toPluralKebab(kebab),
    routeBase,
    paramId: `${toCamelCase(moduleName)}Id`,
    testId: kebab,
    dir,
    sharedPrefix: '../'.repeat(depth + 2),
    listItem: `${entity}ListItem`,
    payload: `Create${entity}Payload`,
    params: `Get${toPluralPascal(entity)}Params`,
    mutationResult: `${entity}MutationResult`,
  };
}
