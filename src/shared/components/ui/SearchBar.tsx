import { useRef, type InputHTMLAttributes } from 'react';
import { CloseCircleBold, Magnifer, Microphone } from '../icons';

interface SearchBarProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'value' | 'onChange' | 'className'> {
  value: string;
  onChange: (value: string) => void;
  /** Style WDS (Search bar styles): box | pill. */
  appearance?: 'box' | 'pill';
  /** Ukuran WDS (token Size): xs | sm | md | lg | xl. */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Ikon pencarian suara di akhir (Figma "Voice search"). */
  voice?: boolean;
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
  size = 'md',
  voice = false,
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
      data-wds-size={size}
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
          <CloseCircleBold />
        </button>
      )}
      {voice && !disabled && (
        <span className="wds-search__voice" aria-hidden="true">
          <Microphone />
        </span>
      )}
    </div>
  );
}

export default SearchBar;
