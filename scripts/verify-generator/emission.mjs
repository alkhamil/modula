/* Verifikasi emisi template + runtime generator (node only, tanpa browser).
 * Dijalankan via `npm run verify:generator`. Gagal (exit 1) bila ada ekspektasi
 * yang tidak terpenuhi. Cakupan: snippet FormItem/tabel/detail/rules/mapper/mock
 * untuk color/editor/upload-multiple/form-array + helper runtime baris.
 */
import { createJiti } from 'jiti';

const jiti = createJiti(import.meta.url);
const ROOT = new URL('../..', import.meta.url).pathname;
const fg = jiti(`${ROOT}/src/modules/generator/engine/fieldGenerator.ts`);
const vg = jiti(`${ROOT}/src/modules/generator/engine/validationGenerator.ts`);
const sg = jiti(`${ROOT}/src/modules/generator/engine/sourceGenerator.ts`);
const parser = jiti(`${ROOT}/src/modules/generator/parser.ts`);
const cp = jiti(`${ROOT}/src/modules/generator/componentProps.ts`);
const vr = jiti(`${ROOT}/src/modules/generator/runtime/validation.ts`);
const utils = jiti(`${ROOT}/src/shared/utils/index.ts`);

const ctx = { names: { testId: 'demo' }, config: { permissionKey: 'demo' } };
const base = {
  name: 'x',
  pascal: 'X',
  valueType: 'string',
  formType: 'string',
  isSelect: false,
  isOptionField: false,
  isMultiOption: false,
  isOptionsQuery: false,
  isLoadOptions: false,
  rulesVar: 'rules',
  optionType: '',
  mockOptionsVar: '',
  optionsQueryHook: '',
  loadOptionsFn: '',
  sortable: false,
  filterable: false,
  filterCriteria: null,
};
const F = (name, label, config) => ({
  ...base,
  name,
  label,
  config: { name, rules: [], label, ...config },
});

let fail = 0;
function expectIn(hay, needle, tag) {
  if (!hay.includes(needle)) {
    fail++;
    console.log('MISS', tag, JSON.stringify(needle), '\n' + hay);
  }
}
function expectEq(actual, expected, tag) {
  if (actual !== expected) {
    fail++;
    console.log('MISS', tag, 'got', JSON.stringify(actual), 'want', JSON.stringify(expected));
  }
}

// --- Fase C: color/editor/upload-multiple ---
const color = fg.formItemSnippet(ctx, F('warna', 'Warna', { type: 'colorField', componentProps: { color: { size: 'lg' } } }));
expectIn(color, 'component={ColorField}', 'color-component');
expectIn(color, 'size="lg"', 'color-size');
expectIn(fg.formItemSnippet(ctx, F('deskripsi', 'Deskripsi', { type: 'editorField' })), 'component={EditorField}', 'editor-component');
const upMulti = fg.formItemSnippet(ctx, F('lampiran', 'Lampiran', { type: 'fileUploadField', componentProps: { upload: { multiple: true } } }));
expectIn(upMulti, 'multiple', 'upload-multiple');
const upSingle = fg.formItemSnippet(ctx, F('dok', 'Dok', { type: 'fileUploadField' }));
if (upSingle.includes('multiple')) {
  fail++;
  console.log('UNEXPECTED multiple in single upload');
}
expectIn(fg.tableColumnSnippet(F('warna', 'Warna', { type: 'colorField' })), 'backgroundColor', 'color-cell');
expectIn(fg.tableColumnSnippet(F('deskripsi', 'Deskripsi', { type: 'editorField' })), 'stripHtml', 'editor-cell');
expectIn(fg.detailRowSnippet(F('warna', 'Warna', { type: 'colorField' })), 'backgroundColor', 'color-detail');
expectIn(fg.detailRowSnippet(F('deskripsi', 'Deskripsi', { type: 'editorField' })), 'stripHtml', 'editor-detail');
const multiModel = F('lampiran', 'Lampiran', { type: 'fileUploadField', componentProps: { upload: { multiple: true } } });
multiModel.valueType = 'file';
multiModel.formType = 'file';
expectEq(fg.tsFormType(multiModel), 'File | File[] | null', 'tsFormType-multiple');
expectIn(fg.payloadMapping(multiModel), 'Array.isArray', 'payload-multiple');
expectEq(cp.propsKeyForType('colorField'), 'color', 'propsKey-color');
expectEq(cp.propsKeyForType('editorField'), 'editor', 'propsKey-editor');
expectEq(utils.stripHtml('<p>Halo <b>Dunia</b></p>'), 'Halo Dunia', 'stripHtml');

