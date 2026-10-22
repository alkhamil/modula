import { type AnchorHTMLAttributes, type ReactNode } from 'react';

interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className'> {
  /** Style WDS (Link styles): default | underline. */
  appearance?: 'default' | 'underline';
  disabled?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  children?: ReactNode;
  className?: string;
  testId?: string;
}

/** Link WDS: tautan teks dengan ikon opsional. Untuk rute internal, bungkus dengan `NavLink`/`Link` router. */
function Link({
  appearance = 'default',
  disabled = false,
  leadingIcon,
  trailingIcon,
  children,
  className = '',
  testId,
  ...rest
}: LinkProps) {
  return (
    <a
      {...rest}
      data-testid={testId}
      data-appearance={appearance}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : rest.tabIndex}
      onClick={disabled ? (e) => e.preventDefault() : rest.onClick}
      className={`wds-link ${className}`}
    >
      {leadingIcon}
      {children}
      {trailingIcon}
    </a>
  );
}

export default Link;
