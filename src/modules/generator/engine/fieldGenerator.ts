import { getMaxLength } from './validationGenerator';
import type { FieldModel, TemplateContext } from './context';

/** Tipe TS untuk types/payload/mock: file disimpan sebagai nama file (string). */
export function tsDataType(field: FieldModel): string {
  switch (field.valueType) {
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

/** Tipe TS untuk FormValues: number diinput sebagai string, file File|null. */
export function tsFormType(field: FieldModel): string {
  switch (field.formType) {
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'stringArray':
      return 'string[]';
    case 'file':
      return 'File | null';
    case 'string':
    default:
      return 'string';
  }
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
  if (field.valueType === 'file')
    return `data.${field.name} instanceof File ? data.${field.name}.name : ''`;
  return `data.${field.name}`;
}

/** Nilai default mode edit dari data detail (number → string, file → null). */
export function formEditValue(field: FieldModel, itemVar: string): string {
  if (field.valueType === 'number') return `String(${itemVar}.${field.name} ?? '')`;
  if (field.valueType === 'file') return 'null';
  return `${itemVar}.${field.name}`;
}

/** `<FormItem ... />` untuk field ini. */
export function formItemSnippet(ctx: TemplateContext, field: FieldModel): string {
  const testId = `${ctx.names.testId}-${field.name}`;
  const maxLength = getMaxLength(field);
  const maxLengthProp =
    maxLength !== null && field.formType === 'string' ? `\n                  maxLength={${maxLength}}` : '';
  const common = `testId="${testId}"\n                  name="${field.name}"\n                  rules={${field.rulesVar}}\n                  layout="horizontal"`;

  switch (field.config.type) {
    case 'textareaField':
      return `<FormItem
                  label="${field.label}"
                  ${common}
                  component={TextAreaField}${maxLengthProp}
                  placeholder="Enter ${field.label.toLowerCase()}"
                />`;
    case 'numberField':
      return `<FormItem
                  label="${field.label}"
                  ${common}
                  component={TextField}
                  currency
                  placeholder="Enter ${field.label.toLowerCase()}"
                />`;
    case 'dateField':
      return `<FormItem
                  label="${field.label}"
                  ${common}
                  component={DatePickerField}
                  placeholder="Select ${field.label.toLowerCase()}"
                />`;
    case 'passwordField':
      return `<FormItem
                  label="${field.label}"
                  ${common}
                  component={PasswordField}${maxLengthProp}
                  placeholder="Enter ${field.label.toLowerCase()}"
                />`;
    case 'dateRangeField':
      return `<FormItem
                  label="${field.label}"
                  ${common}
                  component={DateRangeField}
                  placeholder="Select ${field.label.toLowerCase()}"
                />`;
    case 'selectField':
      if (field.isLoadOptions) {
        const paginate =
          field.config.source === 'mockPagingInfinityScroll' ? '\n                  paginateOnScroll' : '';
        return `<FormItem
                  label="${field.label}"
                  ${common}
                  component={SelectField}
                  placeholder="Select ${field.label.toLowerCase()}"
                  searchable${paginate}
                  loadOptions={${field.loadOptionsFn}}
                />`;
      }
      return `<FormItem
                  label="${field.label}"
                  ${common}
                  component={SelectField}
                  placeholder="Select ${field.label.toLowerCase()}"
                  options={${field.name}Options}
                  clearable={false}
                  searchable
                />`;
    case 'selectMultipleField':
      if (field.isLoadOptions) {
        const paginate =
          field.config.source === 'mockPagingInfinityScroll' ? '\n                  paginateOnScroll' : '';
        return `<FormItem
                  label="${field.label}"
                  ${common}
                  component={SelectMultipleField}
                  placeholder="Select ${field.label.toLowerCase()}"
                  searchable${paginate}
                  loadOptions={${field.loadOptionsFn}}
                />`;
      }
      return `<FormItem
                  label="${field.label}"
                  ${common}
                  component={SelectMultipleField}
                  placeholder="Select ${field.label.toLowerCase()}"
                  options={${field.name}Options}
                  searchable
                />`;
    case 'radioGroupField':
      return `<FormItem
                  label="${field.label}"
                  ${common}
                  component={RadioGroupField}
                  options={${field.name}Options}
                />`;
    case 'checkboxField':
      return `<FormItem
                  ${common}
                  component={CheckboxField}
                  checkboxLabel="${field.label}"
                />`;
    case 'checkboxGroupField':
      return `<FormItem
                  label="${field.label}"
                  ${common}
                  component={CheckboxGroupField}
                  options={${field.name}Options}
                />`;
    case 'switchField':
      return `<FormItem
                  ${common}
                  component={SwitchField}
                  switchLabel="${field.label}"
                  showCheckedLabels={false}
                />`;
    case 'fileUploadField':
      return `<FormItem
                  label="${field.label}"
                  ${common}
                  component={FileUploadField}
                />`;
    case 'textField':
    default:
      return `<FormItem
                  label="${field.label}"
                  ${common}
                  component={TextField}${maxLengthProp}
                  placeholder="Enter ${field.label.toLowerCase()}"
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
