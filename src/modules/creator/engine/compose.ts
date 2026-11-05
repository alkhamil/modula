/**
 * Penyusun project dari template: base + design system (`src/shared`) + feature pack + modul kustom.
 * Murni dan Node-safe (tanpa fs/Vite) — input/output berupa peta path → isi file,
 * sehingga dipakai sama oleh skrip Node (verifikasi) dan builder zip di browser.
 */
import type { GeneratorConfig } from '../../generator/types';
import { generateModule } from '../../generator/engine/moduleGenerator';
import { buildRegistration } from '../../generator/engine/registration';

/** Sisipan teks ke file yang sudah ada, tepat di atas baris yang memuat `anchor`. */
export interface PackInsert {
  file: string;
  anchor: string;
  text: string;
}

export interface PackManifest {
  id: string;
  label: string;
  description: string;
  /** Wajib (selalu ikut, tidak bisa dimatikan di wizard). */
  locked?: boolean;
  /** Terpilih awal di wizard (user masih boleh mematikan). */
  default?: boolean;
  requires: string[];
  dependencies: Record<string, string>;
  devDependencies?: Record<string, string>;
  inserts: PackInsert[];
}

export interface PackSource {
  manifest: PackManifest;
  /** Path relatif project (mis. `src/modules/auth/login/index.ts`) → isi. */
  files: Record<string, string>;
}

export type FileMap = Record<string, string>;

/** Berkas gambar brand (logo) yang diunggah di wizard; disimpan sebagai biner di `public/brand/`. */
export interface BrandAsset {
  /** Ekstensi tanpa titik: `svg` | `png` | `jpg` | `webp`. */
  ext: string;
  bytes: Uint8Array;
}

export type ProjectThemeMode = 'light' | 'dark';

/** Versi Node.js project hasil: selalu 24 (`.nvmrc` + `engines.node`). */
export const NODE_MAJOR = '24';
export const NODE_ENGINE_RANGE = '>=24.0.0';

export interface ProjectOptions {
  /** Nama tampil, mis. `My Portal`. */
  name: string;
  /** Nama paket npm (kebab), mis. `my-portal`. */
  slug: string;
  /** Thema awal project (default `light`). */
  theme?: ProjectThemeMode;
  /** Warna primary awal (hex `#rrggbb`); kosong = brand WDS bawaan. */
  primaryColor?: string;
  /** Logo sidebar & logo ringkas saat sidebar diciutkan (opsional). */
  brand?: { logo?: BrandAsset; collapsedLogo?: BrandAsset };
}

const BRAND_DIR = 'public/brand';

/** Path publik (`/brand/logo.svg`) logo hasil unggah, atau '' bila tidak ada. */
function brandPublicPath(kind: 'logo' | 'logo-collapsed', asset: BrandAsset | undefined): string {
  return asset ? `/brand/${kind}.${asset.ext}` : '';
}

/** Berkas biner brand yang ikut dimasukkan ke arsip (`public/brand/*`). */
export function composeProjectAssets(project: ProjectOptions): Record<string, Uint8Array> {
  const out: Record<string, Uint8Array> = {};
  const { logo, collapsedLogo } = project.brand ?? {};
  if (logo) out[`${BRAND_DIR}/logo.${logo.ext}`] = logo.bytes;
  if (collapsedLogo) out[`${BRAND_DIR}/logo-collapsed.${collapsedLogo.ext}`] = collapsedLogo.bytes;
  return out;
}

export interface ComposeInput {
  /** File template base (`templates/base-project`). */
  base: FileMap;
  /** Design system dari Modula (`src/shared/**`, `src/index.css`, `public/favicon.svg`). */
  designSystem: FileMap;
  /** Semua pack yang tersedia, urutan = urutan penerapan. */
  packs: PackSource[];
  /** Id pack pilihan user (selain yang `locked`; dependensi `requires` ikut otomatis). */
  selected: string[];
  /** Modul CRUD tambahan yang dikonfigurasi user di wizard (opsional). */
  customModules?: GeneratorConfig[];
  project: ProjectOptions;
}

/** Pack aktif: yang `locked` + pilihan user + penutup `requires`, urutan mengikuti `all`. */
export function resolvePacks(all: PackSource[], selected: string[]): PackSource[] {
  const byId = new Map(all.map((pack) => [pack.manifest.id, pack]));
  const active = new Set<string>();
  const visit = (id: string) => {
    if (active.has(id)) return;
    const pack = byId.get(id);
    if (!pack) throw new Error(`Pack tidak dikenal: ${id}`);
    active.add(id);
    pack.manifest.requires.forEach(visit);
  };
  all.filter((pack) => pack.manifest.locked).forEach((pack) => visit(pack.manifest.id));
  selected.forEach(visit);
  return all.filter((pack) => active.has(pack.manifest.id));
}

/** Slug npm dari nama project: huruf kecil, alfanumerik dipisah `-`. */
export function slugifyProjectName(name: string): string {
  return (
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'my-app'
  );
}

