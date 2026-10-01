interface Props {
  className?: string;
}

function ConfirmErrorIcon({ className = 'h-4 w-4' }: Props) {
  return (
    <svg
      className={className}
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" rx="24" fill="color-mix(in srgb, var(--theme-warning) 20%, transparent)" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.8141 32.4368H31.1971C32.7791 32.4368 33.7721 30.7267 32.9861 29.3527L25.8001 16.7878C25.0091 15.4048 23.0151 15.4038 22.2231 16.7868L15.0251 29.3518C14.2391 30.7258 15.2311 32.4368 16.8141 32.4368Z"
        stroke="var(--theme-warning)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24.0027 25.4145V22.3145"
        stroke="var(--theme-warning)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M23.995 28.5H24.005"
        stroke="var(--theme-warning)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default ConfirmErrorIcon;
