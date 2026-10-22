import type { ReactNode } from 'react';

interface LabelTextProps {
  children: ReactNode;
  /** Bobot teks (Label text modes): regular | medium | semibold. */
  weight?: 'regular' | 'medium' | 'semibold';
  /** Ukuran WDS (token Size): xs | sm | md | lg | xl. */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Tanda wajib `*`. */
  required?: boolean;
  /** Ikon / bantuan di akhir label. */
  trailing?: ReactNode;
  htmlFor?: string;
  className?: string;
  testId?: string;
}

/** Label Text WDS: label field dengan tanda wajib dan slot ikon. */
function LabelText({
  children,
  weight = 'medium',
  size = 'md',
  required = false,
  trailing,
  htmlFor,
  className = '',
  testId,
}: LabelTextProps) {
  return (
    <label htmlFor={htmlFor} data-testid={testId} data-weight={weight} data-wds-size={size} className={`wds-label-text ${className}`}>
      {children}
      {trailing && <span className="wds-label-text__icon">{trailing}</span>}
      {required && <span className="wds-label-text__mandatory">*</span>}
    </label>
  );
}

export default LabelText;
