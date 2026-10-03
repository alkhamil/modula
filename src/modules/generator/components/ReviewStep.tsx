import { useMemo } from 'react';
import { Alert, Badge } from '../../../shared/components/ui';
import { SvgIcon } from '../../../shared/components/icons';
import type { FeatureKey, GeneratorConfig } from '../types';
import type { DeleteMode, ModuleLayout } from '../definitions';
import { configToDefinition, validateDefinition } from '../definitions';
import { dataSourceRegistry, featureRegistry, filterCriteriaRegistry } from '../registry';

interface ReviewStepProps {
  config: GeneratorConfig;
  layout: ModuleLayout | null;
  deleteMode: DeleteMode;
}

function ReviewStep({ config, layout, deleteMode }: ReviewStepProps) {
  const preview = useMemo(
    () =>
      configToDefinition(config, {
        status: 'draft',
        layout: layout ?? undefined,
        deleteMode,
      }),
    [config, layout, deleteMode],
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
  const detailOrder = new Map(
    (preview.layout.detail?.order ?? []).map((name, index) => [name, index] as const),
  );
  const detailHidden = new Set(preview.layout.detail?.hidden ?? []);
  const sectionCount = preview.layout.form.filter((item) => item.kind === 'section').length;
  const dividerCount = preview.layout.form.filter((item) => item.kind === 'divider').length;
  const widthCount = Object.keys(preview.layout.table.widths ?? {}).length;

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
        <dt className="text-muted-foreground">Data</dt>
        <dd className="font-mono text-xs text-foreground">{preview.apiPlural} (mock store)</dd>
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
        <dt className="text-muted-foreground">Ikon menu</dt>
        <dd className="flex flex-wrap items-center gap-3 text-foreground">
          {!preview.menuIcon && <span className="text-muted-foreground">Bawaan</span>}
          {preview.menuIcon && (
            <span className="flex items-center gap-1.5 text-sm">
              <SvgIcon svg={preview.menuIcon.svg} className="h-5 w-5" />
              {preview.menuIcon.name} ({preview.parent ? 'parent' : 'modul'})
            </span>
          )}
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
        <dt className="text-muted-foreground">Layout form</dt>
        <dd className="text-foreground">
          {preview.layout.form.length} item ({sectionCount} section, {dividerCount} divider)
        </dd>
        <dt className="text-muted-foreground">Layout tabel</dt>
        <dd className="text-foreground">
          {preview.layout.table.order.length - preview.layout.table.hidden.length} kolom tampil
          {preview.layout.table.hidden.length > 0 &&
            ` (${preview.layout.table.hidden.length} tersembunyi)`}
          {widthCount > 0 && `, ${widthCount} lebar kustom`}
        </dd>
        <dt className="text-muted-foreground">Layout detail</dt>
        <dd className="text-foreground">
          {(preview.layout.detail?.order.length ?? 0) - detailHidden.size} field tampil
          {detailHidden.size > 0 && ` (${detailHidden.size} tersembunyi)`}
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
              const detailIndex = detailOrder.get(field.name);
              const detailHide = detailHidden.has(field.name);
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
                  {detailIndex !== undefined && !detailHide && (
                    <Badge variant="info">Detail #{detailIndex + 1}</Badge>
                  )}
                  {detailHide && <Badge variant="secondary">Detail: hidden</Badge>}
                  {field.source === 'relation' && field.relation && (
                    <Badge variant="primary">→ {field.relation.definitionKey}</Badge>
                  )}
                  {field.source !== 'none' && field.source !== 'relation' && (
                    <Badge variant="secondary">{dataSourceRegistry[field.source].label}</Badge>
                  )}
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
