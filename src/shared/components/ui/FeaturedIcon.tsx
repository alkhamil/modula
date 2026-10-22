import type { ReactNode } from 'react';

interface FeaturedIconProps {
  icon: ReactNode;
  /** Style WDS (Featured icon styles): primary-light | primary-dark | gray-light. */
  appearance?: 'primary-light' | 'primary-dark' | 'gray-light';
  /** Bentuk (Featured icon shape): circle | square. */
  shape?: 'circle' | 'square';
  className?: string;
  testId?: string;
}

/** Featured Icon WDS: ikon dalam wadah berwarna (lingkaran / kotak membulat). */
function FeaturedIcon({ icon, appearance = 'primary-light', shape = 'circle', className = '', testId }: FeaturedIconProps) {
  return (
    <span
      data-testid={testId}
      data-appearance={appearance}
      data-shape={shape}
      className={`wds-featured-icon ${className}`}
    >
      {icon}
    </span>
  );
}

export default FeaturedIcon;
