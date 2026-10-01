import { Alert, Badge } from '../../../shared/components/ui';
import type { FeatureKey, GeneratedFile, GeneratorConfig } from '../types';
import { buildContext } from '../engine/context';
import { getModuleFileList } from '../engine/featureGenerator';
import { normalizeConfig, validateConfig } from '../parser';
import { resolveModulePath } from '../naming';
import { featureRegistry, filterCriteriaRegistry } from '../registry';

interface ReviewStepProps {
  config: GeneratorConfig;
}

function ReviewStep({ config }: ReviewStepProps) {
  const normalized = normalizeConfig(config);
  const issues = validateConfig(normalized);
  const features = (Object.keys(normalized.features) as FeatureKey[]).filter(
    (key) => normalized.features[key],
  );

  let files: GeneratedFile[] = [];
  if (issues.length === 0) {
    const ctx = buildContext(normalized);
    files = getModuleFileList(ctx).map((rel) => ({
      path: `${ctx.names.dir}${rel}`,
      content: '',
    }));
  }

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
        <dd className="font-medium text-foreground">{normalized.moduleName || '-'}</dd>
        <dt className="text-muted-foreground">Parent</dt>
        <dd className="text-foreground">{normalized.parentName ?? '(root)'}</dd>
        <dt className="text-muted-foreground">Type</dt>
        <dd className="text-foreground">{normalized.type}</dd>
        <dt className="text-muted-foreground">Permission</dt>
        <dd className="font-mono text-xs text-foreground">
          {normalized.permissionKey
            ? ['view', 'create', 'update', 'delete', 'bulk_upload', 'export']
                .map((suffix) => `${normalized.permissionKey}.${suffix}`)
                .join(', ')
            : '-'}
        </dd>
        <dt className="text-muted-foreground">Output dir</dt>
        <dd className="font-mono text-xs text-foreground">
          {resolveModulePath(normalized.parentName, normalized.moduleName || 'module')}
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
        <dd className="text-foreground">{normalized.fields.length} field(s)</dd>
      </dl>

      {normalized.fields.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-foreground">Field configuration</p>
          <ul className="rounded-lg border border-border">
            {normalized.fields.map((field, index) => (
              <li
                key={field.name}
                className="flex flex-wrap items-center gap-2 border-b border-border px-3 py-2 text-sm last:border-b-0"
              >
                <span className="font-mono text-xs text-muted-foreground">{index + 1}.</span>
                <span className="font-medium text-foreground">{field.label}</span>
                <span className="font-mono text-xs text-muted-foreground">{field.name}</span>
                <span className="flex-1" />
                {field.sortable !== false && <Badge variant="primary">Sort</Badge>}
                {field.filterable !== false && field.filterCriteria ? (
                  <Badge variant="info">
                    Filter: {filterCriteriaRegistry[field.filterCriteria].label}
                  </Badge>
                ) : (
                  <Badge variant="secondary">No filter</Badge>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {files.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-foreground">
            Files to generate ({files.length})
          </p>
          <ul className="max-h-64 overflow-y-auto rounded-lg border border-border bg-surface px-4 py-2 font-mono text-xs text-foreground">
            {files.map((file) => (
              <li key={file.path} className="py-0.5">
                {file.path}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ReviewStep;
