import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AltArrowDown, Check } from '../../../../shared/components/icons';

interface DropdownProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  label: string;
  /** Isi tambahan di sebelah teks opsi (mis. pratinjau ikon). */
  renderOption?: (option: string) => ReactNode;
}

interface ListPosition {
  top: number;
  left: number;
  width: number;
}

/**
 * Dropdown custom (listbox): panah/Home/End/Enter/Esc, klik di luar menutup. Daftar dirender di
 * portal (fixed) supaya tidak terpotong panel yang bisa discroll; menutup saat scroll/resize.
 */
function Dropdown({ value, options, onChange, label, renderOption }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [pos, setPos] = useState<ListPosition | null>(null);
  const button = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const listId = useId();

  useLayoutEffect(() => {
    if (!open || !button.current) return;
    const rect = button.current.getBoundingClientRect();
    setPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const close = (e: Event) => {
      const target = e.target as Node;
      if (button.current?.contains(target) || list.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', close);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      document.removeEventListener('mousedown', close);
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
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
    <div className="relative">
      <button
        ref={button}
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
      {open &&
        pos &&
        createPortal(
          <ul
            ref={list}
            id={listId}
            role="listbox"
            aria-label={label}
            style={{ position: 'fixed', top: pos.top, left: pos.left, width: pos.width, zIndex: 60 }}
            className="max-h-60 overflow-auto rounded-lg border border-border bg-background py-1 shadow-lg"
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
          </ul>,
          document.body,
        )}
    </div>
  );
}

export default Dropdown;
