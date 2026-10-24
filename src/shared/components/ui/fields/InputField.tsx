import { type ChangeEvent, type InputHTMLAttributes, type ReactNode, forwardRef, useState } from 'react';
import { CloseCircle, DangerCircle, Eye, EyeClosed, QuestionCircle } from '../../icons';
import { stripNonAscii } from '../../../utils';
import Tooltip from '../Tooltip';
import { fieldSlot, fieldState, type FieldSize } from './fieldState';

type PrependProps =
  | { prepend?: ReactNode; prependGroup?: never }
  | { prependGroup?: ReactNode; prepend?: never };

type AppendProps =
  | { append?: ReactNode; appendGroup?: never }
  | { appendGroup?: ReactNode; append?: never };

interface InputFieldOwnProps {
  /** Ukuran WDS (token Size): xs | sm | md | lg | xl. */
  size?: FieldSize;
  /** Style WDS (mode "Input styles"): box (default) atau underline. */
  appearance?: 'box' | 'underline';
  /** Pesan error: state error + teks di slot hint (warna danger). */
  error?: string;
  /** State error tanpa pesan. */
  isInvalid?: boolean;
  /** Teks pendukung di bawah field (digantikan `error`). */
  hint?: ReactNode;
  /** Ikon bantuan di ujung field; isinya tampil sebagai tooltip (Figma "Show Help icon"). */
  help?: ReactNode;
  currency?: boolean;
  clearable?: boolean;
  sanitize?: (value: string) => string;
  /** Kelas tambahan untuk elemen `<input>`. */
  inputClassName?: string;
  /** Kelas tambahan untuk addon ikon prepend/append. */
  addonClassName?: string;
  /** Hanya dokumentasi: paksa state (`selected`, `typing`, `focused`). */
  'data-wds-state'?: string;
  'data-testid'?: string;
}

type InputFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> &
  InputFieldOwnProps &
  PrependProps &
  AppendProps;

function formatCurrency(value: string): string {
  if (!value) return '';
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';
  return Number(digits).toLocaleString('id-ID');
}

/**
 * Input Field WDS. `prepend`/`append` = ikon/konten leading/trailing di dalam field;
 * `prependGroup`/`appendGroup` = Type "Leading/Trailing dropdown" (segmen berlatar).
 * Warna dan state (default, selected, typing, filled, disabled, error, read-only) dari token.
 */
const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      size = 'md',
      appearance = 'box',
      error,
      isInvalid,
      hint,
      help,
      prepend,
      prependGroup,
      append,
      appendGroup,
      currency,
      clearable = false,
      sanitize,
      inputClassName = '',
      addonClassName = '',
      className = '',
      disabled,
      readOnly,
      onChange,
      onFocus,
      onBlur,
      value,
      defaultValue,
      'data-wds-state': forcedState,
      'data-testid': testId,
      type,
      ...rest
    },
    ref,
  ) => {
    const [focused, setFocused] = useState(false);
    // `type="password"`: tombol tampil/sembunyikan di slot trailing.
    const isPassword = type === 'password';
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [uncontrolledFilled, setUncontrolledFilled] = useState(
      defaultValue !== undefined && String(defaultValue).length > 0,
    );
    const displayValue = currency ? formatCurrency(String(value ?? '')) : value;
    const hasValue =
      value !== undefined && value !== null ? String(value).length > 0 : uncontrolledFilled;
    const invalid = Boolean(error) || Boolean(isInvalid);
    const state = fieldState({ disabled, readOnly, invalid, focused, filled: hasValue, forced: forcedState });
    const slot = fieldSlot(error, hint);

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
      const cleaned = stripNonAscii(e.target.value);
      if (cleaned !== e.target.value) {
        e.target.value = cleaned;
      }
      if (currency) {
        const raw = e.target.value.replace(/\./g, '').replace(/\D/g, '');
        (onChange as ((value: string) => void) | undefined)?.(raw);
        return;
      }
      if (sanitize) {
        const raw = sanitize(e.target.value);
        if (raw !== e.target.value) {
          e.target.value = raw;
        }
      }
      setUncontrolledFilled(e.target.value.length > 0);
      onChange?.(e);
    }

    function handleClear() {
      handleChange({ target: { value: '' } } as ChangeEvent<HTMLInputElement>);
      if (ref && typeof ref === 'object' && ref.current) {
        ref.current.focus();
      }
    }

    return (
      <div
        className={['wds-field', className].filter(Boolean).join(' ')}
        data-kind="input"
        data-appearance={appearance}
        data-state={state}
        data-wds-size={size}
        data-wds-state={forcedState}
      >
        <div className="wds-field__box">
          {prependGroup && <div className="wds-field__dd wds-field__dd--lead">{prependGroup}</div>}
          <div className="wds-field__content">
            {prepend && <span className={`wds-field__icon ${addonClassName}`}>{prepend}</span>}
            <input
              data-testid={testId}
              ref={ref}
              type={isPassword && passwordVisible ? 'text' : type}
              disabled={disabled}
              readOnly={readOnly}
              value={displayValue}
              defaultValue={defaultValue}
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
              className={['wds-field__input', inputClassName].filter(Boolean).join(' ')}
              {...rest}
            />
            {clearable && hasValue && !disabled && !readOnly && (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Clear"
                tabIndex={-1}
                className="wds-field__icon wds-field__action"
              >
                <CloseCircle />
              </button>
            )}
            {isPassword && (
              <button
                type="button"
                data-testid={testId ? `${testId}-toggle` : undefined}
                onClick={() => setPasswordVisible((v) => !v)}
                disabled={disabled}
                aria-label={passwordVisible ? 'Hide password' : 'Show password'}
                aria-pressed={passwordVisible}
                tabIndex={-1}
                className="wds-field__icon wds-field__action"
              >
                {passwordVisible ? <Eye /> : <EyeClosed />}
              </button>
            )}
            {invalid && (
              <span className="wds-field__icon wds-field__icon--error">
                <DangerCircle />
              </span>
            )}
            {append && <span className={`wds-field__icon ${addonClassName}`}>{append}</span>}
            {help && (
              <Tooltip content={help}>
                <span className="wds-field__icon" aria-label="Help">
                  <QuestionCircle />
                </span>
              </Tooltip>
            )}
          </div>
          {appendGroup && <div className="wds-field__dd wds-field__dd--trail">{appendGroup}</div>}
        </div>
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
  },
);

InputField.displayName = 'InputField';

export default InputField;
