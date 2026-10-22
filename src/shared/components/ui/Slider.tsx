import type { InputHTMLAttributes } from 'react';

interface SliderProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type' | 'className' | 'size'> {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  testId?: string;
}

/** Slider WDS (input range native dengan track/thumb bergaya WDS). */
function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled,
  className = '',
  testId,
  ...rest
}: SliderProps) {
  const pct = max === min ? 0 : ((value - min) / (max - min)) * 100;
  return (
    <input
      {...rest}
      type="range"
      data-testid={testId}
      min={min}
      max={max}
      step={step}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(Number(e.target.value))}
      style={{ ['--sl-pct' as string]: `${pct}%` }}
      className={`wds-slider ${className}`}
    />
  );
}

export default Slider;
