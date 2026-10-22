import type { ReactNode } from 'react';

interface SectionHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  /** Badge / ikon di samping judul. */
  titleAccessory?: ReactNode;
  /** Tombol aksi di kanan. */
  actions?: ReactNode;
  className?: string;
  testId?: string;
}

/** Section Header WDS: judul seksi dengan teks pendukung, aksesori, aksi, dan garis bawah. */
function SectionHeader({ title, description, titleAccessory, actions, className = '', testId }: SectionHeaderProps) {
  return (
    <div data-testid={testId} className={`wds-section-header ${className}`}>
      <div className="wds-section-header__text">
        <div className="wds-section-header__title-row">
          <h2 className="wds-section-header__title">{title}</h2>
          {titleAccessory}
        </div>
        {description && <p className="wds-section-header__desc">{description}</p>}
      </div>
      {actions && <div className="wds-section-header__actions">{actions}</div>}
    </div>
  );
}

export default SectionHeader;
