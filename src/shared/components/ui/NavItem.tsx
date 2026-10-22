import type { ReactNode } from 'react';

interface NavItemProps {
  label: ReactNode;
  icon?: ReactNode;
  /** Badge / angka di kanan. */
  badge?: ReactNode;
  /** Chevron untuk item grup. */
  trailing?: ReactNode;
  current?: boolean;
  /** Style WDS (Nav item styles): light | dark. */
  appearance?: 'light' | 'dark';
  href?: string;
  onClick?: () => void;
  className?: string;
  testId?: string;
}

/** Nav Item WDS: baris navigasi mandiri (light / dark) dengan state default / hover / focus / current. */
function NavItem({
  label,
  icon,
  badge,
  trailing,
  current = false,
  appearance = 'light',
  href,
  onClick,
  className = '',
  testId,
}: NavItemProps) {
  const body = (
    <>
      {icon && <span className="wds-navitem__icon">{icon}</span>}
      <span className="wds-navitem__label">{label}</span>
      {badge !== undefined && <span className="wds-navitem__badge">{badge}</span>}
      {trailing && <span className="wds-navitem__chevron">{trailing}</span>}
    </>
  );
  const common = {
    'data-testid': testId,
    'data-appearance': appearance,
    'data-current': current || undefined,
    'aria-current': current ? ('page' as const) : undefined,
    className: `wds-navitem ${className}`,
  };
  return href ? (
    <a href={href} {...common} onClick={onClick}>
      {body}
    </a>
  ) : (
    <button type="button" {...common} onClick={onClick}>
      {body}
    </button>
  );
}

export default NavItem;
