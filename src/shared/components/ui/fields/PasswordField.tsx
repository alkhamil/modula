import { useState, type InputHTMLAttributes, type ReactNode } from 'react';
import InputField from './InputField';
import type { FieldSize } from './fieldState';

interface PasswordFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  size?: FieldSize;
  appearance?: 'box' | 'underline';
  error?: string;
  isInvalid?: boolean;
  hint?: ReactNode;
  defaultVisible?: boolean;
  sanitize?: (value: string) => string;
  'data-wds-state'?: string;
  'data-testid'?: string;
}

function EyeOpen({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function EyeClosed({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
      />
    </svg>
  );
}

/** Password WDS: `InputField` dengan tombol tampil/sembunyi di slot trailing. */
function PasswordField({ defaultVisible = false, disabled, 'data-testid': testId, ...rest }: PasswordFieldProps) {
  const [visible, setVisible] = useState(defaultVisible);
  return (
    <InputField
      {...rest}
      data-testid={testId}
      disabled={disabled}
      type={visible ? 'text' : 'password'}
      append={
        <button
          data-testid={testId ? `${testId}-toggle` : undefined}
          type="button"
          onClick={() => setVisible((v) => !v)}
          disabled={disabled}
          aria-label={visible ? 'Hide password' : 'Show password'}
          tabIndex={-1}
          className="wds-field__action"
          style={{ display: 'inline-flex', width: '100%', height: '100%' }}
        >
          {visible ? <EyeOpen /> : <EyeClosed />}
        </button>
      }
    />
  );
}

export default PasswordField;
