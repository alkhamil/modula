import { useId, useState, type ReactNode } from 'react';
import { AltArrowDown } from '../icons';

export interface AccordionItem {
  value: string;
  title: ReactNode;
  /** Isi yang tampil saat terbuka (Figma "Description"). */
  content: ReactNode;
  /** Ikon di awal judul (Figma "Leading icon"). */
  icon?: ReactNode;
  disabled?: boolean;
}

interface AccordionProps {
  items: AccordionItem[];
  /** Style WDS (Accordion styles): box | underline. */
  appearance?: 'box' | 'underline';
  /** Ukuran WDS (token Size): xs | sm | md | lg | xl. */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Pindahkan chevron ke awal (Figma "Flip icon"). */
  flipIcon?: boolean;
  /** Item terbuka awal (tidak terkontrol). */
  defaultOpen?: string[];
  /** Item terbuka (terkontrol; Figma "Expand"). */
  value?: string[];
  onChange?: (value: string[]) => void;
  className?: string;
  testId?: string;
}

/** Accordion WDS: daftar section yang bisa dibuka/ditutup. */
function Accordion({
  items,
  appearance = 'box',
  size = 'md',
  flipIcon = false,
  defaultOpen = [],
  value,
  onChange,
  className = '',
  testId,
}: AccordionProps) {
  // Prefix unik per instance: beberapa Accordion di satu halaman tidak boleh berbagi id.
  const uid = useId();
  const [inner, setInner] = useState<string[]>(defaultOpen);
  const open = value ?? inner;

  function toggle(v: string) {
    // Tiap item punya state Expand sendiri (Figma); membuka satu tidak menutup yang lain.
    const next = open.includes(v) ? open.filter((x) => x !== v) : [...open, v];
    if (value === undefined) setInner(next);
    onChange?.(next);
  }

  return (
    <div
      data-testid={testId}
      data-appearance={appearance}
      data-wds-size={size}
      data-flip={flipIcon || undefined}
      className={`wds-accordion ${className}`}
    >
      {items.map((item) => {
        const expanded = open.includes(item.value);
        const headerId = `${uid}-h-${item.value}`;
        const panelId = `${uid}-p-${item.value}`;
        return (
          <div key={item.value} className="wds-accordion__item" data-open={expanded || undefined}>
            <h3 className="wds-accordion__heading">
              <button
                type="button"
                id={headerId}
                aria-expanded={expanded}
                aria-controls={expanded ? panelId : undefined}
                disabled={item.disabled}
                onClick={() => toggle(item.value)}
                className="wds-accordion__header"
              >
                {flipIcon && <AltArrowDown className="wds-accordion__chevron" />}
                {item.icon && <span className="wds-accordion__lead">{item.icon}</span>}
                <span className="wds-accordion__text">
                  <span className="wds-accordion__title">{item.title}</span>
                </span>
                {!flipIcon && <AltArrowDown className="wds-accordion__chevron" />}
              </button>
            </h3>
            {expanded && (
              <div id={panelId} role="region" aria-labelledby={headerId} className="wds-accordion__panel">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Accordion;
