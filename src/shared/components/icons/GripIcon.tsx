interface Props {
  className?: string;
}

function GripIcon({ className = 'h-4 w-4' }: Props) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <circle cx="5.5" cy="3.5" r="1.3" />
      <circle cx="10.5" cy="3.5" r="1.3" />
      <circle cx="5.5" cy="8" r="1.3" />
      <circle cx="10.5" cy="8" r="1.3" />
      <circle cx="5.5" cy="12.5" r="1.3" />
      <circle cx="10.5" cy="12.5" r="1.3" />
    </svg>
  );
}

export default GripIcon;
