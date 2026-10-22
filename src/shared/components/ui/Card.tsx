import { type ReactNode, useState } from 'react';
import { AltArrowDown } from '../icons';

interface CardProps {
  children: ReactNode;
  title?: string;
  actions?: ReactNode;
  /** Baris aksi bawah dengan divider (mis. tombol form). */
  footer?: ReactNode;
  className?: string;
  testId?: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
  /** Ikon toggle custom saat `collapsible` (default chevron yang ikut berputar). */
  toggleIcon?: ReactNode;
  /** Varian ringkas untuk panel sempit (mis. drawer properti): judul + padding kecil. */
  size?: 'sm' | 'md';
  /** Teks pendukung di bawah judul (Figma "Description"); mengaktifkan layout WDS tanpa garis header. */
  description?: ReactNode;
  /** Media di atas card (Figma "Media"); mengaktifkan layout WDS. */
  media?: ReactNode;
  /** Tombol aksi di bawah isi, lebar sama rata (Figma "Actions"); mengaktifkan layout WDS. */
  bodyActions?: ReactNode;
  /** Style WDS (Card styles): outlined | filled. */
  appearance?: 'outlined' | 'filled';
}

function Card({
  children,
  title,
  actions,
  footer,
  description,
  media,
  bodyActions,
  className = '',
  testId,
  collapsible = false,
  defaultOpen = true,
  toggleIcon,
  size = 'md',
  appearance = 'outlined',
}: CardProps) {
  const [open, setOpen] = useState(defaultOpen);

  // Divider header hanya tampil saat body terbuka — saat collapsed disembunyikan
  // agar tidak ada garis yatim di bawah header.
  const showDivider = !collapsible || open;
  const headerProps = {
    className: 'wds-card__header',
    'data-divider': showDivider || undefined,
    ...(collapsible ? { onClick: () => setOpen((prev) => !prev) } : {}),
  };

  // Layout WDS (Card): media di atas, judul + deskripsi + isi + aksi sama lebar, tanpa garis header.
  if (media || description || bodyActions) {
    return (
      <div
        data-testid={testId}
        data-appearance={appearance}
        data-size={size}
        data-media={media ? true : undefined}
        className={`wds-card ${className}`}
      >
        {media && <div className="wds-card__media">{media}</div>}
        <div className="wds-card__content">
          {(title || description) && (
            <div className="wds-card__heading">
              {title && <h3 className="wds-card__title">{title}</h3>}
              {description && <p className="wds-card__description">{description}</p>}
            </div>
          )}
          {children}
          {bodyActions && <div className="wds-card__body-actions">{bodyActions}</div>}
        </div>
      </div>
    );
  }

  return (
    <div
      data-testid={testId}
      data-appearance={appearance}
      data-size={size}
      className={`wds-card ${className}`}
    >
      {(title || actions) &&
        (collapsible ? (
          <button type="button" {...headerProps} data-collapsible>
            <div className="flex w-full flex-row items-center justify-between gap-2" aria-expanded={open}>
              <h3 className="wds-card__title">{title}</h3>
              <div>
                {toggleIcon ?? (
                  <AltArrowDown
                    className={`h-4 w-4 text-(--wds-icons-secondary) transition-transform ${open ? 'rotate-270' : 'rotate-90'}`}
                  />
                )}
              </div>
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </button>
        ) : (
          <div {...headerProps}>
            {title && <h3 className="wds-card__title">{title}</h3>}
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>
        ))}
      {open && <div className="wds-card__body">{children}</div>}
      {open && footer && <div className="wds-card__footer">{footer}</div>}
    </div>
  );
}

export default Card;
