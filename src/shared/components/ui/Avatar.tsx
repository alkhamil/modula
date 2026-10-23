import type { ReactNode } from 'react';
import { User } from '../icons';

interface AvatarProps {
  /** Nama untuk inisial (huruf pertama dari dua kata pertama, mis. "OR"). */
  name?: string;
  /** Gambar profil (Figma Type: Photo). */
  src?: string;
  /** Ikon di dalam avatar (Figma Type: Icons). */
  icon?: ReactNode;
  /** Paksa tipe konten (Figma "Type"): photo | initials | icon. Default: dari `src` / `icon` / `name`. */
  type?: 'photo' | 'initials' | 'icon';
  /** Ukuran WDS (token Size): xs 36 | sm 40 | md 44 | lg 48 | xl 52 px. */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Style WDS (Avatar styles): default (kotak membulat) | rounded (lingkaran). */
  appearance?: 'default' | 'rounded';
  /** Indikator online (Figma "Online indicator"). */
  online?: boolean;
  className?: string;
  testId?: string;
}

function initialsOf(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('');
}

/** Avatar WDS: foto, inisial, atau ikon dengan indikator online opsional. */
function Avatar({
  name,
  src,
  icon,
  type,
  size = 'md',
  appearance = 'default',
  online = false,
  className = '',
  testId,
}: AvatarProps) {
  const kind = type ?? (src ? 'photo' : icon ? 'icon' : 'initials');
  return (
    <span
      data-testid={testId}
      data-wds-size={size}
      data-appearance={appearance}
      className={`wds-avatar ${className}`}
    >
      {kind === 'photo' && src ? (
        <img src={src} alt={name ?? ''} className="wds-avatar__img" />
      ) : kind === 'icon' ? (
        <span className="wds-avatar__icon">{icon ?? <User />}</span>
      ) : (
        <span className="wds-avatar__initials">{name ? initialsOf(name) : ''}</span>
      )}
      {online && <span className="wds-avatar__online" />}
    </span>
  );
}

export default Avatar;
