import type { ReactNode, Ref } from 'react';
import { Calendar, CloseCircle } from '../../../icons';
import type { FieldSize } from '../fieldState';

interface DateStateInput {
  disabled?: boolean;
  readOnly?: boolean;
  error?: string;
  open: boolean;
  hasValue: boolean;
  /** Hanya dokumentasi: paksa `selected` (terbuka). */
  forced?: string;
}

/** State visual Date Picker (mode token "Date Picker states"). */
export function dateFieldState({ disabled, readOnly, error, open, hasValue, forced }: DateStateInput): string {
  if (disabled) return 'disabled';
  if (readOnly) return 'read-only';
  if (error) return hasValue ? 'error-filled' : 'error-empty';
  // Token "Date Picker states": focused = stroke fokus (sama dengan selected) + cincin fokus.
  if (open || forced === 'selected' || forced === 'focused') return 'selected';
  return hasValue ? 'filled' : 'default';
}

interface DateFieldShellProps {
  wrapperRef?: Ref<HTMLDivElement>;
  className?: string;
  appearance: 'box' | 'underline';
  size: FieldSize;
  state: string;
  forcedState?: string;
  error?: string;
  hint?: ReactNode;
  testId?: string;
  /** Isi kotak (input + ikon). */
  children: ReactNode;
  /** Panel kalender (portal) — dirender di luar kotak. */
  panel?: ReactNode;
}

/** Kerangka field tanggal WDS: kotak `.wds-field` + slot hint/error; dipakai DatePicker (single dan range). */
export function DateFieldShell({
  wrapperRef,
  className,
  appearance,
  size,
  state,
  forcedState,
  error,
  hint,
  testId,
  children,
  panel,
}: DateFieldShellProps) {
  const slot = error ?? hint;
  return (
    <div
      ref={wrapperRef}
      className={['wds-field', className].filter(Boolean).join(' ')}
      data-kind="date"
      data-appearance={appearance}
      data-state={state}
      data-wds-size={size}
      data-wds-state={forcedState}
    >
      <div className="wds-field__box">
        <div className="wds-field__content">{children}</div>
      </div>
      {panel}
      {slot && (
        <p
          data-testid={error && testId ? `${testId}-error` : undefined}
          className="wds-field__hint"
          role={error ? 'alert' : undefined}
        >
          {slot}
        </p>
      )}
    </div>
  );
}

interface DateIconsProps {
  hasValue: boolean;
  interactive: boolean;
  clearable: boolean;
  onClear: () => void;
}

/** Tombol hapus (bila ada nilai) + ikon kalender di ujung field. */
export function DateIcons({ hasValue, interactive, clearable, onClear }: DateIconsProps) {
  return (
    <>
      {clearable && hasValue && interactive && (
        <button
          type="button"
          aria-label="Clear"
          tabIndex={-1}
          className="wds-field__icon wds-field__action"
          onClick={(e) => {
            e.stopPropagation();
            onClear();
          }}
        >
          <CloseCircle />
        </button>
      )}
      <span className="wds-field__icon" aria-hidden="true">
        <Calendar />
      </span>
    </>
  );
}
