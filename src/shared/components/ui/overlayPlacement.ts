/** Posisi overlay (Tooltip, Popover) terhadap pemicu. */
export type PlacementSide = 'top' | 'bottom' | 'left' | 'right';
/**
 * Empat sisi, sudut atas/bawah-kiri/kanan (tepi overlay rata dengan tepi pemicu),
 * atau `auto` (sisi dengan ruang cukup: atas, lalu bawah, lalu kanan/kiri).
 */
export type OverlayPlacement =
  | PlacementSide
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'auto';

export const OVERLAY_PLACEMENTS: OverlayPlacement[] = [
  'top',
  'top-left',
  'top-right',
  'bottom',
  'bottom-left',
  'bottom-right',
  'left',
  'right',
  'auto',
];

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), Math.max(min, max));

/** Sisi awal dari `placement` sebelum ukuran overlay terukur (`auto` dianggap `top`). */
export function initialSide(placement: OverlayPlacement): PlacementSide {
  return placement === 'auto' ? 'top' : (placement.split('-')[0] as PlacementSide);
}

/**
 * Hitung posisi overlay (koordinat viewport) dari kotak pemicu dan ukuran overlay.
 * Hasil dijepit di dalam viewport dengan jarak `edge`.
 */
export function placeOverlay(
  trigger: DOMRect,
  overlay: { width: number; height: number },
  placement: OverlayPlacement,
  gap: number,
  edge: number,
): { side: PlacementSide; left: number; top: number } {
  const align = placement === 'auto' ? undefined : (placement.split('-')[1] as 'left' | 'right' | undefined);
  let side: PlacementSide;
  if (placement === 'auto') {
    const room = {
      top: trigger.top - overlay.height - gap - edge,
      bottom: window.innerHeight - trigger.bottom - overlay.height - gap - edge,
      right: window.innerWidth - trigger.right - overlay.width - gap - edge,
      left: trigger.left - overlay.width - gap - edge,
    };
    side = room.top >= 0 ? 'top' : room.bottom >= 0 ? 'bottom' : room.right >= room.left ? 'right' : 'left';
  } else {
    side = initialSide(placement);
  }
  const vertical = side === 'top' || side === 'bottom';
  let left = vertical
    ? align === 'left'
      ? trigger.left
      : align === 'right'
        ? trigger.right - overlay.width
        : trigger.left + trigger.width / 2 - overlay.width / 2
    : side === 'left'
      ? trigger.left - overlay.width - gap
      : trigger.right + gap;
  let top = vertical
    ? side === 'top'
      ? trigger.top - overlay.height - gap
      : trigger.bottom + gap
    : trigger.top + trigger.height / 2 - overlay.height / 2;
  left = clamp(left, edge, window.innerWidth - overlay.width - edge);
  top = clamp(top, edge, window.innerHeight - overlay.height - edge);
  return { side, left, top };
}
