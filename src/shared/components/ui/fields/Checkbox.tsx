import SelectionControl, { type SelectionAppearance, type SelectionSize } from './SelectionControl';

interface CheckboxProps {
  value: boolean;
  onChange: (value: boolean) => void;
  size?: SelectionSize;
  disabled?: boolean;
  /** Pesan error (state error + teks di slot hint). */
  error?: string;
  className?: string;
  checkboxLabel?: string;
  /** Teks pendukung di bawah label. */
  hint?: string;
  /** Style WDS: outline (default) atau solid (terisi). */
  appearance?: SelectionAppearance;
  indeterminate?: boolean;
  testId?: string;
  /** Hanya dokumentasi: paksa state fokus. */
  'data-wds-state'?: string;
}

/** Checkbox WDS (Figma "Checkbox": Style outline/solid; state dari token Checkbox states). */
function Checkbox({
  value,
  onChange,
  size = 'md',
  disabled,
  className,
  error,
  checkboxLabel,
  hint,
  appearance = 'outline',
  indeterminate,
  testId,
  'data-wds-state': forcedState,
}: CheckboxProps) {
  return (
    <SelectionControl
      kind="checkbox"
      checked={value}
      indeterminate={indeterminate}
      onChange={onChange}
      disabled={disabled}
      error={error}
      appearance={appearance}
      size={size}
      label={checkboxLabel}
      hint={hint}
      className={className}
      testId={testId}
      data-wds-state={forcedState}
    />
  );
}

export default Checkbox;
