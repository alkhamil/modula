import { useRef, type KeyboardEvent, type PointerEvent } from 'react';
import { AltArrowDown, AltArrowLeft, AltArrowRight, AltArrowUp } from '../icons';

interface ScrollBarProps {
  /** Posisi scroll 0–100. */
  value: number;
  onChange?: (value: number) => void;
  /** Panjang thumb sebagai persen track (default 30). */
  thumbSize?: number;
  orientation?: 'vertical' | 'horizontal';
  /** Panjang track dalam px (Figma "Length"). */
  length?: number;
  /** Style WDS (Scrollbar styles): default | grey | outline. */
  appearance?: 'default' | 'grey' | 'outline';
  /** Ukuran WDS (token Size): xs | sm | md | lg | xl. */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Langkah tombol panah dan tombol keyboard. */
  step?: number;
  className?: string;
  testId?: string;
  'aria-label'?: string;
}

/** Scroll Bar WDS: indikator posisi dengan tombol panah di kedua ujung; bisa diseret. */
function ScrollBar({
  value,
  onChange,
  thumbSize = 30,
  orientation = 'vertical',
  length = 240,
  appearance = 'default',
  size = 'md',
  step = 10,
  className = '',
  testId,
  'aria-label': ariaLabel,
}: ScrollBarProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const vertical = orientation === 'vertical';
  const clamp = (n: number) => Math.min(100, Math.max(0, n));
  const free = 100 - thumbSize;
  const offset = (clamp(value) / 100) * free;

  function setFromPointer(e: PointerEvent) {
    const el = trackRef.current;
    if (!el || !onChange) return;
    const r = el.getBoundingClientRect();
    const pos = vertical ? (e.clientY - r.top) / r.height : (e.clientX - r.left) / r.width;
    const centered = pos * 100 - thumbSize / 2;
    onChange(clamp(free === 0 ? 0 : (centered / free) * 100));
  }

  function onKey(e: KeyboardEvent) {
    if (!onChange) return;
    const dec = vertical ? 'ArrowUp' : 'ArrowLeft';
    const inc = vertical ? 'ArrowDown' : 'ArrowRight';
    if (e.key === dec) onChange(clamp(value - step));
    else if (e.key === inc) onChange(clamp(value + step));
    else if (e.key === 'Home') onChange(0);
    else if (e.key === 'End') onChange(100);
    else return;
    e.preventDefault();
  }

  const Dec = vertical ? AltArrowUp : AltArrowLeft;
  const Inc = vertical ? AltArrowDown : AltArrowRight;

  return (
    <div
      data-testid={testId}
      data-orientation={orientation}
      data-appearance={appearance}
      data-wds-size={size}
      style={vertical ? { height: length } : { width: length }}
      className={`wds-scrollbar ${className}`}
    >
      <button type="button" aria-label="Scroll back" tabIndex={-1} onClick={() => onChange?.(clamp(value - step))} className="wds-scrollbar__arrow">
        <Dec />
      </button>
      <div
        ref={trackRef}
        role="scrollbar"
        aria-orientation={orientation}
        aria-valuenow={Math.round(value)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={ariaLabel}
        tabIndex={0}
        onKeyDown={onKey}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          setFromPointer(e);
        }}
        onPointerMove={(e) => e.buttons === 1 && setFromPointer(e)}
        className="wds-scrollbar__track"
      >
        <div
          className="wds-scrollbar__thumb"
          style={vertical ? { height: `${thumbSize}%`, top: `${offset}%` } : { width: `${thumbSize}%`, left: `${offset}%` }}
        />
      </div>
      <button type="button" aria-label="Scroll forward" tabIndex={-1} onClick={() => onChange?.(clamp(value + step))} className="wds-scrollbar__arrow">
        <Inc />
      </button>
    </div>
  );
}

export default ScrollBar;
