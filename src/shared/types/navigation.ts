import { type ReactNode } from 'react';

export interface SubItem {
  label: string;
  /** General-namespace key for the label; falls back to `label`. */
  labelKey?: string;
  path: string;
  permissionKey?: string;
  /** Judul seksi (mis. "Others") yang tampil di atas item ini bila berbeda dari item sebelumnya. */
  section?: string;
  /** General-namespace key for the section; falls back to `section`. */
  sectionKey?: string;
}

export interface NavItemType {
  label: string;
  /** General-namespace key for the label; falls back to `label`. */
  labelKey?: string;
  path?: string;
  icon: ReactNode;
  children?: SubItem[];
  permissionKey?: string;
  section?: string;
  sectionKey?: string;
}

/** Group parent menu (mis. Master Data) untuk modul yang ber-parent. */
export interface ModuleNavParent {
  /** Kunci unik group, mis. `master-data` — modul ber-parent sama digabung. */
  key: string;
  label: string;
  labelKey?: string;
  icon: ReactNode;
}

/**
 * Entri nav milik satu modul (diekspor dari `navigation.tsx` modul).
 * Tanpa `parent` jadi item flat di root; dengan `parent` jadi anak group.
 */
export interface ModuleNavEntry {
  parent?: ModuleNavParent;
  icon: ReactNode;
  item: SubItem;
}

/** Ekspor `navigation.tsx` modul: satu entri, atau beberapa (mis. satu group, banyak halaman). */
export type ModuleNav = ModuleNavEntry | ModuleNavEntry[];
