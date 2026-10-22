import type { ReactNode } from 'react';

export interface SegmentedOption {
  value: string;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

interface SegmentedControlProps {
  options: SegmentedOption[];
  value: string;
  onChange: (value: string) => void;
  /** Ukuran WDS (token Size): xs | sm | md | lg | xl. */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  className?: string;
  testId?: string;
  'aria-label'?: string;
}

/** Segmented Control WDS: pilihan tunggal dalam track terisi (radiogroup). */
function SegmentedControl({
  options,
  value,
  onChange,
  size = 'md',
  fullWidth = false,
  className = '',
  testId,
  'aria-label': ariaLabel,
}: SegmentedControlProps) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      data-testid={testId}
      data-wds-size={size}
      data-full={fullWidth || undefined}
      className={`wds-segmented ${className}`}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="radio"
          aria-checked={opt.value === value}
          disabled={opt.disabled}
          data-current={opt.value === value || undefined}
          onClick={() => onChange(opt.value)}
          className="wds-segmented__item"
        >
          {opt.icon}
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default SegmentedControl;
