import { useRef, type ClipboardEvent, type KeyboardEvent } from 'react';

interface CodeInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  /** Style WDS (OTP/PIN styles): box | underline. */
  appearance?: 'box' | 'underline';
  /** Mode PIN: karakter disamarkan. */
  masked?: boolean;
  status?: 'default' | 'error' | 'success';
  disabled?: boolean;
  /** Hanya angka (default true). */
  numeric?: boolean;
  className?: string;
  testId?: string;
  'aria-label'?: string;
}

/** Input kode per-karakter (dasar OtpInput dan PinInput). */
function CodeInput({
  value,
  onChange,
  length = 6,
  appearance = 'box',
  masked = false,
  status = 'default',
  disabled = false,
  numeric = true,
  className = '',
  testId,
  'aria-label': ariaLabel,
}: CodeInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const chars = Array.from({ length }, (_, i) => value[i] ?? '');

  function clean(raw: string) {
    return numeric ? raw.replace(/\D/g, '') : raw;
  }

  function commit(next: string[]) {
    onChange(next.join('').slice(0, length));
  }

  function handleInput(index: number, raw: string) {
    const typed = clean(raw);
    if (!typed) {
      const next = [...chars];
      next[index] = '';
      commit(next);
      return;
    }
    const next = [...chars];
    const incoming = typed.split('');
    incoming.forEach((c, k) => {
      if (index + k < length) next[index + k] = c;
    });
    commit(next);
    refs.current[Math.min(index + incoming.length, length - 1)]?.focus();
  }

  function handleKey(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !chars[index] && index > 0) {
      e.preventDefault();
      const next = [...chars];
      next[index - 1] = '';
      commit(next);
      refs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      refs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      refs.current[index + 1]?.focus();
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    const pasted = clean(e.clipboardData.getData('text')).slice(0, length);
    if (!pasted) return;
    e.preventDefault();
    onChange(pasted);
    refs.current[Math.min(pasted.length, length - 1)]?.focus();
  }

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      data-testid={testId}
      data-appearance={appearance}
      data-status={status}
      className={`wds-code ${className}`}
    >
      {chars.map((c, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type={masked ? 'password' : 'text'}
          inputMode={numeric ? 'numeric' : 'text'}
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={length}
          value={c}
          disabled={disabled}
          aria-label={`${i + 1}`}
          data-filled={c ? true : undefined}
          onChange={(e) => handleInput(i, e.target.value)}
          onKeyDown={(e) => handleKey(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          className="wds-code__cell"
        />
      ))}
    </div>
  );
}

export default CodeInput;
