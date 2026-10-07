import { t } from 'i18next';
import '../../../../shared/i18n';
import type { PriceListItem } from '../types';
import { Table, Badge, RowActionButton } from '../../../../shared/components/ui';
import { RelationLabel } from '../../../../shared/components/ui';
import { loadProductOptions } from '../api';
import { formatDateTime, formatNumber } from '../../../../shared/utils';

interface Props {
  testId?: string;
  data: PriceListItem[];
  totalRecords: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  sortKey?: string;
  sortDir?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  stickyAction?: boolean;
  onView?: (item: PriceListItem) => void;
  onEdit?: (item: PriceListItem) => void;
  onDelete?: (item: PriceListItem) => void;
  onRestore?: (item: PriceListItem) => void;
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

function PriceTable({
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
    { key: 'product', header: t('price.fields.product.label'), sortable: true, render: (row: PriceListItem) => <RelationLabel loader={loadProductOptions} value={row.product} /> },
    { key: 'price', header: t('price.fields.price.label'), sortable: true, render: (row: PriceListItem) => formatNumber(row.price) },
    { key: 'created_by', header: t('table.createdBy') },
    {
      key: 'created_date',
      header: t('table.createdDate'),
      render: (row: PriceListItem) => formatDateTime(row.created_date),
    },
    {
      key: 'status',
      header: t('table.status'),
      sortable: false,
      className: 'w-32',
      render: (row: PriceListItem) => (
        <Badge variant={row.status === 'active' ? 'success' : 'secondary'}>
          {row.status === 'active' ? t('common.active') : t('common.inactive')}
        </Badge>
      ),
    },
  ];

  return (
    <Table<PriceListItem>
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
              testId={`price-view-${row.id}`}
              title={`View ${row.id}`}
              onClick={() => onView(row)}
            />
          )}
          {onEdit && (
            <RowActionButton
              action="edit"
              testId={`price-edit-${row.id}`}
              title={`Edit ${row.id}`}
              onClick={() => onEdit(row)}
            />
          )}
          {row.status === 'active' && onDelete && (
            <RowActionButton
              action="delete"
              testId={`price-delete-${row.id}`}
              title={`Delete ${row.id}`}
              onClick={() => onDelete(row)}
              disabled={isDeleting}
            />
          )}
          {row.status === 'inactive' && onRestore && (
            <RowActionButton
              action="restore"
              testId={`price-restore-${row.id}`}
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

export default PriceTable;
