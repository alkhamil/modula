import type { ReactNode } from 'react';
import { CheckCircleBold, CloseCircleBold, DangerTriangleBold, InfoCircleBold, Cross } from '../icons';

interface BannerProps {
  /** Style WDS (Banner styles): info | success | warning | danger | default. */
  variant?: 'info' | 'success' | 'warning' | 'danger' | 'default';
  title?: ReactNode;
  message: ReactNode;
  /** Teks tombol aksi. */
  action?: { label: string; onClick?: () => void };
  onClose?: () => void;
  /** Ikon custom (default: sesuai variant). */
  icon?: ReactNode;
  className?: string;
  testId?: string;
}

const ICONS = {
  info: InfoCircleBold,
  success: CheckCircleBold,
  warning: DangerTriangleBold,
  danger: CloseCircleBold,
  default: InfoCircleBold,
};

/** Banner WDS: pesan selebar halaman dengan ikon, aksi, dan tombol tutup. */
function Banner({
  variant = 'info',
  title,
  message,
  action,
  onClose,
  icon,
  className = '',
  testId,
}: BannerProps) {
  const Icon = ICONS[variant];
  return (
    <div
      role={variant === 'danger' || variant === 'warning' ? 'alert' : 'status'}
      data-testid={testId}
      data-variant={variant}
      className={`wds-banner ${className}`}
    >
      <span className="wds-banner__icon">{icon ?? <Icon />}</span>
      <div className="wds-banner__text">
        {title && <p className="wds-banner__title">{title}</p>}
        <p className="wds-banner__message">{message}</p>
      </div>
      {action && (
        <button type="button" onClick={action.onClick} className="wds-banner__action">
          {action.label}
        </button>
      )}
      {onClose && (
        <button type="button" onClick={onClose} aria-label="Close" className="wds-banner__close">
          <Cross />
        </button>
      )}
    </div>
  );
}

export default Banner;
