import { buildRulesObject, getMaxLength } from './validationGenerator';
import type { FieldModel, TemplateContext } from './context';
import { fieldTypeRegistry } from '../registry/fieldTypes';
import { toPascalCase } from '../naming';
import type { GeneratorFieldConfig } from '../types';

/** Tipe TS skalar dari valueType (dipakai field top-level + sub-field array). */
export function scalarDataType(valueType: string): string {
  switch (valueType) {
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'stringArray':
      return 'string[]';
    case 'file':
    case 'string':
    default:
      return 'string';
  }
}

/** Tipe TS form skalar dari formType. */
export function scalarFormType(valueType: string, multipleUpload = false): string {
  switch (valueType) {
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'stringArray':
      return 'string[]';
    case 'file':
      return multipleUpload ? 'File | File[] | null' : 'File | null';
    case 'string':
    default:
      return 'string';
  }
}

/** Tipe TS untuk types/payload/mock: file disimpan sebagai nama file (string). */
export function tsDataType(field: FieldModel): string {
  if (field.valueType === 'rowArray') return `${field.pascal}Row[]`;
  return scalarDataType(field.valueType);
}

/** Tipe TS untuk FormValues: number diinput sebagai string, file File|null (File[] bila multiple). */
export function tsFormType(field: FieldModel): string {
  // Nilai array selalu data-shaped (konversi di batas editor baris).
  if (field.formType === 'rowArray') return `${field.pascal}Row[]`;
  return scalarFormType(
    field.formType,
    field.config.componentProps?.upload?.multiple === true,
  );
}

/** Nilai default form: `''`, `false`, `[]`, atau `null` (file). */
export function formDefaultValue(field: FieldModel): string {
  if (field.formType === 'boolean') return 'false';
  if (field.formType === 'stringArray' || field.formType === 'rowArray') return '[]';
  if (field.formType === 'file') return 'null';
  return "''";
}

/** Mapping form → payload (`parseCurrency` untuk number, nama file untuk file). */
export function payloadMapping(field: FieldModel): string {
  if (field.valueType === 'number') return `parseCurrency(data.${field.name})`;
  if (field.valueType === 'file') {
    if (field.config.componentProps?.upload?.multiple === true) {
      return `(Array.isArray(data.${field.name}) ? data.${field.name}.map((f) => f.name).join(', ') : data.${field.name} instanceof File ? data.${field.name}.name : '')`;
    }
    return `data.${field.name} instanceof File ? data.${field.name}.name : ''`;
  }
  return `data.${field.name}`;
}

/** Nilai default mode edit dari data detail (number → string, file → null). */
export function formEditValue(field: FieldModel, itemVar: string): string {
  if (field.valueType === 'number') return `String(${itemVar}.${field.name} ?? '')`;
  if (field.valueType === 'file') return 'null';
  return `${itemVar}.${field.name}`;
}

function attrEscape(value: string): string {
  return value.replace(/\\/g, '\\').replace(/"/g, '\\"');
}

/** Boolean dengan default: selalu emit (`name` / `name={false}`). */
function boolDefault(name: string, value: boolean | undefined, fallback: boolean): string {
  return (value ?? fallback) ? `\n                  ${name}` : `\n                  ${name}={false}`;
}

/** Boolean opsional: emit hanya bila di-set. */
function boolOpt(name: string, value: boolean | undefined): string {
  if (value === undefined) return '';
  return value ? `\n                  ${name}` : `\n                  ${name}={false}`;
}

function strOpt(name: string, value: string | undefined): string {
  return value?.trim() ? `\n                  ${name}="${attrEscape(value.trim())}"` : '';
}

function sizeOpt(size: string | undefined): string {
  return size ? `\n                  size="${size}"` : '';
}

function numOpt(name: string, value: number | undefined): string {
  return value ? `\n                  ${name}={${value}}` : '';
}

function dateOpt(name: string, value: string | undefined): string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return '';
  return `\n                  ${name}={new Date("${value}T00:00:00")}`;
}

