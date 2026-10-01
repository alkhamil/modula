interface Props {
  className?: string;
}

function ConfirmSuccessIcon({ className = 'h-4 w-4' }: Props) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="24" fill="color-mix(in srgb, var(--theme-success) 20%, transparent)" />
      <path
        opacity="0.4"
        d="M34 24C34 29.524 29.523 34 24 34C18.477 34 14 29.524 14 24C14 18.478 18.477 14 24 14C29.523 14 34 18.478 34 24Z"
        fill="var(--theme-success)"
      />
      <path
        d="M27.6429 22L22.6429 27L20.5 24.8571"
        stroke="var(--theme-success)"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

export default ConfirmSuccessIcon;
