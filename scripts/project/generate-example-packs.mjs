/* Bangkitkan pack contoh modul (`templates/packs/example-*`) memakai engine generator yang sama
 * dengan yang akan tertanam di project hasil. Hasilnya di-commit; jalankan ulang bila engine/template berubah:
 *   npm run packs:examples
 * - example-flat    : modul tanpa parent (satu item menu di root).
 * - example-nested  : parent + dua child (menu group "Master Data"). */
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { createJiti } from 'jiti';
import { ROOT } from './fs-sources.mjs';

const jiti = createJiti(import.meta.url);
const { generateModule } = jiti(`${ROOT}/src/modules/generator/engine/moduleGenerator.ts`);
const { buildRegistration } = jiti(`${ROOT}/src/modules/generator/engine/registration.ts`);

const ALL_FEATURES = { list: true, detail: true, create: true, edit: true, delete: true, bulkUpload: true, export: true };
const text = (name, label, extra = {}) => ({
  name, label, type: 'textField', rules: [], sortable: true, filterable: true, filterCriteria: 'contains', source: 'none', ...extra,
});

/** Field generik (tanpa domain bisnis) — dipakai semua modul contoh. */
const genericFields = () => [
  text('name', 'Name', { rules: ['required', 'max:100'] }),
  text('code', 'Code', { rules: ['required', 'max:30'] }),
  { name: 'sort_order', label: 'Sort Order', type: 'numberField', rules: [], sortable: true, filterable: true, filterCriteria: 'numberExact', source: 'none' },
  { name: 'description', label: 'Description', type: 'textareaField', rules: ['max:500'], sortable: false, filterable: false, filterCriteria: null, source: 'none' },
];

const PACKS = [
  {
    id: 'example-flat',
    label: 'Example module: single (Default Module)',
    description: 'Contoh modul CRUD tunggal tanpa parent: satu item menu di root. Dibangkitkan oleh module generator; ganti namanya sesuai kebutuhan.',
    modules: [
      {
        parentName: null,
        moduleName: 'Default Module',
        type: 'crud',
        permissionKey: 'default_module',
        menuIcon: { name: 'Box' },
        features: ALL_FEATURES,
        fields: genericFields(),
      },
    ],
  },
  {
    id: 'example-nested',
    label: 'Example modules: parent + children (Default Parent)',
    description: 'Contoh dua modul CRUD di bawah satu parent "Default Parent": satu group menu dengan dua anak. Dibangkitkan oleh module generator; ganti namanya sesuai kebutuhan.',
    modules: [
      {
        parentName: 'default-parent',
        moduleName: 'Default Item',
        type: 'crud',
        permissionKey: 'default_item',
        menuIcon: { name: 'Box' },
        features: ALL_FEATURES,
        fields: genericFields(),
      },
      {
        parentName: 'default-parent',
        moduleName: 'Default Record',
        type: 'crud',
        permissionKey: 'default_record',
        menuIcon: { name: 'Layers' },
        features: ALL_FEATURES,
        fields: genericFields(),
      },
    ],
  },
];

const PERMISSION_ACTIONS = ['view', 'create', 'update', 'delete', 'bulk_upload', 'export'];

for (const pack of PACKS) {
  const dir = join(ROOT, 'templates/packs', pack.id);
  rmSync(dir, { recursive: true, force: true });
  const inserts = [];
  const permissionKeys = [];
  for (const config of pack.modules) {
    for (const file of generateModule(config)) {
      if (file.path.endsWith('INTEGRATION.md')) continue;
      const full = join(dir, 'files', file.path);
      mkdirSync(dirname(full), { recursive: true });
      writeFileSync(full, file.content);
    }
    const reg = buildRegistration(config);
    inserts.push(
      { file: 'src/app/router.tsx', anchor: '// __GENERATOR_IMPORTS__', text: `import { ${reg.routesExport} } from '${reg.routesImportPath}';` },
      { file: 'src/app/router.tsx', anchor: '// __GENERATOR_ROUTES__', text: `...${reg.routesExport},` },
      { file: 'src/app/navigation.tsx', anchor: '// __GENERATOR_NAV_IMPORTS__', text: `import { ${reg.navExport} } from '${reg.navImportPath}';` },
      { file: 'src/app/navigation.tsx', anchor: '// __GENERATOR_NAV_ENTRIES__', text: `${reg.navExport},` },
    );
    for (const action of PERMISSION_ACTIONS) permissionKeys.push(`${config.permissionKey}.${action}`);
  }
  inserts.push({
    file: 'src/app/permissions.ts',
    anchor: '// __PERMISSION_KEYS__',
    text: permissionKeys.map((key) => `'${key}',`).join('\n'),
  });
  const manifest = { id: pack.id, label: pack.label, description: pack.description, default: true, requires: [], dependencies: {}, inserts };
  writeFileSync(join(dir, 'pack.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`${pack.id}: ${pack.modules.length} modul`);
}
