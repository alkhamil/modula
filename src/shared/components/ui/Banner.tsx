import type { ReactNode } from 'react';
import { CheckCircle, CloseCircle, Cross, DangerTriangle, InfoCircle } from '../icons';
import Button from './Button';

interface BannerAction {
  label: string;
  onClick?: () => void;
}

interface BannerProps {
  /** Style WDS (Banner styles): info | success | warning | danger | default. */
  variant?: 'info' | 'success' | 'warning' | 'danger' | 'default';
  /** Ukuran WDS (token Size): xs | sm | md | lg | xl. */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  title?: ReactNode;
  message: ReactNode;
  /** Tombol aksi utama (Figma Action-1). */
  action?: BannerAction;
  /** Tombol aksi kedua (Figma Action-2). */
  secondaryAction?: BannerAction;
  onClose?: () => void;
  /** Ikon custom (default: sesuai variant). `false` menyembunyikan ikon. */
  icon?: ReactNode | false;
  className?: string;
  testId?: string;
}

const ICONS = {
  info: InfoCircle,
  success: CheckCircle,
  warning: DangerTriangle,
  danger: CloseCircle,
  default: InfoCircle,
};

/** Banner WDS: pesan selebar halaman dengan ikon, judul, dua aksi (Button), dan tombol tutup. */
function Banner({
  variant = 'info',
  size = 'md',
  title,
  message,
  action,
  secondaryAction,
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
      data-wds-size={size}
      className={`wds-banner ${className}`}
    >
      {icon !== false && <span className="wds-banner__icon">{icon ?? <Icon />}</span>}
      <div className="wds-banner__text">
        {title && <p className="wds-banner__title">{title}</p>}
        <p className="wds-banner__message">{message}</p>
      </div>
      {(action || secondaryAction) && (
        <div className="wds-banner__actions">
          {secondaryAction && (
            <Button size="md" hierarchy="secondary" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
          {action && (
            <Button size="md" onClick={action.onClick}>
              {action.label}
            </Button>
          )}
        </div>
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
