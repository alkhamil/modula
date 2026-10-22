import type { ReactNode } from 'react';

interface AvatarProps {
  /** Nama untuk inisial (huruf pertama). Diabaikan bila `icon`/`src` ada. */
  name?: string;
  /** Gambar profil. */
  src?: string;
  /** Ikon pengganti inisial. */
  icon?: ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Style WDS (Avatar styles): default (lingkaran) | rounded (kotak membulat). */
  appearance?: 'default' | 'rounded';
  /** Indikator online. */
  online?: boolean;
  className?: string;
  testId?: string;
}

/** Avatar WDS: inisial, ikon, atau gambar dengan indikator online opsional. */
function Avatar({
  name,
  src,
  icon,
  size = 'md',
  appearance = 'default',
  online = false,
  className = '',
  testId,
}: AvatarProps) {
  const initial = name ? name.trim().charAt(0).toUpperCase() : '';
  return (
    <span
      data-testid={testId}
      data-size={size}
      data-appearance={appearance}
      className={`wds-avatar ${className}`}
    >
      {src ? (
        <img src={src} alt={name ?? ''} className="wds-avatar__img" />
      ) : icon ? (
        <span className="wds-avatar__icon">{icon}</span>
      ) : (
        <span className="wds-avatar__initials">{initial}</span>
      )}
      {online && <span className="wds-avatar__online" />}
    </span>
  );
}

export default Avatar;
