import type { FieldType, FilterCriteria } from '../types';

export interface FilterCriteriaDef {
  label: string;
  description: string;
  /** Tipe field yang boleh memakai kriteria ini. */
  appliesTo: FieldType[];
}

export const filterCriteriaRegistry: Record<FilterCriteria, FilterCriteriaDef> = {
  contains: {
    label: 'Contains',
    description: 'Text contains keyword (case-insensitive).',
    appliesTo: ['textField', 'textareaField', 'fileUploadField'],
  },
  exact: {
    label: 'Equals',
    description: 'Exact text match.',
    appliesTo: ['textField', 'textareaField', 'fileUploadField'],
  },
  numberExact: {
    label: 'Equals',
    description: 'Exact number match.',
    appliesTo: ['numberField'],
  },
  numberMin: {
    label: 'Minimum',
    description: 'Number greater than or equal.',
    appliesTo: ['numberField'],
  },
  numberMax: {
    label: 'Maximum',
    description: 'Number less than or equal.',
    appliesTo: ['numberField'],
  },
  numberRange: {
    label: 'Range (min–max)',
    description: 'Lower and upper bound inputs.',
    appliesTo: ['numberField'],
  },
  dateExact: {
    label: 'Exact date',
    description: 'Exact date match.',
    appliesTo: ['dateField'],
  },
  dateRange: {
    label: 'Date range',
    description: 'Date between start and end.',
    appliesTo: ['dateField'],
  },
  dateOverlap: {
    label: 'Range overlap',
    description: 'Record range overlaps the filter range.',
    appliesTo: ['dateRangeField'],
  },
  optionExact: {
    label: 'Any value',
    description: 'Value equals the selected option.',
    appliesTo: ['selectField', 'radioGroupField'],
  },
  optionAny: {
    label: 'One/more values',
    description: 'Record matches when containing any selected value.',
    appliesTo: ['selectMultipleField', 'checkboxGroupField'],
  },
  booleanExact: {
    label: 'Yes / No',
    description: 'Boolean value equals the selection.',
    appliesTo: ['checkboxField', 'switchField'],
  },
};

export const filterCriteriaNames = Object.keys(filterCriteriaRegistry) as FilterCriteria[];

/** Opsi kriteria valid untuk satu tipe field. */
export function criteriaForFieldType(type: FieldType): FilterCriteria[] {
  return filterCriteriaNames.filter((name) => filterCriteriaRegistry[name].appliesTo.includes(type));
}

/** Default sortable per tipe. */
export function defaultSortable(_type: FieldType): boolean {
  return true;
}

/** Default filterable per tipe (file dimatikan agar tidak berisik). */
export function defaultFilterable(type: FieldType): boolean {
  return type !== 'fileUploadField';
}

/** Default kriteria per tipe. */
export function defaultCriteria(type: FieldType): FilterCriteria {
  switch (type) {
    case 'numberField':
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
