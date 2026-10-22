import { useCallback, useState, type ReactNode } from 'react';
import { useClickOutside } from '../../hooks';

export interface MenuEntry {
  value: string;
  label: ReactNode;
  /** Teks pendukung di bawah label (Menu item "supporting text"). */
  description?: ReactNode;
  icon?: ReactNode;
  /** Elemen di akhir baris (badge, chevron). */
  trailing?: ReactNode;
  disabled?: boolean;
  /** Item destruktif (merah). */
  destructive?: boolean;
  /** Tandai sebagai terpilih. */
  selected?: boolean;
  onSelect?: () => void;
}

interface DropdownMenuProps {
  /** Pemicu; menerima `open` untuk gaya aktif. */
  trigger: (props: { open: boolean }) => ReactNode;
  items: MenuEntry[];
  /** Ukuran WDS (token Size): xs | sm | md | lg | xl. */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Posisi horizontal menu terhadap pemicu. */
  align?: 'start' | 'end';
  /** Paksa terbuka (mis. dokumentasi). */
  open?: boolean;
  className?: string;
  testId?: string;
}

/** Dropdown Menu WDS: panel menu dengan Menu item (state default / selected / disabled / destructive). */
function DropdownMenu({ trigger, items, align = 'start', size = 'md', open: forced, className = '', testId }: DropdownMenuProps) {
  const [openState, setOpenState] = useState(false);
  const open = forced ?? openState;
  const close = useCallback(() => setOpenState(false), []);
  const ref = useClickOutside<HTMLDivElement>(close);

  return (
    <div ref={ref} data-testid={testId} className={`wds-dropdown ${className}`}>
      <span
        onClick={() => setOpenState((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') close();
        }}
      >
        {trigger({ open })}
      </span>
      {open && (
        <div
          role="menu"
          data-align={align}
          data-wds-size={size}
          className="wds-menu wds-dropdown__panel"
          onKeyDown={(e) => {
            if (e.key === 'Escape') close();
          }}
        >
          {items.map((item) => (
            <button
              key={item.value}
              type="button"
              role="menuitem"
              disabled={item.disabled}
              data-state={
                item.disabled ? 'disabled' : item.destructive ? 'destructive' : item.selected ? 'selected' : 'default'
              }
              onClick={() => {
                item.onSelect?.();
                close();
              }}
              className="wds-menu__item"
            >
              {item.icon && <span className="wds-menu__icon">{item.icon}</span>}
              <span className="wds-menu__text">
                <span>{item.label}</span>
                {item.description && <span className="wds-menu__support">{item.description}</span>}
              </span>
              {item.trailing && <span className="wds-menu__icon">{item.trailing}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default DropdownMenu;
