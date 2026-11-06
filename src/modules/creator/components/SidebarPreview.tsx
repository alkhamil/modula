import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, CloseCircle, Upload } from '../../../shared/components/icons';
import { BRAND_ACCEPT } from '../brand';

interface SidebarPreviewProps {
  projectName: string;
  /** URL pratinjau logo penuh (object URL), kosong = nama project. */
  logoUrl: string | null;
  /** URL pratinjau ikon ringkas, kosong = huruf pertama nama project. */
  collapsedLogoUrl: string | null;
  /** Warna primary terpilih (hex) atau '' untuk brand WDS bawaan. */
  primaryColor: string;
  onUploadLogo: (files: FileList | File[] | null) => void;
  onRemoveLogo: () => void;
  onUploadCollapsedLogo: (files: FileList | File[] | null) => void;
  onRemoveCollapsedLogo: () => void;
  logoError?: string | null;
  collapsedError?: string | null;
}

/**
 * Pratinjau interaktif kepala sidebar: pengguna langsung mengklik kartu
 * Expanded atau Collapsed untuk mengunggah atau mengganti logo.
 */
function SidebarPreview({
  projectName,
  logoUrl,
  collapsedLogoUrl,
  primaryColor,
  onUploadLogo,
  onRemoveLogo,
  onUploadCollapsedLogo,
  onRemoveCollapsedLogo,
  logoError,
  collapsedError,
}: SidebarPreviewProps) {
  const { t } = useTranslation();
  const name = projectName.trim() || 'App';

  const expandedInputRef = useRef<HTMLInputElement>(null);
  const collapsedInputRef = useRef<HTMLInputElement>(null);

  const style = primaryColor
    ? ({
        '--wds-bg-brand': primaryColor,
        '--wds-bg-brand-pressed': `color-mix(in srgb, ${primaryColor} 80%, black)`,
      } as React.CSSProperties)
    : undefined;

  return (
    <div className="flex flex-col gap-3" role="group" aria-label={t('creator.installer.identity.previewTitle')}>
      {/* Hidden file inputs */}
      <input
        ref={expandedInputRef}
        type="file"
        accept={BRAND_ACCEPT}
        className="hidden"
        onChange={(e) => {
          onUploadLogo(e.target.files);
          e.target.value = '';
        }}
      />
      <input
        ref={collapsedInputRef}
        type="file"
        accept={BRAND_ACCEPT}
        className="hidden"
        onChange={(e) => {
          onUploadCollapsedLogo(e.target.files);
          e.target.value = '';
        }}
      />

      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t('creator.installer.identity.brandTitle')}
        </h3>
        <span className="text-xs text-muted-foreground">
          {t('creator.installer.identity.uploadHint', {
            defaultValue: 'Klik pratinjau di bawah untuk unggah logo (SVG, PNG, JPG, WebP · maks 512 KB)',
          })}
        </span>
      </div>

      <div className="flex flex-wrap items-start gap-6">
        {/* Expanded Panel (Klik untuk upload logo utama) */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              {t('creator.installer.identity.previewExpanded')}
            </span>
            {logoUrl && (
              <button
                type="button"
                onClick={onRemoveLogo}
                className="inline-flex cursor-pointer items-center gap-1 text-[11px] font-medium text-danger hover:underline"
                title={t('creator.installer.identity.removeLogo', { defaultValue: 'Hapus logo' })}
              >
                <CloseCircle className="h-3 w-3" />
                {t('creator.installer.identity.removeLogo', { defaultValue: 'Hapus' })}
              </button>
            )}
          </div>

          <div
            data-testid="sidebar-preview-expanded"
            tabIndex={0}
            role="button"
            aria-label="Upload logo sidebar"
            onClick={() => expandedInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                expandedInputRef.current?.click();
              }
            }}
            style={{ ...style, backgroundColor: 'var(--wds-bg-brand-pressed)', color: 'var(--wds-text-on-brand)' }}
            className={[
              'group relative flex h-16 w-60 cursor-pointer items-center justify-between rounded-xl px-4 transition-all hover:ring-2 hover:ring-primary focus-visible:outline-2 focus-visible:outline-primary',
              !logoUrl ? 'border border-dashed border-white/40' : 'border border-transparent',
            ].join(' ')}
          >
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="max-h-10 max-w-[190px] object-contain" />
            ) : (
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-bold tracking-tight text-white">{name}</span>
              </div>
            )}

            {!logoUrl && (
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-white/80 transition-colors group-hover:bg-white/20 group-hover:text-white">
                <Upload className="h-4 w-4" />
              </span>
            )}

            {/* Hover overlay hint */}
            <div className="absolute inset-0 flex items-center justify-center gap-1.5 rounded-xl bg-black/60 opacity-0 backdrop-blur-[1px] transition-opacity group-hover:opacity-100">
              <Camera className="h-4 w-4 text-white" />
              <span className="text-xs font-semibold text-white">
                {logoUrl
                  ? t('creator.installer.identity.changeLogo', { defaultValue: 'Ganti Logo' })
                  : t('creator.installer.identity.clickToUpload', { defaultValue: 'Upload Logo' })}
              </span>
            </div>
          </div>
          {logoError && <span className="text-xs text-danger">{logoError}</span>}
        </div>

        {/* Collapsed Panel (Klik untuk upload icon mini) */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              {t('creator.installer.identity.previewCollapsed')}
            </span>
            {collapsedLogoUrl && (
              <button
                type="button"
                onClick={onRemoveCollapsedLogo}
                className="inline-flex cursor-pointer items-center gap-1 text-[11px] font-medium text-danger hover:underline"
                title={t('creator.installer.identity.removeLogo', { defaultValue: 'Hapus icon' })}
              >
                <CloseCircle className="h-3 w-3" />
                {t('creator.installer.identity.removeLogo', { defaultValue: 'Hapus' })}
              </button>
            )}
          </div>

          <div
            data-testid="sidebar-preview-collapsed"
            tabIndex={0}
            role="button"
            aria-label="Upload icon collapsed"
            onClick={() => collapsedInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                collapsedInputRef.current?.click();
              }
            }}
            style={{ ...style, backgroundColor: 'var(--wds-bg-brand-pressed)', color: 'var(--wds-text-on-brand)' }}
            className={[
              'group relative flex h-16 w-16 cursor-pointer items-center justify-center rounded-xl transition-all hover:ring-2 hover:ring-primary focus-visible:outline-2 focus-visible:outline-primary',
              !collapsedLogoUrl ? 'border border-dashed border-white/40' : 'border border-transparent',
            ].join(' ')}
          >
            {collapsedLogoUrl ? (
              <img src={collapsedLogoUrl} alt="Collapsed Logo" className="max-h-8 max-w-8 object-contain" />
            ) : (
              <span className="text-lg font-bold text-white">{name.charAt(0).toUpperCase()}</span>
            )}

            {/* Hover overlay hint */}
            <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/60 opacity-0 backdrop-blur-[1px] transition-opacity group-hover:opacity-100">
              <Camera className="h-4 w-4 text-white" />
            </div>
          </div>
          {collapsedError && <span className="text-xs text-danger">{collapsedError}</span>}
        </div>
      </div>
    </div>
  );
}

export default SidebarPreview;