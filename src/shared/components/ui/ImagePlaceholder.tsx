import { Gallery } from '../icons';

interface ImagePlaceholderProps {
  src?: string;
  alt?: string;
  /** Style WDS (Image styles): default | rounded. */
  appearance?: 'default' | 'rounded';
  width?: number | string;
  height?: number | string;
  className?: string;
  testId?: string;
}

/** Image WDS: gambar dengan placeholder bergaya WDS saat `src` kosong. */
function ImagePlaceholder({
  src,
  alt = '',
  appearance = 'default',
  width = '100%',
  height = 160,
  className = '',
  testId,
}: ImagePlaceholderProps) {
  return (
    <div
      data-testid={testId}
      data-appearance={appearance}
      style={{ width, height }}
      className={`wds-image ${className}`}
    >
      {src ? <img src={src} alt={alt} className="wds-image__img" /> : <Gallery className="wds-image__icon" />}
    </div>
  );
}

export default ImagePlaceholder;
