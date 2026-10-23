import { type ReactNode } from 'react';
import { CheckCircle, CloseCircle, Cross, DangerTriangle, InfoCircle } from '../icons';

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

// Outline untuk varian `basic`; varian lain memakai ikon solid (token `alert-icons`: *-filled).
const OUTLINE = {
  success: CheckCircle,
  danger: CloseCircle,
  warning: DangerTriangle,
  info: InfoCircle,
} as const;

/** Ikon status solid Figma ("*-filled"): bentuk berwarna ikon dengan simbol berwarna latar alert. */
function FilledIcon({ status }: { status: 'success' | 'danger' | 'warning' | 'info' }) {
  const cut = { fill: 'none', stroke: 'var(--a-bg)', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {status === 'warning' ? (
        <path d="M10.3 3.9a2 2 0 0 1 3.4 0l8 13.7A2 2 0 0 1 20 20.6H4a2 2 0 0 1-1.7-3z" fill="currentColor" />
      ) : (
        <circle cx="12" cy="12" r="10" fill="currentColor" />
      )}
      {status === 'info' && (
        <>
          <circle cx="12" cy="7.6" r="1.3" fill="var(--a-bg)" />
          <path d="M12 11v6" {...cut} />
        </>
      )}
      {status === 'success' && <path d="M7.5 12.4l3 3 6-6.4" {...cut} />}
      {status === 'danger' && <path d="M8.6 8.6l6.8 6.8M15.4 8.6l-6.8 6.8" {...cut} />}
      {status === 'warning' && (
        <>
          <path d="M12 9.6v4.4" {...cut} />
          <circle cx="12" cy="17.2" r="1.2" fill="var(--a-bg)" />
        </>
      )}
    </svg>
  );
}

/**
 * Alert WDS: pesan blok dengan ikon status. Warna dan garis dari token (style × varian);
 * judul, tombol aksi, dan tombol tutup opsional.
 */
function Alert({ variant, message, title, appearance = 'light', size = 'md', action, onClose, testId }: AlertProps) {
  const style = STYLE_OF[variant];
  const Outline = OUTLINE[style];
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
        {appearance === 'basic' ? <Outline /> : <FilledIcon status={style} />}
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
