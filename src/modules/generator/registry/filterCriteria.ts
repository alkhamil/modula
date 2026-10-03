import type { FieldType, FilterCriteria } from '../types';

export interface FilterCriteriaDef {
  label: string;
  description: string;
  /** Tipe field yang boleh memakai kriteria ini. */
  appliesTo: FieldType[];
}

export const filterCriteriaRegistry: Record<FilterCriteria, FilterCriteriaDef> = {
  contains: {
    label: 'Mengandung',
    description: 'Teks mengandung keyword (case-insensitive).',
    appliesTo: ['textField', 'textareaField', 'passwordField', 'fileUploadField', 'colorField'],
  },
  exact: {
    label: 'Sama dengan',
    description: 'Teks sama persis.',
    appliesTo: ['textField', 'textareaField', 'passwordField', 'fileUploadField', 'colorField'],
  },
  numberExact: {
    label: 'Sama dengan',
    description: 'Angka sama persis.',
    appliesTo: ['numberField', 'currencyField'],
  },
  numberMin: {
    label: 'Minimal',
    description: 'Angka lebih besar atau sama dengan.',
    appliesTo: ['numberField', 'currencyField'],
  },
  numberMax: {
    label: 'Maksimal',
    description: 'Angka lebih kecil atau sama dengan.',
    appliesTo: ['numberField', 'currencyField'],
  },
  numberRange: {
    label: 'Rentang (min–maks)',
    description: 'Dua isian batas bawah dan atas.',
    appliesTo: ['numberField', 'currencyField'],
  },
  dateExact: {
    label: 'Tanggal pas',
    description: 'Tanggal sama persis.',
    appliesTo: ['dateField'],
  },
  dateRange: {
    label: 'Rentang tanggal',
    description: 'Tanggal di antara awal dan akhir.',
    appliesTo: ['dateField'],
  },
  dateOverlap: {
    label: 'Irisan rentang',
    description: 'Rentang record beririsan dengan rentang filter.',
    appliesTo: ['dateRangeField'],
  },
  optionExact: {
    label: 'Salah satu nilai',
    description: 'Nilai sama dengan option terpilih.',
    appliesTo: ['selectField', 'radioGroupField'],
  },
  optionAny: {
    label: 'Satu/lebih nilai',
    description: 'Record cocok bila mengandung salah satu nilai terpilih.',
    appliesTo: ['selectMultipleField', 'checkboxGroupField'],
  },
  booleanExact: {
    label: 'Ya / Tidak',
    description: 'Nilai boolean sama dengan pilihan.',
    appliesTo: ['checkboxField', 'switchField'],
  },
};

export const filterCriteriaNames = Object.keys(filterCriteriaRegistry) as FilterCriteria[];

/** Opsi kriteria valid untuk satu tipe field. */
export function criteriaForFieldType(type: FieldType): FilterCriteria[] {
  return filterCriteriaNames.filter((name) => filterCriteriaRegistry[name].appliesTo.includes(type));
}

/** Default sortable per tipe (array baris dimatikan — sortir objek tak bermakna). */
export function defaultSortable(type: FieldType): boolean {
  return type !== 'formArrayField';
}

/** Default filterable per tipe (password, file, editor, array dimatikan agar tidak berisik). */
export function defaultFilterable(type: FieldType): boolean {
  return (
    type !== 'passwordField' &&
    type !== 'fileUploadField' &&
    type !== 'editorField' &&
    type !== 'formArrayField'
  );
}

/** Default kriteria per tipe. */
export function defaultCriteria(type: FieldType): FilterCriteria {
  switch (type) {
    case 'numberField':
    case 'currencyField':
      return 'numberExact';
    case 'dateField':
      return 'dateExact';
    case 'dateRangeField':
      return 'dateOverlap';
    case 'selectField':
    case 'radioGroupField':
      return 'optionExact';
    case 'selectMultipleField':
    case 'checkboxGroupField':
      return 'optionAny';
    case 'checkboxField':
    case 'switchField':
      return 'booleanExact';
    default:
      return 'contains';
  }
}
