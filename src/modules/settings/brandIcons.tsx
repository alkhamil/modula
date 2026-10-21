import { Bolt, Box, Camera, Command, Database, Global, Layers, Planet } from '../../shared/components/icons';
import type { IconComponent } from '../../shared/components/icons';

/** Ikon brand yang bisa dipilih untuk sidebar (nama = kunci tersimpan di pengaturan). */
export const BRAND_ICONS: { name: string; Icon: IconComponent }[] = [
  { name: 'Box', Icon: Box },
  { name: 'Command', Icon: Command },
  { name: 'Layers', Icon: Layers },
  { name: 'Hexagon', Icon: Planet },
  { name: 'Aperture', Icon: Camera },
  { name: 'Globe', Icon: Global },
  { name: 'Zap', Icon: Bolt },
  { name: 'Database', Icon: Database },
];

export function BrandIcon({ name, className }: { name: string; className?: string }) {
  const found = BRAND_ICONS.find((item) => item.name === name);
  const Icon = found ? found.Icon : Box;
  return <Icon className={className} />;
}
