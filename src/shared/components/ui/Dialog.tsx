import { useState, useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { Cross } from '../icons';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  /** Teks pendukung di bawah judul (Figma "Supporting text"). */
  description?: ReactNode;
  /** Featured icon di atas judul (Figma Dialog styles = icon). */
  icon?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /** Ukuran WDS (token Size): xs | sm | md | lg | xl. */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  hideCloseButton?: boolean;
  disableCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  /** Render panel inline tanpa portal/backdrop (untuk dokumentasi). */
  static?: boolean;
  testId?: string;
}

const maxWidthStyles: Record<string, string> = {
  sm: 'max-w-[400px]',
  md: 'max-w-[500px]',
  lg: 'max-w-[640px]',
  xl: 'max-w-[800px]',
  '2xl': 'max-w-[1000px]',
};

function Dialog({
  open,
  onClose,
  title,
  description,
  icon,
  children,
  footer,
  maxWidth = 'md',
  size = 'md',
  hideCloseButton = false,
  disableCloseButton = false,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  static: isStatic = false,
  testId,
}: DialogProps) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const live = open && !isStatic;

  useEffect(() => {
    if (!live) return;
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => {
      cancelAnimationFrame(frame);
      setVisible(false);
    };
  }, [live]);

  useEffect(() => {
    if (!live || !closeOnEscape) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [live, closeOnEscape, onClose]);

  useEffect(() => {
    if (live) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [live]);

  if (!open) return null;

  const panel = (
    <div
      data-testid={testId}
      data-wds-size={size}
      data-static={isStatic || undefined}
      role="dialog"
      aria-modal={isStatic ? undefined : true}
      className={[
        'wds-dialog',
        maxWidthStyles[maxWidth],
        isStatic ? '' : visible ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
      ].join(' ')}
      onClick={(e) => e.stopPropagation()}
    >
      {(title || icon) && (
        <div className="wds-dialog__header">
          <div className="wds-dialog__heading">
            {icon && <span className="wds-dialog__icon">{icon}</span>}
            {title && <h2 className="wds-dialog__title">{title}</h2>}
          </div>
          {!hideCloseButton && (
            <button
              data-testid={testId ? `${testId}-close` : undefined}
              type="button"
              onClick={onClose}
              disabled={disableCloseButton}
              aria-label={t('common.close')}
              className="wds-dialog__close"
            >
              <Cross />
            </button>
          )}
        </div>
      )}
      {(description || children) && (
        <div className="wds-dialog__content">
          {description && <p className="wds-dialog__description">{description}</p>}
          {children}
        </div>
      )}
      {footer && <div className="wds-dialog__footer">{footer}</div>}
    </div>
  );

  if (isStatic) return panel;

  return createPortal(
    <div data-dialog="true" className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        data-testid={testId ? `${testId}-backdrop` : undefined}
        className={['wds-overlay__backdrop', visible ? 'opacity-100' : 'opacity-0'].join(' ')}
        onClick={closeOnBackdropClick ? onClose : undefined}
      />
      <div className="relative z-10 flex w-full justify-center">{panel}</div>
    </div>,
    document.body,
  );
}

export default Dialog;
