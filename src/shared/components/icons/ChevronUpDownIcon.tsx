interface Props {
  className?: string;
  testId?: string;
}

function ChevronUpDownIcon({ className = 'h-4 w-4', testId }: Props) {
  return (
    <svg
      data-testid={testId}
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4M8 15l4 4 4-4" />
    </svg>
  );
}

export default ChevronUpDownIcon;
