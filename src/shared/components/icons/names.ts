import wdsIndex from './wds/index.json';

/** Nama ikon WDS (PascalCase) → slug kategori file `wds/<kategori>.tsx`. Node-safe. */
export const WDS_ICON_INDEX: Readonly<Record<string, string>> = wdsIndex;

/** Semua nama ikon WDS, urut abjad. */
export const WDS_ICON_NAMES: readonly string[] = Object.keys(WDS_ICON_INDEX);

export function isWdsIcon(name: string): boolean {
  return Object.hasOwn(WDS_ICON_INDEX, name);
}

/** Slug kategori ikon, atau undefined bila nama tak dikenal. */
export function wdsIconCategory(name: string): string | undefined {
  return isWdsIcon(name) ? WDS_ICON_INDEX[name] : undefined;
}
