interface ProgressProps {
  /** Nilai 0–100. */
  value: number;
  /** Style WDS (Progress styles): default | success | danger. */
  appearance?: 'default' | 'success' | 'danger';
  /** Tampilkan label persen di kanan track. */
  showLabel?: boolean;
  'aria-label'?: string;
  className?: string;
  testId?: string;
}

/** Progress Indicator linear WDS. */
function Progress({
  value,
  appearance = 'default',
  showLabel = false,
  'aria-label': ariaLabel,
  className = '',
  testId,
}: ProgressProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div data-testid={testId} data-appearance={appearance} className={`wds-progress ${className}`}>
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={ariaLabel}
        className="wds-progress__track"
      >
        <div className="wds-progress__bar" style={{ width: `${clamped}%` }} />
      </div>
      {showLabel && <span className="wds-progress__label">{Math.round(clamped)}%</span>}
    </div>
  );
}

export default Progress;
