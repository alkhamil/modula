import type { ReactNode } from 'react';

interface IconWrapperProps {
  children: ReactNode;
  /** Ukuran sisi dalam px (default 20). */
  size?: number;
  className?: string;
  testId?: string;
}

/** Icon Wrapper WDS: menyeragamkan ukuran dan warna ikon (icons.primary). */
function IconWrapper({ children, size = 20, className = '', testId }: IconWrapperProps) {
  return (
    <span
      data-testid={testId}
      style={{ ['--iw-size' as string]: `${size}px` }}
      className={`wds-icon-wrapper ${className}`}
    >
      {children}
    </span>
  );
}

export default IconWrapper;
