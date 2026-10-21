import { useEffect, useState } from 'react';
import type { IconComponent, IconProps } from './createIcon';
import { wdsIconCategory } from './names';

type CategoryModule = Record<string, IconComponent>;

/** Gaya ikon WDS: `outline` (default) atau `bold-duotone`. */
export type WdsIconVariant = 'outline' | 'bold-duotone';

// Satu chunk per style + kategori, dimuat saat dibutuhkan.
const loaders = import.meta.glob<CategoryModule>('./wds/*/*.tsx');
const cache = new Map<string, IconComponent>();

async function loadIcon(name: string, variant: WdsIconVariant): Promise<IconComponent | undefined> {
  const key = `${variant}:${name}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const category = wdsIconCategory(name);
  const load = category ? loaders[`./wds/${variant}/${category}.tsx`] : undefined;
  const Icon = load ? (await load())[name] : undefined;
  if (Icon) cache.set(key, Icon);
  return Icon;
}

interface WdsIconProps extends Omit<IconProps, 'name'> {
  /** Nama ikon WDS PascalCase (mis. `Database`). */
  name?: string | null;
  /** Nama ikon bila `name` kosong/tak dikenal. */
  fallback?: string;
  /** Gaya ikon (default `outline`). */
  variant?: WdsIconVariant;
}

/**
 * Ikon WDS menurut nama (dinamis) — untuk nama yang baru diketahui saat
 * runtime (ikon menu dari definisi, picker). Pemakaian statis cukup
 * `import { Pen } from 'shared/components/icons'`.
 */
function WdsIcon({ name, fallback = 'Database', variant = 'outline', ...props }: WdsIconProps) {
  const wanted = name?.trim() || fallback;
  const target = wdsIconCategory(wanted) ? wanted : fallback;
  const [Icon, setIcon] = useState<IconComponent | undefined>(() => cache.get(`${variant}:${target}`));

  useEffect(() => {
    let active = true;
    const hit = cache.get(`${variant}:${target}`);
    if (hit) {
      setIcon(() => hit);
      return;
    }
    void loadIcon(target, variant).then((loaded) => {
      if (active && loaded) setIcon(() => loaded);
    });
    return () => {
      active = false;
    };
  }, [target, variant]);

  if (!Icon) return <span aria-hidden="true" className={props.className} />;
  return <Icon {...props} />;
}

export default WdsIcon;
