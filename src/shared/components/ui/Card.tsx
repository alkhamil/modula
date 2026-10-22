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
  /** Style WDS (Card styles): outlined | filled. */
  appearance?: 'outlined' | 'filled';
}

function Card({
  children,
  title,
  actions,
  footer,
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
