import type { TemplateContext } from '../../engine/context';
import { formItemSnippet, tableColumnSnippet } from '../../engine/fieldGenerator';
import { fieldTypeRegistry } from '../../registry';

export function tableTemplate(ctx: TemplateContext): string {
  const { names, fields, features } = ctx;
  const withView = features.detail;
  const withEdit = features.edit;
  const withDelete = features.delete;
  const withActions = withView || withEdit || withDelete;

  // Kolom status selalu memakai capitalize (tanpa peduli tipe field).
  const needCapitalize = true;
  const needFormatNumber = ctx.hasNumberFields;
  const needFormatDate = fields.some((f) => f.config.type === 'dateField');
  const needFormatDateRange = fields.some((f) => f.config.type === 'dateRangeField');
  const utilImports = [
    ...(needCapitalize ? ['capitalize'] : []),
    'formatDateTime',
    ...(needFormatNumber ? ['formatNumber'] : []),
    ...(needFormatDate ? ['formatDate'] : []),
    ...(needFormatDateRange ? ['formatDateRange'] : []),
  ];
  const iconImports = [
    ...(withView ? ['ViewIcon'] : []),
    ...(withEdit ? ['PencilIcon'] : []),
    ...(withDelete ? ['TrashIcon', 'RestoreIcon'] : []),
  ];

  const columns = fields
    .map((f) => `    ${tableColumnSnippet(f).replace(/ROWTYPE/g, names.listItem)}`)
    .join('\n');

  return `import type { ${names.listItem} } from '../types';
import { Table, Badge } from '${names.sharedPrefix}shared/components/ui';
${iconImports.length > 0 ? `import {\n  ${iconImports.join(',\n  ')},\n} from '${names.sharedPrefix}shared/components/icons';\n` : ''}import { ${utilImports.join(', ')} } from '${names.sharedPrefix}shared/utils';

interface Props {
  testId?: string;
  data: ${names.listItem}[];
  totalRecords: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  sortKey?: string;
  sortDir?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  stickyAction?: boolean;
${withView ? `  onView?: (item: ${names.listItem}) => void;\n` : ''}${withEdit ? `  onEdit?: (item: ${names.listItem}) => void;\n` : ''}${withDelete ? `  onDelete?: (item: ${names.listItem}) => void;\n  onRestore?: (item: ${names.listItem}) => void;\n` : ''}${withDelete ? `  isDeleting?: boolean;\n  isRestoring?: boolean;\n` : ''}  isEmptyState?: boolean;
  isFilteredEmptyState?: boolean;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  filteredEmptyStateTitle?: string;
  filteredEmptyStateDescription?: string;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

function ${names.entity}Table({
  testId,
${withView ? '  onView,\n' : ''}${withEdit ? '  onEdit,\n' : ''}${withDelete ? '  onDelete,\n  onRestore,\n  isDeleting = false,\n  isRestoring = false,\n' : ''}  data,
  isEmptyState,
  isFilteredEmptyState,
  ...rest
}: Props) {
  const columns = [
${columns}
    { key: 'created_by', header: 'Created By' },
    {
      key: 'created_date',
      header: 'Created Date',
      render: (row: ${names.listItem}) => formatDateTime(row.created_date),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: false,
      className: 'w-32',
      render: (row: ${names.listItem}) => (
        <Badge variant={row.status === 'active' ? 'success' : 'secondary'}>
          {capitalize(row.status)}
        </Badge>
      ),
    },
  ];

  return (
    <Table<${names.listItem}>
${withActions ? '      actionWidth="w-40"\n' : ''}      testId={testId}
      columns={columns}
      data={data}
      rowKey={(r) => String(r.id)}
      fixedLayout={true}
${withActions ? `      renderAction={(row) => (
        <div className="flex justify-evenly w-full gap-1">
${withView ? `          {onView && (
            <button
              data-testid={\`${names.testId}-view-\${row.id}\`}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md hover:bg-muted"
              title={\`View \${row.id}\`}
              onClick={() => onView(row)}
            >
              <ViewIcon />
            </button>
          )}
` : ''}${withEdit ? `          {onEdit && (
            <button
              data-testid={\`${names.testId}-edit-\${row.id}\`}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md hover:bg-muted"
              title={\`Edit \${row.id}\`}
              onClick={() => onEdit(row)}
            >
              <PencilIcon />
            </button>
          )}
` : ''}${withDelete ? `          {row.status === 'active' && onDelete && (
            <button
              data-testid={\`${names.testId}-delete-\${row.id}\`}
              className={\`flex h-7 w-7 items-center justify-center rounded-md \${isDeleting ? 'cursor-not-allowed opacity-40' : 'hover:bg-muted cursor-pointer'}\`}
              title={\`Delete \${row.id}\`}
              onClick={() => onDelete(row)}
              disabled={isDeleting}
            >
              <TrashIcon />
            </button>
          )}
          {row.status === 'inactive' && onRestore && (
            <button
              data-testid={\`${names.testId}-restore-\${row.id}\`}
              className={\`flex h-7 w-7 items-center justify-center rounded-md \${isRestoring ? 'cursor-not-allowed opacity-40' : 'hover:bg-muted cursor-pointer'}\`}
              title={\`Restore \${row.id}\`}
              onClick={() => onRestore(row)}
              disabled={isRestoring}
            >
              <RestoreIcon />
            </button>
          )}
` : ''}        </div>
      )}
` : ''}      isEmptyState={isEmptyState}
      isFilteredEmptyState={isFilteredEmptyState}
      {...rest}
    />
  );
}

export default ${names.entity}Table;
`;
}

