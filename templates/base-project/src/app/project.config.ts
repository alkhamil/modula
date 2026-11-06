import type { ThemeName, ThemeOverrides, UiStyle } from '../shared/theme';

/** Identitas & tampilan project — diisi dari wizard Modula saat project dibuat. */
export const projectConfig = {
  name: '__PROJECT_NAME__',
  slug: '__PROJECT_SLUG__',
  /** Thema awal sebelum pengguna memilih sendiri. */
  theme: '__PROJECT_THEME__' as ThemeName,
  /** Gaya tampilan (tata letak shell + auth); `classic` = WDS resmi. */
  uiStyle: '__PROJECT_STYLE__' as UiStyle,
  /** Warna primary awal (hex); kosong = warna brand WDS bawaan. */
  primaryColor: '__PROJECT_PRIMARY__',
  /** Logo sidebar (path di `public/`); kosong = nama project. */
  logo: '__PROJECT_LOGO__',
  /** Logo ringkas saat sidebar diciutkan; kosong = huruf pertama nama project. */
  logoCollapsed: '__PROJECT_LOGO_COLLAPSED__',
} as const;

export const defaultThemeOverrides: ThemeOverrides = projectConfig.primaryColor
  ? { primary: projectConfig.primaryColor }
  : {};

/** URL aset di `public/` yang ikut `base` Vite (aplikasi bisa disajikan di sub-path). Kosong tetap kosong. */
export function assetUrl(path: string): string {
  return path ? `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}` : '';
}