/** Override snippet untuk sub-field array (rules inline + options lokal). */
export interface FormItemSnippetOpts {
  testId?: string;
  rulesExpr?: string;
  optionsVar?: string;
}

/** `<FormItem ... />` untuk field ini. */
export function formItemSnippet(
  ctx: TemplateContext,
  field: FieldModel,
  opts?: FormItemSnippetOpts,
): string {
  const testId = opts?.testId ?? `${ctx.names.testId}-${field.name}`;
  const rulesExpr = opts?.rulesExpr ?? field.rulesVar;
  const optionsVar = opts?.optionsVar ?? `${field.name}Options`;
  const maxLength = getMaxLength(field);
  const maxLengthProp =
    maxLength !== null && field.formType === 'string' ? `\n                  maxLength={${maxLength}}` : '';
  const disabledProp = field.config.disabled === true ? '\n                  disabled' : '';
  const itemProps = field.config.componentProps?.formItem;
  const layoutProp = itemProps?.layout ?? 'horizontal';
  const labelWidthProp = strOpt('labelWidth', itemProps?.labelWidth);
  const alignProp = itemProps?.align ? `\n                  align="${itemProps.align}"` : '';
  const tooltipProp = strOpt('labelTooltip', itemProps?.labelTooltip);
  const weightProp = itemProps?.labelFontWeight
    ? `\n                  labelFontWeight="${itemProps.labelFontWeight}"`
    : '';
  const common = `testId="${testId}"\n                  name="${field.name}"\n                  rules={${rulesExpr}}\n                  layout="${layoutProp}"${disabledProp}${labelWidthProp}${alignProp}${tooltipProp}${weightProp}`;
  const placeholderText = (verb: 'Enter' | 'Select'): string =>
    attrEscape(field.config.placeholder?.trim() || `${verb} ${field.label.toLowerCase()}`);
  const props = field.config.componentProps;
  const rowsProp =
    field.config.type === 'textareaField' && field.config.rows && field.config.rows > 0
      ? `\n                  rows={${field.config.rows}}`
      : '';
  const acceptProp =
    field.config.type === 'fileUploadField' && field.config.accept?.trim()
      ? `\n                  accept="${attrEscape(field.config.accept.trim())}"`
      : '';

  switch (field.config.type) {
    case 'textareaField':
      return `<FormItem
                  label="${field.label}"
                  ${common}
                  component={TextAreaField}${maxLengthProp}${rowsProp}${sizeOpt(props?.textarea?.size)}
                  placeholder="${placeholderText('Enter')}"
                />`;
    case 'numberField':
      return `<FormItem
                  label="${field.label}"
                  ${common}
                  component={TextField}
                  currency${sizeOpt(props?.text?.size)}${boolOpt('clearable', props?.text?.clearable)}${strOpt('prepend', props?.text?.prefix)}${strOpt('append', props?.text?.suffix)}
                  placeholder="${placeholderText('Enter')}"
                />`;
    case 'currencyField':
      return `<FormItem
                  label="${field.label}"
                  ${common}
                  component={TextField}
                  currency${sizeOpt(props?.text?.size)}${boolOpt('clearable', props?.text?.clearable)}${strOpt('prepend', props?.text?.prefix?.trim() || 'Rp')}${strOpt('append', props?.text?.suffix)}
                  placeholder="${placeholderText('Enter')}"
                />`;
    case 'dateField':
      return `<FormItem
                  label="${field.label}"
                  ${common}
                  component={DatePickerField}${sizeOpt(props?.date?.size)}${boolOpt('showTime', props?.date?.showTime)}${boolOpt('clearable', props?.date?.clearable)}${dateOpt('minDate', props?.date?.minDate)}${dateOpt('maxDate', props?.date?.maxDate)}
                  placeholder="${placeholderText('Select')}"
                />`;
    case 'passwordField':
      return `<FormItem
                  label="${field.label}"
                  ${common}
                  component={PasswordField}${maxLengthProp}${sizeOpt(props?.password?.size)}${boolOpt('defaultVisible', props?.password?.defaultVisible)}
                  placeholder="${placeholderText('Enter')}"
                />`;
    case 'dateRangeField':
      return `<FormItem
                  label="${field.label}"
                  ${common}
                  component={DateRangeField}${sizeOpt(props?.dateRange?.size)}${dateOpt('maxDate', props?.dateRange?.maxDate)}${numOpt('maxRangeDays', props?.dateRange?.maxRangeDays)}
                  placeholder="${placeholderText('Select')}"
                />`;
    case 'selectField': {
      const selectProps = props?.select;
      const searchable = boolDefault('searchable', selectProps?.searchable, true);
      const selectExtra =
        `${sizeOpt(selectProps?.size)}` +
        `${strOpt('emptyOptionsText', selectProps?.emptyOptionsText)}` +
        `${boolOpt('showSelectedOptions', selectProps?.showSelectedOptions)}` +
        `${boolOpt('showValueOnly', selectProps?.showValueOnly)}`;
      if (field.isLoadOptions) {
        const paginate = boolDefault(
          'paginateOnScroll',
          selectProps?.paginateOnScroll,
          field.config.source === 'mockPagingInfinityScroll',
        );
        return `<FormItem
                  label="${field.label}"
                  ${common}
                  component={SelectField}
                  placeholder="${placeholderText('Select')}"${searchable}${paginate}${selectExtra}${boolOpt('clearable', selectProps?.clearable)}${numOpt('pageSize', selectProps?.pageSize)}
                  loadOptions={${field.loadOptionsFn}}
                />`;
      }
      return `<FormItem
                  label="${field.label}"
                  ${common}
                  component={SelectField}
                  placeholder="${placeholderText('Select')}"
                  options={${optionsVar}}${boolDefault('clearable', selectProps?.clearable, false)}${searchable}${selectExtra}
                />`;
    }
    case 'selectMultipleField': {
      const multiProps = props?.selectMultiple;
      const searchable = boolDefault('searchable', multiProps?.searchable, true);
      const multiExtra =
        `${sizeOpt(multiProps?.size)}` +
        `${boolOpt('clearable', multiProps?.clearable)}` +
        `${strOpt('emptyOptionsText', multiProps?.emptyOptionsText)}` +
        `${boolOpt('showSelectedOptions', multiProps?.showSelectedOptions)}` +
        `${boolOpt('chipsSummary', multiProps?.chipsSummary)}` +
        `${boolOpt('closeOnSelect', multiProps?.closeOnSelect)}` +
        `${boolOpt('hideCheckBox', multiProps?.hideCheckBox)}`;
      if (field.isLoadOptions) {
        const paginate = boolDefault(
          'paginateOnScroll',
          multiProps?.paginateOnScroll,
          field.config.source === 'mockPagingInfinityScroll',
        );
        return `<FormItem
                  label="${field.label}"
                  ${common}
                  component={SelectMultipleField}
                  placeholder="${placeholderText('Select')}"${searchable}${paginate}${multiExtra}${numOpt('pageSize', multiProps?.pageSize)}
                  loadOptions={${field.loadOptionsFn}}
                />`;
      }
      return `<FormItem
                  label="${field.label}"
                  ${common}
                  component={SelectMultipleField}
                  placeholder="${placeholderText('Select')}"
                  options={${optionsVar}}${searchable}${multiExtra}
                />`;
    }
    case 'radioGroupField':
      return `<FormItem
                  label="${field.label}"
                  ${common}
                  component={RadioGroupField}
                  options={${optionsVar}}${sizeOpt(props?.radio?.size)}
                />`;
    case 'checkboxField':
      return `<FormItem
                  label="${field.label}"
                  ${common}
                  component={CheckboxField}${sizeOpt(props?.checkbox?.size)}${boolOpt('indeterminate', props?.checkbox?.indeterminate)}
                />`;
    case 'checkboxGroupField':
      return `<FormItem
                  label="${field.label}"
                  ${common}
                  component={CheckboxGroupField}
                  options={${optionsVar}}${sizeOpt(props?.checkboxGroup?.size)}
                />`;
    case 'switchField':
      return `<FormItem
                  label="${field.label}"
                  ${common}
                  component={SwitchField}${sizeOpt(props?.switch?.size)}${boolDefault('showCheckedLabels', props?.switch?.showCheckedLabels, false)}${strOpt('checkedLabel', props?.switch?.checkedLabel)}${strOpt('uncheckedLabel', props?.switch?.uncheckedLabel)}
                />`;
    case 'fileUploadField':
      return `<FormItem
                  label="${field.label}"
                  ${common}
                  component={FileUploadField}${acceptProp}${sizeOpt(props?.upload?.size)}${boolOpt('multiple', props?.upload?.multiple)}
                />`;
    case 'colorField':
      return `<FormItem
                  label="${field.label}"
                  ${common}
                  component={ColorField}${sizeOpt(props?.color?.size)}
                />`;
    case 'editorField':
      return `<FormItem
                  label="${field.label}"
                  ${common}
                  component={EditorField}${sizeOpt(props?.editor?.size)}
                />`;
    case 'formArrayField': {
      const arrayProps = props?.array;
      return `<FormItem
                  label="${field.label}"
                  ${common}
                  component={${field.pascal}ArrayInput}${sizeOpt(arrayProps?.size)}${strOpt('addLabel', arrayProps?.addLabel)}${strOpt('editorTitle', arrayProps?.editorTitle || field.label)}${strOpt('emptyTitle', arrayProps?.emptyTitle)}${strOpt('emptyDescription', arrayProps?.emptyDescription)}${numOpt('maxRows', arrayProps?.maxRows)}${boolOpt('lockFirstRow', arrayProps?.lockFirstRow)}
                />`;
    }
    case 'textField':
    default:
      return `<FormItem
                  label="${field.label}"
                  ${common}
                  component={TextField}${maxLengthProp}${sizeOpt(props?.text?.size)}${boolOpt('clearable', props?.text?.clearable)}${strOpt('prepend', props?.text?.prefix)}${strOpt('append', props?.text?.suffix)}
                  placeholder="${placeholderText('Enter')}"
                />`;
  }
}

