/**
 * Muat sumber template di browser lewat `import.meta.glob` (Vite-only, makanya tidak di `engine/`).
 * Isinya dimuat lazy — ±8 MB teks (ikon WDS) hanya diambil saat user menekan Download.
 * Peta yang dihasilkan sama persis dengan `scripts/project/fs-sources.mjs` (dicek `verify:project`).
 */
import type { FileMap, PackManifest, PackSource } from './engine/compose';

type RawLoaders = Record<string, () => Promise<string>>;

/**
 * Catatan: Vite dev server memblokir request HTTP ke dotfile (`.env*`, `.gitignore`, `.gitkeep`)
 * demi keamanan (`server.fs.deny`), sehingga `import.meta.glob` hanya memuat file non-dotfile,
 * sementara dotfile disuntikkan secara eksplisit sebagai konstanta di bawah.
 */
const BASE_DOTFILES: FileMap = {
  '.gitignore': 'node_modules/\ndist/\n.env\n',
  '.env.example': '# Base URL API backend (axios, src/shared/lib/api.ts)\nVITE_API_BASE_URL=http://localhost:8080\n',
};

const GENERATOR_DOTFILES: FileMap = {
  'src/modules/generator/seeds/definitions/.gitkeep': '',
  'src/modules/generator/seeds/records/.gitkeep': '',
};

const baseFiles = import.meta.glob('/templates/base-project/**/*', {
  query: '?raw',
  import: 'default',
}) as RawLoaders;

const packFiles = import.meta.glob('/templates/packs/*/files/**/*', {
  query: '?raw',
  import: 'default',
}) as RawLoaders;

const generatorFiles = import.meta.glob(['/src/modules/generator/**/*', '/vite-plugin/**/*'], {
  query: '?raw',
  import: 'default',
}) as RawLoaders;

const sharedFiles = import.meta.glob('/src/shared/**/*', {
  query: '?raw',
  import: 'default',
}) as RawLoaders;

const singleFiles = import.meta.glob(['/src/index.css', '/public/favicon.svg'], {
  query: '?raw',
  import: 'default',
}) as RawLoaders;

/** Manifest kecil → dimuat langsung (dipakai wizard untuk daftar pack). */
const packManifests = import.meta.glob('/templates/packs/*/pack.json', {
  eager: true,
  import: 'default',
}) as Record<string, PackManifest>;

const packOrder = import.meta.glob('/templates/packs/order.json', {
  eager: true,
  import: 'default',
}) as Record<string, string[]>;

async function readAll(loaders: RawLoaders, stripPrefix: string, addPrefix = ''): Promise<FileMap> {
  const entries = await Promise.all(
    Object.entries(loaders).map(async ([path, load]) => [addPrefix + path.slice(stripPrefix.length), await load()] as const),
  );
  return Object.fromEntries(entries);
}

function orderedManifests(): PackManifest[] {
  const manifests = Object.values(packManifests);
  const order = Object.values(packOrder)[0] ?? manifests.map((manifest) => manifest.id);
  return order.map((id) => {
    const manifest = manifests.find((candidate) => candidate.id === id);
    if (!manifest) throw new Error(`order.json menyebut pack "${id}" yang tidak punya pack.json`);
    return manifest;
  });
}

/** Daftar pack (urutan penerapan) untuk wizard — tanpa memuat isi file. */
export function listPackManifests(): PackManifest[] {
  return orderedManifests();
}

export interface ProjectSources {
  base: FileMap;
  designSystem: FileMap;
  packs: PackSource[];
}

let cache: Promise<ProjectSources> | null = null;

/** Muat seluruh sumber (di-cache setelah panggilan pertama). */
export function loadProjectSources(): Promise<ProjectSources> {
  cache ??= (async () => {
    const [baseLoaded, shared, single, packs] = await Promise.all([
      readAll(baseFiles, '/templates/base-project/'),
      readAll(sharedFiles, '/', ''),
      readAll(singleFiles, '/'),
      Promise.all(
        orderedManifests().map(async (manifest) => ({
          manifest,
          files:
            manifest.id === 'generator'
              ? { ...(await readAll(generatorFiles, '/')), ...GENERATOR_DOTFILES }
              : await readAll(
                  Object.fromEntries(
                    Object.entries(packFiles).filter(([path]) =>
                      path.startsWith(`/templates/packs/${manifest.id}/files/`),
                    ),
                  ),
                  `/templates/packs/${manifest.id}/files/`,
                ),
        })),
      ),
    ]);
    return {
      base: { ...BASE_DOTFILES, ...baseLoaded },
      designSystem: { ...shared, ...single },
      packs,
    };
  })();
  return cache;
}
