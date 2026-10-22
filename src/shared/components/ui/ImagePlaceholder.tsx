export type ImageRatio = '1:1' | '16:9' | '4:3' | '3:2' | '2:1' | '5:2' | '3:4' | '2:3' | '1:2';

interface ImagePlaceholderProps {
  src?: string;
  alt?: string;
  /** Style WDS (Image styles): default | rounded. */
  appearance?: 'default' | 'rounded';
  /** Rasio (Figma "Ratio"); dipakai bila `height` tidak diisi. */
  ratio?: ImageRatio;
  width?: number | string;
  /** Tinggi tetap; menimpa `ratio`. */
  height?: number | string;
  className?: string;
  testId?: string;
}

/** Image / Placeholder WDS: blok abu dengan rasio preset; tampil sebagai gambar bila `src` diisi. */
function ImagePlaceholder({
  src,
  alt = '',
  appearance = 'default',
  ratio = '1:1',
  width = '100%',
  height,
  className = '',
  testId,
}: ImagePlaceholderProps) {
  return (
    <div
      data-testid={testId}
      data-appearance={appearance}
      style={{ width, height, aspectRatio: height === undefined ? ratio.replace(':', ' / ') : undefined }}
      className={`wds-image ${className}`}
    >
      {src && <img src={src} alt={alt} className="wds-image__img" />}
    </div>
  );
}

export default ImagePlaceholder;
