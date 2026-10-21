import RadioButton from './RadioButton';
import type { SelectionAppearance, SelectionSize } from './SelectionControl';

interface RadioOption {
  label: string;
  value: string;
  disabled?: boolean;
  /** Teks pendukung di bawah label. */
  hint?: string;
}

interface RadioButtonGroupProps {
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  size?: SelectionSize;
  appearance?: SelectionAppearance;
  disabled?: boolean;
  error?: string;
  testId?: string;
  'data-testid'?: string;
}

function RadioButtonGroup({
  value,
  onChange,
  options,
  size = 'md',
  appearance,
  disabled,
  error,
  testId,
  'data-testid': dataTestId,
}: RadioButtonGroupProps) {
  const resolvedTestId = dataTestId ?? testId;
  return (
    <div data-testid={resolvedTestId} role="radiogroup">
      <div className="flex flex-wrap gap-4">
        {options.map((option) => (
          <RadioButton
            key={option.value}
            size={size}
            appearance={appearance}
            label={option.label}
            hint={option.hint}
            value={option.value}
            checked={value === option.value}
            disabled={disabled || option.disabled}
            // Pesan error tampil sekali di bawah grup; tiap radio hanya menampilkan state error.
            invalid={Boolean(error)}
            onChange={onChange}
            testId={resolvedTestId ? `${resolvedTestId}-${option.value}` : undefined}
          />
        ))}
      </div>
      {error && (
        <p data-testid={resolvedTestId ? `${resolvedTestId}-error` : undefined} className="mt-2 text-xs text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default RadioButtonGroup;
