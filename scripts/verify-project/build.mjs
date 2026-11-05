/* Verifikasi project hasil wizard: susun beberapa kombinasi pack ke .tmp/verify-project/<kombinasi>,
 * uji zip round-trip (fflate zipProjectFiles → unzipSync), cek dependensi & token tersisa,
 * lalu `tsc -b` + `vite build`.
 * node_modules diambil dari repo ini (folder tmp ada di dalam repo), jadi tanpa `npm install`.
 * Dijalankan via `npm run verify:project`. Argumen: nama kombinasi (opsional) atau `--keep`. */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { builtinModules } from 'node:module';
import { dirname, join } from 'node:path';
import { unzipSync } from 'fflate';
import { createJiti } from 'jiti';
import { ROOT, loadBase, loadDesignSystem, loadPacks } from '../project/fs-sources.mjs';

const jiti = createJiti(import.meta.url);
const { composeProject, composeProjectAssets } = jiti(`${ROOT}/src/modules/creator/engine/compose.ts`);
const { zipProjectFiles } = jiti(`${ROOT}/src/modules/creator/engine/zip.ts`);

const CUSTOM_INVOICE_MODULE = {
  parentName: 'billing',
  moduleName: 'Invoice',
  type: 'crud',
  permissionKey: 'invoice',
  menuIcon: { name: 'BillList' },
  features: { list: true, detail: true, create: true, edit: true, delete: true, bulkUpload: true, export: true },
  fields: [
    { name: 'invoiceNumber', label: 'Invoice Number', type: 'textField', rules: ['required', 'max:40'], sortable: true, filterable: true, filterCriteria: 'contains', source: 'none' },
    { name: 'amount', label: 'Amount', type: 'numberField', rules: ['required'], sortable: true, filterable: true, filterCriteria: 'numberExact', source: 'none' },
    { name: 'statusNote', label: 'Status Note', type: 'textareaField', rules: ['max:250'], sortable: false, filterable: false, filterCriteria: null, source: 'none' },
  ],
};

const COMBOS = {
  minimal: { selected: [] },
  full: {
    selected: ['logout', 'forgot-password', 'register', 'two-factor', 'user', 'role', 'example-flat', 'example-nested'],
    customModules: [CUSTOM_INVOICE_MODULE],
  },
  modules: { selected: ['user', 'role', 'example-flat', 'example-nested'] },
  role: { selected: ['role'] },
  nested: { selected: ['example-nested'] },
  // Brand + tema + versi Node dari wizard: logo svg, ikon collapsed png, mode gelap, primary kustom.
  branded: {
    selected: ['example-flat'],
    project: {
      theme: 'dark',
      primaryColor: '#2b80af',
      brand: {
        logo: { ext: 'svg', bytes: new TextEncoder().encode('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8"><rect width="8" height="8"/></svg>') },
        collapsedLogo: { ext: 'png', bytes: new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]) },
      },
    },
  },
};

const args = process.argv.slice(2);
const keep = args.includes('--keep');
const only = args.find((arg) => !arg.startsWith('--'));
const combos = only ? { [only]: COMBOS[only] } : COMBOS;
if (only && !COMBOS[only]) throw new Error(`Kombinasi tidak dikenal: ${only}`);

const base = loadBase();
const designSystem = loadDesignSystem();
const packs = loadPacks();
const failures = [];

function fail(combo, message) {
  failures.push(`[${combo}] ${message}`);
  console.error(`  ✗ ${message}`);
}