/** Kolom tabel untuk field ini (dengan render khusus bila perlu). */
export function tableColumnSnippet(field: FieldModel): string {
  const header = field.label;
  const sort = field.sortable ? ', sortable: true' : '';
  const open = `{ key: '${field.name}', header: '${header}'${sort}`;
  switch (field.config.type) {
    case 'numberField':
    case 'currencyField':
      return `${open}, render: (row: ROWTYPE) => formatNumber(row.${field.name}) },`;
    case 'dateField':
      return `${open}, render: (row: ROWTYPE) => formatDate(row.${field.name}) },`;
    case 'dateRangeField':
      return `${open}, render: (row: ROWTYPE) => formatDateRange(row.${field.name}) },`;
    case 'checkboxField':
    case 'switchField':
      return `${open}, render: (row: ROWTYPE) => (row.${field.name} ? 'Yes' : 'No') },`;
    case 'selectField':
    case 'radioGroupField':
      return `${open}, render: (row: ROWTYPE) => capitalize(String(row.${field.name})) },`;
    case 'selectMultipleField':
    case 'checkboxGroupField':
      return `${open}, render: (row: ROWTYPE) => (row.${field.name} ?? []).join(', ') },`;
    case 'passwordField':
      return `${open}, render: () => '••••••' },`;
    case 'colorField':
      return `${open}, render: (row: ROWTYPE) => (row.${field.name} ? (<span className="inline-flex items-center gap-1.5"><span className="inline-block h-4 w-4 rounded border border-border" style={{ backgroundColor: row.${field.name} }} /><span>{row.${field.name}}</span></span>) : '-') },`;
    case 'editorField':
      return `${open}, render: (row: ROWTYPE) => stripHtml(row.${field.name} ?? '') || '-' },`;
    case 'formArrayField':
      return `${open}, render: (row: ROWTYPE) => ((row.${field.name} ?? []).length > 0 ? (row.${field.name} ?? []).length + ' baris' : '-') },`;
    case 'textareaField':
    case 'fileUploadField':
    case 'textField':
    default:
      return `${open} },`;
  }
}

