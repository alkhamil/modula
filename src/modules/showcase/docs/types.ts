import type { ComponentType } from 'react';

/** Rujukan ikon di data dokumentasi (di-resolve ke elemen saat render, dicetak `<Nama />` di kode). */
export interface IconRef {
  $icon: string;
}
export const icon = (name: string): IconRef => ({ $icon: name });
/** Props non-serializable di data docs: `value` dipakai saat render, `code` dicetak di kode contoh. */
export interface RawRef {
  $raw: string;
  value: unknown;
}
export const raw = (code: string, value: unknown): RawRef => ({ $raw: code, value });
export const fn = (name: string): RawRef => raw(name, () => undefined);
export const isRawRef = (value: unknown): value is RawRef =>
  typeof value === 'object' && value !== null && '$raw' in value;

export const isIconRef = (value: unknown): value is IconRef =>
  typeof value === 'object' && value !== null && '$icon' in value;

export interface DocControl {
  prop: string;
  kind: 'select' | 'boolean' | 'text' | 'icon';
  /** Untuk `select`; untuk `icon` daftar nama ikon (opsi "none" otomatis). */
  options?: string[];
}

/**
 * Satu baris pemetaan properti/mode di Figma → props komponen. Kalimat (nilai bebas, catatan)
 * ada di locale: `docs.<slug>.figma.<id>.values|note`; `values` di sini jadi default bila
 * kunci locale tidak ada.
 */
export interface FigmaMapping {
  id: string;
  /** Nama properti/mode di Figma (istilah Figma, tidak diterjemahkan). */
  figma: string;
  values: string;
  prop: string;
}

/** Deskripsi di locale: `docs.<slug>.props.<id>`. */
export interface PropDoc {
  id: string;
  name: string;
  type: string;
  default?: string;
}

export interface DocVariant {
  label: string;
  props: Record<string, unknown>;
  children?: string;
}

/** Judul/deskripsi di locale: `docs.<slug>.examples.<id>.title|description`. */
export interface DocExample {
  id: string;
  variants: DocVariant[];
}

/** Matriks state × varian; state dipaksa lewat `data-wds-state`. Judul: `docs.<slug>.matrices.<id>`. */
export interface DocMatrix {
  id: string;
  rows: { label: string; props: Record<string, unknown> }[];
  columns: { label: string; props: Record<string, unknown> }[];
  children?: string;
}

/** Penjelasan di locale: `docs.<slug>.tokens.<name>`. */
export interface TokenDoc {
  /** Nama CSS variable, mis. `--wds-bg-brand`. */
  name: string;
}

/**
 * Komponen grup yang didokumentasikan di halaman komponen dasarnya (mis. CheckboxGroup di halaman
 * Checkbox). Teks di locale: `docs.<slug>.group.summary|examples.<id>|props.<id>`.
 */
export interface GroupDoc {
  /** Nama komponen, mis. `CheckboxGroup`. */
  name: string;
  importStatement: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: ComponentType<any>;
  codeExtra: string[];
  codeOmit: string[];
  baseProps: Record<string, unknown>;
  examples: DocExample[];
  props: PropDoc[];
}

/**
 * Data teknis dokumentasi satu komponen. Semua kalimat (ringkasan, catatan, behavior, dst.)
 * ada di `showcase/i18n/<lang>.json` di bawah `docs.<slug>` agar bisa diterjemahkan.
 */
export interface ComponentDoc {
  slug: string;
  name: string;
  /** Id kategori → `docs.categories.<id>`. */
  category: string;
  /** Teks import yang ditampilkan di header. */
  importStatement: string;
  /** Nama komponen di kode contoh bila beda dari `name` (mis. wrapper demo → komponen asli). */
  codeName?: string;
  /** Nama komponen di kode contoh menurut props (untuk komponen yang berganti nama menurut props; saat ini tidak dipakai). */
  codeNameFor?: (props: Record<string, unknown>) => string;
  /** Kode children di kode contoh (mis. elemen pemicu Tooltip); menggantikan teks children. */
  codeChildren?: string;
  /** Atribut tambahan di awal kode contoh (mis. `value={checked}`). */
  codeExtra?: string[];
  /** Props demo yang tidak dicetak di kode contoh. */
  codeOmit?: string[];
  figmaUrl?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: ComponentType<any>;
  /** Nilai default komponen — tidak dicetak di kode contoh. */
  defaults?: Record<string, unknown>;
  /** Props awal playground + teks children. */
  baseProps: Record<string, unknown>;
  baseChildren?: string;
  controls: DocControl[];
  figmaMapping: FigmaMapping[];
  examples: DocExample[];
  matrices?: DocMatrix[];
  props: PropDoc[];
  tokens: TokenDoc[];
  /** Komponen grup (mis. CheckboxGroup) yang dijelaskan di halaman ini. */
  group?: GroupDoc;
}