export function formTemplate(ctx: TemplateContext): string {
  const { names, fields } = ctx;
  const usedComponents = [...new Set(fields.map((f) => fieldTypeRegistry[f.config.type].component))];
  const optionsFields = fields.filter((f) => f.isOptionsQuery);
  const loadFields = fields.filter((f) => f.isLoadOptions);

  const formItems = fields.map((f) => `                ${formItemSnippet(ctx, f)}`).join('\n\n');
  const rulesImports = fields.map((f) => f.rulesVar).join(', ');

  return `import { useCallback, useState, useRef } from 'react';
import {
  Card,
  Button,
  FormGroup,
  FormItem,
  FormDefaultValuesWatcher,
  ${usedComponents.join(',\n  ')},
  NavigationGuard,
} from '${names.sharedPrefix}shared/components/ui';
import type { FormValues } from '../hooks';
import type { SubmitResult } from '${names.sharedPrefix}shared/types';
import { type UseFormReturn } from 'react-hook-form';
${optionsFields.length > 0 ? `import type { ${optionsFields.map((f) => f.optionType).join(', ')} } from '../types';\n` : ''}${loadFields.length > 0 ? `import { ${loadFields.map((f) => f.loadOptionsFn).join(', ')} } from '../api';\n` : ''}import { ${rulesImports} } from '../validation/${names.camel}Validation';

interface ${names.entity}FormProps {
  defaultValues: FormValues;
  onSubmit: (data: FormValues) => Promise<SubmitResult>;
  onCancel: () => void;
  isEdit?: boolean;
  isSubmitting?: boolean;
${optionsFields.map((f) => `  ${f.name}Options: ${f.optionType}[];`).join('\n')}
${optionsFields.length > 0 ? '' : ''}}

function ${names.entity}Form({
  defaultValues,
  onSubmit,
  onCancel,
  isEdit = false,
  isSubmitting = false,
${optionsFields.map((f) => `  ${f.name}Options,`).join('\n')}
${optionsFields.length > 0 ? '' : ''}}: ${names.entity}FormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const setErrorRef = useRef<((name: keyof FormValues, error: { message: string }) => void) | null>(
    null,
  );
  const methodsRef = useRef<UseFormReturn<FormValues> | null>(null);

  const handleFormSubmit = useCallback(
    async (data: FormValues) => {
      if (submittingRef.current) return;
      submittingRef.current = true;
      setSubmitting(true);
      setSubmitted(false);
      let success = false;
      try {
        const result = await onSubmit(data);
        if (result.fieldErrors && setErrorRef.current) {
          for (const [field, message] of Object.entries(result.fieldErrors)) {
            setErrorRef.current(field as keyof FormValues, { message });
          }
        }
        success = result.success;
        if (result.success) {
          methodsRef.current?.reset(data);
          setSubmitted(true);
        }
      } finally {
        if (!success) {
          submittingRef.current = false;
          setSubmitting(false);
        }
      }
    },
    [onSubmit],
  );

  return (
    <Card testId="${names.testId}-form-card" title={isEdit ? 'Edit ${names.entity}' : 'Create ${names.entity}'}>
      <FormGroup<FormValues>
        testId="${names.testId}-form"
        defaultValues={defaultValues}
        onSubmit={handleFormSubmit}
      >
        {(methods) => {
          setErrorRef.current = methods.setError;
          methodsRef.current = methods;

          return (
            <>
              <FormDefaultValuesWatcher methods={methods} defaultValues={defaultValues} />

              <div className="flex flex-col section-gap">
${formItems}
              </div>

              <div className="-mx-5 mt-6 flex items-center justify-end gap-2 border-t border-border px-5 pt-4">
                <Button
                  data-testid="${names.testId}-back-button"
                  type="button"
                  variant="secondary"
                  className="w-30"
                  onClick={onCancel}
                >
                  Back
                </Button>
                <Button
                  data-testid="${names.testId}-submit-button"
                  type="submit"
                  className="w-30"
                  disabled={isSubmitting || submitting}
                >
                  {isEdit ? 'Update' : 'Create'}
                </Button>
              </div>

              <NavigationGuard submitted={submitted} />
            </>
          );
        }}
      </FormGroup>
    </Card>
  );
}

export default ${names.entity}Form;
`;
}

