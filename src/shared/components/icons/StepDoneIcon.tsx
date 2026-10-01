interface Props {
  className?: string;
  testId?: string;
}

function StepDoneIcon({ className = 'h-8 w-8', testId }: Props) {
  return (
    <svg
      data-testid={testId}
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="32" height="32" rx="16" fill="color-mix(in srgb, var(--theme-primary) 25%, transparent)" />
      <path
        d="M21.0001 13L14 20L11 17"
        stroke="var(--theme-primary)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default StepDoneIcon;
