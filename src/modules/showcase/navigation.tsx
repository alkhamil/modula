import { Database } from 'lucide-react';
import type { ModuleNavEntry } from '../../shared/types/navigation';

const parent: ModuleNavEntry['parent'] = {
  key: 'components',
  label: 'Component',
  labelKey: 'nav.components',
  icon: <Database className="h-5 w-5" />,
};

/** Tiga halaman showcase berbagi satu group menu "Component". */
export const showcaseNav: ModuleNavEntry[] = [
  { parent, icon: parent.icon, item: { label: 'Typography', labelKey: 'nav.typography', path: '/components/typography' } },
  { parent, icon: parent.icon, item: { label: 'Colors', labelKey: 'nav.colors', path: '/components/colors' } },
  { parent, icon: parent.icon, item: { label: 'UI', labelKey: 'nav.ui', path: '/components/ui' } },
];
