import { type ReactNode } from 'react';
import { NavLink } from 'react-router';
import { AltArrowRight, HamburgerMenu } from '../icons';

export interface BreadcrumbItem {
  label: string;
  /** General-namespace key for the label; falls back to `label`. */
  labelKey?: string;
  path?: string;
}

interface PageHeaderProps {
  title: string;
  breadcrumb?: BreadcrumbItem[];
  actions?: ReactNode;
  onMenuToggle?: () => void;
  /** Konten sisi kanan (mis. `<Profile />`). */
  children?: ReactNode;
  testId?: string;
}

/** Header halaman WDS (Header styles): judul + breadcrumb, aksi, dan slot kanan. */
function PageHeader({
  title,
  breadcrumb,
  actions,
  onMenuToggle,
  children,
  testId,
}: PageHeaderProps) {
  return (
    <header data-testid={testId} className="wds-header">
      {onMenuToggle && (
        <button
          type="button"
          onClick={onMenuToggle}
          className="wds-header__menu md:hidden"
          aria-label="Toggle menu"
        >
          <HamburgerMenu />
        </button>
      )}

      <div className="wds-header__text">
        <h1 className="wds-header__title">{title}</h1>
        {breadcrumb && breadcrumb.length > 0 && (
          <nav aria-label="Breadcrumb" className="wds-header__crumbs">
            {breadcrumb.map((item, i) => (
              <span key={item.label} className="wds-header__crumb">
                {i > 0 && (
                  <span className="wds-header__sep" aria-hidden="true">
                    <AltArrowRight />
                  </span>
                )}
                {item.path ? (
                  <NavLink to={item.path} className="wds-header__link">
                    {item.label}
                  </NavLink>
                ) : (
                  <span>{item.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
      </div>

      {actions && <div className="wds-header__actions">{actions}</div>}
      {children && <div className="wds-header__slot">{children}</div>}
    </header>
  );
}

export default PageHeader;
