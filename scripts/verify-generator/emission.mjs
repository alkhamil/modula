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

const ctx = { names: { testId: 'demo' } };
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
expectIn(fg.arrayInputSnippet(ctx, arrayModel), "required: 'Nama Barang is required.'", 'sub-rules');
expectIn(fg.tableColumnSnippet(arrayModel), "' baris'", 'array-cell');
expectIn(fg.detailRowSnippet(arrayModel), "' baris'", 'array-detail');
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

console.log(fail === 0 ? 'EMISSION PASS' : `EMISSION FAIL (${fail})`);
process.exit(fail === 0 ? 0 : 1);
