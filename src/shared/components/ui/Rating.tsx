import { useState } from 'react';

interface RatingProps {
  value: number;
  /** Tanpa `onChange` komponen hanya-baca. */
  onChange?: (value: number) => void;
  max?: number;
  /** Ukuran WDS (token Size): xs | sm | md | lg | xl. */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  testId?: string;
  'aria-label'?: string;
}

const STAR =
  'M12 2.5l2.94 5.96 6.58.96-4.76 4.64 1.12 6.55L12 17.52l-5.88 3.09 1.12-6.55L2.48 9.42l6.58-.96L12 2.5z';

/** Rating bintang WDS; interaktif bila `onChange` diberikan. */
function Rating({ value, onChange, max = 5, size = 'md', className = '', testId, 'aria-label': ariaLabel }: RatingProps) {
  const [hover, setHover] = useState<number | null>(null);
  const shown = hover ?? value;
  const interactive = !!onChange;
  return (
    <div
      role={interactive ? 'radiogroup' : 'img'}
      aria-label={ariaLabel ?? `${value} / ${max}`}
      data-testid={testId}
      data-wds-size={size}
      className={`wds-rating ${className}`}
      onMouseLeave={() => setHover(null)}
    >
      {Array.from({ length: max }, (_, i) => {
        const n = i + 1;
        const star = (
          <svg viewBox="0 0 24 24" aria-hidden="true" data-filled={n <= shown || undefined}>
            <path d={STAR} />
          </svg>
        );
        return interactive ? (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={n === value}
            aria-label={`${n}`}
            onClick={() => onChange(n === value ? 0 : n)}
            onMouseEnter={() => setHover(n)}
            className="wds-rating__star"
          >
            {star}
          </button>
        ) : (
          <span key={n} className="wds-rating__star">
            {star}
          </span>
        );
      })}
    </div>
  );
}

export default Rating;
