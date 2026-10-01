interface Props {
  className?: string;
}

function LineSidebarIcon({ className }: Props) {
  return (
    <svg className={className} fill="none" viewBox="0 0 368 180">
      <path
        d="M0.508545 121.466C39.6161 144.568 79.8353 168.657 118.919 176.2C202.601 192.349 284.878 131.648 358.213 167.494M23.4966 0.760986C66.6379 37.5362 109.72 84.2148 159.572 103.468C224.709 128.625 304.037 106.79 367.411 119.2"
        stroke="white"
        strokeOpacity="0.12"
        strokeWidth="1"
      />
    </svg>
  );
}

export default LineSidebarIcon;