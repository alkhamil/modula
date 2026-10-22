import { type ReactNode } from 'react';
import { NavLink } from 'react-router';
import { AltArrowRight } from '../icons';

export interface BreadcrumbsItem {
  label: string;
  /** Rute tujuan; item tanpa `to` (atau yang terakhir) tampil sebagai halaman saat ini. */
  to?: string;
  icon?: ReactNode;
  disabled?: boolean;
}

interface BreadcrumbsProps {
  /** Ukuran WDS (token Size): xs | sm | md | lg | xl. */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  items: BreadcrumbsItem[];
  className?: string;
  testId?: string;
}

/** Breadcrumbs WDS: tautan berpisah chevron; item terakhir = halaman saat ini. */
function Breadcrumbs({ items, size = 'md', className = '', testId }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" data-testid={testId} data-wds-size={size} className={`wds-breadcrumbs ${className}`}>
      <ol className="wds-breadcrumbs__list">
        {items.map((item, i) => {
          const current = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="wds-breadcrumbs__item">
              {i > 0 && (
                <span className="wds-breadcrumbs__sep" aria-hidden="true">
                  <AltArrowRight />
                </span>
              )}
              {item.to && !current && !item.disabled ? (
                <NavLink to={item.to} className="wds-breadcrumbs__link">
                  {item.icon}
                  {item.label}
                </NavLink>
              ) : (
                <span
                  className="wds-breadcrumbs__link"
                  data-current={current || undefined}
                  data-disabled={item.disabled || undefined}
                  aria-current={current ? 'page' : undefined}
                >
                  {item.icon}
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