/** Baris detail untuk field ini. Prefix `item.` diganti nama entitas oleh template. */
export function detailRowSnippet(field: FieldModel): string {
  switch (field.config.type) {
    case 'numberField':
    case 'currencyField':
      return `{ label: '${field.label}', value: formatNumber(item.${field.name}) },`;
    case 'dateField':
      return `{ label: '${field.label}', value: formatDate(item.${field.name}) },`;
    case 'dateRangeField':
      return `{ label: '${field.label}', value: formatDateRange(item.${field.name}) },`;
    case 'checkboxField':
    case 'switchField':
      return `{ label: '${field.label}', value: item.${field.name} ? 'Yes' : 'No' },`;
    case 'selectField':
    case 'radioGroupField':
      return `{ label: '${field.label}', value: capitalize(String(item.${field.name})) },`;
    case 'selectMultipleField':
    case 'checkboxGroupField':
      return `{ label: '${field.label}', value: (item.${field.name} ?? []).join(', ') },`;
    case 'passwordField':
      return `{ label: '${field.label}', value: '••••••' },`;
    case 'colorField':
      return `{ label: '${field.label}', value: item.${field.name} ? (<span className="inline-flex items-center gap-1.5"><span className="inline-block h-4 w-4 rounded border border-border" style={{ backgroundColor: item.${field.name} }} /><span>{item.${field.name}}</span></span>) : '-' },`;
    case 'editorField':
      return `{ label: '${field.label}', value: stripHtml(item.${field.name} ?? '') || '-' },`;
    case 'formArrayField':
      return `{ label: '${field.label}', value: ((item.${field.name} ?? []).length > 0 ? (item.${field.name} ?? []).length + ' baris' : '-') },`;
    default:
      return `{ label: '${field.label}', value: item.${field.name} },`;
  }
}

