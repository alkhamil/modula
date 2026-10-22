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
  /** Batas item tampil; sisanya diringkas menjadi "…" (Figma "No. of items"). */
  maxItems?: number;
  className?: string;
  testId?: string;
}

/** Breadcrumbs WDS: tautan berpisah chevron; item terakhir = halaman saat ini. */
function Breadcrumbs({ items: allItems, maxItems, size = 'md', className = '', testId }: BreadcrumbsProps) {
  const collapsed = maxItems !== undefined && maxItems >= 2 && allItems.length > maxItems;
  const tail = collapsed ? allItems.slice(allItems.length - (maxItems - 1)) : [];
  const items: (BreadcrumbsItem | 'ellipsis')[] = collapsed ? [allItems[0]!, 'ellipsis', ...tail] : allItems;
  return (
    <nav aria-label="Breadcrumb" data-testid={testId} data-wds-size={size} className={`wds-breadcrumbs ${className}`}>
      <ol className="wds-breadcrumbs__list">
        {items.map((item, i) => {
          const current = i === items.length - 1;
          if (item === 'ellipsis') {
            return (
              <li key="ellipsis" className="wds-breadcrumbs__item">
                <span className="wds-breadcrumbs__sep" aria-hidden="true">
                  <AltArrowRight />
                </span>
                <span className="wds-breadcrumbs__link" title={allItems.slice(1, allItems.length - tail.length).map((x) => x.label).join(' / ')}>
                  …
                </span>
              </li>
            );
          }
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
