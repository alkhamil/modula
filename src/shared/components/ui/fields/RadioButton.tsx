import SelectionControl, { type SelectionAppearance, type SelectionSize } from './SelectionControl';

interface RadioButtonProps {
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  size?: SelectionSize;
  disabled?: boolean;
  /** Pesan error (state error + teks di slot hint). */
  error?: string;
  /** State error tanpa pesan (mis. pesan di level grup). */
  invalid?: boolean;
  className?: string;
  /** Label di samping radio; tanpa label = radio saja (icon only). */
  label?: string;
  /** Teks pendukung di bawah label. */
  hint?: string;
  /** Style WDS: outline (default) atau solid. */
  appearance?: SelectionAppearance;
  name?: string;
  testId?: string;
  /** Hanya dokumentasi: paksa state fokus. */
  'data-wds-state'?: string;
}

/** RadioButton WDS (Figma "Radio Button": Style outline/solid; state dari token Radio btn states). */
function RadioButton({
  value,
  checked,
  onChange,
  size = 'md',
  disabled,
  error,
  invalid,
  className,
  label,
  hint,
  appearance = 'outline',
  name,
  testId,
  'data-wds-state': forcedState,
}: RadioButtonProps) {
  return (
    <SelectionControl
      kind="radio"
      checked={checked}
      onChange={() => onChange(value)}
      disabled={disabled}
      error={error}
      invalid={invalid}
      appearance={appearance}
      size={size}
      label={label}
      hint={hint}
      className={className}
      testId={testId}
      value={value}
      name={name}
      data-wds-state={forcedState}
    />
  );
}

export default RadioButton;