/** Kunci query params untuk filter field ini (range → dua kunci Min/Max). */
export function filterParamKeys(field: FieldModel): string[] {
  if (field.filterCriteria === 'numberRange') return [`${field.name}Min`, `${field.name}Max`];
  return [field.name];
}

/** Blok FilterToolbar per kriteria (numberRange → dua blok). */
export function filterFieldSnippet(field: FieldModel): string {
  const criteria = field.filterCriteria;
  switch (criteria) {
    case 'contains':
      return `{
    name: '${field.name}',
    label: '${field.label}',
    type: 'text',
    placeholder: 'Contains…',
  },`;
    case 'exact':
    case 'numberExact':
      return `{
    name: '${field.name}',
    label: '${field.label}',
    type: 'text',
  },`;
    case 'numberMin':
      return `{
    name: '${field.name}',
    label: '${field.label} (Min)',
    type: 'text',
    placeholder: 'Minimal…',
  },`;
    case 'numberMax':
      return `{
    name: '${field.name}',
    label: '${field.label} (Max)',
    type: 'text',
    placeholder: 'Maksimal…',
  },`;
    case 'numberRange':
      return `{
    name: '${field.name}Min',
    label: '${field.label} (Min)',
    type: 'text',
    placeholder: 'Minimal…',
  },
  {
    name: '${field.name}Max',
    label: '${field.label} (Max)',
    type: 'text',
    placeholder: 'Maksimal…',
  },`;
    case 'dateExact':
      return `{
    name: '${field.name}',
    label: '${field.label}',
    type: 'date',
  },`;
    case 'dateRange':
    case 'dateOverlap':
      return `{
    name: '${field.name}',
    label: '${field.label}',
    type: 'date',
    range: true,
    rangeErrorMessage: '${field.label} harus diisi awal dan akhir.',
  },`;
    case 'booleanExact':
      return `{
    name: '${field.name}',
    label: '${field.label}',
    type: 'select',
    options: [
      { label: 'Ya', value: 'true' },
      { label: 'Tidak', value: 'false' },
    ],
  },`;
    case 'optionAny':
    case 'optionExact':
    default: {
      const filterType = field.isMultiOption ? 'multi-select' : 'select';
      if (field.isOptionsQuery) {
        const options = field.config.options ?? [];
        const rows = options.map((o) => `      { label: '${o.label}', value: '${o.value}' },`);
        return `{
    name: '${field.name}',
    label: '${field.label}',
    type: '${filterType}',
    options: [
${rows.join('\n')}
    ],
  },`;
      }
      return `{
    name: '${field.name}',
    label: '${field.label}',
    type: '${filterType}',
    loadOptions: ${field.loadOptionsFn},
  },`;
    }
  }
}

