import type { FeatureKey, GeneratorFieldConfig } from '../types';

/** Versi skema definisi modul. Naikkan bila ada perubahan breaking. */
export const MODULE_DEFINITION_VERSION = 1 as const;

export type ModuleDefinitionVersion = typeof MODULE_DEFINITION_VERSION;

/** Hanya `published` yang di-render runtime; `draft` hanya tampil di preview wizard. */
export type ModuleDefinitionStatus = 'draft' | 'published';

/**
 * Perilaku hapus: `hard` = record dihapus permanen, `soft` = status → inactive
 * + endpoint restore (pola modul user).
 */
export type DeleteMode = 'hard' | 'soft';

/** Posisi satu field dalam grid form 12 kolom. */
export interface FormLayoutItem {
  /** Nama field (ref ke `fields[].name`). */
  field: string;
  /** Urutan tampil (0-based, unik). */
  order: number;
  /** Lebar kolom grid 1..12 (12 = satu baris penuh). */
  colSpan: number;
}

/** Layout kolom tabel list. Kolom sistem (created_by, created_date, status) selalu di akhir. */
export interface TableLayout {
  /** Nama field berurutan (ref ke `fields[].name`). */
  order: string[];
  /** Subset `order` yang disembunyikan. */
  hidden: string[];
}

export interface ModuleLayout {
  form: FormLayoutItem[];
  table: TableLayout;
}

/**
 * Single source of truth satu modul dinamis (v1).
 * Disimpan di BE (`module_definitions`), di-render generik oleh FE saat runtime.
 * Node-safe: boleh dipakai wizard, runtime, maupun skrip seed.
 */
export interface ModuleDefinition {
  version: ModuleDefinitionVersion;
  /** Identity stabil & unik, kebab path: `region` atau `mater-data/company`. Immutable setelah publish. */
  key: string;
  /** Label plural tampil: `Companies`. */
  label: string;
  /** Label singular tampil: `Company`. */
  singularLabel: string;
  /** Parent path kebab (`mater-data`) atau null = root. */
  parent: string | null;
  /** Basis route FE tanpa leading slash: `mater-data/companies`. */
  routeBase: string;
  /** Base permission key; suffix `.view/.create/.update/.delete/.bulk_upload/.export` otomatis. */
  permissionKey: string;
  /** Plural untuk URL API flat: `/api/v1/companies`. */
  apiPlural: string;
  moduleType: 'crud';
  features: Record<FeatureKey, boolean>;
  fields: GeneratorFieldConfig[];
  layout: ModuleLayout;
  deleteMode: DeleteMode;
  status: ModuleDefinitionStatus;
  createdAt?: string;
  updatedAt?: string;
}
