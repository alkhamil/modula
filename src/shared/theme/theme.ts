import { wdsPrimitives, wdsSemantic } from './wds.generated';

export type ThemeName = 'light' | 'dark';

/** Satu-satunya sumber kebenaran token thema. Nilai di sini yang dipakai seluruh shared components. */
export interface ThemeTokens {
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  background: string;
  surface: string;
  muted: string;
  border: string;
  foreground: string;
  mutedForeground: string;
  radiusSm: string;
  radiusMd: string;
  radiusLg: string;
  /** Standar spacing — dipakai via class semantik (`.page-padding`, `.section-gap`, ...). */
  pagePadding: string;
  pagePaddingLg: string;
  cardPaddingX: string;
  cardPaddingY: string;
  sectionGap: string;
  stackGap: string;
  fieldGap: string;
}

const spacing = {
  pagePadding: '1rem',
  pagePaddingLg: '1.5rem',
  cardPaddingX: '1.25rem',
  cardPaddingY: '1rem',
  sectionGap: '1.5rem',
  stackGap: '1rem',
  fieldGap: '0.75rem',
} satisfies Pick<
  ThemeTokens,
  | 'pagePadding'
  | 'pagePaddingLg'
  | 'cardPaddingX'
  | 'cardPaddingY'
  | 'sectionGap'
  | 'stackGap'
  | 'fieldGap'
>;

/**
 * Token legacy (`bg-primary`, `text-muted-foreground`, ...) diturunkan dari
 * token semantic WDS (`tokens/tokens.json` → `wds.generated.ts`), jadi seluruh
 * app ikut palet WDS dan mode light/dark-nya.
 */
function fromWds(mode: ThemeName): ThemeTokens {
  const s = wdsSemantic[mode];
  return {
    primary: s['bg.brand'],
    primaryForeground: s['text.on-brand'],
    secondary: mode === 'light' ? wdsPrimitives['secondary.500'] : wdsPrimitives['secondary.400'],
    secondaryForeground: s['text.on-brand'],
    success: s['bg.success'],
    warning: s['bg.warning'],
    danger: s['bg.danger'],
    info: s['bg.info'],
    background: s['bg.page'],
    surface: s['bg.subtle'],
    muted: s['bg.subtle-2'],
    border: s['stroke.default'],
    foreground: s['text.primary'],
    mutedForeground: s['text.tertiary'],
    radiusSm: '0.125rem',
    radiusMd: '0.25rem',
    radiusLg: '0.5rem',
    ...spacing,
  };
}

export const themes: Record<ThemeName, ThemeTokens> = {
  light: fromWds('light'),
  dark: fromWds('dark'),
};

/** Override pengguna via panel thema — diterapkan di atas token thema aktif. */
export interface ThemeOverrides {
  primary?: string;
  secondary?: string;
  radiusSm?: string;
  radiusMd?: string;
  radiusLg?: string;
}

const STORAGE_KEY = 'app-theme';
const OVERRIDES_KEY = 'app-theme-overrides';

function toVarName(key: keyof ThemeTokens): string {
  return `--theme-${key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}`;
}

/** Pilih warna teks (gelap/terang) yang kontras di atas `hex`. */
export function getContrastForeground(hex: string): string {
  const raw = hex.replace('#', '');
  const full =
    raw.length === 3
      ? raw
          .split('')
          .map((ch) => ch + ch)
          .join('')
      : raw;
  const channel = (i: number) => {
    const v = parseInt(full.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  const luminance = 0.2126 * channel(0) + 0.7152 * channel(2) + 0.0722 * channel(4);
  return luminance > 0.45 ? '#0f172a' : '#ffffff';
}

const BRAND_VARS = [
  '--wds-bg-brand',
  '--wds-bg-brand-hover',
  '--wds-bg-brand-pressed',
  '--wds-bg-brand-pressed-strong',
  '--wds-bg-brand-subtle',
  '--wds-text-brand',
  '--wds-text-on-brand',
  '--wds-icons-brand',
  '--wds-icons-on-brand',
  '--wds-stroke-brand',
  '--wds-stroke-focus',
] as const;

/**
 * Warna primary pilihan pengguna juga diterapkan ke token brand WDS agar komponen
 * WDS (Button, dst.) ikut berubah; state hover/pressed diturunkan dari warna itu.
 */
function applyBrandOverride(root: HTMLElement, primary: string | undefined): void {
  if (!primary) {
    BRAND_VARS.forEach((name) => root.style.removeProperty(name));
    return;
  }
  const onBrand = getContrastForeground(primary);
  const mix = (pct: number, base: string) => `color-mix(in srgb, ${primary} ${pct}%, ${base})`;
  const values: Record<(typeof BRAND_VARS)[number], string> = {
    '--wds-bg-brand': primary,
    '--wds-bg-brand-hover': mix(88, 'black'),
    '--wds-bg-brand-pressed': mix(80, 'black'),
    '--wds-bg-brand-pressed-strong': mix(72, 'black'),
    '--wds-bg-brand-subtle': mix(10, 'white'),
    '--wds-text-brand': primary,
    '--wds-text-on-brand': onBrand,
    '--wds-icons-brand': primary,
    '--wds-icons-on-brand': onBrand,
    '--wds-stroke-brand': primary,
    '--wds-stroke-focus': primary,
  };
  BRAND_VARS.forEach((name) => root.style.setProperty(name, values[name]));
}

/** Terapkan thema: set `data-theme` + CSS variables dari token, lalu simpan pilihan. */
export function applyTheme(name: ThemeName, overrides: ThemeOverrides = {}): void {
  const root = document.documentElement;
  root.dataset.theme = name;
  const tokens: ThemeTokens = { ...themes[name], ...overrides };
  if (overrides.primary) {
    tokens.primaryForeground = getContrastForeground(overrides.primary);
  }
  if (overrides.secondary) {
    tokens.secondaryForeground = getContrastForeground(overrides.secondary);
  }
  (Object.keys(tokens) as (keyof ThemeTokens)[]).forEach((key) => {
    root.style.setProperty(toVarName(key), tokens[key]);
  });
  applyBrandOverride(root, overrides.primary);
  localStorage.setItem(STORAGE_KEY, name);
  localStorage.setItem(OVERRIDES_KEY, JSON.stringify(overrides));
}

export function getInitialTheme(): ThemeName {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'light' || saved === 'dark') return saved;
  return 'light';
}

export function getStoredOverrides(): ThemeOverrides {
  try {
    const raw = localStorage.getItem(OVERRIDES_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as ThemeOverrides;
    return { ...parsed };
  } catch {
    return {};
  }
}

export function clearStoredOverrides(): void {
  localStorage.removeItem(OVERRIDES_KEY);
}
