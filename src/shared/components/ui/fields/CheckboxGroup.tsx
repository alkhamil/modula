import Checkbox from './Checkbox';
import type { SelectionAppearance, SelectionSize } from './SelectionControl';

interface CheckboxOption {
  label: string;
  value: string;
  disabled?: boolean;
  /** Teks pendukung di bawah label. */
  hint?: string;
}

interface CheckboxGroupProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: CheckboxOption[];
  size?: SelectionSize;
  appearance?: SelectionAppearance;
  disabled?: boolean;
  /** Arah susunan (Figma Horizontal Checkbox / Radio): horizontal (default) | vertical. */
  direction?: 'horizontal' | 'vertical';
  error?: string;
  testId?: string;
}

function CheckboxGroup({
  value = [],
  onChange,
  options,
  size = 'md',
  appearance,
  disabled,
  direction = 'horizontal',
  error,
  testId,
}: CheckboxGroupProps) {
  function handleToggle(optionValue: string) {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  }

  return (
    <div data-testid={testId}>
      <div
        className={`flex gap-[var(--wds-sz-form-row-options-gap)] ${direction === 'vertical' ? 'flex-col' : 'flex-wrap'}`}
      >
        {options.map((option) => (
          <Checkbox
            key={option.value}
            size={size}
            appearance={appearance}
            hint={option.hint}
            value={value.includes(option.value)}
            onChange={() => handleToggle(option.value)}
            disabled={disabled || option.disabled}
            checkboxLabel={option.label}
            testId={testId ? `${testId}-${option.value}` : undefined}
          />
        ))}
      </div>
      {error && (
        <p data-testid={testId ? `${testId}-error` : undefined} className="mt-1 text-xs text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default CheckboxGroup;
