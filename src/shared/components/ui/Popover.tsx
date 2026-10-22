import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

type Placement = 'top' | 'bottom' | 'left' | 'right';

interface PopoverProps {
  /** Pemicu (dibuka/ditutup saat diklik). */
  children: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  /** Isi tambahan di bawah teks. */
  content?: ReactNode;
  /** Tombol aksi di bawah isi. */
  actions?: ReactNode;
  /** Ukuran WDS (token Size): xs | sm | md | lg | xl. */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  placement?: Placement;
  /** Paksa terbuka (mis. dokumentasi). */
  open?: boolean;
  className?: string;
  testId?: string;
}

const GAP = 12;
const EDGE = 8;
const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), Math.max(min, max));

/** Popover WDS: panel mengambang berisi judul, teks, isi, dan aksi; ditutup lewat klik luar / Escape. */
function Popover({
  children,
  title,
  description,
  content,
  actions,
  placement = 'bottom',
  size = 'md',
  open: forced,
  className = '',
  testId,
}: PopoverProps) {
  const [openState, setOpenState] = useState(false);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const open = forced ?? openState;

  useLayoutEffect(() => {
    if (!open || !triggerRef.current || !panelRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    const p = panelRef.current.getBoundingClientRect();
    const vertical = placement === 'top' || placement === 'bottom';
    let left = vertical ? r.left + r.width / 2 - p.width / 2 : placement === 'left' ? r.left - p.width - GAP : r.right + GAP;
    let top = vertical ? (placement === 'top' ? r.top - p.height - GAP : r.bottom + GAP) : r.top + r.height / 2 - p.height / 2;
    left = clamp(left, EDGE, window.innerWidth - p.width - EDGE);
    top = clamp(top, EDGE, window.innerHeight - p.height - EDGE);
    // Posisi bergantung pada ukuran DOM yang baru terukur; satu render lanjutan memang diperlukan.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPos({ left, top });
  }, [open, placement, title, description, content, actions]);

  useLayoutEffect(() => {
    if (!open || forced !== undefined) return;
    function onDown(e: MouseEvent) {
      const t = e.target as Node;
      if (panelRef.current?.contains(t) || triggerRef.current?.contains(t)) return;
      setOpenState(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpenState(false);
    }
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, forced]);

  return (
    <span ref={triggerRef} className={`relative inline-flex ${className}`} onClick={() => forced === undefined && setOpenState((v) => !v)} aria-expanded={open}>
      {children}
      {open &&
        createPortal(
          <div
            ref={panelRef}
            role="dialog"
            data-testid={testId}
            data-placement={placement}
            data-wds-size={size}
            className="wds-popover"
            style={{ left: pos?.left ?? 0, top: pos?.top ?? 0, visibility: pos ? 'visible' : 'hidden' }}
            onClick={(e) => e.stopPropagation()}
          >
            {(title || description) && (
              <div className="wds-popover__text">
                {title && <p className="wds-popover__title">{title}</p>}
                {description && <p className="wds-popover__desc">{description}</p>}
              </div>
            )}
            {content}
            {actions && <div className="wds-popover__actions">{actions}</div>}
          </div>,
          document.body,
        )}
    </span>
  );
}

export default Popover;
