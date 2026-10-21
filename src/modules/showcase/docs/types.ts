import type { ComponentType } from 'react';

/** Rujukan ikon di data dokumentasi (di-resolve ke elemen saat render, dicetak `<Nama />` di kode). */
export interface IconRef {
  $icon: string;
}
export const icon = (name: string): IconRef => ({ $icon: name });
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
}
