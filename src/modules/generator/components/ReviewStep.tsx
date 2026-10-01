import { useMemo } from 'react';
import { Alert, Badge } from '../../../shared/components/ui';
import type { FeatureKey, GeneratorConfig } from '../types';
import type { ModuleLayout } from '../definitions';
import { configToDefinition, validateDefinition } from '../definitions';
import { featureRegistry, filterCriteriaRegistry } from '../registry';

interface ReviewStepProps {
  config: GeneratorConfig;
  layout: ModuleLayout | null;
}

function ReviewStep({ config, layout }: ReviewStepProps) {
  const preview = useMemo(
    () => configToDefinition(config, { status: 'draft', layout: layout ?? undefined }),
    [config, layout],
  );
  const issues = useMemo(() => validateDefinition(preview), [preview]);
  const features = (Object.keys(preview.features) as FeatureKey[]).filter(
    (key) => preview.features[key],
  );
  const formOrder = new Map(preview.layout.form.map((item) => [item.field, item]));
  const tableOrder = new Map(
    preview.layout.table.order.map((name, index) => [name, index] as const),
  );
  const tableHidden = new Set(preview.layout.table.hidden);

  return (
    <div className="flex flex-col stack-gap">
      {issues.length > 0 && (
        <Alert
          variant="error"
          message={
            <ul className="list-disc pl-5">
              {issues.map((issue) => (
                <li key={issue.path}>
                  <span className="font-mono">{issue.path}</span>: {issue.message}
                </li>
              ))}
            </ul>
          }
        />
      )}

      <dl className="grid grid-cols-[160px_1fr] gap-y-2 text-sm">
        <dt className="text-muted-foreground">Module</dt>
        <dd className="font-medium text-foreground">
          {preview.singularLabel} ({preview.label})
        </dd>
        <dt className="text-muted-foreground">Parent</dt>
        <dd className="text-foreground">{preview.parent ?? '(root)'}</dd>
        <dt className="text-muted-foreground">Key</dt>
        <dd className="font-mono text-xs text-foreground">{preview.key}</dd>
        <dt className="text-muted-foreground">Route</dt>
        <dd className="font-mono text-xs text-foreground">/{preview.routeBase}</dd>
        <dt className="text-muted-foreground">API</dt>
        <dd className="font-mono text-xs text-foreground">/api/v1/{preview.apiPlural}</dd>
        <dt className="text-muted-foreground">Permission</dt>
        <dd className="font-mono text-xs text-foreground">
          {['view', 'create', 'update', 'delete', 'bulk_upload', 'export']
            .map((suffix) => `${preview.permissionKey}.${suffix}`)
            .join(', ')}
        </dd>
        <dt className="text-muted-foreground">Delete mode</dt>
        <dd className="text-foreground">
          {preview.deleteMode === 'soft' ? 'Soft delete' : 'Hard delete'}
        </dd>
        <dt className="text-muted-foreground">Features</dt>
        <dd className="flex flex-wrap gap-1.5">
          {features.length === 0 && <span className="text-muted-foreground">-</span>}
          {features.map((key) => (
            <Badge key={key} variant="primary">
              {featureRegistry[key].label}
            </Badge>
          ))}
        </dd>
        <dt className="text-muted-foreground">Fields</dt>
        <dd className="text-foreground">{preview.fields.length} field(s)</dd>
        <dt className="text-muted-foreground">Layout</dt>
        <dd className="text-foreground">
          Form {preview.layout.form.length} field, tabel{' '}
          {preview.layout.table.order.length - preview.layout.table.hidden.length} kolom tampil
          {preview.layout.table.hidden.length > 0 &&
            ` (${preview.layout.table.hidden.length} tersembunyi)`}
        </dd>
      </dl>

      {preview.fields.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-foreground">Field configuration</p>
          <ul className="rounded-lg border border-border">
            {preview.fields.map((field) => {
              const formItem = formOrder.get(field.name);
              const tableIndex = tableOrder.get(field.name);
              const hidden = tableHidden.has(field.name);
              return (
                <li
                  key={field.name}
                  className="flex flex-wrap items-center gap-2 border-b border-border px-3 py-2 text-sm last:border-b-0"
                >
                  <span className="font-medium text-foreground">{field.label}</span>
                  <span className="font-mono text-xs text-muted-foreground">{field.name}</span>
                  <span className="flex-1" />
                  {formItem && (
                    <Badge variant="secondary">
                      Form #{formItem.order + 1} ×{formItem.colSpan}
                    </Badge>
                  )}
                  {tableIndex !== undefined && !hidden && (
                    <Badge variant="info">Tabel #{tableIndex + 1}</Badge>
                  )}
                  {hidden && <Badge variant="secondary">Tabel: hidden</Badge>}
                  {field.sortable !== false && <Badge variant="primary">Sort</Badge>}
                  {field.filterable !== false && field.filterCriteria ? (
                    <Badge variant="info">
                      Filter: {filterCriteriaRegistry[field.filterCriteria].label}
                    </Badge>
                  ) : (
                    <Badge variant="secondary">No filter</Badge>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ReviewStep;
