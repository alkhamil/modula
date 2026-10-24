import { getMaxLength } from './validationGenerator';
import { resolveFormItemLayout } from '../componentProps';
import { loadLabelHelper } from './sourceGenerator';
import type { FieldModel, TemplateContext } from './context';

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
  return scalarDataType(field.valueType);
}

/** Tipe TS untuk FormValues: number diinput sebagai string, file File|null (File[] bila multiple). */
export function tsFormType(field: FieldModel): string {
  return scalarFormType(
    field.formType,
    field.config.componentProps?.upload?.multiple === true,
  );
}

/** Nilai default form: `''`, `false`, `[]`, atau `null` (file). */
export function formDefaultValue(field: FieldModel): string {
  if (field.formType === 'boolean') return 'false';
  if (field.formType === 'stringArray') return '[]';
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
  /** Bila diisi → label/placeholder memakai t() key modul hasil generate. */
  labelKey?: string;
  placeholderKey?: string;
  /** Span grid 1–12; tanpa layout eksplisit, span sempit default vertikal. */
  span?: number;
}

/** Terapkan key i18n ke snippet FormItem yang sudah jadi (label + placeholder). */
function applyI18nKeys(snippet: string, field: FieldModel, opts?: FormItemSnippetOpts): string {
  if (!opts?.labelKey) return snippet;
  let next = snippet.replace(`label="${field.label}"`, `label={t('${opts.labelKey}')}`);
  if (opts?.placeholderKey) {
    next = next.replace(/placeholder="[^"]*"/, `placeholder={t('${opts.placeholderKey}')}`);
  }
  return next;
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
  const layoutProp = resolveFormItemLayout(itemProps?.layout, opts?.span);
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

  const snippet = ((): string => {
    switch (field.config.type) {
    case 'textareaField':
      return `<FormItem
                  label="${field.label}"
                  ${common}
                  component={Textarea}${maxLengthProp}${rowsProp}${sizeOpt(props?.textarea?.size)}
                  placeholder="${placeholderText('Enter')}"
                />`;
    case 'numberField':
      return `<FormItem
                  label="${field.label}"
                  ${common}
                  component={InputField}
                  currency${sizeOpt(props?.text?.size)}${boolOpt('clearable', props?.text?.clearable)}${strOpt('prepend', props?.text?.prefix)}${strOpt('append', props?.text?.suffix)}
                  placeholder="${placeholderText('Enter')}"
                />`;
    case 'dateField':
      return `<FormItem
                  label="${field.label}"
                  ${common}
                  component={DatePicker}${sizeOpt(props?.date?.size)}${boolOpt('showTime', props?.date?.showTime)}${boolOpt('clearable', props?.date?.clearable)}${dateOpt('minDate', props?.date?.minDate)}${dateOpt('maxDate', props?.date?.maxDate)}
                  placeholder="${placeholderText('Select')}"
                />`;
    case 'dateRangeField':
      return `<FormItem
                  label="${field.label}"
                  ${common}
                  component={DatePicker}
                  range${sizeOpt(props?.dateRange?.size)}${dateOpt('maxDate', props?.dateRange?.maxDate)}${numOpt('maxRangeDays', props?.dateRange?.maxRangeDays)}
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
      if (field.isLoadOptions || field.isRelationOptions) {
        const paginate = boolDefault(
          'paginateOnScroll',
          selectProps?.paginateOnScroll,
          field.config.source === 'mockPagingInfinityScroll' || field.config.source === 'relation',
        );
        return `<FormItem
                  label="${field.label}"
                  ${common}
                  component={Select}
                  placeholder="${placeholderText('Select')}"${searchable}${paginate}${selectExtra}${boolOpt('clearable', selectProps?.clearable)}${numOpt('pageSize', selectProps?.pageSize)}
                  loadOptions={${field.loadOptionsFn}}
                />`;
      }
      return `<FormItem
                  label="${field.label}"
                  ${common}
                  component={Select}
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
      if (field.isLoadOptions || field.isRelationOptions) {
        const paginate = boolDefault(
          'paginateOnScroll',
          multiProps?.paginateOnScroll,
          field.config.source === 'mockPagingInfinityScroll' || field.config.source === 'relation',
        );
        return `<FormItem
                  label="${field.label}"
                  ${common}
                  component={Select}
                  multiple
                  placeholder="${placeholderText('Select')}"${searchable}${paginate}${multiExtra}${numOpt('pageSize', multiProps?.pageSize)}
                  loadOptions={${field.loadOptionsFn}}
                />`;
      }
      return `<FormItem
                  label="${field.label}"
                  ${common}
                  component={Select}
                  multiple
                  placeholder="${placeholderText('Select')}"
                  options={${optionsVar}}${searchable}${multiExtra}
                />`;
    }
    case 'radioGroupField':
      return `<FormItem
                  label="${field.label}"
                  ${common}
                  component={RadioButtonGroup}
                  options={${optionsVar}}${sizeOpt(props?.radio?.size)}
                />`;
    case 'checkboxField':
      return `<FormItem
                  label="${field.label}"
                  ${common}
                  component={Checkbox}${sizeOpt(props?.checkbox?.size)}${boolOpt('indeterminate', props?.checkbox?.indeterminate)}
                />`;
    case 'checkboxGroupField':
      return `<FormItem
                  label="${field.label}"
                  ${common}
                  component={CheckboxGroup}
                  options={${optionsVar}}${sizeOpt(props?.checkboxGroup?.size)}
                />`;
    case 'switchField':
      return `<FormItem
                  label="${field.label}"
                  ${common}
                  component={Toggle}${sizeOpt(props?.switch?.size)}${boolDefault('showCheckedLabels', props?.switch?.showCheckedLabels, false)}${strOpt('checkedLabel', props?.switch?.checkedLabel)}${strOpt('uncheckedLabel', props?.switch?.uncheckedLabel)}
                />`;
    case 'fileUploadField':
      return `<FormItem
                  label="${field.label}"
                  ${common}
                  component={FileUpload}${acceptProp}${sizeOpt(props?.upload?.size)}${boolOpt('multiple', props?.upload?.multiple)}
                />`;
    case 'textField':
    default:
      return `<FormItem
                  label="${field.label}"
                  ${common}
                  component={InputField}${maxLengthProp}${sizeOpt(props?.text?.size)}${boolOpt('clearable', props?.text?.clearable)}${strOpt('prepend', props?.text?.prefix)}${strOpt('append', props?.text?.suffix)}
                  placeholder="${placeholderText('Enter')}"
                />`;
    }
  })();
  return applyI18nKeys(snippet, field, opts);
}

