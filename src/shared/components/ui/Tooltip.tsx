import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

type Side = 'top' | 'bottom' | 'left' | 'right';
/** Posisi: empat sisi, sudut atas/bawah-kiri/kanan (tepi tooltip rata dengan pemicu), atau `auto` (sisi dengan ruang cukup). */
type Placement = Side | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'auto';

interface TooltipProps {
  content?: ReactNode;
  children?: ReactNode;
  /** Posisi tooltip terhadap pemicu (Figma "Position"): top | bottom | left | right, plus top-left | top-right | bottom-left | bottom-right | auto. */
  placement?: Placement;
  /** Ikon di awal teks (Figma "Show leading"). */
  leading?: ReactNode;
  maxWidth?: number;
  /** Ukuran WDS (token Size): xs | sm | md | lg | xl. */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  minWidth?: number;
  className?: string;
  /** Paksa tampil (mis. dokumentasi); tanpa ini tampil saat hover/fokus/klik. */
  open?: boolean;
  testId?: string;
}

interface Layout {
  /** Sisi hasil resolusi (penting untuk `auto`). */
  side: Side;
  left: number;
  top: number;
  arrow: { left?: number; top?: number };
}

const GAP = 8;
const EDGE = 8;
const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), Math.max(min, max));

/**
 * Tooltip WDS: balon berlatar brand dengan panah, empat posisi, dan ikon awal opsional.
 * Tampil saat hover, fokus keyboard, atau klik pada pemicu; posisi dijepit di dalam viewport.
 */
function Tooltip({
  content,
  children,
  placement = 'top',
  leading,
  maxWidth = 300,
  size = 'md',
  minWidth,
  className = '',
  open,
  testId,
}: TooltipProps) {
  const [shown, setShown] = useState(false);
  const [layout, setLayout] = useState<Layout | null>(null);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const visible = (open ?? shown) && Boolean(content);

  useLayoutEffect(() => {
    if (!visible || !triggerRef.current || !tipRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    const tip = tipRef.current.getBoundingClientRect();
    const arrowSize = 8;
    const [rawSide, align] = placement === 'auto' ? [undefined, undefined] : (placement.split('-') as [Side, 'left' | 'right' | undefined]);
    let side: Side;
    if (rawSide) {
      side = rawSide;
    } else {
      // Auto: atas bila muat, lalu bawah, lalu sisi horizontal dengan ruang terbesar.
      const room = {
        top: r.top - tip.height - GAP - EDGE,
        bottom: window.innerHeight - r.bottom - tip.height - GAP - EDGE,
        right: window.innerWidth - r.right - tip.width - GAP - EDGE,
        left: r.left - tip.width - GAP - EDGE,
      };
      side = room.top >= 0 ? 'top' : room.bottom >= 0 ? 'bottom' : room.right >= room.left ? 'right' : 'left';
    }
    const vertical = side === 'top' || side === 'bottom';
    const centerLeft = r.left + r.width / 2 - tip.width / 2;
    let left = vertical
      ? align === 'left'
        ? r.left
        : align === 'right'
          ? r.right - tip.width
          : centerLeft
      : side === 'left'
        ? r.left - tip.width - GAP
        : r.right + GAP;
    let top = vertical ? (side === 'top' ? r.top - tip.height - GAP : r.bottom + GAP) : r.top + r.height / 2 - tip.height / 2;
    left = clamp(left, EDGE, window.innerWidth - tip.width - EDGE);
    top = clamp(top, EDGE, window.innerHeight - tip.height - EDGE);
    const arrow = vertical
      ? { left: clamp(r.left + r.width / 2 - left - arrowSize / 2, 8, tip.width - 8 - arrowSize) }
      : { top: clamp(r.top + r.height / 2 - top - arrowSize / 2, 8, tip.height - 8 - arrowSize) };
    // Posisi bergantung pada ukuran DOM yang baru terukur; satu render lanjutan memang diperlukan.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLayout({ side, left, top, arrow });
  }, [visible, placement, content]);

  const side: Side = layout?.side ?? (placement === 'auto' ? 'top' : (placement.split('-')[0] as Side));
  const arrowSide: Record<Side, Record<string, number | string>> = {
    top: { bottom: 'calc(var(--wds-sz-tooltip-arrow-size) / -2)' },
    bottom: { top: 'calc(var(--wds-sz-tooltip-arrow-size) / -2)' },
    left: { right: 'calc(var(--wds-sz-tooltip-arrow-size) / -2)' },
    right: { left: 'calc(var(--wds-sz-tooltip-arrow-size) / -2)' },
  };

  const tooltip = visible
    ? createPortal(
        <div
          ref={tipRef}
          role="tooltip"
          data-testid={testId}
          data-placement={side}
          data-wds-size={size}
          className="wds-tooltip"
          style={{
            left: layout?.left ?? 0,
            top: layout?.top ?? 0,
            maxWidth,
            minWidth,
            visibility: layout ? 'visible' : 'hidden',
          }}
        >
          <div className="wds-tooltip__body">
            {leading && <span className="wds-tooltip__icon">{leading}</span>}
            <span>{content}</span>
          </div>
          <span
            className="wds-tooltip__arrow"
            aria-hidden="true"
            style={{ ...arrowSide[side], ...layout?.arrow }}
          />
        </div>,
        document.body,
      )
    : null;

  return (
    <span
      ref={triggerRef}
      className={`relative inline-flex ${className}`}
      onMouseEnter={() => setShown(true)}
      onMouseLeave={() => setShown(false)}
      onFocus={() => setShown(true)}
      onBlur={() => setShown(false)}
      onClick={() => setShown((v) => !v)}
    >
      {children}
      {tooltip}
    </span>
  );
}

export default Tooltip;
