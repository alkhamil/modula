import { type ReactNode } from 'react';
import {
  CheckCircle,
  CheckCircleBold,
  CloseCircle,
  CloseCircleBold,
  Cross,
  DangerTriangle,
  DangerTriangleBold,
  InfoCircle,
  InfoCircleBold,
} from '../icons';

/** Style Alert WDS (mode "Alert styles"); `error` = nama lama dari `danger`. */
export type AlertVariant = 'success' | 'error' | 'danger' | 'warning' | 'info';
/** Varian tampilan (mode "Alert variant"): basic, solid, light, left-stroke. */
export type AlertAppearance = 'basic' | 'solid' | 'light' | 'left-stroke';

interface AlertProps {
  variant: AlertVariant;
  message: string | ReactNode;
  /** Judul di atas pesan (Figma "Show title"). */
  title?: ReactNode;
  /** Varian tampilan WDS (default `light`). */
  appearance?: AlertAppearance;
  /** Ukuran WDS (token Size): xs | sm | md | lg | xl. */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Tombol aksi di sisi kanan (Alert types: action). */
  action?: { label: string; onClick?: () => void };
  /** Menampilkan tombol tutup (Alert types: close). */
  onClose?: () => void;
  testId?: string;
}

const STYLE_OF: Record<AlertVariant, 'success' | 'danger' | 'warning' | 'info'> = {
  success: 'success',
  error: 'danger',
  danger: 'danger',
  warning: 'warning',
  info: 'info',
};

// Outline untuk varian `basic`, filled (Bold Duotone) untuk varian lain — sesuai token `alert-icons`.
const ICONS = {
  success: { outline: CheckCircle, filled: CheckCircleBold },
  danger: { outline: CloseCircle, filled: CloseCircleBold },
  warning: { outline: DangerTriangle, filled: DangerTriangleBold },
  info: { outline: InfoCircle, filled: InfoCircleBold },
} as const;

/**
 * Alert WDS: pesan blok dengan ikon status. Warna dan garis dari token (style × varian);
 * judul, tombol aksi, dan tombol tutup opsional.
 */
function Alert({ variant, message, title, appearance = 'light', size = 'md', action, onClose, testId }: AlertProps) {
  const style = STYLE_OF[variant];
  const Icon = ICONS[style][appearance === 'basic' ? 'outline' : 'filled'];
  return (
    <div
      data-testid={testId}
      data-style={style}
      data-appearance={appearance}
      data-wds-size={size}
      data-has-title={title ? 'true' : 'false'}
      role={style === 'danger' || style === 'warning' ? 'alert' : 'status'}
      className="wds-alert"
    >
      <span className="wds-alert__icon" aria-hidden="true">
        <Icon />
      </span>
      <div className="wds-alert__text">
        {title && <p className="wds-alert__title">{title}</p>}
        <span className="wds-alert__message">{message}</span>
      </div>
      {action && (
        <button type="button" className="wds-alert__action" onClick={action.onClick}>
          {action.label}
        </button>
      )}
      {onClose && (
        <button type="button" aria-label="Close" className="wds-alert__close" onClick={onClose}>
          <Cross />
        </button>
      )}
    </div>
  );
}

export default Alert;
