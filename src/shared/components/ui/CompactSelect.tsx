import type { ReactNode } from 'react';
import { AltArrowDown } from '../icons';
import DropdownMenu from './DropdownMenu';

interface CompactSelectProps {
  options: { value: string; label: string; icon?: ReactNode }[];
  value: string;
  onChange: (value: string) => void;
  /** Tipe WDS (Compact select types): text | icon (hanya ikon pemicu). */
  type?: 'text' | 'icon';
  /** Ikon pemicu untuk tipe `icon`. */
  icon?: ReactNode;
  disabled?: boolean;
  className?: string;
  testId?: string;
  'aria-label'?: string;
}

/** Compact Select WDS: pemilih ringkas berupa teks atau ikon dengan menu dropdown. */
function CompactSelect({
  options,
  value,
  onChange,
  type = 'text',
  icon,
  disabled = false,
  className = '',
  testId,
  'aria-label': ariaLabel,
}: CompactSelectProps) {
  const current = options.find((o) => o.value === value);
  return (
    <DropdownMenu
      testId={testId}
      className={className}
      trigger={({ open }) => (
        <button
          type="button"
          disabled={disabled}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label={ariaLabel}
          data-type={type}
          className="wds-compact-select"
        >
          {type === 'icon' ? icon : <span>{current?.label ?? ''}</span>}
          {type === 'text' && <AltArrowDown />}
        </button>
      )}
      items={options.map((o) => ({
        value: o.value,
        label: o.label,
        icon: o.icon,
        selected: o.value === value,
        onSelect: () => onChange(o.value),
      }))}
    />
  );
}

export default CompactSelect;
