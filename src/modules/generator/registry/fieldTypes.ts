import type { FieldType } from '../types';

export type FieldValueType = 'string' | 'number' | 'boolean' | 'stringArray' | 'file';

export interface FieldTypeDef {
  label: string;
  /** Komponen shared yang dipakai di form hasil generate. */
  component: string;
  /** Kategori nilai di types/payload/mock hasil generate. */
  valueType: FieldValueType;
  /** Kategori nilai di form (bisa beda, mis. number/file). */
  formType: FieldValueType;
  description: string;
}

export const fieldTypeRegistry: Record<FieldType, FieldTypeDef> = {
  textField: {
    label: 'Text Field',
    component: 'TextField',
    valueType: 'string',
    formType: 'string',
    description: 'Input teks satu baris.',
  },
  textareaField: {
    label: 'Textarea Field',
    component: 'TextAreaField',
    valueType: 'string',
    formType: 'string',
    description: 'Input teks multi baris.',
  },
  passwordField: {
    label: 'Password Field',
    component: 'PasswordField',
    valueType: 'string',
    formType: 'string',
    description: 'Input password dengan toggle show/hide; dimask di tabel.',
  },
  numberField: {
    label: 'Number Field',
    component: 'TextField',
    valueType: 'number',
    formType: 'string',
    description: 'Input angka (currency); form string, payload number.',
  },
  dateField: {
    label: 'Date Field',
    component: 'DatePickerField',
    valueType: 'string',
    formType: 'string',
    description: 'Input tanggal (ISO string).',
  },
  dateRangeField: {
    label: 'Date Range Field',
    component: 'DateRangeField',
    valueType: 'string',
    formType: 'string',
    description: 'Input rentang tanggal ("start,end" ISO).',
  },
  selectField: {
    label: 'Select Field',
    component: 'SelectField',
    valueType: 'string',
    formType: 'string',
    description: 'Dropdown; options dari source (static/loadOptions/api).',
  },
  selectMultipleField: {
    label: 'Select Multiple Field',
    component: 'SelectMultipleField',
    valueType: 'stringArray',
    formType: 'stringArray',
    description: 'Dropdown multi-pilih; nilai string[].',
  },
  radioGroupField: {
    label: 'Radio Group Field',
    component: 'RadioGroupField',
    valueType: 'string',
    formType: 'string',
    description: 'Pilihan radio; options static/api.',
  },
  checkboxField: {
    label: 'Checkbox Field',
    component: 'CheckboxField',
    valueType: 'boolean',
    formType: 'boolean',
    description: 'Centang ya/tidak.',
  },
  checkboxGroupField: {
    label: 'Checkbox Group Field',
    component: 'CheckboxGroupField',
    valueType: 'stringArray',
    formType: 'stringArray',
    description: 'Grup checkbox; nilai string[].',
  },
  switchField: {
    label: 'Switch Field',
    component: 'SwitchField',
    valueType: 'boolean',
    formType: 'boolean',
    description: 'Toggle switch.',
  },
  fileUploadField: {
    label: 'File Upload Field',
    component: 'FileUploadField',
    valueType: 'file',
    formType: 'file',
    description: 'Upload file tunggal; form File|null, payload nama file.',
  },
};

export const fieldTypeOptions = (Object.keys(fieldTypeRegistry) as FieldType[]).map((value) => ({
  label: fieldTypeRegistry[value].label,
  value,
}));
