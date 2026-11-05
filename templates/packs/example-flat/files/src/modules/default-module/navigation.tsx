import { WdsIcon } from '../../shared/components/icons';
import type { ModuleNavEntry } from '../../shared/types/navigation';

export const defaultModuleNav: ModuleNavEntry = {
  icon: <WdsIcon name="Box" className="h-5 w-5" />,
  item: {
    label: 'Default Modules',
    labelKey: 'default_module.labelPlural',
    path: '/default-modules',
    permissionKey: 'default_module.view',
  },
};
