/* Verifikasi emisi template + runtime generator (node only, tanpa browser).
 * Dijalankan via `npm run verify:generator`. Gagal (exit 1) bila ada ekspektasi
 * yang tidak terpenuhi. Cakupan: snippet FormItem/tabel/detail/rules/mapper/mock
 * untuk color/editor/upload-multiple/form-array + helper runtime baris.
 */
import { createJiti } from 'jiti';

const jiti = createJiti(import.meta.url);
const ROOT = new URL('../..', import.meta.url).pathname;
const fg = jiti(`${ROOT}/src/modules/generator/engine/fieldGenerator.ts`);
const naming = jiti(`${ROOT}/src/modules/generator/naming.ts`);
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
// Select tampil label opsi di tabel/detail: map statis → literal, paging → helper api.
const selStatic = F('status', 'Status', {
  type: 'selectField',
  source: 'mockStatic',
  options: [
    { label: 'Aktif', value: 'active' },
    { label: "Nonaktif", value: 'inactive' },
  ],
});
expectIn(fg.tableColumnSnippet(selStatic), "'active': 'Aktif'", 'table-static-label');
expectIn(fg.detailRowSnippet(selStatic), "'active': 'Aktif'", 'detail-static-label');
const selLoad = {
  ...base,
  name: 'seller',
  label: 'Seller',
  pascal: 'Seller',
  isLoadOptions: true,
  config: { name: 'seller', rules: [], label: 'Seller', type: 'selectField', source: 'mockPagingInfinityScroll' },
};
expectIn(fg.tableColumnSnippet(selLoad), 'getSellerOptionLabel(row.seller)', 'table-load-label');
expectIn(fg.detailRowSnippet(selLoad), 'getSellerOptionLabel(item.seller)', 'detail-load-label');
expectEq(fg.loadLabelHelpers([selLoad]).join(','), 'getSellerOptionLabel', 'label-helpers');
// Sub-field paging: kolom array memakai helper, import capitalize tak ikut.
const subLoad = { name: 'product', label: 'Product', type: 'selectField', rules: [], source: 'mockPagingInfinityScroll' };
const arrayLoadModel = {
  ...arrayModel,
  config: { ...arrayModel.config, subFields: [subLoad] },
};
expectEq(fg.arrayColumnUtils(arrayLoadModel).includes('capitalize'), false, 'array-utils-no-cap-paging');
expectIn(fg.arrayColumnsSnippet(arrayLoadModel), 'getItemsProductOptionLabel(row.product)', 'array-sub-load-label');
// Sub-field opsi statis: map literal + fallback capitalize tetap butuh import.
const subStatic = { name: 'kondisi', label: 'Kondisi', type: 'selectField', rules: [], source: 'mockStatic', options: [{ label: 'Baru', value: 'baru' }] };
const arrayStaticModel = {
  ...arrayModel,
  config: { ...arrayModel.config, subFields: [subStatic] },
};
expectEq(fg.arrayColumnUtils(arrayStaticModel).includes('capitalize'), true, 'array-utils-cap-static');
expectIn(fg.arrayColumnsSnippet(arrayStaticModel), "'baru': 'Baru'", 'array-sub-static-label');
// Relasi: resolve target + kolom/detail memakai RelationLabel + loader terdaftar.
const relTarget = naming.resolveRelationTarget({ definitionKey: 'catalogue/category', labelField: 'name', valueField: 'id' });
expectEq(relTarget?.mockListFn, 'mockGetCategories', 'relation-mock-fn');
expectEq(relTarget?.mockImportPath, '../../catalogue/category/api/mock', 'relation-import-path');
const relField = {
  ...base,
  name: 'category',
  label: 'Category',
  pascal: 'Category',
  isRelationOptions: true,
  loadOptionsFn: 'loadCategoryOptions',
  config: { name: 'category', rules: [], label: 'Category', type: 'selectField', source: 'relation', relation: { definitionKey: 'catalogue/category', labelField: 'name', valueField: 'id' } },
};
expectIn(fg.tableColumnSnippet(relField), '<RelationLabel loader={loadCategoryOptions} value={row.category} />', 'table-relation-label');
expectIn(fg.detailRowSnippet(relField), '<RelationLabel loader={loadCategoryOptions} value={item.category} />', 'detail-relation-label');
expectEq(fg.relationLoaders([relField]).join(','), 'loadCategoryOptions', 'relation-loaders');
expectIn(sg.mockRelationOptionsFn(relField), 'mockGetCategories({ search: search || undefined', 'relation-mock-loader');
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
// Tabel hasil generate memakai RowActionButton; size/warna dari canvas ikut ter-bake.
const actionProbe = mg.generateModule({
  ...probeConfig,
  tableProps: { actionIconSize: 20, actionIconColor: { edit: 'danger' } },
});
const actionTable = actionProbe.find((f) => f.path.endsWith('Table.tsx')).content;
expectIn(actionTable, 'RowActionButton', 'table-row-action-btn');
expectIn(actionTable, 'iconSize={20}', 'table-action-size-baked');
expectIn(actionTable, 'color="danger"', 'table-action-color-baked');
const defaultProbe = mg.generateModule(probeConfig);
const defaultTable = defaultProbe.find((f) => f.path.endsWith('Table.tsx')).content;
expectIn(defaultTable, 'RowActionButton', 'table-row-action-default');
expectEq(defaultTable.includes('iconSize='), false, 'table-action-size-absent');
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
// Publish ulang dgn ikon beda: item flat terupdate, bukan duplikat.
const flatBase = `${navSrc}const items = [
  {
    label: 'Probe',
    path: '/probes',
    icon: <Database className="h-5 w-5" />,
  },
];
// __GENERATOR_NAV_ITEMS__
`;
const flatReg = { ...iconReg, navPath: '/probes', routes: iconReg.routes };
const flatOut = mr.registerModuleNav(flatBase, flatReg);
expectIn(flatOut.source, '<Users className="h-5 w-5" />', 'icon-resync-flat');
expectEq(flatOut.added, false, 'icon-resync-no-dup');
const flatSame = mr.registerModuleNav(flatOut.source, flatReg);
expectEq(flatSame.source, flatOut.source, 'icon-resync-idempotent');
// Item anak: ikon group parent ikut terupdate.
const parentBase = `${navSrc}const items = [
  // __GENERATOR_PARENT master-data__
  {
    label: 'Master',
    icon: <Database className="h-5 w-5" />,
    children: [
      { label: 'Probe', path: '/probes', permissionKey: 'probe.view' },
    ],
  },
];
// __GENERATOR_NAV_ITEMS__
`;
const parentOut = mr.registerModuleNav(parentBase, { ...flatReg, parentPath: 'master-data' });
expectIn(parentOut.source, '<Users className="h-5 w-5" />', 'icon-resync-parent');
// Unregister: hapus routes + import + item nav, idempoten.
const fakeReg = {
  moduleImportPath: '../modules/probe',
  routes: [{ path: 'probes', code: '' }],
  navPath: '/probes',
  parentPath: '',
};
const routerSrc = `import {
  ProbeListPage,
} from '../modules/probe';
// __GENERATOR_IMPORTS__
const r = [
      {
        path: 'probes',
        element: <ProbeListPage />,
        handle: {
          breadcrumb: [{ label: 'Probes', labelKey: 'probe.breadcrumbs.list' }],
          requiredPermission: 'probe.view',
        },
      },
];`;
const unRoutes = mr.unregisterModuleRoutes(routerSrc, fakeReg);
expectEq(unRoutes.removed, 1, 'unreg-route-count');
expectEq(unRoutes.source.includes("path: 'probes'"), false, 'unreg-route-gone');
expectEq(unRoutes.source.includes('../modules/probe'), false, 'unreg-import-gone');
expectEq(unRoutes.source.includes('// __GENERATOR_IMPORTS__'), true, 'unreg-anchor-kept');
const unRoutesAgain = mr.unregisterModuleRoutes(unRoutes.source, fakeReg);
expectEq(unRoutesAgain.removed, 0, 'unreg-route-idempotent');
expectEq(unRoutesAgain.source, unRoutes.source, 'unreg-route-stable');
const navFlatDel = `${navSrc}const items = [
  {
    label: 'Probe',
    labelKey: 'probe.labelPlural',
    path: '/probes',
    icon: <Database className="h-5 w-5" />,
    permissionKey: 'probe.view',
  },
];
// __GENERATOR_NAV_ITEMS__
`;
const unNav = mr.unregisterModuleNav(navFlatDel, fakeReg);
expectEq(unNav.removed, 1, 'unreg-nav-count');
expectEq(unNav.source.includes("path: '/probes'"), false, 'unreg-nav-gone');
expectEq(unNav.source.includes('// __GENERATOR_NAV_ITEMS__'), true, 'unreg-nav-anchor-kept');
// Anak terakhir grup: grup + marker ikut terhapus; sibling tersisa dipertahankan.
const navGroupDel = `${navSrc}const items = [
  // __GENERATOR_PARENT master-data__
  {
    label: 'Master',
    labelKey: 'childmod.parentLabel',
    icon: <Database className="h-5 w-5" />,
    children: [
      { label: 'Probe', labelKey: 'probe.labelPlural', path: '/probes', permissionKey: 'probe.view' },
    ],
  },
];
// __GENERATOR_NAV_ITEMS__
`;
const unGroup = mr.unregisterModuleNav(navGroupDel, { ...fakeReg, parentPath: 'master-data' });
expectEq(unGroup.removed, 1, 'unreg-group-child');
expectEq(unGroup.source.includes('__GENERATOR_PARENT master-data__'), false, 'unreg-group-gone');
const navSiblingDel = `${navSrc}const items = [
  // __GENERATOR_PARENT master-data__
  {
    label: 'Master',
    labelKey: 'childmod.parentLabel',
    icon: <Database className="h-5 w-5" />,
    children: [
      { label: 'Probe', labelKey: 'probe.labelPlural', path: '/probes', permissionKey: 'probe.view' },
      { label: 'Other', labelKey: 'other.labelPlural', path: '/others', permissionKey: 'other.view' },
    ],
  },
];
// __GENERATOR_NAV_ITEMS__
`;
const unSibling = mr.unregisterModuleNav(navSiblingDel, { ...fakeReg, parentPath: 'master-data' });
expectEq(unSibling.removed, 1, 'unreg-sibling-child');
expectEq(unSibling.source.includes('__GENERATOR_PARENT master-data__'), true, 'unreg-group-kept');
expectIn(unSibling.source, "path: '/others'", 'unreg-sibling-kept');
// Validasi target hapus: dalam src/modules boleh, escape/luar ditolak.
const mw = jiti(`${ROOT}/vite-plugin/moduleWriter.ts`);
expectEq(mw.resolveDeleteTarget('/a/b', 'src/modules/probe'), '/a/b/src/modules/probe', 'del-target-ok');
for (const [bad, tag] of [['../escape', 'del-escape'], ['src/modules', 'del-root'], ['', 'del-empty']]) {
  try {
    mw.resolveDeleteTarget('/a/b', bad);
    fail++;
    console.log('MISS', tag, 'tidak melempar');
  } catch {
    /* diharapkan */
  }
}

