import { useTranslation } from 'react-i18next';

/**
 * Terjemahan dokumentasi: `t('x')` → `docs.x`; `c('x')` → `docs.<slug>.x`;
 * `list('x')` → array string `docs.<slug>.x` (behavior, aksesibilitas, dst.).
 */
export function useDocT(slug?: string) {
  const { t } = useTranslation();
  return {
    t: (path: string, options?: Record<string, unknown>) => t(`docs.${path}`, options) as string,
    c: (path: string, options?: Record<string, unknown>) => t(`docs.${slug}.${path}`, options) as string,
    list: (path: string): string[] => {
      const value = t(`docs.${slug}.${path}`, { returnObjects: true }) as unknown;
      return Array.isArray(value) ? (value as string[]) : [];
    },
  };
}
