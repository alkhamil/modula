import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import DocsLayout from '../docs/DocsLayout';
import { docs } from '../docs/registry';

/** Indeks dokumentasi komponen: pencarian + kartu per kategori. */
function ComponentsIndexPage() {
  const { t, i18n } = useTranslation();
  const [query, setQuery] = useState('');
  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q === ''
      ? docs
      : docs.filter((d) =>
          `${d.name} ${t(`docs.${d.slug}.summary`)} ${t(`docs.categories.${d.category}`)}`.toLowerCase().includes(q),
        );
    // `t` berubah saat bahasa berganti.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, i18n.language]);

  return (
    <DocsLayout>
      <div className="flex flex-col section-gap" data-testid="components-index">
        <header className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{t('docs.index.title')}</h1>
          <p className="max-w-3xl text-xs text-muted-foreground">{t('docs.index.subtitle')}</p>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('docs.nav.searchPlaceholder')}
            aria-label={t('docs.nav.searchLabel')}
            className="w-full max-w-sm rounded-lg border border-border bg-background px-3 py-2 text-xs hover:border-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
          />
        </header>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {matches.map((d) => (
            <Link
              key={d.slug}
              to={`/components/${d.slug}`}
              className="flex flex-col gap-1.5 rounded-xl border border-border bg-background p-5 transition-shadow hover:border-primary hover:shadow-md"
            >
              <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                {t(`docs.categories.${d.category}`)}
              </span>
              <span className="text-sm font-semibold text-foreground">{d.name}</span>
              <span className="line-clamp-3 text-xs text-muted-foreground">{t(`docs.${d.slug}.summary`)}</span>
            </Link>
          ))}
          {matches.length === 0 && <p className="text-xs text-muted-foreground">{t('docs.nav.noResults')}</p>}
        </div>
      </div>
    </DocsLayout>
  );
}

export default ComponentsIndexPage;
