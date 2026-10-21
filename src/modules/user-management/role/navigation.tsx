import { Users } from 'lucide-react';
import type { ModuleNavEntry } from '../../../shared/types/navigation';

export const roleNav: ModuleNavEntry = {
  parent: {
    key: 'user-management',
    label: 'User Management',
    labelKey: 'user.navGroup',
    icon: <Users className="h-5 w-5" />,
  },
  icon: <Users className="h-5 w-5" />,
  item: {
    label: 'Roles',
    labelKey: 'role.labelPlural',
    path: '/user-management/role',
    permissionKey: 'master-role.view',
  },
};
