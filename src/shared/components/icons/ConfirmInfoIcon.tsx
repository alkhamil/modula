interface Props {
  className?: string;
}

function ConfirmInfoIcon({ className = 'h-4 w-4' }: Props) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="24" fill="color-mix(in srgb, var(--theme-info) 20%, transparent)" />
      <path
        opacity="0.4"
        d="M34 23.9998C34 29.5238 29.523 33.9998 24 33.9998C18.477 33.9998 14 29.5238 14 23.9998C14 18.4778 18.477 13.9998 24 13.9998C29.523 13.9998 34 18.4778 34 23.9998Z"
        fill="var(--theme-info)"
      />
      <path
        d="M23.9951 21.0858C24.4881 21.0858 24.8799 20.6927 24.8799 20.2108C24.8799 19.7288 24.4879 19.3358 24.0049 19.3358C23.52 19.3359 23.125 19.7288 23.125 20.2108C23.125 20.6927 23.5161 21.0858 23.9951 21.0858ZM23.9951 28.6785C24.4771 28.6785 24.8701 28.2855 24.8701 27.8035V23.3836C24.8701 22.9016 24.4771 22.5086 23.9951 22.5086C23.5131 22.5086 23.1201 22.9016 23.1201 23.3836V27.8035C23.1201 28.2855 23.5131 28.6785 23.9951 28.6785Z"
        fill="var(--theme-info)"
      />
    </svg>
  );
}

export default ConfirmInfoIcon
