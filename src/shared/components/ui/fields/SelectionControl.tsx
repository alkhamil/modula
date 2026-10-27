import { type ReactNode } from 'react';

export type SelectionSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type SelectionAppearance = 'outline' | 'solid';
type SelectionKind = 'checkbox' | 'radio' | 'toggle';

interface SelectionControlProps {
  kind: SelectionKind;
  checked: boolean;
  indeterminate?: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  /** Pesan error: memicu state error dan tampil di slot hint. */
  error?: string;
  /** State error tanpa pesan (mis. pesan ditampilkan di level grup). */
  invalid?: boolean;
  /** Style WDS (Checkbox/RadioButton): outline (default) atau solid. */
  appearance?: SelectionAppearance;
  size?: SelectionSize;
  label?: ReactNode;
  /** Teks pendukung di bawah label (digantikan `error` bila ada). */
  hint?: ReactNode;
  className?: string;
  testId?: string;
  /** RadioButton: nilai & nama grup native. */
  value?: string;
  name?: string;
  /** Toggle memakai role="switch". */
  inputRole?: 'switch';
  /** Toggle (Figma "Tick"): tanda centang di dalam thumb saat aktif. */
  tick?: boolean;
  /** Hanya dokumentasi: paksa state fokus (`focused`). */
  'data-wds-state'?: string;
}

/** Path tanda centang & strip di grid 24 (dari node Figma `check` / `indeterminate`). */
const CHECK_PATH = 'M18 7.5L9.75 15.75L6 12';
const DASH_PATH = 'M7.5 12H18';

/**
 * Dasar Checkbox, RadioButton, dan Toggle WDS (internal; pakai `Checkbox`, `RadioButton`,
 * `Toggle`). Warna/ukuran dari token lewat atribut data → `theme/wds/selection*.css`;
 * state visual mengikuti mode token: default, selected, indeterminate, disabled-off/on, error.
 */
function SelectionControl({
  kind,
  checked,
  indeterminate = false,
  onChange,
  disabled = false,
  error,
  invalid = false,
  appearance = 'outline',
  size = 'md',
  label,
  hint,
  className = '',
  testId,
  value,
  name,
  inputRole,
  tick = false,
  'data-wds-state': forcedState,
}: SelectionControlProps) {
  const isError = Boolean(error) || invalid;
  const active = checked || indeterminate;
  const state = disabled
    ? active
      ? 'disabled-on'
      : 'disabled-off'
    : isError && !active
      ? 'error'
      : indeterminate
        ? 'indeterminate'
        : checked
          ? 'selected'
          : 'default';
  const slot = error ?? hint;
  const hasText = Boolean(label) || Boolean(slot);

  return (
    <div data-testid={testId ? `${testId}-field` : undefined} className={className || undefined}>
      <label
        className="wds-sc"
        data-kind={kind}
        data-appearance={kind === 'toggle' ? undefined : appearance}
        data-state={state}
        data-error={isError ? 'true' : undefined}
        data-checked={checked ? 'true' : 'false'}
        data-indeterminate={indeterminate ? 'true' : 'false'}
        data-disabled={disabled ? 'true' : undefined}
        data-has-hint={slot ? 'true' : undefined}
        data-tick={kind === 'toggle' && tick ? 'true' : undefined}
        data-wds-size={size}
        data-wds-state={forcedState}
      >
        <span className="wds-sc__control">
          <input
            data-testid={testId}
            className="wds-sc__input"
            type={kind === 'radio' ? 'radio' : 'checkbox'}
            role={inputRole}
            name={name}
            value={value}
            checked={checked}
            disabled={disabled}
            aria-invalid={isError ? true : undefined}
            ref={(el) => {
              if (el && kind === 'checkbox') el.indeterminate = indeterminate;
            }}
            onChange={(e) => onChange(e.target.checked)}
          />
          <span className="wds-sc__box" aria-hidden="true">
            {kind === 'checkbox' && (
              <svg className="wds-sc__mark" viewBox="0 0 24 24">
                <path className="wds-sc__check" d={CHECK_PATH} />
                <path className="wds-sc__dash" d={DASH_PATH} />
              </svg>
            )}
            {kind === 'radio' && <span className="wds-sc__dot" />}
            {kind === 'toggle' && (
              <span className="wds-sc__thumb">
                <svg className="wds-sc__tick" viewBox="0 0 24 24">
                  <path d={CHECK_PATH} />
                </svg>
              </span>
            )}
          </span>
        </span>
        {hasText && (
          <span className="wds-sc__text">
            {label ? <span className="wds-sc__label">{label}</span> : null}
            {slot ? (
              <span
                className="wds-sc__hint"
                role={error ? 'alert' : undefined}
                data-testid={error && testId ? `${testId}-error` : undefined}
              >
                {slot}
              </span>
            ) : null}
          </span>
        )}
      </label>
    </div>
  );
}

export default SelectionControl;
