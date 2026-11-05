import type { ThemeName, ThemeOverrides } from '../shared/theme';

/** Identitas & tampilan project — diisi dari wizard Modula saat project dibuat. */
export const projectConfig = {
  name: '__PROJECT_NAME__',
  slug: '__PROJECT_SLUG__',
  /** Thema awal sebelum pengguna memilih sendiri. */
  theme: '__PROJECT_THEME__' as ThemeName,
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
