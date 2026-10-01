interface Props {
  className?: string;
  testId?: string;
}

function StepOutGoingIcon({ className = 'h-8 w-8', testId }: Props) {
  return (
    <svg
      data-testid={testId}
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="32" height="32" rx="16" fill="var(--theme-muted)" />
      <rect x="8.5" y="8.5" width="15" height="15" rx="7.5" stroke="var(--theme-border)" />
      <circle cx="16" cy="16" r="5" fill="var(--theme-muted-foreground)" />
    </svg>
  );
}

export default StepOutGoingIcon;
