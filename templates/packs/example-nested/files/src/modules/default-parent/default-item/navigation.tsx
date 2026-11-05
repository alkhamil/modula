import { WdsIcon } from '../../../shared/components/icons';
import type { ModuleNavEntry } from '../../../shared/types/navigation';

export const defaultItemNav: ModuleNavEntry = {
  parent: {
    key: 'default-parent',
    label: 'Default Parent',
    labelKey: 'default_item.parentLabel',
    icon: <WdsIcon name="Box" className="h-5 w-5" />,
  },
  icon: <WdsIcon name="Box" className="h-5 w-5" />,
  item: {
    label: 'Default Items',
    labelKey: 'default_item.labelPlural',
    path: '/default-parent/default-items',
    permissionKey: 'default_item.view',
  },
};
