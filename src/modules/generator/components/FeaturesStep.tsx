import type { FeatureKey } from '../types';
import { featureRegistry } from '../registry';

interface FeaturesStepProps {
  value: Record<FeatureKey, boolean>;
  onChange: (value: Record<FeatureKey, boolean>) => void;
}

const GROUPS: { title: string; keys: FeatureKey[] }[] = [
  { title: 'Halaman', keys: ['list', 'detail', 'create', 'edit', 'delete'] },
  { title: 'Data', keys: ['bulkUpload', 'export'] },
];

function FeaturesStep({ value, onChange }: FeaturesStepProps) {
  return (
    <div className="flex flex-col stack-gap">
      {GROUPS.map((group) => (
        <div key={group.title}>
          <p className="mb-2 text-sm font-medium text-foreground">{group.title}</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {group.keys.map((key) => {
              const active = value[key];
              return (
                <div
                  key={key}
                  role="checkbox"
                  aria-checked={active}
                  aria-label={featureRegistry[key].label}
                  tabIndex={0}
                  data-testid={`feature-tile-${key}`}
                  onClick={() => onChange({ ...value, [key]: !active })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onChange({ ...value, [key]: !active });
                    }
                  }}
                  className={[
                    'flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
                    active ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50',
                  ].join(' ')}
                >
                  <span
                    aria-hidden="true"
                    className={[
                      'mt-0.5 flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors',
                      active ? 'justify-end bg-primary' : 'justify-start bg-muted',
                    ].join(' ')}
                  >
                    <span className="h-3.5 w-3.5 rounded-full bg-white shadow" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-foreground">
                      {featureRegistry[key].label}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {featureRegistry[key].description}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default FeaturesStep;
