import type { ReactNode } from 'react';

interface ScrollAreaProps {
  children: ReactNode;
  /** Style WDS (Scrollbar styles): default | grey | outline. */
  appearance?: 'default' | 'grey' | 'outline';
  /** Tinggi maksimum area (px / CSS length). */
  maxHeight?: number | string;
  className?: string;
  testId?: string;
}

/** Scroll Area WDS: kontainer dengan scrollbar custom (track/thumb sesuai token Scrollbar). */
function ScrollArea({ children, appearance = 'default', maxHeight = 200, className = '', testId }: ScrollAreaProps) {
  return (
    <div
      tabIndex={0}
      data-testid={testId}
      data-appearance={appearance}
      style={{ maxHeight }}
      className={`wds-scroll ${className}`}
    >
      {children}
    </div>
  );
}

export default ScrollArea;
