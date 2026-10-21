import { Tuning2 } from '../../shared/components/icons';
import type { ModuleNavEntry } from '../../shared/types/navigation';

export const settingsNav: ModuleNavEntry = {
  icon: <Tuning2 className="h-5 w-5" />,
  item: {
    label: 'Settings',
    labelKey: 'settings.title',
    path: '/settings',
    permissionKey: 'settings.view',
  },
};