// definitionToConfig mempertahankan menuIcon Step 1 (regresi ikon menu jadi Database).
const fd = jiti(`${ROOT}/src/modules/generator/engine/fromDefinition.ts`);
const iconDef = {
  key: 'region',
  label: 'Regions',
  singularLabel: 'Region',
  parent: null,
  moduleType: 'crud',
  permissionKey: 'region',
  features: {},
  menuIcon: { name: 'Users' },
  fields: [],
  layout: { table: { order: [], hidden: [] } },
};
const iconCfg = fd.definitionToConfig(iconDef);
expectEq(iconCfg.menuIcon?.name, 'Users', 'fromdef-menuicon');
// definitionToConfig mempertahankan layout form kanvas (regresi section/grid hilang saat publish ulang).
const layoutDef = {
  ...iconDef,
  layout: {
    form: [
      { field: 'section-1', order: 0, colSpan: 12, kind: 'section', label: 'Data' },
      { field: 'nama', order: 1, colSpan: 6 },
    ],
    table: { order: [], hidden: [] },
  },
};
const layoutCfg = fd.definitionToConfig(layoutDef);
expectEq(layoutCfg.formLayout?.length, 2, 'fromdef-formlayout-len');
expectEq(layoutCfg.formLayout?.[0]?.kind, 'section', 'fromdef-formlayout-section');
expectEq(layoutCfg.formLayout?.[1]?.colSpan, 6, 'fromdef-formlayout-span');
const rg = jiti(`${ROOT}/src/modules/generator/engine/registration.ts`);
const menuReg = rg.buildRegistration(iconCfg);
expectEq(menuReg.iconName, 'Users', 'registration-iconname');
expectIn(menuReg.navItemCode ?? menuReg.navSnippet ?? '', '<Users', 'registration-nav-icon');
// setTableProps: patch size/warna ikon aksi kanvas tersimpan (regresi dropdown kartu Ikon aksi).
const ops = jiti(`${ROOT}/src/modules/generator/runtime/layoutOps.ts`);
const baseLayout = { form: [], table: { order: [], hidden: [], props: { dense: true } } };
const sized = ops.setTableProps(baseLayout, { actionIconSize: 20 });
expectEq(sized.table.props.actionIconSize, 20, 'props-icon-size');
expectEq(sized.table.props.dense, true, 'props-icon-size-merge');
const colored = ops.setTableProps(sized, { actionIconColor: { edit: 'danger', view: 'bogus' } });
expectEq(JSON.stringify(colored.table.props.actionIconColor), JSON.stringify({ edit: 'danger' }), 'props-icon-color');
expectEq(colored.table.props.actionIconSize, 20, 'props-icon-color-keep-size');
const badSize = ops.setTableProps(colored, { actionIconSize: 99 });
expectEq('actionIconSize' in badSize.table.props, false, 'props-icon-size-invalid');
const badColor = ops.setTableProps(colored, { actionIconColor: { edit: 'bogus' } });
expectEq('actionIconColor' in badColor.table.props, false, 'props-icon-color-invalid');
const boolPatch = ops.setTableProps(baseLayout, { dense: false });
expectEq(boolPatch.table.props.dense, false, 'props-bool-still-works');
// Draft milik modul terhapus dikenali dari info-nya (cermin configToDefinition).
const dt = jiti(`${ROOT}/src/modules/generator/builder/draft.ts`);
const rootInfo = { parentName: '', newParentName: '', moduleName: 'Region', type: 'crud', permissionKey: 'region' };
expectEq(dt.draftDefinitionKey(rootInfo), 'region', 'draft-key-root');
const childInfo = { ...rootInfo, parentName: 'master-data', moduleName: 'Company' };
expectEq(dt.draftDefinitionKey(childInfo), 'master-data/company', 'draft-key-child');
const newParentInfo = { ...rootInfo, parentName: '__new__', newParentName: 'Master Data', moduleName: 'Company' };
expectEq(dt.draftDefinitionKey(newParentInfo), 'master-data/company', 'draft-key-new-parent');
const stub = (info) => ({ info, features: {}, fields: [], layout: null, deleteMode: 'soft', menuIcon: null, sampleRows: [], step: 0, updatedAt: '' });
expectEq(dt.isDraftOfModule(stub(childInfo), { key: 'master-data/company' }), true, 'draft-match');
expectEq(dt.isDraftOfModule(stub(childInfo), { key: 'master-data/other' }), false, 'draft-mismatch');
expectEq(dt.isDraftOfModule(stub({ ...childInfo, moduleName: '' }), { key: 'master-data/company' }), false, 'draft-empty-name');
expectEq(dt.isDraftOfModule(null, { key: 'region' }), false, 'draft-null');
// Aturan validasi: arg kosong/angka-tak-valid/regex-rusak ditolak publish; runtime tak crash.
const ruleField = (rules) => ({
  name: 'nama',
  label: 'Nama',
  type: 'textField',
  source: 'none',
  rules,
});
const ruleBase = {
  moduleName: 'Probe',
  parentName: null,
  type: 'crud',
  permissionKey: 'probe',
  features: {
    list: true,
    detail: false,
    create: false,
    edit: false,
    delete: false,
    bulkUpload: false,
    export: false,
  },
  fields: [],
};
function ruleIssues(rules) {
  return parser
    .validateConfig({ ...ruleBase, fields: [ruleField(rules)] })
    .filter((i) => i.path === 'fields[0].rules');
}
expectEq(ruleIssues(['min:']).length, 1, 'rule-arg-required');
expectEq(ruleIssues(['max:abc']).length, 1, 'rule-numeric');
expectEq(ruleIssues(['regex:(']).length, 1, 'rule-regex');
expectEq(ruleIssues(['min:3', 'max:10', 'regex:^\\d+$', 'required']).length, 0, 'rule-valid');
let rxThrew = false;
let rxRules = {};
try {
  rxRules = vr.fieldRulesToRHF({ name: 'kode', label: 'Kode', type: 'textField', rules: ['regex:('] });
} catch {
  rxThrew = true;
}
expectEq(rxThrew, false, 'runtime-regex-no-throw');
expectEq('pattern' in rxRules, false, 'runtime-regex-skipped');
const emptyMin = vr.fieldRulesToRHF({ name: 'nama', label: 'Nama', type: 'textField', rules: ['min:'] });
expectEq('minLength' in emptyMin, false, 'runtime-min-empty-skipped');
const okMin = vr.fieldRulesToRHF({ name: 'nama', label: 'Nama', type: 'textField', rules: ['min:3'] });
expectEq(okMin.minLength?.value, 3, 'runtime-min-kept');
// Kolom sistem: bisa dipindah (drag) + diatur lebar via canvas.
const sysLayout = { form: [], table: { order: ['nama', 'status'], hidden: [], props: {} } };
const movedSys = ops.moveTableColumn(sysLayout, 'status', 'nama');
expectEq(JSON.stringify(movedSys.table.order), JSON.stringify(['status', 'nama']), 'props-system-move');
const sysWidth = ops.setTableWidth(sysLayout, 'created_date', 200);
expectEq(sysWidth.table.widths.created_date, 200, 'props-system-width');
// Normalize mempertahankan posisi kolom sistem hasil drag (regresi seret kolom sistem).
const nl = jiti(`${ROOT}/src/modules/generator/definitions/normalize.ts`);
const normedSys = nl.normalizeLayout(
  { form: [], table: { order: ['status', 'nama'], hidden: [], props: {} } },
  ['nama'],
);
expectEq(JSON.stringify(normedSys.table.order), JSON.stringify(['status', 'nama', 'created_by', 'created_date']), 'normalize-keeps-system-order');
const normedMissing = nl.normalizeLayout(
  { form: [], table: { order: ['nama'], hidden: [], props: {} } },
  ['nama'],
);
expectEq(
  JSON.stringify(normedMissing.table.order),
  JSON.stringify(['nama', 'created_by', 'created_date', 'status']),
  'normalize-appends-system',
);
// Detail: posisi baris sistem hasil drag dipertahankan + bisa dipindah.
const normedDetail = nl.normalizeLayout(
  { form: [], table: { order: ['nama'], hidden: [] }, detail: { order: ['created_date', 'nama'], hidden: [] } },
  ['nama'],
);
expectEq(JSON.stringify(normedDetail.detail.order), JSON.stringify(['created_date', 'nama']), 'normalize-keeps-system-detail');
const movedDetail = ops.moveDetailItem(
  { form: [], table: { order: [], hidden: [] }, detail: { order: ['status', 'nama'], hidden: [] } },
  'nama',
  'status',
);
expectEq(JSON.stringify(movedDetail.detail.order), JSON.stringify(['nama', 'status']), 'props-system-detail-move');

console.log(fail === 0 ? 'EMISSION PASS' : `EMISSION FAIL (${fail})`);
process.exit(fail === 0 ? 0 : 1);
