import { Settings } from 'lucide-react';
import type { ModuleNavEntry } from '../../shared/types/navigation';

export const generatorNav: ModuleNavEntry = {
  icon: <Settings className="h-5 w-5" />,
  item: { label: 'Generator', labelKey: 'nav.generator', path: '/generator' },
};
