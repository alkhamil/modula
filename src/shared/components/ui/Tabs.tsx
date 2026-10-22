import { useRef, type KeyboardEvent, type ReactNode } from 'react';

export interface TabItem {
  value: string;
  label: ReactNode;
  icon?: ReactNode;
  /** Angka / teks kecil di samping label (Figma "badge"). */
  badge?: ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  items: TabItem[];
  value: string;
  onChange: (value: string) => void;
  /** Style WDS (Navigation styles): default | box | underline | segmented. */
  appearance?: 'default' | 'box' | 'underline' | 'segmented';
  /** Tab membagi lebar container sama rata. */
  fullWidth?: boolean;
  className?: string;
  testId?: string;
  'aria-label'?: string;
}

/** Tabs WDS: tablist dengan navigasi panah / Home / End. Konten panel dikelola pemanggil. */
function Tabs({
  items,
  value,
  onChange,
  appearance = 'default',
  fullWidth = false,
  className = '',
  testId,
  'aria-label': ariaLabel,
}: TabsProps) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function focusAt(index: number) {
    const enabled = items.map((item, i) => (item.disabled ? -1 : i)).filter((i) => i >= 0);
    if (enabled.length === 0) return;
    const pos = enabled.indexOf(index);
    const target = pos >= 0 ? index : enabled[0]!;
    refs.current[target]?.focus();
    const item = items[target];
    if (item) onChange(item.value);
  }

  function handleKey(e: KeyboardEvent, index: number) {
    const last = items.length - 1;
    let next = -1;
    if (e.key === 'ArrowRight') next = index === last ? 0 : index + 1;
    else if (e.key === 'ArrowLeft') next = index === 0 ? last : index - 1;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = last;
    if (next < 0) return;
    e.preventDefault();
    // Lewati tab disabled searah panah.
    const step = e.key === 'ArrowLeft' ? -1 : 1;
    let guard = 0;
    while (items[next]?.disabled && guard++ < items.length) {
      next = (next + step + items.length) % items.length;
    }
    focusAt(next);
  }

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      data-testid={testId}
      data-appearance={appearance}
      data-full={fullWidth || undefined}
      className={`wds-tabs ${className}`}
    >
      {items.map((item, i) => {
        const selected = item.value === value;
        return (
          <button
            key={item.value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            disabled={item.disabled}
            data-current={selected || undefined}
            onClick={() => onChange(item.value)}
            onKeyDown={(e) => handleKey(e, i)}
            className="wds-tab"
          >
            {item.icon && <span className="wds-tab__icon">{item.icon}</span>}
            <span>{item.label}</span>
            {item.badge !== undefined && <span className="wds-tab__badge">{item.badge}</span>}
          </button>
        );
      })}
    </div>
  );
}

export default Tabs;
