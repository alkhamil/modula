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

/** Satu file hasil generate: path relatif repo + isi kode. */
export interface GeneratedFile {
  path: string;
  content: string;
}

/** Satu entri route siap sisip ke `src/app/router.tsx`. */
export interface RegistrationRoute {
  /** Mis. `companies` — dipakai untuk cek idempotensi. */
  path: string;
  /** Blok kode lengkap siap sisip (indent 6 spasi). */
  code: string;
}

/**
 * Data registrasi modul hasil generate ke app shell.
 * Dibangun murni dari config (Node-safe) lalu dikirim ke dev-server
 * untuk disisipkan ke `router.tsx` + `navigation.tsx`.
 */
export interface ModuleRegistration {
  /** Path import modul dari `src/app/`, mis. `../modules/mater-data/company`. */
  moduleImportPath: string;
  /** Blok import multi-baris siap sisip (kosong bila tanpa halaman). */
  importBlock: string;
  routes: RegistrationRoute[];
  /** Absolute path nav, mis. `/companies` — untuk cek idempotensi. */
  navPath: string;
  /** Item nav siap sisip: flat (root) atau child (ber-parent). */
  navItemCode: string;
  /** Snippet INTEGRATION.md: item flat atau blok group utuh + marker. */
  navSnippet: string;
  /** Parent kebab penuh, mis. `mater-data` (satu level group). */
  parentPath: string | null;
  /** Label group parent, mis. `Mater Data`. */
  parentLabel: string | null;
  /** Label modul plural, mis. `Companies`. */
  label: string;
  permissionView: string;
}
