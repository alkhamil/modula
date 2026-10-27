import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, InputField, SegmentedControl } from '../../../shared/components/ui';
import { WdsIcon, type WdsIconVariant } from '../../../shared/components/icons';
import { WDS_ICON_INDEX, WDS_ICON_NAMES } from '../../../shared/components/icons/names';
import DocSection from '../components/DocSection';

const PAGE_SIZE = 120;
const VARIANTS: { value: WdsIconVariant; label: string }[] = [
  { value: 'outline', label: 'Outline' },
  { value: 'bold', label: 'Bold' },
  { value: 'bold-duotone', label: 'Bold Duotone' },
  { value: 'broken', label: 'Broken' },
  { value: 'line-duotone', label: 'Line Duotone' },
];

/** Galeri ikon WDS: cari, pilih gaya (Outline / Bold Duotone), klik untuk menyalin nama. */
function IconsPage() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [variant, setVariant] = useState<WdsIconVariant>('outline');
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [copied, setCopied] = useState<string | null>(null);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/\s+/g, '');
    if (!q) return WDS_ICON_NAMES;
    return WDS_ICON_NAMES.filter(
      (name) => name.toLowerCase().includes(q) || (WDS_ICON_INDEX[name] ?? '').replace(/-/g, '').includes(q),
    );
  }, [query]);
  const visible = matches.slice(0, limit);

  function copy(name: string) {
    void navigator.clipboard?.writeText(name).catch(() => undefined);
    setCopied(name);
  }

  return (
    <DocSection title={t('docs.icons.title')} description={t('docs.icons.description')}>
      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-[220px] flex-1">
          <InputField
            size="sm"
            type="search"
            aria-label={t('docs.icons.searchLabel')}
            placeholder={t('docs.icons.searchPlaceholder')}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setLimit(PAGE_SIZE);
            }}
          />
        </div>
        <SegmentedControl
          size="sm"
          aria-label={t('docs.icons.styleLabel')}
          value={variant}
          onChange={(v) => setVariant(v as WdsIconVariant)}
          options={VARIANTS.map((v) => ({ value: v.value, label: v.label }))}
        />
      </div>
      <p className="text-xs text-muted-foreground" role="status">
        {copied
          ? t('docs.icons.copied', { name: copied })
          : t('docs.icons.count', { shown: visible.length, total: matches.length })}
      </p>
      {visible.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t('docs.icons.noResults')}</p>
      ) : (
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
          {visible.map((name) => (
            <li key={name}>
              <button
                type="button"
                onClick={() => copy(name)}
                title={name}
                className="flex w-full flex-col items-center gap-2 rounded-lg border border-border bg-background px-2 py-3 text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-primary"
              >
                <WdsIcon name={name} variant={variant} className="h-6 w-6" aria-hidden="true" />
                <span className="w-full truncate text-center text-[11px] text-muted-foreground">{name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {matches.length > visible.length && (
        <div className="flex justify-center">
          <Button hierarchy="secondary" onClick={() => setLimit((n) => n + PAGE_SIZE)}>
            {t('docs.icons.loadMore')}
          </Button>
        </div>
      )}
    </DocSection>
  );
}

export default IconsPage;
