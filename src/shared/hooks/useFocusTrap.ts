import { useEffect, type RefObject } from 'react';

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]):not([type=hidden]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/** Overlay yang sedang menjebak fokus (yang paling atas = terakhir); hanya itu yang memproses Tab. */
const stack: HTMLElement[] = [];

function focusables(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => el.offsetParent !== null || getComputedStyle(el).position === 'fixed',
  );
}

/**
 * Fokus untuk overlay modal (Dialog, Drawer): saat aktif fokus pindah ke dalam panel
 * (elemen `[data-autofocus]`, lalu elemen fokus pertama, lalu panel itu sendiri), Tab / Shift+Tab
 * berputar di dalam panel, dan saat ditutup fokus dikembalikan ke elemen yang sebelumnya fokus.
 */
export function useFocusTrap(active: boolean, containerRef: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const container = containerRef.current;
    if (!active || !container) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    stack.push(container);
    const items = focusables(container);
    const initial = container.querySelector<HTMLElement>('[data-autofocus]') ?? items[0] ?? container;
    if (initial === container && !container.hasAttribute('tabindex')) container.setAttribute('tabindex', '-1');
    initial.focus({ preventScroll: true });

    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Tab' || !container || stack[stack.length - 1] !== container) return;
      const list = focusables(container);
      if (list.length === 0) {
        e.preventDefault();
        return;
      }
      const first = list[0]!;
      const last = list[list.length - 1]!;
      const current = document.activeElement;
      if (e.shiftKey && (current === first || !container.contains(current))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (current === last || !container.contains(current))) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      const index = stack.lastIndexOf(container);
      if (index !== -1) stack.splice(index, 1);
      if (previous && document.contains(previous)) previous.focus({ preventScroll: true });
    };
  }, [active, containerRef]);
}
