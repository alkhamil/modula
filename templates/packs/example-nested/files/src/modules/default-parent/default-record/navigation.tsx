import { WdsIcon } from '../../../shared/components/icons';
import type { ModuleNavEntry } from '../../../shared/types/navigation';

export const defaultRecordNav: ModuleNavEntry = {
  parent: {
    key: 'default-parent',
    label: 'Default Parent',
    labelKey: 'default_record.parentLabel',
    icon: <WdsIcon name="Layers" className="h-5 w-5" />,
  },
  icon: <WdsIcon name="Layers" className="h-5 w-5" />,
  item: {
    label: 'Default Records',
    labelKey: 'default_record.labelPlural',
    path: '/default-parent/default-records',
    permissionKey: 'default_record.view',
  },
};
