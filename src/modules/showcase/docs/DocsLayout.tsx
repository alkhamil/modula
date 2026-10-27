import { useEffect, useRef, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation } from 'react-router';
import { docs } from './registry';

/** Kerangka dokumentasi: daftar komponen (per kategori) di kiri, isi di kanan. */
function DocsLayout({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const categories = [...new Set(docs.map((d) => d.category))];
  const { pathname } = useLocation();
  const navRef = useRef<HTMLElement>(null);

  // Daftar panjang: jaga item aktif tetap terlihat saat berpindah halaman.
  useEffect(() => {
    navRef.current?.querySelector('[aria-current="page"]')?.scrollIntoView({ block: 'nearest' });
  }, [pathname]);
  return (
    // Lebar penuh viewport (keluar dari wadah max-w halaman) dengan padding kecil di tepi kiri/kanan.
    <div className="mx-[calc(50%-50vw)] flex flex-col gap-6 px-3 lg:flex-row lg:px-4">
      <aside className="shrink-0 lg:w-48" aria-label={t('docs.nav.componentList')}>
        <nav
          ref={navRef}
          className="wds-scroll flex flex-col gap-5 lg:sticky lg:top-4 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-2"
        >
          <NavLink
            to="/components"
            end
            className={({ isActive }) =>
              [
                'rounded-lg px-3 py-2 text-[13px] font-semibold',
                isActive ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted',
              ].join(' ')
            }
          >
            {t('docs.nav.allComponents')}
          </NavLink>
          <div className="flex flex-col gap-0.5">
            <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Foundations
            </p>
            {[
              { to: '/components/typography', label: t('nav.typography') },
              { to: '/components/colors', label: t('nav.colors') },
              { to: '/components/icons', label: t('nav.icons') },
              { to: '/components/ui', label: t('nav.ui') },
            ].map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    'rounded-lg px-3 py-1.5 text-[13px] transition-colors',
                    isActive
                      ? 'bg-primary/10 font-medium text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  ].join(' ')
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
          {categories.map((category) => (
            <div key={category} className="flex flex-col gap-0.5">
              <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {t(`docs.categories.${category}`)}
              </p>
              {docs
                .filter((d) => d.category === category)
                .map((d) => (
                  <NavLink
                    key={d.slug}
                    to={`/components/${d.slug}`}
                    className={({ isActive }) =>
                      [
                        'rounded-lg px-3 py-1.5 text-[13px] transition-colors',
                        isActive
                          ? 'bg-primary/10 font-medium text-primary'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                      ].join(' ')
                    }
                  >
                    {d.name}
                  </NavLink>
                ))}
            </div>
          ))}
        </nav>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

export default DocsLayout;
