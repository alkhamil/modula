import type { ComponentType, SVGProps } from 'react';

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'ref'> {
  /** Lebar & tinggi (default 24); kelas `h-*`/`w-*` tetap menimpa. */
  size?: number | string;
}

export type IconComponent = ComponentType<IconProps>;

/**
 * Buat komponen ikon dari isi SVG (`markup`, warna sudah `currentColor`) —
 * ukuran lewat `size`/`className`, warna ikut `text-*`.
 */
export function createIcon(name: string, markup: string): IconComponent {
  function Icon({ size = 24, ...props }: IconProps) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        focusable="false"
        {...props}
        dangerouslySetInnerHTML={{ __html: markup }}
      />
    );
  }
  Icon.displayName = name;
  return Icon;
}