// --- Fase D: form array ---
const subName = { name: 'namaBarang', label: 'Nama Barang', type: 'textField', rules: ['required'], source: 'none' };
const subQty = { name: 'qty', label: 'Qty', type: 'numberField', rules: [], source: 'none' };
const subFile = { name: 'nota', label: 'Nota', type: 'fileUploadField', rules: [], source: 'none' };
const arrayModel = {
  ...base,
  name: 'items',
  label: 'Items',
  pascal: 'Items',
  valueType: 'rowArray',
  formType: 'rowArray',
  rulesVar: 'itemsRules',
  config: {
    name: 'items',
    label: 'Items',
    rules: ['required', 'min:1'],
    type: 'formArrayField',
    subFields: [subName, subQty, subFile],
  },
};
expectIn(fg.formItemSnippet(ctx, arrayModel), 'component={ItemsArrayInput}', 'array-input');
expectIn(fg.formItemSnippet(ctx, arrayModel), 'editorTitle="Items"', 'array-editor-title');
expectIn(fg.rowInterfacesSnippet(arrayModel), 'export interface ItemsRow extends Record<string, unknown>', 'row-iface');
expectIn(fg.rowInterfacesSnippet(arrayModel), 'qty: number;', 'row-iface-num');
expectIn(fg.rowInterfacesSnippet(arrayModel), 'nota: File | null;', 'rowform-file');
expectIn(fg.rowMappersSnippet(arrayModel), "String(row?.qty ?? '')", 'mapper-num-form');
expectIn(fg.rowMappersSnippet(arrayModel), 'parseCurrency(form.qty)', 'mapper-num-data');
expectIn(fg.arrayColumnsSnippet(arrayModel), 'const ItemsArrayColumns: Column<ItemsRow>[]', 'array-cols');
expectIn(fg.arrayInputSnippet(ctx, arrayModel), 'function ItemsRowEditor', 'row-editor');
expectIn(fg.arrayInputSnippet(ctx, arrayModel), 'testId="demo-items-namaBarang"', 'sub-testid');
expectIn(
  fg.arrayInputSnippet(ctx, arrayModel),
  "t('validation.required', { label: t('demo.fields.items.sub.namaBarang.label') })",
  'sub-rules',
);
expectIn(fg.tableColumnSnippet(arrayModel), "t('system.rowCount'", 'array-cell');
expectIn(fg.detailRowSnippet(arrayModel), "t('system.rowCount'", 'array-detail');
expectEq(fg.tsDataType(arrayModel), 'ItemsRow[]', 'tsDataType-array');
expectEq(fg.tsFormType(arrayModel), 'ItemsRow[]', 'tsFormType-array');
expectEq(fg.formDefaultValue(arrayModel), '[]', 'formDefault-array');
expectEq(fg.payloadMapping(arrayModel), 'data.items', 'payload-array');
expectIn(vg.buildRulesObject(arrayModel), 'value.length > 0', 'rules-array-required');
expectIn(sg.mockRecordValue(arrayModel, 'i'), 'namaBarang:', 'mock-array');
const form = vr.rowFormValues([subName, subQty, subFile], { namaBarang: 'Buku', qty: 3 });
expectEq(`${form.namaBarang}|${form.qty}|${form.nota}`, 'Buku|3|null', 'rowFormValues');
const rhf = vr.fieldRulesToRHF({ name: 'items', label: 'Items', type: 'formArrayField', rules: ['required'], source: 'none' });
if (typeof rhf.validate?.required !== 'function' || rhf.validate.required([]) === true) {
  fail++;
  console.log('MISS rhf-array-required');
}
const cfg = parser.normalizeConfig({
  parentName: null, moduleName: 'M', permissionKey: 'm', type: 'crud', features: {},
  fields: [{ name: 'items', label: 'Items', type: 'formArrayField', rules: [], source: 'none',
    subFields: [{ name: 'sub', label: 'Sub', type: 'formArrayField', rules: [], source: 'none' }] }],
});
expectEq((cfg.fields[0].subFields ?? []).length, 0, 'normalize-strips-nested');

