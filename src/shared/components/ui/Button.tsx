import { type ButtonHTMLAttributes, type ReactNode } from 'react';

/** Hierarchy tombol WDS (token koleksi "Button hierarchy"). */
export type ButtonHierarchy = 'primary' | 'secondary' | 'tertiary' | 'text' | 'tonal' | 'elevated';
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'custom';

interface ButtonBaseProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  /** Ukuran WDS (token Size): xs | sm | md | lg | xl. */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Hierarchy WDS; bila diisi menimpa pemetaan dari `variant`. */
  hierarchy?: ButtonHierarchy;
  /** Gaya destruktif (merah) untuk hierarchy mana pun; `variant="danger"` otomatis true. */
  destructive?: boolean;
  /** Bentuk: `box` (radius token) atau `rounded` (pill). */
  shape?: 'box' | 'rounded';
  /** Tombol ikon saja (Figma "Show icons": only): isi lewat `leadingIcon`/`icon`, `children` diabaikan. */
  iconOnly?: boolean;
  /** Ikon sebelum label (Figma "Show icons": leading). */
  leadingIcon?: ReactNode;
  /** Ikon setelah label (Figma "Show icons": trailing; keduanya = both). */
  trailingIcon?: ReactNode;
  /** Pintasan lama: satu ikon, posisi lewat `iconPosition` (ekuivalen `leadingIcon`/`trailingIcon`). */
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  children?: ReactNode;
  testId?: string;
}

type ButtonProps =
  | (ButtonBaseProps & { variant?: Exclude<ButtonVariant, 'custom'>; className?: string })
  | (ButtonBaseProps & { variant: 'custom'; className: string });

/** `variant` lama → hierarchy WDS (+ destructive untuk `danger`). */
const VARIANT_MAP: Record<Exclude<ButtonVariant, 'custom'>, { hierarchy: ButtonHierarchy; destructive: boolean }> = {
  primary: { hierarchy: 'primary', destructive: false },
  secondary: { hierarchy: 'secondary', destructive: false },
  danger: { hierarchy: 'primary', destructive: true },
};

/**
 * Button WDS. Warna/state (hover, pressed, focus, disabled) dan ukuran datang dari
 * token (`tokens/tokens.json` → `theme/wds/*.generated.css`); komponen hanya
 * menetapkan atribut data. `variant="custom"` melewati warna WDS (hanya layout/ukuran),
 * warna dari `className`.
 */
function Button({
  variant = 'primary',
  hierarchy,
  destructive,
  shape = 'box',
  iconOnly = false,
  size = 'md',
  leadingIcon,
  trailingIcon,
  icon,
  iconPosition = 'left',
  children,
  className = '',
  disabled,
  testId,
  ...rest
}: ButtonProps) {
  const mapped = variant === 'custom' ? null : VARIANT_MAP[variant];
  const resolvedHierarchy = hierarchy ?? mapped?.hierarchy;
  const isDestructive = destructive ?? mapped?.destructive ?? false;
  const leading = leadingIcon ?? (icon && iconPosition === 'left' ? icon : undefined);
  const trailing = trailingIcon ?? (icon && iconPosition === 'right' ? icon : undefined);
  return (
    <button
      data-testid={testId}
      data-wds-size={size}
      data-hierarchy={resolvedHierarchy}
      data-destructive={resolvedHierarchy ? String(isDestructive) : undefined}
      data-shape={shape}
      data-icon-only={iconOnly ? 'true' : undefined}
      className={['wds-btn', className].filter(Boolean).join(' ')}
      disabled={disabled}
      {...rest}
    >
      {iconOnly ? (leading ?? trailing) : leading}
      {!iconOnly && children}
      {!iconOnly && trailing}
    </button>
  );
}

export default Button;
