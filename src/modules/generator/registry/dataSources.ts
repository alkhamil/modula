import type { DataSource, FieldType } from '../types';

export interface DataSourceDef {
  label: string;
  description: string;
  /** Tipe field yang mendukung source ini. */
  appliesTo: FieldType[];
}

export const dataSourceRegistry: Record<DataSource, DataSourceDef> = {
  none: {
    label: 'None',
    description: 'Tanpa sumber data eksternal.',
    appliesTo: [
      'textField',
      'textareaField',
      'passwordField',
      'numberField',
      'dateField',
      'dateRangeField',
      'selectField',
      'selectMultipleField',
      'radioGroupField',
      'checkboxField',
      'checkboxGroupField',
      'switchField',
      'fileUploadField',
    ],
  },
  mockStatic: {
    label: 'Mock Static',
    description: 'Options statis [{label, value}] di mock.',
    appliesTo: ['selectField', 'selectMultipleField', 'radioGroupField', 'checkboxGroupField'],
  },
  mockPagingInfinityScroll: {
    label: 'Mock Paging (Infinite Scroll + Search)',
    description: 'Options mock paginated dan searchable via loadOptions.',
    appliesTo: ['selectField', 'selectMultipleField'],
  },
  api: {
    label: 'API',
    description: 'Options dari endpoint real (mock memakai contoh options).',
    appliesTo: ['selectField', 'selectMultipleField', 'radioGroupField', 'checkboxGroupField'],
  },
};

export const dataSourceOptions = (Object.keys(dataSourceRegistry) as DataSource[]).map(
  (value) => ({ label: dataSourceRegistry[value].label, value }),
);
