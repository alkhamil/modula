import type { ReactNode } from 'react';

interface ListItemProps {
  title: ReactNode;
  description?: ReactNode;
  /** Ikon / avatar di awal. */
  leading?: ReactNode;
  /** Aksesori di akhir (badge, chevron, tombol). */
  trailing?: ReactNode;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  testId?: string;
}

/** List Item WDS: baris daftar dengan state default / pressed / selected / disabled. */
function ListItem({
  title,
  description,
  leading,
  trailing,
  selected = false,
  disabled = false,
  onClick,
  className = '',
  testId,
}: ListItemProps) {
  const body = (
    <>
      {leading && <span className="wds-list-item__leading">{leading}</span>}
      <span className="wds-list-item__content">
        <span className="wds-list-item__title">{title}</span>
        {description && <span className="wds-list-item__desc">{description}</span>}
      </span>
      {trailing && <span className="wds-list-item__trailing">{trailing}</span>}
    </>
  );
  const common = {
    'data-testid': testId,
    'data-selected': selected || undefined,
    className: `wds-list-item ${className}`,
  };
  return onClick ? (
    <button type="button" {...common} disabled={disabled} aria-pressed={selected} onClick={onClick}>
      {body}
    </button>
  ) : (
    <div {...common} aria-disabled={disabled || undefined}>
      {body}
    </div>
  );
}

export default ListItem;