/** Nama interface baris data untuk field array. */
export function rowTypeName(field: FieldModel): string {
  return `${field.pascal}Row`;
}

/** Nama interface baris form untuk field array. */
export function rowFormTypeName(field: FieldModel): string {
  return `${field.pascal}RowForm`;
}

/** Model sintetis untuk satu sub-field (emisi item/aturan/kolom statis). */
function subFieldModel(parent: FieldModel, sub: GeneratorFieldConfig): FieldModel {
  const def = fieldTypeRegistry[sub.type];
  const pascal = `${parent.pascal}${toPascalCase(sub.name)}`;
  const isOptionField =
    sub.type === 'selectField' ||
    sub.type === 'selectMultipleField' ||
    sub.type === 'radioGroupField' ||
    sub.type === 'checkboxGroupField';
  return {
    config: sub,
    name: sub.name,
    label: sub.label,
    pascal,
    valueType: def.valueType,
    formType: def.formType,
    isSelect: sub.type === 'selectField' || sub.type === 'radioGroupField',
    isOptionField,
    isMultiOption: sub.type === 'selectMultipleField' || sub.type === 'checkboxGroupField',
    isOptionsQuery: isOptionField && (sub.source === 'mockStatic' || sub.source === 'api'),
    isLoadOptions:
      (sub.type === 'selectField' || sub.type === 'selectMultipleField') &&
      sub.source === 'mockPagingInfinityScroll',
    rulesVar: `${sub.name}Rules`,
    optionType: `${pascal}Option`,
    mockOptionsVar: `mock${pascal}Options`,
    optionsQueryHook: `use${pascal}OptionsQuery`,
    loadOptionsFn: `load${pascal}Options`,
    sortable: false,
    filterable: false,
    filterCriteria: null,
  };
}

/** Sub-field efektif untuk emisi (nested array dibuang defensif). */
function arraySubs(field: FieldModel): GeneratorFieldConfig[] {
  return (field.config.subFields ?? []).filter((sub) => sub.type !== 'formArrayField');
}

/** Model loadOptions untuk sub-field paging di seluruh fields (emisi mock loader + wiring). */
export function arraySubLoadModels(fields: FieldModel[]): FieldModel[] {
  return fields
    .filter((f) => f.config.type === 'formArrayField')
    .flatMap((f) => arraySubs(f).map((sub) => subFieldModel(f, sub)))
    .filter((model) => model.isLoadOptions);
}

function isSubOptionType(type: string): boolean {
  return (
    type === 'selectField' ||
    type === 'selectMultipleField' ||
    type === 'radioGroupField' ||
    type === 'checkboxGroupField'
  );
}

