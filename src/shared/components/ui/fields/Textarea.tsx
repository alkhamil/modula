import { type ChangeEvent, type ReactNode, type TextareaHTMLAttributes, forwardRef, useState } from 'react';
import { stripNonAscii } from '../../../utils';
import { fieldSlot, fieldState, type FieldSize } from './fieldState';

interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  /** Ukuran WDS (token Size): xs | sm | md | lg | xl. */
  size?: FieldSize;
  /** Pesan error: state error + teks di slot hint (warna danger). */
  error?: string;
  /** Teks pendukung di bawah field (digantikan `error`). */
  hint?: ReactNode;
  /** Figma "Dynamic?": aktifkan handle resize vertikal (default: tinggi tetap 128px). */
  dynamic?: boolean;
  /** Figma "Show Scroll Bar": tampilkan scrollbar saat isi melebihi tinggi (default disembunyikan). */
  showScrollBar?: boolean;
  sanitize?: (value: string) => string;
  /** Hanya dokumentasi: paksa state (`selected`, `typing`, `focused`). */
  'data-wds-state'?: string;
  'data-testid'?: string;
}

/**
 * Textarea WDS: state dari token "Textarea states"; `maxLength` menampilkan penghitung
 * `n/max` di baris hint (seperti Figma).
 */
const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      size = 'md',
      error,
      hint,
      dynamic = false,
      showScrollBar = false,
      className = '',
      disabled,
      readOnly,
      rows = 4,
      sanitize,
      onChange,
      onFocus,
      onBlur,
      value,
      defaultValue,
      maxLength,
      'data-wds-state': forcedState,
      'data-testid': testId,
      ...rest
    },
    ref,
  ) => {
    const [focused, setFocused] = useState(false);
    const [uncontrolledLength, setUncontrolledLength] = useState(
      defaultValue !== undefined ? String(defaultValue).length : 0,
    );
    const length = value !== undefined && value !== null ? String(value).length : uncontrolledLength;
    const invalid = Boolean(error);
    const state = fieldState({ disabled, readOnly, invalid, focused, filled: length > 0, forced: forcedState });
    const slot = fieldSlot(error, hint);

    function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
      const cleaned = stripNonAscii(e.target.value);
      if (cleaned !== e.target.value) {
        e.target.value = cleaned;
      }
      if (sanitize) {
        const raw = sanitize(e.target.value);
        if (raw !== e.target.value) {
          e.target.value = raw;
        }
      }
      setUncontrolledLength(e.target.value.length);
      onChange?.(e);
    }

    return (
      <div
        className={['wds-field', className].filter(Boolean).join(' ')}
        data-kind="textarea"
        data-state={state}
        data-dynamic={dynamic ? 'true' : undefined}
        data-scrollbar={showScrollBar ? 'true' : undefined}
        data-wds-size={size}
        data-wds-state={forcedState}
      >
        <div className="wds-field__box">
          <textarea
            data-testid={testId}
            ref={ref}
            disabled={disabled}
            readOnly={readOnly}
            rows={rows}
            value={value}
            defaultValue={defaultValue}
            maxLength={maxLength}
            aria-invalid={invalid ? true : undefined}
            onChange={handleChange}
            onFocus={(e) => {
              setFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              onBlur?.(e);
            }}
            className="wds-field__input"
            {...rest}
          />
        </div>
        {(slot || maxLength !== undefined) && (
          <p className="wds-field__hint">
            <span data-testid={error && testId ? `${testId}-error` : undefined} role={error ? 'alert' : undefined}>
              {slot}
            </span>
            {maxLength !== undefined && (
              <span className="wds-field__counter">
                {length}/{maxLength}
              </span>
            )}
          </p>
        )}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';

export default Textarea;
