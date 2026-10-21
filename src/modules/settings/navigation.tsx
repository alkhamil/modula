import { SlidersHorizontal } from 'lucide-react';
import type { ModuleNavEntry } from '../../shared/types/navigation';

export const settingsNav: ModuleNavEntry = {
  icon: <SlidersHorizontal className="h-5 w-5" />,
  item: {
    label: 'Settings',
    labelKey: 'settings.title',
    path: '/settings',
    permissionKey: 'settings.view',
  },
};
