import type { TemplateContext } from '../../engine/context';
import {
  detailRowSnippet,
  filterFieldSnippet,
  filterParamKeys,
  formDefaultValue,
  formEditValue,
  payloadMapping,
  tsFormType,
} from '../../engine/fieldGenerator';

export function listHookTemplate(ctx: TemplateContext): string {
  const { names, features } = ctx;
  const withDelete = features.delete;
  const apiImports = [`use${names.entity}ListQuery`];
  if (withDelete) apiImports.push(`useDelete${names.entity}`, `useRestore${names.entity}`);

  return `${withDelete ? `import { useState } from 'react';\n` : ''}${withDelete ? `import { useToast } from '${names.sharedPrefix}shared/components/ui';\n` : ''}import type { ${withDelete ? `${names.listItem}, ` : ''}${names.params} } from '../types';
import { ${apiImports.join(', ')} } from '../api';
${withDelete ? `import { mapSubmitError } from '${names.sharedPrefix}shared/utils';\n` : ''}
export function use${names.entity}List(params: ${names.params}) {
${withDelete ? '  const { showToast } = useToast();\n' : ''}${withDelete ? `  const [deleteTarget, setDeleteTarget] = useState<${names.listItem} | null>(null);
  const [restoreTarget, setRestoreTarget] = useState<${names.listItem} | null>(null);
` : ''}
  const query = use${names.entity}ListQuery(params);
${withDelete ? `  const deleteMutation = useDelete${names.entity}();
  const restoreMutation = useRestore${names.entity}();
` : ''}${withDelete ? `
  function handleDeleteClick(${names.camel}: ${names.listItem}) {
    setDeleteTarget(${names.camel});
  }

  function handleDeleteCancel() {
    setDeleteTarget(null);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      const res = await deleteMutation.mutateAsync(String(deleteTarget.id));
      setDeleteTarget(null);
      showToast({ message: res.message, variant: 'success' });
    } catch (err: unknown) {
      const fallback = 'Failed to delete ${names.camel}';
      const result = mapSubmitError(err, fallback);
      showToast({ message: result.toastMessage ?? fallback, variant: 'error' });
    }
  }

  function handleRestoreClick(${names.camel}: ${names.listItem}) {
    setRestoreTarget(${names.camel});
  }

  function handleRestoreCancel() {
    setRestoreTarget(null);
  }

  async function handleRestore() {
    if (!restoreTarget) return;
    try {
      const res = await restoreMutation.mutateAsync(String(restoreTarget.id));
      setRestoreTarget(null);
      showToast({ message: res.message, variant: 'success' });
    } catch (err: unknown) {
      const fallback = 'Failed to restore ${names.camel}';
      const result = mapSubmitError(err, fallback);
      showToast({ message: result.toastMessage ?? fallback, variant: 'error' });
    }
  }
` : ''}
  return {
    ${names.camel}s: query.data?.list.content ?? [],
    totalRecords: query.data?.list.pagination?.total_elements ?? 0,
    isLoading: query.isLoading,
    error: query.error?.message ?? null,
    refresh: () => query.refetch(),${withDelete ? `
    deleteTarget,
    isDeleting: deleteMutation.isPending,
    handleDeleteClick,
    handleDeleteCancel,
    handleDelete,
    restoreTarget,
    isRestoring: restoreMutation.isPending,
    handleRestoreClick,
    handleRestoreCancel,
    handleRestore,` : ''}
  };
}
`;
}