/** Paket bare yang di-import (static + dynamic) vs package.json hasil. */
function checkDependencies(combo, files) {
  const pkg = JSON.parse(files['package.json']);
  const declared = new Set([...Object.keys(pkg.dependencies), ...Object.keys(pkg.devDependencies)]);
  const builtin = new Set(builtinModules);
  const used = new Set();
  for (const [path, content] of Object.entries(files)) {
    if (!/\.(tsx?|css)$/.test(path)) continue;
    const code = content
      .split('\n')
      .filter((line) => !/^\s*(\*|\/\/|\/\*)/.test(line))
      .join('\n');
    const re = /(?:from\s+|import\s*\(\s*|import\s+|@import\s+)['"]([^'"./][^'"]*)['"]/g;
    for (const match of code.matchAll(re)) {
      const spec = match[1];
      if (spec.includes('${')) continue;
      const name = spec.startsWith('@') ? spec.split('/').slice(0, 2).join('/') : spec.split('/')[0];
      if (!builtin.has(name) && !name.startsWith('node:')) used.add(name);
    }
  }
  for (const name of used) {
    if (!declared.has(name) && !declared.has(`@types/${name}`)) fail(combo, `dependensi "${name}" dipakai tapi tidak ada di package.json`);
  }
}

for (const [combo, spec] of Object.entries(combos)) {
  const { selected, customModules = [], project: projectExtra = {} } = spec;
  const customDesc = customModules.length ? ` + custom(${customModules.map((m) => m.moduleName).join(',')})` : '';
  console.log(`\n▶ ${combo} (${['login', ...selected].join(', ')}${customDesc})`);
  const outDir = join(ROOT, '.tmp/verify-project', combo);
  rmSync(outDir, { recursive: true, force: true });
  let files;
  try {
    files = composeProject({
      base,
      designSystem,
      packs,
      selected,
      customModules,
      project: { ...projectExtra, name: 'Verify App', slug: 'verify-app' },
    });
  } catch (error) {
    fail(combo, `compose gagal: ${error.message}`);
    continue;
  }

  // Uji zip round-trip: zipProjectFiles → unzipSync → tulis hasil ekstrak ke outDir
  const slug = 'verify-app';
  const assets = composeProjectAssets({ ...projectExtra, name: 'Verify App', slug });
  const zipped = zipProjectFiles(files, slug, assets);
  const unzipped = unzipSync(zipped);
  const unzippedKeys = Object.keys(unzipped);
  if (unzippedKeys.length !== Object.keys(files).length + Object.keys(assets).length) {
    fail(combo, `zip round-trip jumlah file tidak cocok: ${unzippedKeys.length} vs ${Object.keys(files).length + Object.keys(assets).length}`);
  }
  for (const [zipPath, bytes] of Object.entries(unzipped)) {
    const relPath = zipPath.replace(new RegExp(`^${slug}/`), '');
    const full = join(outDir, relPath);
    mkdirSync(dirname(full), { recursive: true });
    writeFileSync(full, bytes);
  }
  console.log(`  ${Object.keys(files).length} file (${(zipped.byteLength / 1024).toFixed(0)} KB zip) → ${outDir}`);

  // Node selalu 24 untuk semua kombinasi.
  if (files['.nvmrc'] !== '24\n') fail(combo, '.nvmrc harus 24');
  if (JSON.parse(files['package.json']).engines?.node !== '>=24.0.0') fail(combo, 'engines.node harus >=24.0.0');
  if (projectExtra.brand) {
    const config = files['src/app/project.config.ts'];
    for (const needle of ["'/brand/logo.svg'", "'/brand/logo-collapsed.png'", "'dark'", "'#2b80af'"]) {
      if (!config.includes(needle)) fail(combo, `project.config.ts tidak memuat ${needle}`);
    }
    if (!files['index.html'].includes('href="/brand/logo.svg"')) fail(combo, 'favicon tidak memakai logo svg');
    if (!existsSync(join(outDir, 'public/brand/logo.svg')) || !existsSync(join(outDir, 'public/brand/logo-collapsed.png'))) {
      fail(combo, 'berkas logo tidak ikut ke hasil unzip');
    }
  }

  const leftover = Object.entries(files).filter(([, content]) => content.includes('__PROJECT_'));
  for (const [path] of leftover) fail(combo, `token __PROJECT_* tersisa di ${path}`);
  checkDependencies(combo, files);

  for (const [label, bin, binArgs] of [
    ['tsc -b', 'typescript/bin/tsc', ['-b']],
    ['vite build', 'vite/bin/vite.js', ['build']],
  ]) {
    try {
      execFileSync('node', [join(ROOT, 'node_modules', bin), ...binArgs], { cwd: outDir, stdio: 'pipe' });
      console.log(`  ✓ ${label}`);
    } catch (error) {
      fail(combo, `${label} gagal:\n${String(error.stdout ?? '')}${String(error.stderr ?? '')}`.slice(0, 4000));
    }
  }
  if (!keep) rmSync(outDir, { recursive: true, force: true });
}

if (!keep) rmSync(join(ROOT, '.tmp/verify-project'), { recursive: true, force: true });
if (failures.length) {
  console.error(`\n${failures.length} masalah:\n${failures.join('\n')}`);
  process.exit(1);
}
console.log('\nverify:project OK');
