import { useRef, type InputHTMLAttributes } from 'react';
import { Cross, Magnifer } from '../icons';

interface SearchBarProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'value' | 'onChange' | 'className'> {
  value: string;
  onChange: (value: string) => void;
  /** Style WDS (Search bar styles): box | pill. */
  appearance?: 'box' | 'pill';
  /** Tombol hapus saat ada teks (default true). */
  clearable?: boolean;
  className?: string;
  testId?: string;
}

/** Search Bar WDS: field pencarian dengan ikon dan tombol hapus. */
function SearchBar({
  value,
  onChange,
  appearance = 'box',
  clearable = true,
  disabled,
  placeholder = 'Search',
  className = '',
  testId,
  ...rest
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div
      data-testid={testId}
      data-appearance={appearance}
      data-disabled={disabled || undefined}
      className={`wds-search ${className}`}
    >
      <span className="wds-search__icon">
        <Magnifer />
      </span>
      <input
        {...rest}
        ref={inputRef}
        type="search"
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="wds-search__input"
      />
      {clearable && value && !disabled && (
        <button
          type="button"
          aria-label="Clear"
          onClick={() => {
            onChange('');
            inputRef.current?.focus();
          }}
          className="wds-search__clear"
        >
          <Cross />
        </button>
      )}
    </div>
  );
}

export default SearchBar;