/** Interface `${Pascal}Row` + `${Pascal}RowForm` untuk field array. */
export function rowInterfacesSnippet(field: FieldModel): string {
  const subs = arraySubs(field);
  const dataLines = subs
    .map((sub) => `  ${sub.name}: ${scalarDataType(fieldTypeRegistry[sub.type].valueType)};`)
    .join('\n');
  const formLines = subs
    .map(
      (sub) =>
        `  ${sub.name}: ${scalarFormType(fieldTypeRegistry[sub.type].formType, sub.componentProps?.upload?.multiple === true)};`,
    )
    .join('\n');
  return `export interface ${rowTypeName(field)} extends Record<string, unknown> {\n${dataLines}\n}\n\nexport interface ${rowFormTypeName(field)} extends Record<string, unknown> {\n${formLines}\n}`;
}

/** Const options statis tiap sub-field opsi (`${Parent}${Sub}Options`; api memakai contoh options). */
export function subOptionsSnippet(field: FieldModel): string {
  // Semua source kecuali paging (paging memakai loadOptions, bukan const).
  // Termasuk `none`/sisa `relation` agar referensi options selalu terdefinisi.
  const subs = arraySubs(field).filter(
    (sub) => isSubOptionType(sub.type) && sub.source !== 'mockPagingInfinityScroll',
  );
  return subs
    .map((sub) => {
      const rows = (sub.options ?? []).map((o) => `  { label: '${o.label}', value: '${o.value}' },`);
      return `const ${field.name}${toPascalCase(sub.name)}Options: { label: string; value: string }[] = [\n${rows.join('\n')}\n];`;
    })
    .join('\n\n');
}

/** True bila ada sub-field number (butuh import parseCurrency di file form). */
export function arrayNeedsParseCurrency(field: FieldModel): boolean {
  return arraySubs(field).some(
    (sub) => fieldTypeRegistry[sub.type].valueType === 'number',
  );
}

/** Util format yang dibutuhkan kolom array (`capitalize`, `format*`, `stripHtml`). */
export function arrayColumnUtils(field: FieldModel): string[] {
  const subs = arraySubs(field);
  const utils: string[] = [];
  if (subs.some((sub) => sub.type === 'selectField' || sub.type === 'radioGroupField')) {
    utils.push('capitalize');
  }
  if (subs.some((sub) => sub.type === 'numberField' || sub.type === 'currencyField'))
    utils.push('formatNumber');
  if (subs.some((sub) => sub.type === 'dateField')) utils.push('formatDate');
  if (subs.some((sub) => sub.type === 'dateRangeField')) utils.push('formatDateRange');
  if (subs.some((sub) => sub.type === 'editorField')) utils.push('stripHtml');
  return utils;
}

/** Konversi baris data → form (`toXRowForm`) dan form → data (`toXRow`). */
export function rowMappersSnippet(field: FieldModel): string {
  const row = rowTypeName(field);
  const rowForm = rowFormTypeName(field);
  const subs = arraySubs(field);
  const toFormLines = subs
    .map((sub) => {
      const valueType = fieldTypeRegistry[sub.type].valueType;
      if (valueType === 'number') return `    ${sub.name}: String(row?.${sub.name} ?? ''),`;
      if (valueType === 'file') return `    ${sub.name}: null,`;
      if (valueType === 'stringArray')
        return `    ${sub.name}: Array.isArray(row?.${sub.name}) ? [...(row?.${sub.name} as string[])] : [],`;
      if (valueType === 'boolean') return `    ${sub.name}: (row?.${sub.name} ?? false),`;
      return `    ${sub.name}: (row?.${sub.name} ?? ''),`;
    })
    .join('\n');
  const toDataLines = subs
    .map((sub) => {
      const valueType = fieldTypeRegistry[sub.type].valueType;
      if (valueType === 'number') return `    ${sub.name}: parseCurrency(form.${sub.name}),`;
      if (valueType === 'file') {
        if (sub.componentProps?.upload?.multiple === true) {
          return `    ${sub.name}: (Array.isArray(form.${sub.name}) ? form.${sub.name}.map((f) => f.name).join(', ') : form.${sub.name} instanceof File ? form.${sub.name}.name : ''),`;
        }
        return `    ${sub.name}: (form.${sub.name} instanceof File ? form.${sub.name}.name : ''),`;
      }
      return `    ${sub.name}: form.${sub.name},`;
    })
    .join('\n');
  return `function to${field.pascal}RowForm(row?: ${row} | null): ${rowForm} {
  return {
${toFormLines}
  };
}

function to${field.pascal}Row(form: ${rowForm}): ${row} {
  return {
${toDataLines}
  };
}`;
}

