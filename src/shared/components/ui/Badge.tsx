import { type ReactNode } from 'react';
import { Cross } from '../icons';

/** Style Badge WDS (mode "Badge styles"). */
export type BadgeStyle = 'neutral' | 'primary' | 'info' | 'success' | 'warning' | 'danger';
/** Nama lama: `error` → danger, `secondary` → neutral; `custom` = tanpa warna WDS (warna dari className). */
type BadgeVariant = BadgeStyle | 'error' | 'secondary' | 'custom';

interface BadgeProps {
  variant?: BadgeVariant;
  /** Ukuran WDS (token Size): xs | sm | md | lg | xl. */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Tipe "dot": titik berwarna sebelum label. */
  dot?: boolean;
  /** Tipe "counter": angka dalam pil di ujung kanan. */
  counter?: ReactNode;
  /** Ikon sebelum / sesudah label (tipe "icon left" / "icon right"). */
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  /** Tipe "x close": tombol hapus di ujung kanan. */
  onRemove?: () => void;
  /** Tipe "icon only": hanya ikon (`leadingIcon`); children diabaikan — beri aria-label. */
  iconOnly?: boolean;
  children?: ReactNode;
  className?: string;
  testId?: string;
  'aria-label'?: string;
}

const STYLE_OF: Record<Exclude<BadgeVariant, 'custom'>, BadgeStyle> = {
  neutral: 'neutral',
  primary: 'primary',
  info: 'info',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
  error: 'danger',
  secondary: 'neutral',
};

/**
 * Badge WDS: label berbentuk pil. Style (warna) dari token "Badge styles"; tipe (dot, counter, x close,
 * icon left/right/only) lewat props. Ukuran dari token Size.
 */
function Badge({
  variant = 'info',
  size = 'md',
  dot = false,
  counter,
  leadingIcon,
  trailingIcon,
  onRemove,
  iconOnly = false,
  children,
  className = '',
  testId,
  'aria-label': ariaLabel,
}: BadgeProps) {
  const hasCounter = counter !== undefined && counter !== null && counter !== false && counter !== '';
  return (
    <span
      data-testid={testId}
      data-style={variant === 'custom' ? undefined : STYLE_OF[variant]}
      data-wds-size={size}
      data-counter={hasCounter ? 'true' : undefined}
      data-icon-only={iconOnly ? 'true' : undefined}
      aria-label={ariaLabel}
      className={['wds-badge', className].filter(Boolean).join(' ')}
    >
      {dot && <span className="wds-badge__dot" aria-hidden="true" />}
      {leadingIcon && <span className="wds-badge__icon">{leadingIcon}</span>}
      {!iconOnly && children}
      {!iconOnly && trailingIcon && <span className="wds-badge__icon">{trailingIcon}</span>}
      {!iconOnly && hasCounter && <span className="wds-badge__counter">{counter}</span>}
      {!iconOnly && onRemove && (
        <button type="button" aria-label="Remove" className="wds-badge__remove" onClick={onRemove}>
          <Cross />
        </button>
      )}
    </span>
  );
}

export default Badge;