export function listFilterHookTemplate(ctx: TemplateContext): string {
  const { names } = ctx;
  const filterableFields = ctx.fields.filter((f) => f.filterable && f.filterCriteria);
  const loadFields = filterableFields.filter((f) => f.isLoadOptions);
  const paramKeys = filterableFields.flatMap((f) => filterParamKeys(f));
  const statusFilter = `{
    name: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
    ],
  },`;
  const fieldFilters = filterableFields.map((f) => filterFieldSnippet(f)).join('\n');

  return `import { useState } from 'react';
import { useSearchParams } from 'react-router';
import type { FilterField } from '${names.sharedPrefix}shared/components/ui';
import type { ${names.params} } from '../types';
import { useDebounce, useUrlPagination } from '${names.sharedPrefix}shared/hooks';
${loadFields.length > 0 ? `import { ${loadFields.map((f) => f.loadOptionsFn).join(', ')} } from '../api';\n` : ''}
const filterFields: FilterField[] = [
${statusFilter
  .split('\n')
  .map((line) => `  ${line}`)
  .join('\n')}
${fieldFilters ? `${fieldFilters.split('\n').map((line) => `  ${line}`).join('\n')}\n` : ''}];

export function use${names.entity}ListFilter() {
  const [searchParams] = useSearchParams();
  const { page, setPage, pageSize, setPageSize, handlePageSizeChange } = useUrlPagination();
  const [sortKey, setSortKey] = useState<string | undefined>(undefined);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') ?? '');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [filterValues, setFilterValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
${['status', ...paramKeys]
  .map(
    (key) => `    const ${key} = searchParams.get('${key}');
    if (${key}) initial.${key} = ${key};`,
  )
  .join('\n')}
    return initial;
  });

  const queryParams: ${names.params} = {
    search: debouncedSearchQuery || undefined,
    status: filterValues.status || undefined,
${paramKeys.map((key) => `    ${key}: filterValues.${key} || undefined,`).join('\n')}
${paramKeys.length > 0 ? '' : ''}    order: sortKey,
    sort: sortKey ? sortDir : undefined,
    page,
    size: pageSize,
  };

  const isFilterActive = !!debouncedSearchQuery || Object.values(filterValues).some(Boolean);

  function handleSearchChange(value: string) {
    setSearchQuery(value);
    setPage(1);
  }

  function handleApply(values: Record<string, string>, options?: { resetPage?: boolean }) {
    setFilterValues(values);
    if (options?.resetPage !== false) setPage(1);
  }

  function handleReset() {
    setFilterValues({});
    setPage(1);
  }

  function handleSort(key: string) {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  return {
    filterFields,
    page,
    setPage,
    pageSize,
    setPageSize,
    handlePageSizeChange,
    sortKey,
    sortDir,
    searchQuery,
    filterValues,
    queryParams,
    isFilterActive,
    handleSearchChange,
    handleApply,
    handleReset,
    handleSort,
  };
}
`;
}

