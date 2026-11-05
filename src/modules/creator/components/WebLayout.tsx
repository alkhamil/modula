import { useTranslation } from 'react-i18next';
import { Link, NavLink, Outlet } from 'react-router';
import { Button } from '../../../shared/components/ui';
import brandLogo from '../../../assets/icons/brand/brand.png';
import { AddCircle, Database } from '../../../shared/components/icons';
import LanguageSwitch from '../../../shared/i18n/LanguageSwitch';
import { ThemeSwitch } from '../../../shared/theme';

/** Layout utama Modula bergaya web end-user (top navbar + konten terpusat + footer). */
function WebLayout() {
  const { t } = useTranslation();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    [
      'inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
      isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
    ].join(' ');

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground" data-testid="web-layout">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-foreground">
              {/* Hanya lambang "M" dari logo brand (kiri gambar); teks "Modula" tetap teks agar ikut tema terang/gelap. */}
              <span className="block h-9 w-10 shrink-0 overflow-hidden" aria-hidden="true">
                <img src={brandLogo} alt="" className="h-9 max-w-none" />
              </span>
              <span>Modula</span>
            </Link>
            <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
              <NavLink to="/" end className={navLinkClass} data-testid="nav-home">
                {t('creator.nav.home')}
              </NavLink>
              <NavLink to="/create" className={navLinkClass} data-testid="nav-create">
                <AddCircle className="h-4 w-4" />
                {t('creator.nav.create')}
              </NavLink>
              <NavLink to="/components" className={navLinkClass} data-testid="nav-docs">
                <Database className="h-4 w-4" />
                {t('creator.nav.docs')}
              </NavLink>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitch testId="web-language-switch" />
            <ThemeSwitch testId="web-theme-switch" />
            <Link to="/create" className="hidden sm:inline-flex">
              <Button size="sm" testId="header-create-btn">
                {t('creator.nav.cta')}
              </Button>
            </Link>
          </div>
        </div>
        <nav className="flex items-center gap-1 border-t border-border px-4 py-2 md:hidden" aria-label="Mobile navigation">
          <NavLink to="/" end className={navLinkClass}>
            {t('creator.nav.home')}
          </NavLink>
          <NavLink to="/create" className={navLinkClass}>
            {t('creator.nav.create')}
          </NavLink>
          <NavLink to="/components" className={navLinkClass}>
            {t('creator.nav.docs')}
          </NavLink>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      <footer className="border-t border-border bg-surface py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <p>{t('creator.footer.tagline')}</p>
          <div className="flex items-center gap-4">
            <Link to="/create" className="hover:text-foreground">
              {t('creator.nav.create')}
            </Link>
            <Link to="/components" className="hover:text-foreground">
              {t('creator.nav.docs')}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default WebLayout;
