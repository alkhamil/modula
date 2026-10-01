interface Props {
  className?: string;
}

function SuccessIcon({ className = 'h-4 w-4' }: Props) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path opacity="0.4" d="M20 10C20 15.524 15.523 20 10 20C4.477 20 0 15.524 0 10C0 4.478 4.477 0 10 0C15.523 0 20 4.478 20 10Z" fill="var(--theme-success)" />
      <path d="M6 10.5L9 13.5L14.5 7" stroke="var(--theme-success)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default SuccessIcon;