export function formHookTemplate(ctx: TemplateContext): string {
  const { names, fields } = ctx;
  const optionsFields = fields.filter((f) => f.isOptionsQuery);
  const needCapitalize = true;
  const needParseCurrency = ctx.hasNumberFields;
  const needFormatNumber = ctx.hasNumberFields;
  const needFormatDate = fields.some((f) => f.config.type === 'dateField');
  const needFormatDateRange = fields.some((f) => f.config.type === 'dateRangeField');

  const utilImports = [
    ...(needCapitalize ? ['capitalize'] : []),
    'isConnectionError',
    'mapSubmitError',
    ...(needParseCurrency ? ['parseCurrency'] : []),
    'splitFieldErrors',
    'getErrorStateType',
    ...(needFormatNumber ? ['formatNumber'] : []),
    ...(needFormatDate ? ['formatDate'] : []),
    ...(needFormatDateRange ? ['formatDateRange'] : []),
  ];

  const detailRows = fields
    .map((f) => detailRowSnippet(f).replace(/item\./g, `${names.camel}.`))
    .map((line) => `      ${line}`)
    .join('\n');

  return `import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useToast, Badge } from '${names.sharedPrefix}shared/components/ui';
import type { DetailRow } from '${names.sharedPrefix}shared/components/ui';
import type { SubmitResult } from '${names.sharedPrefix}shared/types';
import {
  ${utilImports.join(',\n  ')},
} from '${names.sharedPrefix}shared/utils';
import type { ${names.entity} } from '../types';
import { use${names.entity}DetailQuery, useUpsert${names.entity}${optionsFields.map((f) => `, ${f.optionsQueryHook}`).join('')} } from '../api';

export interface FormValues {
${fields.map((f) => `  ${f.name}: ${tsFormType(f)};`).join('\n')}
}

function buildDefaultValues(item?: ${names.entity}): FormValues {
  return item
    ? {
${fields.map((f) => `        ${f.name}: ${formEditValue(f, 'item')},`).join('\n')}
      }
    : {
${fields.map((f) => `        ${f.name}: ${formDefaultValue(f)},`).join('\n')}
      };
}

export function use${names.entity}Form(id?: string) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isEdit = !!id;

  const query = use${names.entity}DetailQuery(id);
${optionsFields.map((f) => `  const ${f.name}OptionsQuery = ${f.optionsQueryHook}();`).join('\n')}
${optionsFields.length > 0 ? '' : ''}  const upsertMutation = useUpsert${names.entity}();

  const ${names.camel} = query.data;

  async function onSubmit(data: FormValues): Promise<SubmitResult> {
    try {
      const res = await upsertMutation.mutateAsync({
        id: isEdit ? id : undefined,
        data: {
${fields.map((f) => `          ${f.name}: ${payloadMapping(f)},`).join('\n')}
        },
      });

      showToast({ message: res.message, variant: 'success' });
      setTimeout(() => navigate('/${names.routeBase}'), 500);
      return { success: true };
    } catch (err: unknown) {
      const fallback = \`Failed to \${isEdit ? 'update' : 'create'} ${names.camel}\`;
      const result = mapSubmitError(err, fallback);
      if (result.fieldErrors) {
        const { fieldErrors, unknownMessage } = splitFieldErrors(
          result.fieldErrors,
          (field) => field,
        );
        if (unknownMessage) showToast({ message: unknownMessage, variant: 'error' });
        return Object.keys(fieldErrors).length > 0
          ? { success: false, fieldErrors }
          : { success: false };
      }
      if (result.toastMessage) {
        showToast({ message: result.toastMessage, variant: 'error' });
      }
      return result;
    }
  }

  function onCancel() {
    navigate(-1);
  }

  const detailRows = useMemo<DetailRow[]>(() => {
    if (!${names.camel}) {
      return [
        { label: 'Status', value: '' },
${fields.map((f) => `        { label: '${f.label}', value: '' },`).join('\n')}
      ];
    }
    return [
      {
        label: 'Status',
        value: (
          <Badge variant={${names.camel}.status === 'active' ? 'success' : 'secondary'}>
            {capitalize(${names.camel}.status)}
          </Badge>
        ),
      },
${detailRows}
      { label: 'Created By', value: ${names.camel}.createdBy },
      { label: 'Created Date', value: ${names.camel}.createdDate },
    ];
  }, [${names.camel}]);

  const queryStatus: 'loading' | 'error' | 'success' = query.isLoading
    ? 'loading'
    : query.error
      ? 'error'
      : 'success';

  const defaultValues = useMemo(() => buildDefaultValues(${names.camel}), [${names.camel}]);

  return {
    queryStatus,
    queryMessage: query.error?.message ?? undefined,
    errorType: query.error ? getErrorStateType(query.error) : undefined,
    isNetworkError: query.error ? isConnectionError(query.error) : false,
    ${names.camel},
    refresh: () => query.refetch(),
    detailRows,
    defaultValues,
    isSubmitting: upsertMutation.isPending,
    isEdit,
    onSubmit,
    onCancel,
${optionsFields.map((f) => `    ${f.name}Options: ${f.name}OptionsQuery.data ?? [],`).join('\n')}
${optionsFields.length > 0 ? '' : ''}  };
}
`;
}

export function exportHookTemplate(ctx: TemplateContext): string {
  const { names } = ctx;
  return `import { useState } from 'react';
import { useToast } from '${names.sharedPrefix}shared/components/ui';
import { downloadBlob, mapSubmitError } from '${names.sharedPrefix}shared/utils';
import type { ${names.params} } from '../types';
import { export${names.entityPlural} } from '../api';

export function use${names.entity}Export() {
  const { showToast } = useToast();
  const [isExporting, setExporting] = useState(false);

  async function exportData(params: ${names.params}): Promise<void> {
    setExporting(true);
    try {
      const blob = await export${names.entityPlural}(params);
      const stamp = new Date().toISOString().slice(0, 10);
      downloadBlob(blob, \`${names.kebab}-\${stamp}.xlsx\`);
      showToast({ variant: 'success', message: 'Export berhasil diunduh.' });
    } catch (err: unknown) {
      const fallback = 'Gagal mengekspor data.';
      const result = mapSubmitError(err, fallback);
      showToast({ message: result.toastMessage ?? fallback, variant: 'error' });
    } finally {
      setExporting(false);
    }
  }

  return { exportData, isExporting };
}
`;
}

export function hooksIndexTemplate(ctx: TemplateContext): string {
  const { names, features } = ctx;
  const needForm = features.create || features.edit || features.detail;
  return `${features.list ? `export { use${names.entity}List } from './use${names.entity}List';\n` : ''}${needForm ? `export { use${names.entity}Form } from './use${names.entity}Form';\n` : ''}${features.list ? `export { use${names.entity}ListFilter } from './use${names.entity}ListFilter';\n` : ''}${features.export ? `export { use${names.entity}Export } from './use${names.entity}Export';\n` : ''}${needForm ? `export type { FormValues } from './use${names.entity}Form';\n` : ''}`;
}
