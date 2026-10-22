import { Minus, Plus } from '../icons';

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Style WDS (QS styles): outlined | filled | ghost. */
  appearance?: 'outlined' | 'filled' | 'ghost';
  /** Ukuran WDS (token Size): xs | sm | md | lg | xl. */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  className?: string;
  testId?: string;
  'aria-label'?: string;
}

/** Quantity Selector WDS: satu kontainer (tinggi token Size) berisi tombol kurang, nilai, dan tambah. */
function QuantitySelector({
  value,
  onChange,
  min = 0,
  max = Number.POSITIVE_INFINITY,
  step = 1,
  appearance = 'outlined',
  size = 'md',
  disabled = false,
  className = '',
  testId,
  'aria-label': ariaLabel,
}: QuantitySelectorProps) {
  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      data-testid={testId}
      data-appearance={appearance}
      data-wds-size={size}
      className={`wds-qs ${className}`}
    >
      <button
        type="button"
        aria-label="Decrease"
        disabled={disabled || value <= min}
        onClick={() => onChange(clamp(value - step))}
        className="wds-qs__btn"
      >
        <Minus />
      </button>
      <span className="wds-qs__value" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase"
        disabled={disabled || value >= max}
        onClick={() => onChange(clamp(value + step))}
        className="wds-qs__btn"
      >
        <Plus />
      </button>
    </div>
  );
}

export default QuantitySelector;
