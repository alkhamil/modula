import { CheckboxField } from '../../../shared/components/ui';
import type { FeatureKey } from '../types';
import { featureKeys, featureRegistry } from '../registry';

interface FeaturesStepProps {
  value: Record<FeatureKey, boolean>;
  onChange: (value: Record<FeatureKey, boolean>) => void;
}

function FeaturesStep({ value, onChange }: FeaturesStepProps) {
  return (
    <div className="rounded-lg border border-border">
      {featureKeys.map((key) => (
        <div
          key={key}
          className="flex items-start gap-3 border-b border-border px-4 py-3 last:border-b-0"
        >
          <div className="pt-0.5">
            <CheckboxField
              value={value[key]}
              onChange={(checked) => onChange({ ...value, [key]: checked })}
              checkboxLabel={featureRegistry[key].label}
            />
          </div>
          <p className="flex-1 text-sm text-muted-foreground">{featureRegistry[key].description}</p>
        </div>
      ))}
    </div>
  );
}

export default FeaturesStep;