/** Kolom tabel untuk field ini (dengan render khusus bila perlu). */
/** Literal map value → label dari opsi statis; null bila tak ada opsi statis. */
function optionMapLiteral(field: FieldModel): string | null {
  const options = field.config.options ?? [];
  if (options.length === 0) return null;
  const source = field.config.source;
  if (source !== undefined && source !== 'none' && source !== 'mockStatic') return null;
  const q = (s: string): string => `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
  return `{${options.map((o) => `${q(o.value)}: ${q(o.label)}`).join(', ')}}`;
}

/** Helper label sinkron untuk field paging (`getXOptionLabel` di api); null bila bukan paging. */
function optionLabelHelper(field: FieldModel): string | null {
  return field.isLoadOptions ? loadLabelHelper(field) : null;
}

/** Nama helper label semua field paging dalam daftar (untuk import file statis). */
export function loadLabelHelpers(models: FieldModel[]): string[] {
  return [...new Set(models.flatMap((f) => (f.isLoadOptions ? [loadLabelHelper(f)] : [])))];
}

/** Field top-level bersumber relasi (loader target-backed). */
export function relationSelects(ctx: { fields: FieldModel[] }): FieldModel[] {
  return ctx.fields.filter((f) => f.isRelationOptions);
}

/** Nama loader (`loadXOptions`) semua field relasi dalam daftar. */
export function relationLoaders(models: FieldModel[]): string[] {
  return [...new Set(models.flatMap((f) => (f.isRelationOptions ? [f.loadOptionsFn] : [])))];
}

/** Ekspresi label satu value: relasi → helper paging → map statis → fallback. */
function singleLabelExpr(field: FieldModel, valueExpr: string): string {
  if (field.isRelationOptions) {
    return `<RelationLabel loader={${field.loadOptionsFn}} value={${valueExpr}} />`;
  }
  const helper = optionLabelHelper(field);
  if (helper) return `${helper}(${valueExpr})`;
  const map = optionMapLiteral(field);
  if (map) return `(${map}[${valueExpr}] ?? capitalize(String(${valueExpr})))`;
  return `capitalize(String(${valueExpr}))`;
}

/** Ekspresi label multi value (join koma). */
function multiLabelExpr(field: FieldModel, valueExpr: string): string {
  if (field.isRelationOptions) {
    return `(${valueExpr} ?? []).map((v: string, i: number) => (<span key={v}>{i > 0 ? ', ' : ''}<RelationLabel loader={${field.loadOptionsFn}} value={v} /></span>))`;
  }
  const helper = optionLabelHelper(field);
  if (helper) return `(${valueExpr} ?? []).map((v: string) => ${helper}(v)).join(', ')`;
  const map = optionMapLiteral(field);
  // Map literal dibungkus kurung: tanpa itu `{...}` setelah `=>` dibaca sebagai block.
  if (map) return `(${valueExpr} ?? []).map((v: string) => (${map})[v] ?? v).join(', ')`;
  return `(${valueExpr} ?? []).join(', ')`;
}

export function tableColumnSnippet(field: FieldModel, width?: number, labelKey?: string): string {
  const header = labelKey ? `t('${labelKey}')` : `'${field.label}'`;
  const sort = field.sortable ? ', sortable: true' : '';
  const widthPart = width !== undefined ? `, width: ${width}` : '';
  const open = `{ key: '${field.name}', header: ${header}${sort}${widthPart}`;
  switch (field.config.type) {
    case 'numberField':
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
      return `${open}, render: (row: ROWTYPE) => ${singleLabelExpr(field, `row.${field.name}`)} },`;
    case 'selectMultipleField':
    case 'checkboxGroupField':
      return `${open}, render: (row: ROWTYPE) => ${multiLabelExpr(field, `row.${field.name}`)} },`;
    case 'textareaField':
    case 'fileUploadField':
    case 'textField':
    default:
      return `${open} },`;
  }
}

/** Baris detail untuk field ini. Prefix `item.` diganti nama entitas oleh template. */
export function detailRowSnippet(field: FieldModel, labelKey?: string): string {
  const label = labelKey ? `t('${labelKey}')` : `'${field.label}'`;
  const yesNo = labelKey ? `t('filter.yes') : t('filter.no')` : `'Yes' : 'No'`;
  switch (field.config.type) {
    case 'numberField':
      return `{ label: ${label}, value: formatNumber(item.${field.name}) },`;
    case 'dateField':
      return `{ label: ${label}, value: formatDate(item.${field.name}) },`;
    case 'dateRangeField':
      return `{ label: ${label}, value: formatDateRange(item.${field.name}) },`;
    case 'checkboxField':
    case 'switchField':
      return `{ label: ${label}, value: item.${field.name} ? ${yesNo} },`;
    case 'selectField':
    case 'radioGroupField':
      return `{ label: ${label}, value: ${singleLabelExpr(field, `item.${field.name}`)} },`;
    case 'selectMultipleField':
    case 'checkboxGroupField':
      return `{ label: ${label}, value: ${multiLabelExpr(field, `item.${field.name}`)} },`;
    default:
      return `{ label: ${label}, value: item.${field.name} },`;
  }
}

/** Kunci query params untuk filter field ini (range → dua kunci Min/Max). */
export function filterParamKeys(field: FieldModel): string[] {
  if (field.filterCriteria === 'numberRange') return [`${field.name}Min`, `${field.name}Max`];
  return [field.name];
}

/** Blok TableToolbar per kriteria (numberRange → dua blok). */
export function filterFieldSnippet(field: FieldModel, labelKey?: string): string {
  const criteria = field.filterCriteria;
  const label = labelKey ? `t('${labelKey}')` : `'${field.label}'`;
  switch (criteria) {
    case 'contains':
      return `{
    name: '${field.name}',
    label: ${label},
    type: 'text',
    placeholder: t('filter.containsPh'),
  },`;
    case 'exact':
    case 'numberExact':
      return `{
    name: '${field.name}',
    label: ${label},
    type: 'text',
  },`;
    case 'numberMin':
      return `{
    name: '${field.name}',
    label: \`${label} (Min)\`,
    type: 'text',
    placeholder: t('filter.minPh'),
  },`;
    case 'numberMax':
      return `{
    name: '${field.name}',
    label: \`${label} (Max)\`,
    type: 'text',
    placeholder: t('filter.maxPh'),
  },`;
    case 'numberRange':
      return `{
    name: '${field.name}Min',
    label: \`${label} (Min)\`,
    type: 'text',
    placeholder: t('filter.minPh'),
  },
  {
    name: '${field.name}Max',
    label: \`${label} (Max)\`,
    type: 'text',
    placeholder: t('filter.maxPh'),
  },`;
    case 'dateExact':
      return `{
    name: '${field.name}',
    label: ${label},
    type: 'date',
  },`;
    case 'dateRange':
    case 'dateOverlap':
      return `{
    name: '${field.name}',
    label: ${label},
    type: 'date',
    range: true,
    rangeErrorMessage: t('validation.rangeRequired', { label: ${label} }),
  },`;
    case 'booleanExact':
      return `{
    name: '${field.name}',
    label: ${label},
    type: 'select',
    options: [
      { label: t('filter.yes'), value: 'true' },
      { label: t('filter.no'), value: 'false' },
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
    label: ${label},
    type: '${filterType}',
    options: [
${rows.join('\n')}
    ],
  },`;
      }
      return `{
    name: '${field.name}',
    label: ${label},
    type: '${filterType}',
    loadOptions: ${field.loadOptionsFn},
  },`;
    }
  }
}

/**
 * True bila kolom tabel model ini memanggil `capitalize` — semua ekspresi
 * label kecuali helper paging dan `RelationLabel` (menelan fallback sendiri).
 */
export function selectNeedsCapitalize(model: FieldModel): boolean {
  if (model.isRelationOptions) return false;
  const t = model.config.type;
  if (
    t !== 'selectField' &&
    t !== 'radioGroupField' &&
    t !== 'selectMultipleField' &&
    t !== 'checkboxGroupField'
  ) {
    return false;
  }
  return optionLabelHelper(model) === null;
}
