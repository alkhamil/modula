interface Props {
  className?: string;
}

function ChevronSingleRightIcon({ className = 'h-4 w-4' }: Props) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
    </svg>
  );
}

export default ChevronSingleRightIcon;
