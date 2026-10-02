/** Tabel list generik — kolom + aksi + render sel dari definisi modul. */
import type { ReactNode } from 'react';
import { Badge, Table } from '../../../shared/components/ui';
import type { Column } from '../../../shared/components/ui/Table';
import {
  PencilIcon,
  RestoreIcon,
  TrashIcon,
  ViewIcon,
} from '../../../shared/components/icons';
import {
  capitalize,
  formatDate,
  formatDateRange,
  formatDateTime,
  formatNumber,
} from '../../../shared/utils';
import type { ModuleDefinition } from '../definitions';
import { definitionTestId, type DynamicListItem } from './types';

interface DynamicTableProps {
  testId?: string;
  def: ModuleDefinition;
  data: DynamicListItem[];
  totalRecords: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  sortKey?: string;
  sortDir?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  stickyAction?: boolean;
  onView?: (item: DynamicListItem) => void;
  onEdit?: (item: DynamicListItem) => void;
  onDelete?: (item: DynamicListItem) => void;
  onRestore?: (item: DynamicListItem) => void;
  isDeleting?: boolean;
  isRestoring?: boolean;
  isEmptyState?: boolean;
  isFilteredEmptyState?: boolean;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  filteredEmptyStateTitle?: string;
  filteredEmptyStateDescription?: string;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

function cellRender(fieldType: string, name: string): ((row: DynamicListItem) => ReactNode) | undefined {
  switch (fieldType) {
    case 'numberField':
      return (row) => formatNumber(Number(row[name] ?? 0));
    case 'dateField':
      return (row) => formatDate(String(row[name] ?? ''));
    case 'dateRangeField':
      return (row) => formatDateRange(String(row[name] ?? ''));
    case 'checkboxField':
    case 'switchField':
      return (row) => (row[name] ? 'Yes' : 'No');
    case 'selectField':
    case 'radioGroupField':
      return (row) => capitalize(String(row[name] ?? ''));
    case 'selectMultipleField':
    case 'checkboxGroupField':
      return (row) => ((row[name] as string[] | null) ?? []).join(', ');
    case 'passwordField':
      return () => '••••••';
    default:
      return undefined;
  }
}

function DynamicTable({
  testId,
  def,
  onView,
  onEdit,
  onDelete,
  onRestore,
  isDeleting = false,
  isRestoring = false,
  data,
  isEmptyState,
  isFilteredEmptyState,
  ...rest
}: DynamicTableProps) {
  const testPrefix = definitionTestId(def.key);
  const byName = new Map(def.fields.map((field) => [field.name, field]));
  const hidden = new Set(def.layout.table.hidden);
  const widths = def.layout.table.widths ?? {};
  const columns: Column<DynamicListItem>[] = [
    ...def.layout.table.order
      .filter((name) => byName.has(name) && !hidden.has(name))
      .map((name) => {
        const field = byName.get(name);
        const type = field?.type ?? 'textField';
        const column: Column<DynamicListItem> = {
          key: name,
          header: field?.label ?? name,
          sortable: field?.sortable !== false,
        };
        const render = cellRender(type, name);
        if (render) column.render = render;
        if (widths[name]) column.width = widths[name];
        return column;
      }),
    { key: 'created_by', header: 'Created By' },
    {
      key: 'created_date',
      header: 'Created Date',
      render: (row) => formatDateTime(String(row.created_date ?? '')),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: false,
      className: 'w-32',
      render: (row) => (
        <Badge variant={row.status === 'active' ? 'success' : 'secondary'}>
          {capitalize(row.status)}
        </Badge>
      ),
    },
  ];
  const withActions = !!onView || !!onEdit || !!onDelete || !!onRestore;

  return (
    <Table<DynamicListItem>
      actionWidth={withActions ? 'w-40' : undefined}
      testId={testId}
      columns={columns}
      data={data}
      rowKey={(row) => String(row.id)}
      fixedLayout={true}
      renderAction={
        withActions
          ? (row) => (
              <div className="flex justify-evenly w-full gap-1">
                {onView && (
                  <button
                    data-testid={`${testPrefix}-view-${row.id}`}
                    className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md hover:bg-muted"
                    title={`View ${row.id}`}
                    onClick={() => onView(row)}
                  >
                    <ViewIcon />
                  </button>
                )}
                {onEdit && (
                  <button
                    data-testid={`${testPrefix}-edit-${row.id}`}
                    className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md hover:bg-muted"
                    title={`Edit ${row.id}`}
                    onClick={() => onEdit(row)}
                  >
                    <PencilIcon />
                  </button>
                )}
                {row.status === 'active' && onDelete && (
                  <button
                    data-testid={`${testPrefix}-delete-${row.id}`}
                    className={`flex h-7 w-7 items-center justify-center rounded-md ${isDeleting ? 'cursor-not-allowed opacity-40' : 'hover:bg-muted cursor-pointer'}`}
                    title={`Delete ${row.id}`}
                    onClick={() => onDelete(row)}
                    disabled={isDeleting}
                  >
                    <TrashIcon />
                  </button>
                )}
                {row.status === 'inactive' && onRestore && (
                  <button
                    data-testid={`${testPrefix}-restore-${row.id}`}
                    className={`flex h-7 w-7 items-center justify-center rounded-md ${isRestoring ? 'cursor-not-allowed opacity-40' : 'hover:bg-muted cursor-pointer'}`}
                    title={`Restore ${row.id}`}
                    onClick={() => onRestore(row)}
                    disabled={isRestoring}
                  >
                    <RestoreIcon />
                  </button>
                )}
              </div>
            )
          : undefined
      }
      isEmptyState={isEmptyState}
      isFilteredEmptyState={isFilteredEmptyState}
      {...rest}
    />
  );
}

export default DynamicTable;
