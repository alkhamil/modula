import type { ReactNode } from 'react';

interface MenuItemProps {
  label: ReactNode;
  /** Teks pendukung di bawah label. */
  description?: ReactNode;
  /** Ikon / avatar di awal. */
  leading?: ReactNode;
  /** Badge / chevron / toggle di akhir. */
  trailing?: ReactNode;
  /** Ukuran WDS (token Size): xs | sm | md | lg | xl. */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  selected?: boolean;
  disabled?: boolean;
  destructive?: boolean;
  onClick?: () => void;
  className?: string;
  testId?: string;
}

/** Menu Item WDS: baris menu dengan state default / selected / disabled / destructive. */
function MenuItem({
  label,
  description,
  leading,
  trailing,
  size = 'md',
  selected = false,
  disabled = false,
  destructive = false,
  onClick,
  className = '',
  testId,
}: MenuItemProps) {
  return (
    <div data-wds-size={size} className="contents">
      <button
        type="button"
        data-testid={testId}
        disabled={disabled}
        data-state={disabled ? 'disabled' : destructive ? 'destructive' : selected ? 'selected' : 'default'}
        onClick={onClick}
        className={`wds-menu__item ${className}`}
      >
        {leading && <span className="wds-menu__icon">{leading}</span>}
        <span className="wds-menu__text">
          <span>{label}</span>
          {description && <span className="wds-menu__support">{description}</span>}
        </span>
        {trailing && <span className="wds-menu__icon">{trailing}</span>}
      </button>
    </div>
  );
}

export default MenuItem;
