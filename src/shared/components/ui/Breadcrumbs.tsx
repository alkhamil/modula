import { type ReactNode } from 'react';
import { NavLink } from 'react-router';
import { AltArrowRight, MenuDotsVertical } from '../icons';

export interface BreadcrumbsItem {
  label: string;
  /** Rute tujuan; item tanpa `to` (atau yang terakhir) tampil sebagai halaman saat ini. */
  to?: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export type BreadcrumbsShowIcons = 'off' | 'leading' | 'trailing' | 'only' | 'both';

interface BreadcrumbsProps {
  /** Ukuran WDS (token Size): xs | sm | md | lg | xl. */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  items: BreadcrumbsItem[];
  /** Figma "Truncated": item tengah diringkas jadi satu "…" — tersisa item pertama dan terakhir. */
  truncated?: boolean;
  /** Figma mode "Show icons": penempatan `icon` tiap item — off | leading | trailing | only | both. */
  showIcons?: BreadcrumbsShowIcons;
  className?: string;
  testId?: string;
}

/** Breadcrumbs WDS: tautan berpisah chevron; item terakhir = halaman saat ini. */
function Breadcrumbs({ items: allItems, truncated = false, showIcons = 'leading', size = 'md', className = '', testId }: BreadcrumbsProps) {
  const collapsed = truncated && allItems.length > 2;
  const items: (BreadcrumbsItem | 'ellipsis')[] = collapsed ? [allItems[0]!, 'ellipsis', allItems[allItems.length - 1]!] : allItems;
  const leading = showIcons === 'leading' || showIcons === 'both' || showIcons === 'only';
  const trailing = showIcons === 'trailing' || showIcons === 'both';
  const labelHidden = showIcons === 'only';
  return (
    <nav aria-label="Breadcrumb" data-testid={testId} data-wds-size={size} className={`wds-breadcrumbs ${className}`}>
      <ol className="wds-breadcrumbs__list">
        {items.map((item, i) => {
          const current = i === items.length - 1;
          const sep = i > 0 && (
            <span className="wds-breadcrumbs__sep" aria-hidden="true">
              <AltArrowRight />
            </span>
          );
          if (item === 'ellipsis') {
            return (
              <li key="ellipsis" className="wds-breadcrumbs__item">
                {sep}
                <span
                  className="wds-breadcrumbs__link wds-breadcrumbs__ellipsis"
                  role="img"
                  aria-label={allItems.slice(1, -1).map((x) => x.label).join(' / ')}
                >
                  <MenuDotsVertical />
                </span>
              </li>
            );
          }
          const content = (
            <>
              {leading && item.icon}
              {!labelHidden && item.label}
              {trailing && item.icon}
            </>
          );
          return (
            <li key={`${item.label}-${i}`} className="wds-breadcrumbs__item">
              {sep}
              {item.to && !current && !item.disabled ? (
                <NavLink to={item.to} aria-label={labelHidden ? item.label : undefined} className="wds-breadcrumbs__link">
                  {content}
                </NavLink>
              ) : (
                <span
                  className="wds-breadcrumbs__link"
                  data-current={current || undefined}
                  data-disabled={item.disabled || undefined}
                  aria-current={current ? 'page' : undefined}
                  aria-label={labelHidden ? item.label : undefined}
                >
                  {content}
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
