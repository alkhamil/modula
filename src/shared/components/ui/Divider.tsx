interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  /** Style WDS (Divider styles): subtle | default | strong. */
  appearance?: 'subtle' | 'default' | 'strong';
  className?: string;
  testId?: string;
}

/** Garis pemisah WDS. */
function Divider({
  orientation = 'horizontal',
  appearance = 'subtle',
  className = '',
  testId,
}: DividerProps) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      data-testid={testId}
      data-orientation={orientation}
      data-appearance={appearance}
      className={`wds-divider ${className}`}
    />
  );
}

export default Divider;