export function bulkDialogTemplate(ctx: TemplateContext): string {
  const { names, fields } = ctx;
  const columns = fields
    .filter((f) => f.config.type !== 'fileUploadField')
    .flatMap((f) =>
      f.config.type === 'dateRangeField' ? [`${f.label} Start`, `${f.label} End`] : [f.label],
    )
    .join(', ');
  return `import { useState } from 'react';
import {
  Alert,
  Button,
  Dialog,
  FileUploadField,
} from '${names.sharedPrefix}shared/components/ui';
import { downloadBlob, mapSubmitError } from '${names.sharedPrefix}shared/utils';
import type { BulkUploadResult } from '../types';
import { download${names.entity}Template, useBulkUpload${names.entity} } from '../api';

interface ${names.entity}BulkUploadDialogProps {
  open: boolean;
  onClose: () => void;
}

function ${names.entity}BulkUploadDialog({ open, onClose }: ${names.entity}BulkUploadDialogProps) {
  const [file, setFile] = useState<File | File[] | null>(null);
  const [loadingTemplate, setLoadingTemplate] = useState(false);
  const [result, setResult] = useState<BulkUploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const bulkMutation = useBulkUpload${names.entity}();

  function reset(): void {
    setFile(null);
    setResult(null);
    setError(null);
  }

  function handleClose(): void {
    reset();
    onClose();
  }

  async function handleDownloadTemplate(): Promise<void> {
    setLoadingTemplate(true);
    try {
      const blob = await download${names.entity}Template();
      downloadBlob(blob, '${names.kebab}-template.xlsx');
    } catch (err: unknown) {
      const mapped = mapSubmitError(err, 'Gagal mengunduh template.');
      setError(mapped.toastMessage ?? 'Gagal mengunduh template.');
    } finally {
      setLoadingTemplate(false);
    }
  }

  async function handleUpload(): Promise<void> {
    const single = Array.isArray(file) ? file[0] : file;
    if (!single) {
      setError('Pilih file .xlsx terlebih dahulu.');
      return;
    }
    setError(null);
    try {
      const uploadResult = await bulkMutation.mutateAsync(single);
      setResult(uploadResult);
    } catch (err: unknown) {
      const mapped = mapSubmitError(err, 'Gagal mengunggah file.');
      setError(mapped.toastMessage ?? 'Gagal mengunggah file.');
    }
  }

  return (
    <Dialog
      testId="${names.testId}-bulk-upload-dialog"
      open={open}
      onClose={handleClose}
      title="Bulk Upload ${names.entity}"
      maxWidth="lg"
      closeOnEscape
      closeOnBackdropClick
    >
      <div className="flex flex-col stack-gap">
        {error && <Alert variant="error" message={error} />}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleDownloadTemplate}
            disabled={loadingTemplate}
          >
            {loadingTemplate ? 'Mengunduh…' : 'Unduh template'}
          </Button>
          <span className="text-xs text-muted-foreground">
            Format .xlsx dengan kolom ${columns}.
          </span>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">File upload</label>
          <FileUploadField
            value={file}
            onChange={(next) => {
              setFile(next);
              setResult(null);
              setError(null);
            }}
            accept=".xlsx"
          />
        </div>
        {result && (
          <div className="flex flex-col field-gap">
            <Alert
              variant={result.failedCount === 0 ? 'success' : 'warning'}
              message={\`\${result.successCount} berhasil, \${result.failedCount} gagal dari \${result.totalRows} baris.\`}
            />
            {result.errors.length > 0 && (
              <ul className="max-h-48 overflow-y-auto rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground">
                {result.errors.map((item, index) => (
                  <li key={\`\${item.row}-\${item.field ?? ''}-\${index}\`} className="py-0.5">
                    <span className="font-mono">Baris {item.row}</span>
                    {item.field ? <span className="font-mono"> [{item.field}]</span> : null}:{' '}
                    {item.message}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Tutup
          </Button>
          <Button
            type="button"
            onClick={handleUpload}
            disabled={bulkMutation.isPending || !file}
          >
            {bulkMutation.isPending ? 'Mengunggah…' : 'Upload'}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

export default ${names.entity}BulkUploadDialog;
`;
}

export function componentsIndexTemplate(ctx: TemplateContext): string {
  const { names, features } = ctx;
  const needForm = features.create || features.edit || features.detail;
  return `${features.list ? `export { default as ${names.entity}Table } from './${names.entity}Table';\n` : ''}${needForm ? `export { default as ${names.entity}Form } from './${names.entity}Form';\n` : ''}${features.bulkUpload ? `export { default as ${names.entity}BulkUploadDialog } from './${names.entity}BulkUploadDialog';\n` : ''}`;
}
