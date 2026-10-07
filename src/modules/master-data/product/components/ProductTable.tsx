import { t } from 'i18next';
import '../../../../shared/i18n';
import type { ProductListItem } from '../types';
import { Table, Badge, RowActionButton, RelationLabel } from '../../../../shared/components/ui';
import { formatDateTime } from '../../../../shared/utils';
import { loadCategoryOptions } from '../api';

interface Props {
  testId?: string;
  data: ProductListItem[];
  totalRecords: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  sortKey?: string;
  sortDir?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  stickyAction?: boolean;
  onView?: (item: ProductListItem) => void;
  onEdit?: (item: ProductListItem) => void;
  onDelete?: (item: ProductListItem) => void;
  onRestore?: (item: ProductListItem) => void;
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

function ProductTable({
  testId,
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
}: Props) {
  const columns = [
    { key: 'name', header: t('product.fields.name.label'), sortable: true },
    { key: 'category', header: t('product.fields.category.label'), sortable: true, render: (row: ProductListItem) => <RelationLabel loader={loadCategoryOptions} value={row.category} /> },
    { key: 'created_by', header: t('table.createdBy') },
    {
      key: 'created_date',
      header: t('table.createdDate'),
      render: (row: ProductListItem) => formatDateTime(row.created_date),
    },
    {
      key: 'status',
      header: t('table.status'),
      sortable: false,
      className: 'w-32',
      render: (row: ProductListItem) => (
        <Badge variant={row.status === 'active' ? 'success' : 'secondary'}>
          {row.status === 'active' ? t('common.active') : t('common.inactive')}
        </Badge>
      ),
    },
  ];

  return (
    <Table<ProductListItem>
      actionWidth="w-40"
      testId={testId}
      columns={columns}
      data={data}
      rowKey={(r) => String(r.id)}
      fixedLayout={true}
      renderAction={(row) => (
        <div className="flex justify-evenly w-full gap-1">
          {onView && (
            <RowActionButton
              action="view"
              testId={`product-view-${row.id}`}
              title={`View ${row.id}`}
              onClick={() => onView(row)}
            />
          )}
          {onEdit && (
            <RowActionButton
              action="edit"
              testId={`product-edit-${row.id}`}
              title={`Edit ${row.id}`}
              onClick={() => onEdit(row)}
            />
          )}
          {row.status === 'active' && onDelete && (
            <RowActionButton
              action="delete"
              testId={`product-delete-${row.id}`}
              title={`Delete ${row.id}`}
              onClick={() => onDelete(row)}
              disabled={isDeleting}
            />
          )}
          {row.status === 'inactive' && onRestore && (
            <RowActionButton
              action="restore"
              testId={`product-restore-${row.id}`}
              title={`Restore ${row.id}`}
              onClick={() => onRestore(row)}
              disabled={isRestoring}
            />
          )}
        </div>
      )}
      isEmptyState={isEmptyState}
      isFilteredEmptyState={isFilteredEmptyState}
      {...rest}
    />
  );
}

export default ProductTable;