// --- Fase E: i18n per-modul (Slice A) ---
const mg = jiti(`${ROOT}/src/modules/generator/engine/moduleGenerator.ts`);
const reg = jiti(`${ROOT}/src/modules/generator/engine/registration.ts`);
const probeConfig = {
  parentName: null,
  moduleName: 'I18n Probe',
  type: 'crud',
  permissionKey: 'i18nprobe',
  features: { list: true, detail: true, create: true, edit: true, delete: true, bulkUpload: true, export: true },
  fields: [
    { name: 'nama', label: 'Nama', type: 'textField', rules: ['required', 'min:3'], sortable: true, filterable: true, filterCriteria: 'contains', source: 'none' },
    { name: 'tipe', label: 'Tipe', type: 'selectField', rules: ['required'], sortable: false, filterable: true, filterCriteria: 'optionExact', source: 'mockStatic', options: [{ label: 'A', value: 'a' }] },
    {
      name: 'items', label: 'Items', type: 'formArrayField', rules: ['required'], sortable: false, filterable: false, filterCriteria: null, source: 'none',
      subFields: [{ name: 'barang', label: 'Barang', type: 'textField', rules: ['required'], source: 'none' }],
    },
  ],
};
const emitted = mg.generateModule(probeConfig);
const byPath = Object.fromEntries(emitted.map((f) => [f.path, f.content]));
const enPath = Object.keys(byPath).find((p) => p.endsWith('i18n/en.json'));
const idPath = Object.keys(byPath).find((p) => p.endsWith('i18n/id.json'));
expectEq(typeof enPath, 'string', 'emit-en');
expectEq(typeof idPath, 'string', 'emit-id');
const enJson = JSON.parse(byPath[enPath]);
expectEq(byPath[idPath], byPath[enPath], 'id-placeholders-en');
const mod = enJson.i18nprobe;
expectEq(typeof mod?.label, 'string', 'locale-label');
expectEq(typeof mod?.labelPlural, 'string', 'locale-labelPlural');
expectEq(typeof mod?.breadcrumbs?.create, 'string', 'locale-crumb');
expectEq(mod?.fields?.nama?.label, 'Nama', 'locale-field-label');
expectEq(typeof mod?.fields?.nama?.placeholder, 'string', 'locale-field-placeholder');
expectEq(mod?.fields?.items?.sub?.barang?.label, 'Barang', 'locale-sub-label');
expectEq(typeof mod?.fields?.items?.array?.editorTitle, 'string', 'locale-array-title');
expectEq(typeof mod?.toast?.created, 'string', 'locale-toast');
// Semua key t('<base>...') statis di file hasil generate harus ada di en.json.
const flat = {};
(function flatten(obj, pre = '') {
  for (const [k, v] of Object.entries(obj)) {
    if (v && typeof v === 'object') flatten(v, `${pre}${k}.`);
    else flat[`${pre}${k}`] = v;
  }
})(enJson);
const code = emitted.filter((f) => /\.(ts|tsx)$/.test(f.path)).map((f) => f.content).join('\n');
const usedKeys = [...code.matchAll(/t\('(i18nprobe\.[A-Za-z0-9_.]+)'/g)].map((m) => m[1]);
expectEq(usedKeys.length > 0, true, 'module-keys-used');
for (const k of new Set(usedKeys)) {
  if (!(k in flat)) {
    fail++;
    console.log('MISS locale-key', k);
  }
}
// Literal Inggris lama di posisi UI harus hilang dari output.
for (const lit of [
  "header: 'Created By'",
  "header: 'Status'",
  "{ label: 'Status'",
  'is required.',
  'created successfully.',
  "not found'",
]) {
  if (code.includes(lit)) {
    fail++;
    console.log('MISS literal-leak', JSON.stringify(lit));
  }
}
// id.json = en ditimpa terjemahan step Translation (hanya key `<base>...`).
const translatedConfig = {
  ...probeConfig,
  i18n: { id: { 'i18nprobe.fields.nama.label': 'Nama (ID)', 'field.nama.label': 'SKIP', 'other.x': 'SKIP' } },
};
const translatedFiles = mg.generateModule(translatedConfig);
const translatedByPath = Object.fromEntries(translatedFiles.map((f) => [f.path, f.content]));
const idPath2 = Object.keys(translatedByPath).find((p) => p.endsWith('i18n/id.json'));
const idJson2 = JSON.parse(translatedByPath[idPath2]);
expectEq(idJson2.i18nprobe.fields.nama.label, 'Nama (ID)', 'id-merge');
expectEq(idJson2.i18nprobe.fields.nama.placeholder, enJson.i18nprobe.fields.nama.placeholder, 'id-fallback');
expectEq('field' in idJson2 || 'other' in idJson2, false, 'id-base-filter');
// definitionToConfig meneruskan i18n (sumber id.json saat Generate to repo).
const defs = jiti(`${ROOT}/src/modules/generator/definitions/normalize.ts`);
const { definitionToConfig } = jiti(`${ROOT}/src/modules/generator/engine/fromDefinition.ts`);
const savedDef = defs.configToDefinition(translatedConfig, { status: 'draft' });
const roundConfig = definitionToConfig(savedDef);
expectEq(roundConfig.i18n?.id?.['i18nprobe.fields.nama.label'], 'Nama (ID)', 'i18n-roundtrip');

// Registrasi: breadcrumb + nav memakai labelKey modul (fallback label tetap ada).
const regOut = reg.buildRegistration(probeConfig);
const regCode = regOut.routes.map((r) => r.code).join('\n') + '\n' + regOut.navItemCode;
expectIn(regCode, "labelKey: 'i18nprobe.breadcrumbs.list'", 'reg-crumb-list');
expectIn(regCode, "labelKey: 'i18nprobe.breadcrumbs.create'", 'reg-crumb-create');
expectIn(regCode, "labelKey: 'i18nprobe.labelPlural'", 'reg-nav');
// Grup parent: label + labelKey parentLabel (satu key per modul anak).
const parentConfig = { ...probeConfig, parentName: 'Master Data', permissionKey: 'childmod' };
const parentLocales = mg.generateModule(parentConfig);
const parentEn = JSON.parse(
  parentLocales.find((f) => f.path.endsWith('i18n/en.json')).content,
);
expectEq(parentEn.childmod.parentLabel, 'Master Data', 'locale-parent');
const parentReg = reg.buildRegistration(parentConfig);
expectIn(parentReg.navSnippet, "labelKey: 'childmod.parentLabel'", 'reg-parent-key');
expectIn(parentReg.navSnippet, "label: 'Master Data'", 'reg-parent-fallback');
// Tanpa parent: tidak ada key parentLabel.
expectEq('parentLabel' in enJson.i18nprobe, false, 'locale-no-parent');
// Ikon nav: nama lucide dari config dipakai di snippet; default Database.
const iconConfig = { ...probeConfig, menuIcon: { name: 'Users' } };
const iconReg = reg.buildRegistration(iconConfig);
expectEq(iconReg.iconName, 'Users', 'reg-icon-name');
expectIn(iconReg.navItemCode, '<Users className="h-5 w-5" />', 'reg-icon-code');
const noIconReg = reg.buildRegistration(probeConfig);
expectEq(noIconReg.iconName, 'Database', 'reg-icon-default');
// Registrasi nav (vite-plugin): validasi keberadaan ikon + kelola import lucide.
const mr = jiti(`${ROOT}/vite-plugin/moduleRegistration.ts`);
expectEq(mr.resolveNavIconName('Users'), 'Users', 'icon-known');
expectEq(mr.resolveNavIconName('NotAnIcon'), 'Database', 'icon-unknown');
expectEq(mr.resolveNavIconName('x;evil()'), 'Database', 'icon-evil');
const navSrc = "import { Database } from 'lucide-react';\nconst x = 1;\n";
expectIn(mr.ensureLucideImport(navSrc, 'Database'), "import { Database } from 'lucide-react';", 'icon-import-kept');
expectIn(mr.ensureLucideImport(navSrc, 'Users'), "import { Database, Users } from 'lucide-react';", 'icon-import-added');

console.log(fail === 0 ? 'EMISSION PASS' : `EMISSION FAIL (${fail})`);
process.exit(fail === 0 ? 0 : 1);
