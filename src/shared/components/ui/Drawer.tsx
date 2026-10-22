import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { createPortal } from 'react-dom';
import { Cross } from '../icons';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  width?: 'sm' | 'md' | 'lg';
  /** Modal = backdrop + kunci scroll (default true). Non-modal: kanvas tetap interaktif. */
  modal?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  /** Render panel inline tanpa portal/backdrop (untuk dokumentasi). */
  static?: boolean;
  testId?: string;
}

const widthStyles: Record<string, string> = {
  sm: 'w-[320px]',
  md: 'w-[400px]',
  lg: 'w-[480px]',
};

function Drawer({
  open,
  onClose,
  title,
  children,
  footer,
  width = 'md',
  modal = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  static: isStatic = false,
  testId,
}: DrawerProps) {
  const { t } = useTranslation();
  // `render` menahan mount selama animasi tutup; `visible` menggerakkan transisi.
  const [render, setRender] = useState(open);
  const [visible, setVisible] = useState(false);
  const asideRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<number | null>(null);

  useEffect(() => {
    if (open) {
      if (closeTimer.current !== null) {
        window.clearTimeout(closeTimer.current);
        closeTimer.current = null;
      }
      setRender(true);
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }
    // Tutup: mainkan transisi keluar dulu, baru unmount.
    setVisible(false);
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    closeTimer.current = window.setTimeout(
      () => {
        setRender(false);
        closeTimer.current = null;
      },
      reduceMotion ? 0 : 200,
    );
    return () => {
      if (closeTimer.current !== null) {
        window.clearTimeout(closeTimer.current);
        closeTimer.current = null;
      }
    };
  }, [open ]);

  useEffect(() => {
    if (!open || isStatic || !closeOnEscape) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key !== 'Escape') return;
      // Dialog di atas drawer menangani Escape sendiri — drawer non-modal
      // jangan ikut menutup agar seleksi kanvas tidak hilang.
      if (!modal && document.querySelector('[data-dialog]')) return;
      onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, isStatic, closeOnEscape, modal, onClose]);

  useEffect(() => {
    if (open && modal && !isStatic) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open, modal, isStatic]);

  // Mode non-modal (kanvas tetap interaktif): klik di luar panel menutup
  // drawer. Klik di dropdown select / dialog yang di-portal ke body
  // diabaikan agar memilih option / mengisi modal tidak ikut menutup drawer.
  useEffect(() => {
    if (!open || isStatic || modal || !closeOnBackdropClick) return;
    function handlePointerDown(e: PointerEvent) {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (asideRef.current?.contains(target)) return;
      if (typeof target.closest !== 'function') return;
      if (target.closest('[data-select-dropdown]')) return;
      if (target.closest('[data-dialog]')) return;
      onClose();
    }
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [open, isStatic, modal, closeOnBackdropClick, onClose]);

  const panel = (
    <aside
      ref={asideRef}
      data-static={isStatic || undefined}
      data-wds-size="md"
      className={[
        'wds-drawer',
        isStatic ? '' : 'absolute top-0 right-0 h-full',
        !isStatic && !modal ? 'pointer-events-auto' : '',
        widthStyles[width],
        isStatic ? '' : visible ? 'translate-x-0' : 'translate-x-full',
      ].join(' ')}
    >
      {title && (
        <div className="wds-drawer__header">
          <h2 className="wds-drawer__title">{title}</h2>
          <button
            data-testid={testId ? `${testId}-close` : undefined}
            type="button"
            onClick={onClose}
            aria-label={t('common.close')}
            className="wds-dialog__close"
          >
            <Cross />
          </button>
        </div>
      )}
      <div className="wds-drawer__body">{children}</div>
      {footer && <div className="wds-drawer__footer">{footer}</div>}
    </aside>
  );

  if (isStatic) return panel;
  if (!render) return null;

  return createPortal(
    <div
      data-testid={testId}
      className={`fixed inset-0 z-40 ${modal ? '' : 'pointer-events-none'}`}
    >
      {modal && (
        <div
          data-testid={testId ? `${testId}-backdrop` : undefined}
          className={['wds-overlay__backdrop', visible ? 'opacity-100' : 'opacity-0'].join(' ')}
          onClick={closeOnBackdropClick ? onClose : undefined}
        />
      )}
      {panel}
    </div>,
    document.body,
  );
}

export default Drawer;
