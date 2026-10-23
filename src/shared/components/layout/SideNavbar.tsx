import { useState, useRef, useCallback, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation } from 'react-router';
import { type NavItemType, type SubItem } from '../../types/navigation';
import { filterNavItems, resolveNavLabel } from '../../utils';
import { AltArrowDown, DoubleAltArrowLeft, DoubleAltArrowRight } from '../icons';

interface SideNavbarProps {
  items: NavItemType[];
  /** Daftar permission user; item ber-`permissionKey` disaring. Default: tampil semua. */
  permissions?: string[];
  collapsed: boolean;
  mobileOpen: boolean;
  onToggle: () => void;
  onMobileClose: () => void;
  /** Logo custom di kepala sidebar. Default: inisial `appName`. */
  logo?: ReactNode;
  appName?: string;
  testId?: string;
}

function SideNavbar({
  items,
  permissions = [],
  collapsed,
  mobileOpen,
  onToggle,
  onMobileClose,
  logo,
  appName = 'App',
  testId,
}: SideNavbarProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const navItems = filterNavItems(items, permissions);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [hoverTop, setHoverTop] = useState(0);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = useCallback((label: string, el: HTMLElement) => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    const rect = el.getBoundingClientRect();
    setHoverTop(rect.top);
    setHoveredItem(label);
  }, []);

  const handleMouseLeave = useCallback(() => {
    hideTimer.current = setTimeout(() => {
      setHoveredItem(null);
    }, 200);
  }, []);

  const cancelHide = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
  }, []);

  function toggleExpand(label: string) {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  }

  function isChildActive(children?: SubItem[]) {
    if (!children) return false;
    return children.some(
      (child) => location.pathname === child.path || location.pathname.startsWith(child.path + '/'),
    );
  }

  const hoveredNavItem = hoveredItem ? navItems.find((n) => n.label === hoveredItem) : null;

  return (
    <>
      {mobileOpen && (
        <div className="wds-overlay__backdrop z-30 md:hidden" onClick={onMobileClose} />
      )}

      <aside
        data-testid={testId ?? 'app-sidebar'}
        data-collapsed={collapsed || undefined}
        className={[
          'wds-sidenav fixed inset-y-0 left-0 z-40 transition-all duration-300',
          collapsed ? 'md:w-16' : 'md:w-64',
          'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
          'md:translate-x-0',
        ].join(' ')}
      >
        <div className="wds-sidenav__header">
          {!collapsed &&
            (logo ?? (
              <span className="wds-sidenav__logo">{appName}</span>
            ))}

          <button
            data-testid="sidebar-toggle"
            onClick={onToggle}
            type="button"
            aria-label={t('common.toggleSidebar', { defaultValue: 'Toggle sidebar' })}
            className="wds-sidenav__toggle max-md:hidden"
          >
            {collapsed ? (
              <DoubleAltArrowRight className="h-3.5 w-3.5" />
            ) : (
              <DoubleAltArrowLeft className="h-3.5 w-3.5" />
            )}
          </button>
        </div>

        <nav className="wds-sidenav__nav">
          {navItems.map((item, index) => {
            const section = item.section && item.section !== navItems[index - 1]?.section ? item.section : null;
            const hasSubItems = !!(item.children && item.children.length > 0);
            const isExpanded = expandedItems.has(item.label) || isChildActive(item.children);

            return (
              <div key={item.label} className="contents">
                {section &&
                  (collapsed ? (
                    <span className="wds-sidenav__divider" aria-hidden="true" />
                  ) : (
                    <p className="wds-sidenav__section">
                      {item.sectionKey ? t(item.sectionKey, { defaultValue: section }) : section}
                    </p>
                  ))}
              <div
                className="relative"
                onMouseEnter={(e) => collapsed && handleMouseEnter(item.label, e.currentTarget)}
                onMouseLeave={() => collapsed && handleMouseLeave()}
              >
                {hasSubItems ? (
                  <button
                    type="button"
                    onClick={() => !collapsed && toggleExpand(item.label)}
                    aria-expanded={isExpanded}
                    data-current={isChildActive(item.children) || undefined}
                    className="wds-nav-item"
                  >
                    {item.icon}
                    {!collapsed && (
                      <>
                        <span className="wds-nav-item__label">{resolveNavLabel(item, t)}</span>
                        <AltArrowDown
                          className={`wds-nav-item__chevron transition-transform ${isExpanded ? '-rotate-90' : 'rotate-90'}`}
                        />
                      </>
                    )}
                  </button>
                ) : (
                  <NavLink
                    to={item.path!}
                    end={item.path === '/'}
                    className="wds-nav-item"
                  >
                    {item.icon}
                    {!collapsed && <span className="wds-nav-item__label">{resolveNavLabel(item, t)}</span>}
                  </NavLink>
                )}

                {hasSubItems && isExpanded && !collapsed && (
                  <div className="wds-sidenav__sub">
                    {item.children!.map((child) => (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        className="wds-nav-item wds-nav-item--sub"
                      >
                        {resolveNavLabel(child, t)}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
              </div>
            );
          })}
        </nav>
      </aside>

      {collapsed && hoveredNavItem && (
        <div
          className="fixed z-50 min-w-40 rounded-lg bg-background py-1 shadow-xl border border-border max-md:hidden"
          style={{ left: 72, top: hoverTop }}
          onMouseEnter={cancelHide}
          onMouseLeave={handleMouseLeave}
        >
          {hoveredNavItem.children ? (
            <>
              <div className="border-b border-border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {resolveNavLabel(hoveredNavItem, t)}
              </div>
              {hoveredNavItem.children.map((child) => (
                <NavLink
                  key={child.path}
                  to={child.path}
                  className={({ isActive }) =>
                    [
                      'block px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-muted',
                      isActive ? 'bg-muted font-medium' : '',
                    ].join(' ')
                  }
                >
                  {resolveNavLabel(child, t)}
                </NavLink>
              ))}
            </>
          ) : (
            <NavLink
              to={hoveredNavItem.path!}
              end={hoveredNavItem.path === '/'}
              className={({ isActive }) =>
                [
                  'block px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-muted',
                  isActive ? 'bg-muted font-medium' : '',
                ].join(' ')
              }
            >
              {resolveNavLabel(hoveredNavItem, t)}
            </NavLink>
          )}
        </div>
      )}
    </>
  );
}

export default SideNavbar;
