import { useRef } from 'react';

interface SegmentedProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  label: string;
  /** Teks tampilan per opsi (default = nilai opsi). */
  labels?: Record<string, string>;
}

/** Pilihan tunggal berbentuk segmen (radiogroup, panah kiri/kanan berpindah). */
function Segmented({ value, options, onChange, label, labels }: SegmentedProps) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const move = (index: number) => {
    const next = (index + options.length) % options.length;
    onChange(options[next] as string);
    refs.current[next]?.focus();
  };
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="inline-flex flex-wrap gap-1 rounded-lg border border-border bg-surface p-1"
    >
      {options.map((option, index) => {
        const active = option === value;
        return (
          <button
            key={option}
            ref={(el) => {
              refs.current[index] = el;
            }}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(option)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                move(index + 1);
              } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                move(index - 1);
              }
            }}
            className={[
              'cursor-pointer rounded-md px-2 py-1 text-[11px] font-medium transition-colors',
              'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary',
              active ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground',
            ].join(' ')}
          >
            {labels?.[option] ?? option}
          </button>
        );
      })}
    </div>
  );
}

export default Segmented;