function applyInsert(content: string, insert: PackInsert, packId: string): string {
  const lines = content.split('\n');
  const index = lines.findIndex((line) => line.includes(insert.anchor));
  if (index === -1) {
    throw new Error(`Anchor "${insert.anchor}" tidak ada di ${insert.file} (pack ${packId}).`);
  }
  const indent = lines[index].match(/^\s*/)?.[0] ?? '';
  const inserted = insert.text.split('\n').map((line, i) => (i === 0 ? indent + line : indent + line.trimStart()));
  lines.splice(index, 0, ...inserted);
  return lines.join('\n');
}

function sortKeys(record: Record<string, string>): Record<string, string> {
  return Object.fromEntries(Object.entries(record).sort(([a], [b]) => a.localeCompare(b)));
}

const PERMISSION_ACTIONS = ['view', 'create', 'update', 'delete', 'bulk_upload', 'export'] as const;

/** Konversi konfigurasi modul CRUD menjadi PackSource in-memory. */
export function buildCustomModulePack(config: GeneratorConfig, index: number): PackSource {
  const generated = generateModule(config);
  const reg = buildRegistration(config);
  const files: FileMap = {};
  for (const file of generated) {
    if (file.path.endsWith('INTEGRATION.md')) continue;
    files[file.path] = file.content;
  }

  const inserts: PackInsert[] = [];
  if (reg.hasPages) {
    inserts.push(
      {
        file: 'src/app/router.tsx',
        anchor: '// __GENERATOR_IMPORTS__',
        text: `import { ${reg.routesExport} } from '${reg.routesImportPath}';`,
      },
      {
        file: 'src/app/router.tsx',
        anchor: '// __GENERATOR_ROUTES__',
        text: `...${reg.routesExport},`,
      },
      {
        file: 'src/app/navigation.tsx',
        anchor: '// __GENERATOR_NAV_IMPORTS__',
        text: `import { ${reg.navExport} } from '${reg.navImportPath}';`,
      },
      {
        file: 'src/app/navigation.tsx',
        anchor: '// __GENERATOR_NAV_ENTRIES__',
        text: `${reg.navExport},`,
      },
    );
  }
  inserts.push({
    file: 'src/app/permissions.ts',
    anchor: '// __PERMISSION_KEYS__',
    text: PERMISSION_ACTIONS.map((action) => `'${config.permissionKey}.${action}',`).join('\n'),
  });

  return {
    manifest: {
      id: `custom-module-${index + 1}-${config.permissionKey}`,
      label: config.moduleName,
      description: `Custom module ${config.moduleName}`,
      requires: [],
      dependencies: {},
      inserts,
    },
    files,
  };
}

/** Susun seluruh file project hasil. */
export function composeProject(input: ComposeInput): FileMap {
  const customPacks = (input.customModules ?? []).map((cfg, idx) => buildCustomModulePack(cfg, idx));
  const active = [...resolvePacks(input.packs, input.selected), ...customPacks];
  const output: FileMap = { ...input.designSystem, ...input.base };

  for (const pack of active) {
    for (const [path, content] of Object.entries(pack.files)) {
      if (path in output && !path.endsWith('.json')) {
        throw new Error(`Konflik file: ${path} dibuat ulang oleh pack ${pack.manifest.id}.`);
      }
      output[path] = content;
    }
  }
  for (const pack of active) {
    for (const insert of pack.manifest.inserts) {
      const target = output[insert.file];
      if (target === undefined) {
        throw new Error(`File ${insert.file} tidak ada (pack ${pack.manifest.id}).`);
      }
      output[insert.file] = applyInsert(target, insert, pack.manifest.id);
    }
  }

  const pkg = JSON.parse(output['package.json']) as {
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
  };
  for (const pack of active) {
    Object.assign(pkg.dependencies, pack.manifest.dependencies);
    Object.assign(pkg.devDependencies, pack.manifest.devDependencies ?? {});
  }
  (pkg as { engines?: Record<string, string> }).engines = { node: NODE_ENGINE_RANGE };
  output['.nvmrc'] = `${NODE_MAJOR}\n`;
  pkg.dependencies = sortKeys(pkg.dependencies);
  pkg.devDependencies = sortKeys(pkg.devDependencies);
  output['package.json'] = `${JSON.stringify(pkg, null, 2)}\n`;

  const logo = brandPublicPath('logo', input.project.brand?.logo);
  const tokens: Record<string, string> = {
    __PROJECT_NAME__: input.project.name,
    __PROJECT_SLUG__: input.project.slug,
    __PROJECT_THEME__: input.project.theme ?? 'light',
    __PROJECT_PRIMARY__: input.project.primaryColor ?? '',
    __PROJECT_LOGO__: logo,
    __PROJECT_LOGO_COLLAPSED__: brandPublicPath('logo-collapsed', input.project.brand?.collapsedLogo),
    __PROJECT_FAVICON__: logo.endsWith('.svg') ? logo : '/favicon.svg',
    __PROJECT_NODE__: NODE_MAJOR,
  };
  for (const [path, content] of Object.entries(output)) {
    if (!content.includes('__PROJECT_')) continue;
    output[path] = Object.entries(tokens).reduce((acc, [token, value]) => acc.split(token).join(value), content);
  }
  return output;
}
