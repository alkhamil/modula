import type { ReactNode } from 'react';

interface LabelTextProps {
  children: ReactNode;
  /** Bobot teks (Label text modes): regular | medium | semibold. */
  weight?: 'regular' | 'medium' | 'semibold';
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
  required = false,
  trailing,
  htmlFor,
  className = '',
  testId,
}: LabelTextProps) {
  return (
    <label htmlFor={htmlFor} data-testid={testId} data-weight={weight} className={`wds-label-text ${className}`}>
      {children}
      {required && <span className="wds-label-text__mandatory">*</span>}
      {trailing && <span className="wds-label-text__icon">{trailing}</span>}
    </label>
  );
}

export default LabelText;
