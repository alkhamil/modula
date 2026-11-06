import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import {
  DEFAULT_STORAGE_PREFIX,
  applyTheme,
  clearStoredOverrides,
  getContrastForeground,
  getInitialTheme,
  getStoredOverrides,
  persistTheme,
  themes,
} from './theme';
import type { ThemeName, ThemeOverrides, ThemeTokens, UiStyle } from './theme';

interface ThemeContextValue {
  theme: ThemeName;
  tokens: ThemeTokens;
  overrides: ThemeOverrides;
  setTheme: (theme: ThemeName) => void;
  toggleTheme: () => void;
  /** Gabungkan override kustom (warna primary/secondary, radius) dan terapkan langsung. */
  updateOverrides: (partial: ThemeOverrides) => void;
  /** Hapus semua override kembali ke token bawaan thema. */
  resetOverrides: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
  /** Thema awal bila pengguna belum memilih (default `light`). */
  defaultTheme?: ThemeName;
  /** Override awal (mis. warna primary project) bila pengguna belum mengubahnya. */
  defaultOverrides?: ThemeOverrides;
  /** Gaya tampilan project (default `classic` = WDS resmi); ditulis ke `data-ui-style` di `<html>`. */
  uiStyle?: UiStyle;
  /** Prefix kunci localStorage; project hasil wizard memakai slug-nya agar pilihan tak bentrok antar-app. */
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme,
  defaultOverrides,
  uiStyle = 'classic',
  storageKey = DEFAULT_STORAGE_PREFIX,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeName>(() => getInitialTheme(defaultTheme, storageKey));
  const [overrides, setOverridesState] = useState<ThemeOverrides>(() => getStoredOverrides(defaultOverrides, storageKey));
  // Simpan hanya setelah pengguna mengubah thema; default project yang baru diterapkan bukan "pilihan pengguna".
  const touched = useRef(false);

  // Layout effect: gaya, tema, dan warna primary harus terpasang SEBELUM paint pertama, kalau tidak halaman
  // berkedip dengan warna bawaan dulu (dan transition komponen membuat perubahannya terlihat pelan).
  useLayoutEffect(() => {
    document.documentElement.dataset.uiStyle = uiStyle;
  }, [uiStyle]);

  useLayoutEffect(() => {
    applyTheme(theme, overrides);
    if (touched.current) persistTheme(theme, overrides, storageKey);
  }, [theme, overrides, storageKey]);

  const setTheme = useCallback((next: ThemeName) => {
    touched.current = true;
    setThemeState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    touched.current = true;
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const updateOverrides = useCallback((partial: ThemeOverrides) => {
    touched.current = true;
    setOverridesState((prev) => ({ ...prev, ...partial }));
  }, []);

  const resetOverrides = useCallback(() => {
    // Kembali ke default project: tidak ada lagi override pengguna yang perlu disimpan.
    touched.current = false;
    clearStoredOverrides(storageKey);
    setOverridesState({ ...defaultOverrides });
  }, [defaultOverrides, storageKey]);

  const value = useMemo<ThemeContextValue>(() => {
    const merged: ThemeTokens = { ...themes[theme], ...overrides };
    if (overrides.primary) {
      merged.primaryForeground = getContrastForeground(overrides.primary);
    }
    if (overrides.secondary) {
      merged.secondaryForeground = getContrastForeground(overrides.secondary);
    }
    return {
      theme,
      tokens: merged,
      overrides,
      setTheme,
      toggleTheme,
      updateOverrides,
      resetOverrides,
    };
  }, [theme, overrides, setTheme, toggleTheme, updateOverrides, resetOverrides]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>.');
  return ctx;
}
