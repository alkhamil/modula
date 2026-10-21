import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { AltArrowDown, Check } from '../../../../shared/components/icons';

interface DropdownProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  label: string;
  /** Isi tambahan di sebelah teks opsi (mis. pratinjau ikon). */
  renderOption?: (option: string) => ReactNode;
}

/** Dropdown custom (listbox): panah/Home/End/Enter/Esc, klik di luar menutup. */
function Dropdown({ value, options, onChange, label, renderOption }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  const openList = () => {
    setActive(Math.max(0, options.indexOf(value)));
    setOpen(true);
  };
  const pick = (option: string) => {
    onChange(option);
    setOpen(false);
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        openList();
      }
      return;
    }
    if (e.key === 'Escape') setOpen(false);
    else if (e.key === 'ArrowDown') setActive((i) => Math.min(options.length - 1, i + 1));
    else if (e.key === 'ArrowUp') setActive((i) => Math.max(0, i - 1));
    else if (e.key === 'Home') setActive(0);
    else if (e.key === 'End') setActive(options.length - 1);
    else if (e.key === 'Enter' || e.key === ' ') pick(options[active] as string);
    else return;
    e.preventDefault();
  };

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        role="combobox"
        aria-label={label}
        aria-expanded={open}
        aria-controls={listId}
        aria-haspopup="listbox"
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        className={[
          'flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg border bg-background px-3 py-1.5 text-xs',
          'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary',
          open ? 'border-primary' : 'border-border hover:border-muted-foreground',
        ].join(' ')}
      >
        <span className="flex min-w-0 items-center gap-2 truncate text-foreground">
          {renderOption?.(value)}
          {value}
        </span>
        <AltArrowDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label={label}
          className="absolute z-20 mt-1 max-h-60 w-full min-w-40 overflow-auto rounded-lg border border-border bg-background py-1 shadow-lg"
        >
          {options.map((option, index) => (
            <li
              key={option}
              role="option"
              aria-selected={option === value}
              onMouseEnter={() => setActive(index)}
              onMouseDown={(e) => {
                e.preventDefault();
                pick(option);
              }}
              className={[
                'flex cursor-pointer items-center justify-between gap-2 px-3 py-1.5 text-xs',
                index === active ? 'bg-muted' : '',
                option === value ? 'font-medium text-primary' : 'text-foreground',
              ].join(' ')}
            >
              <span className="flex min-w-0 items-center gap-2 truncate">
                {renderOption?.(option)}
                {option}
              </span>
              {option === value && <Check className="h-4 w-4 shrink-0" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dropdown;
