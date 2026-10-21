import SelectionControl, { type SelectionSize } from './SelectionControl';

interface ToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
  size?: SelectionSize;
  disabled?: boolean;
  /** Pesan error (state error + teks di slot hint). */
  error?: string;
  className?: string;
  // check/uncheck dinamis: tampilkan checkedLabel/uncheckedLabel mengikuti nilai value.
  // Kalau showCheckedLabels=false (tidak pakai checkedLabel/uncheckedLabel), pakai switchLabel (statis).
  checkedLabel?: string;
  uncheckedLabel?: string;
  switchLabel?: string;
  showCheckedLabels?: boolean;
  /** Teks pendukung di bawah label. */
  hint?: string;
  testId?: string;
  'data-testid'?: string;
  /** Hanya dokumentasi: paksa state fokus. */
  'data-wds-state'?: string;
}

/** Toggle WDS (Figma "Toggle": track 1.8×, thumb 0.8×; state dari token Toggle states). */
function Toggle({
  value = false,
  onChange,
  size = 'md',
  disabled,
  error,
  className,
  checkedLabel,
  uncheckedLabel,
  switchLabel,
  showCheckedLabels = true,
  hint,
  testId,
  'data-testid': dataTestId,
  'data-wds-state': forcedState,
}: ToggleProps) {
  const resolvedTestId = dataTestId ?? testId;
  // Label selalu tampil: bila mode label dinamis aktif tapi checked/unchecked
  // kosong, fallback ke switchLabel agar label tidak hilang.
  const visibleLabel = showCheckedLabels
    ? value
      ? checkedLabel || switchLabel
      : uncheckedLabel || switchLabel
    : switchLabel;
  return (
    <SelectionControl
      kind="toggle"
      inputRole="switch"
      checked={value}
      onChange={onChange}
      disabled={disabled}
      error={error}
      size={size}
      label={visibleLabel}
      hint={hint}
      className={className}
      testId={resolvedTestId}
      data-wds-state={forcedState}
    />
  );
}

export default Toggle;
