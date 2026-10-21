import { Widget } from '../../shared/components/icons';
import type { ModuleNavEntry } from '../../shared/types/navigation';

export const dashboardNav: ModuleNavEntry = {
  icon: <Widget className="h-5 w-5" />,
  item: { label: 'Dashboard', labelKey: 'nav.dashboard', path: '/' },
};
