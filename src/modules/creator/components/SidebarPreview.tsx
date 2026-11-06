import { useTranslation } from 'react-i18next';

interface SidebarPreviewProps {
  projectName: string;
  /** URL pratinjau logo penuh (object URL), kosong = nama project. */
  logoUrl: string | null;
  /** URL pratinjau ikon ringkas, kosong = huruf pertama nama project. */
  collapsedLogoUrl: string | null;
  /** Warna primary terpilih (hex) atau '' untuk brand WDS bawaan. */
  primaryColor: string;
}

/** Pratinjau kepala sidebar saat terbuka dan collapsed, memakai kelas sidebar WDS yang sama dengan app hasil. */
function SidebarPreview({ projectName, logoUrl, collapsedLogoUrl, primaryColor }: SidebarPreviewProps) {
  const { t } = useTranslation();
  const name = projectName.trim() || 'App';
  // Latar sidebar = brand-pressed; dengan warna kustom diturunkan sama seperti applyBrandOverride.
  const style = primaryColor
    ? ({
        '--wds-bg-brand': primaryColor,
        '--wds-bg-brand-pressed': `color-mix(in srgb, ${primaryColor} 80%, black)`,
      } as React.CSSProperties)
    : undefined;

  const panel = (label: string, collapsed: boolean) => (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-muted-foreground">{label}</span>
      <div
        data-testid={collapsed ? 'sidebar-preview-collapsed' : 'sidebar-preview-expanded'}
        style={{ ...style, backgroundColor: 'var(--wds-bg-brand-pressed)', color: 'var(--wds-text-on-brand)' }}
        className={['rounded-xl p-3', collapsed ? 'w-16' : 'w-56'].join(' ')}
      >
        <div className="wds-sidenav__header">
          {collapsed ? (
            collapsedLogoUrl ? (
              <img src={collapsedLogoUrl} alt="" className="wds-sidenav__brand-img wds-sidenav__brand-img--mini" />
            ) : (
              <span className="wds-sidenav__logo wds-sidenav__logo--mini">{name.charAt(0)}</span>
            )
          ) : logoUrl ? (
            <img src={logoUrl} alt="" className="wds-sidenav__brand-img" />
          ) : (
            <span className="wds-sidenav__logo">{name}</span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-2" role="group" aria-label={t('creator.installer.identity.previewTitle')}>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {t('creator.installer.identity.previewTitle')}
      </h3>
      <div className="flex flex-wrap items-start gap-6">
        {panel(t('creator.installer.identity.previewExpanded'), false)}
        {panel(t('creator.installer.identity.previewCollapsed'), true)}
      </div>
    </div>
  );
}

export default SidebarPreview;
