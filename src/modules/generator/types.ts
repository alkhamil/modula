export type ModuleType = 'crud';

export type FeatureKey =
  | 'list'
  | 'detail'
  | 'create'
  | 'edit'
  | 'delete'
  | 'bulkUpload'
  | 'export';

export type FieldType =
  | 'textField'
  | 'textareaField'
  | 'passwordField'
  | 'numberField'
  | 'dateField'
  | 'dateRangeField'
  | 'selectField'
  | 'selectMultipleField'
  | 'radioGroupField'
  | 'checkboxField'
  | 'checkboxGroupField'
  | 'switchField'
  | 'fileUploadField';

export type DataSource =
  | 'none'
  | 'mockStatic'
  | 'mockPagingInfinityScroll'
  | 'api';

export interface FieldOption {
  label: string;
  value: string;
}

export interface ApiSourceConfig {
  endpoint: string;
  method?: string;
  valueField?: string;
  labelField?: string;
}

/** Kriteria filter per field — opsi valid tergantung tipe field (lihat filterCriteriaRegistry). */
export type FilterCriteria =
  | 'contains'
  | 'exact'
  | 'numberExact'
  | 'numberMin'
  | 'numberMax'
  | 'numberRange'
  | 'dateExact'
  | 'dateRange'
  | 'dateOverlap'
  | 'optionExact'
  | 'optionAny'
  | 'booleanExact';

/** Satu field deklaratif dalam konfigurasi generator. */
export interface GeneratorFieldConfig {
  /** camelCase, mis. `regionName`. */
  name: string;
  /** Label tampil, mis. `Region Name`. */
  label: string;
  type: FieldType;
  /** Rules format string, mis. `["required", "min:3", "max:100"]`. */
  rules: string[];
  source: DataSource;
  /** Wajib bila `source === 'mockStatic'`; contoh saat `source === 'api'`. */
  options?: FieldOption[];
  /** Konfigurasi endpoint bila `source === 'api'`. */
  api?: ApiSourceConfig;
  /** Kolom tabel bisa di-sort (default true). */
  sortable?: boolean;
  /** Kolom tampil sebagai filter (default tergantung tipe). */
  filterable?: boolean;
  /** Kriteria filter bila `filterable` (default tergantung tipe). */
  filterCriteria?: FilterCriteria | null;
}

/** Single source of truth konfigurasi generator (skill §5). */
export interface GeneratorConfig {
  /** null/empty string = root. */
  parentName: string | null;
  moduleName: string;
  type: ModuleType;
  /**
   * Base permission key modul (wajib, single value tanpa titik —
   * mis. `user`, `generator`, `audit_trail`). Suffix `.view`, `.create`,
   * `.update`, `.delete` diturunkan otomatis oleh generator.
   */
  permissionKey: string;
  features: Record<FeatureKey, boolean>;
  fields: GeneratorFieldConfig[];
}


