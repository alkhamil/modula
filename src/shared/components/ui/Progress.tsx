interface ProgressProps {
  /** Nilai 0–100 (diabaikan saat `indeterminate`). */
  value?: number;
  /** Mode indeterminate: bar bergerak tanpa nilai. */
  indeterminate?: boolean;
  /** Style WDS (Progress styles): default | success | danger. */
  appearance?: 'default' | 'success' | 'danger';
  /** Ukuran WDS (token Size): xs | sm | md | lg | xl. */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Tampilkan label persen di kanan track. */
  showLabel?: boolean;
  'aria-label'?: string;
  className?: string;
  testId?: string;
}

/** Progress Indicator linear WDS: determinate atau indeterminate. */
function Progress({
  value = 0,
  indeterminate = false,
  appearance = 'default',
  size = 'md',
  showLabel = false,
  'aria-label': ariaLabel,
  className = '',
  testId,
}: ProgressProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      data-testid={testId}
      data-appearance={appearance}
      data-wds-size={size}
      data-indeterminate={indeterminate || undefined}
      className={`wds-progress ${className}`}
    >
      <div
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={ariaLabel}
        className="wds-progress__track"
      >
        <div className="wds-progress__bar" style={indeterminate ? undefined : { width: `${clamped}%` }} />
      </div>
      {showLabel && !indeterminate && <span className="wds-progress__label">{Math.round(clamped)}%</span>}
    </div>
  );
}

export default Progress;
