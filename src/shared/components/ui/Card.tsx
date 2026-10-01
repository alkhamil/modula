import { type ReactNode, useState } from 'react';
import { ChevronDownIcon } from '../icons';

interface CardProps {
  children: ReactNode;
  title?: string;
  actions?: ReactNode;
  className?: string;
  testId?: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
  /** Ikon toggle custom saat `collapsible` (default chevron yang ikut berputar). */
  toggleIcon?: ReactNode;
}

function Card({
  children,
  title,
  actions,
  className = '',
  testId,
  collapsible = false,
  defaultOpen = true,
  toggleIcon,
}: CardProps) {
  const [open, setOpen] = useState(defaultOpen);

  const headerClass = [
    'flex flex-row w-full items-center justify-between border-b border-border px-[var(--theme-card-padding-x)] py-[var(--theme-card-padding-y)]',
    collapsible ? 'cursor-pointer' : '',
  ].join(' ');

  const headerProps = collapsible ? { onClick: () => setOpen((prev) => !prev) } : {};

  return (
    <div
      data-testid={testId}
      className={`rounded-xl border border-border bg-background shadow-sm ${className}`}
    >
      {(title || actions) &&
        (collapsible ? (
          <button className={headerClass} {...headerProps}>
            <div
              className="flex flex-row w-full justify-between items-center gap-2"
              aria-expanded={open}
            >
              <h3 className="text-lg font-semibold text-foreground">{title}</h3>
              <div>
                {toggleIcon ?? (
                  <ChevronDownIcon
                    className={`h-4 w-4 text-muted-foreground transition-transform ${open ? 'rotate-270' : 'rotate-90'}`}
                  />
                )}
              </div>
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </button>
        ) : (
          <div className={headerClass}>
            {title && <h3 className="text-lg font-semibold text-foreground">{title}</h3>}
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>
        ))}
      {open && (
        <div className="min-w-0 px-[var(--theme-card-padding-x)] py-[var(--theme-card-padding-y)]">
          {children}
        </div>
      )}
    </div>
  );
}

export default Card;
