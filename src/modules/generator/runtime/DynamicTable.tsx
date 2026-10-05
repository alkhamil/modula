/** Tabel list generik — kolom + aksi + render sel dari definisi modul. */
import type { ReactNode } from 'react';
import { Table } from '../../../shared/components/ui';
import type { Column } from '../../../shared/components/ui/Table';
import { Pencil, RotateCcw, Trash2, Eye } from 'lucide-react';
import type { ModuleDefinition } from '../definitions';
import { definitionTestId, type DynamicListItem } from './types';
import { columnRenderForType, systemTableColumn } from './cellRender';
import { moduleFieldLabel } from './moduleI18n';

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

function cellRender(
  fieldType: string,
  name: string,
): ((row: DynamicListItem) => ReactNode) | undefined {
  const render = columnRenderForType(fieldType, name);
  return render
    ? (row: DynamicListItem) => render(row as Record<string, unknown>)
    : undefined;
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
  const displayProps = def.layout.table.props;
  // Urutancampuran field + kolom sistem; definisi lama tanpa kunci sistem
  // mendapatkannya di akhir (fallback perilaku lama).
  const orderedKeys = def.layout.table.order.filter(
    (name) => byName.has(name) || systemTableColumn(name) !== null,
  );
  const tableKeys = orderedKeys.some((name) => systemTableColumn(name) !== null)
    ? orderedKeys
    : [...orderedKeys, 'created_by', 'created_date', 'status'];
  const columns: Column<DynamicListItem>[] = tableKeys.flatMap((name) => {
    const field = byName.get(name);
    if (field) {
      if (hidden.has(name)) return [];
      const type = field.type;
      const column: Column<DynamicListItem> = {
        key: name,
        header: moduleFieldLabel(def, field),
        sortable: field.sortable !== false,
      };
      const render = cellRender(type, name);
      if (render) column.render = render;
      if (widths[name]) column.width = widths[name];
      return [column];
    }
    const system = systemTableColumn(name);
    if (!system) return [];
    const column: Column<DynamicListItem> = {
      key: system.key,
      header: system.header,
      sortable: system.sortable,
    };
    if (system.render) column.render = system.render;
    if (system.className) column.className = system.className;
    if (widths[name]) column.width = widths[name];
    return [column];
  });
  const withActions = !!onView || !!onEdit || !!onDelete || !!onRestore;

  return (
    <Table<DynamicListItem>
      actionWidth={withActions ? 'w-40' : undefined}
      actionPosition={displayProps?.actionPosition}
      testId={testId}
      columns={columns}
      data={data}
      rowKey={(row) => String(row.id)}
      fixedLayout={displayProps?.fixedLayout ?? true}
      dense={displayProps?.dense}
      hidePagination={displayProps?.hidePagination}
      hideTotalRecords={displayProps?.hideTotalRecords}
      stickyHeader={displayProps?.stickyHeader}
      stickyAction={displayProps?.stickyAction}
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
                    <Eye />
                  </button>
                )}
                {onEdit && (
                  <button
                    data-testid={`${testPrefix}-edit-${row.id}`}
                    className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md hover:bg-muted"
                    title={`Edit ${row.id}`}
                    onClick={() => onEdit(row)}
                  >
                    <Pencil />
                  </button>
                )}
                {row.status === 'active' && onDelete && (
                  <button
                    data-testid={`${testPrefix}-delete-${row.id}`}
                    className={`flex h-7 w-7 items-center justify-center rounded-md text-danger ${isDeleting ? 'cursor-not-allowed opacity-40' : 'hover:bg-danger/10 cursor-pointer'}`}
                    title={`Delete ${row.id}`}
                    onClick={() => onDelete(row)}
                    disabled={isDeleting}
                  >
                    <Trash2 />
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
                    <RotateCcw />
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
