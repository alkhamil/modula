import type { InputHTMLAttributes } from 'react';

type SliderSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface SliderBase
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type' | 'className' | 'size'> {
  min?: number;
  max?: number;
  step?: number;
  /** Ukuran WDS (token Size): xs | sm | md | lg | xl. */
  size?: SliderSize;
  className?: string;
  testId?: string;
}

type SliderProps =
  | (SliderBase & { range?: false; value: number; onChange: (value: number) => void })
  | (SliderBase & { range: true; value: [number, number]; onChange: (value: [number, number]) => void });

/** Slider WDS: satu thumb (input range native) atau mode `range` dengan dua thumb. */
function Slider(props: SliderProps) {
  const { min = 0, max = 100, step = 1, size = 'md', disabled, className = '', testId, ...rest } = props;
  const pctOf = (v: number) => (max === min ? 0 : ((v - min) / (max - min)) * 100);

  if (props.range) {
    const { value, onChange } = props;
    const [lo, hi] = value;
    // buang prop khusus mode agar tidak diteruskan ke <input>
    const { range: _range, value: _v, onChange: _o, ...inputRest } = rest as typeof rest & { range?: boolean };
    void _range;
    void _v;
    void _o;
    return (
      <div
        data-testid={testId}
        data-wds-size={size}
        data-disabled={disabled || undefined}
        style={{ ['--sl-lo' as string]: `${pctOf(lo)}%`, ['--sl-hi' as string]: `${pctOf(hi)}%` }}
        className={`wds-slider-range ${className}`}
      >
        <input
          {...inputRest}
          type="range"
          aria-label="Minimum"
          min={min}
          max={max}
          step={step}
          value={lo}
          disabled={disabled}
          onChange={(e) => onChange([Math.min(Number(e.target.value), hi), hi])}
          className="wds-slider"
        />
        <input
          {...inputRest}
          type="range"
          aria-label="Maximum"
          min={min}
          max={max}
          step={step}
          value={hi}
          disabled={disabled}
          onChange={(e) => onChange([lo, Math.max(Number(e.target.value), lo)])}
          className="wds-slider"
        />
      </div>
    );
  }

  const { value, onChange } = props;
  const { range: _r, value: _v, onChange: _o, ...inputRest } = rest as typeof rest & { range?: boolean };
  void _r;
  void _v;
  void _o;
  return (
    <input
      {...inputRest}
      type="range"
      data-testid={testId}
      data-wds-size={size}
      min={min}
      max={max}
      step={step}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(Number(e.target.value))}
      style={{ ['--sl-pct' as string]: `${pctOf(value)}%` }}
      className={`wds-slider ${className}`}
    />
  );
}

export default Slider;
