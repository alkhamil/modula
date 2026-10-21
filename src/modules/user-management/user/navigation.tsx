import { Users } from 'lucide-react';
import type { ModuleNavEntry } from '../../../shared/types/navigation';

export const userNav: ModuleNavEntry = {
  parent: {
    key: 'user-management',
    label: 'User Management',
    labelKey: 'user.navGroup',
    icon: <Users className="h-5 w-5" />,
  },
  icon: <Users className="h-5 w-5" />,
  item: {
    label: 'Users',
    labelKey: 'user.labelPlural',
    path: '/user-management/user',
    permissionKey: 'master-user.view',
  },
};
