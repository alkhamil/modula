import { useState, type ReactNode } from 'react';
import { AltArrowDown } from '../icons';

export interface AccordionItem {
  value: string;
  title: ReactNode;
  /** Teks pendukung di bawah judul header. */
  description?: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

interface AccordionProps {
  items: AccordionItem[];
  /** Style WDS (Accordion styles): box | underline. */
  appearance?: 'box' | 'underline';
  /** Boleh membuka banyak item sekaligus. */
  multiple?: boolean;
  /** Item terbuka awal (tidak terkontrol). */
  defaultOpen?: string[];
  className?: string;
  testId?: string;
}

/** Accordion WDS: daftar section yang bisa dibuka/ditutup. */
function Accordion({
  items,
  appearance = 'box',
  multiple = false,
  defaultOpen = [],
  className = '',
  testId,
}: AccordionProps) {
  const [open, setOpen] = useState<string[]>(defaultOpen);

  function toggle(value: string) {
    setOpen((prev) => {
      if (prev.includes(value)) return prev.filter((v) => v !== value);
      return multiple ? [...prev, value] : [value];
    });
  }

  return (
    <div data-testid={testId} data-appearance={appearance} className={`wds-accordion ${className}`}>
      {items.map((item) => {
        const expanded = open.includes(item.value);
        const headerId = `acc-h-${item.value}`;
        const panelId = `acc-p-${item.value}`;
        return (
          <div key={item.value} className="wds-accordion__item" data-open={expanded || undefined}>
            <h3 className="wds-accordion__heading">
              <button
                type="button"
                id={headerId}
                aria-expanded={expanded}
                aria-controls={panelId}
                disabled={item.disabled}
                onClick={() => toggle(item.value)}
                className="wds-accordion__header"
              >
                <span className="wds-accordion__text">
                  <span className="wds-accordion__title">{item.title}</span>
                  {item.description && <span className="wds-accordion__desc">{item.description}</span>}
                </span>
                <AltArrowDown className="wds-accordion__chevron" />
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