/** Kolom tabel array dari sub-field (reuse render per tipe). */
export function arrayColumnsSnippet(field: FieldModel): string {
  const subs = arraySubs(field);
  const columns = subs
    .map((sub) =>
      tableColumnSnippet(subFieldModel(field, sub)).replace(/ROWTYPE/g, rowTypeName(field)),
    )
    .map((line) => `  ${line}`)
    .join('\n');
  return `const ${field.pascal}ArrayColumns: Column<${rowTypeName(field)}>[] = [\n${columns}\n];`;
}

/** Editor baris + komponen input array untuk file form hasil generate. */
export function arrayInputSnippet(ctx: TemplateContext, field: FieldModel): string {
  const row = rowTypeName(field);
  const rowForm = rowFormTypeName(field);
  const subs = arraySubs(field);
  const items = subs
    .map((sub) => {
      const model = subFieldModel(field, sub);
      const snippet = formItemSnippet(ctx, model, {
        testId: `${ctx.names.testId}-${field.name}-${sub.name}`,
        rulesExpr: buildRulesObject(model),
        optionsVar: `${field.name}${toPascalCase(sub.name)}Options`,
      }).replace(/\n                  /g, '\n            ');
      return `          ${snippet}`;
    })
    .join('\n\n');
  return `function ${field.pascal}RowEditor({
  initial,
  onSave,
  formId,
}: {
  initial: ${row} | null;
  onSave: (row: ${row}) => void;
  onCancel: () => void;
  formId: string;
}) {
  return (
    <FormGroup<${rowForm}>
      testId="${ctx.names.testId}-${field.name}-row-form"
      id={formId}
      defaultValues={to${field.pascal}RowForm(initial)}
      onSubmit={(form) => onSave(to${field.pascal}Row(form))}
    >
      <div className="flex flex-col section-gap">
${items}
      </div>
    </FormGroup>
  );
}

function ${field.pascal}ArrayInput({
  value,
  onChange,
  size,
  addLabel,
  editorTitle,
  emptyTitle,
  emptyDescription,
  maxRows,
  lockFirstRow,
  disabled,
  error,
  'data-testid': testId,
}: {
  value?: ${row}[] | null;
  onChange: (rows: ${row}[]) => void;
  size?: 'sm' | 'md' | 'lg';
  addLabel?: string;
  editorTitle?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  maxRows?: number;
  lockFirstRow?: boolean;
  disabled?: boolean;
  error?: string;
  'data-testid'?: string;
}) {
  return (
    <FormArrayField
      value={value ?? []}
      onChange={onChange}
      columns={${field.pascal}ArrayColumns}
      renderEditor={({ initial, onSave, onCancel, formId }) => (
        <${field.pascal}RowEditor initial={initial} onSave={onSave} onCancel={onCancel} formId={formId} />
      )}
      size={size}
      addLabel={addLabel}
      editorTitle={editorTitle}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
      maxRows={maxRows}
      lockFirstRow={lockFirstRow}
      disabled={disabled}
      error={error}
      data-testid={testId}
    />
  );
}`;
}
