import { LayoutDashboard } from 'lucide-react';
import type { ModuleNavEntry } from '../../shared/types/navigation';

export const dashboardNav: ModuleNavEntry = {
  icon: <LayoutDashboard className="h-5 w-5" />,
  item: { label: 'Dashboard', labelKey: 'nav.dashboard', path: '/' },
};
