import { t } from 'i18next';
import '../../../shared/i18n';
import type { InvoiceListItem } from '../types';
import { Table, Badge, RowActionButton } from '../../../shared/components/ui';
import { getSellerOptionLabel, getBuyerOptionLabel } from '../api';
import { formatDateTime, formatDate } from '../../../shared/utils';

interface Props {
  testId?: string;
  data: InvoiceListItem[];
  totalRecords: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  sortKey?: string;
  sortDir?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  stickyAction?: boolean;
  onView?: (item: InvoiceListItem) => void;
  onEdit?: (item: InvoiceListItem) => void;
  onDelete?: (item: InvoiceListItem) => void;
  onRestore?: (item: InvoiceListItem) => void;
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

function InvoiceTable({
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
    { key: 'invoiceNumber', header: t('invoice.fields.invoiceNumber.label'), sortable: true, width: 175 },
    { key: 'dateOfIssue', header: t('invoice.fields.dateOfIssue.label'), sortable: true, width: 180, render: (row: InvoiceListItem) => formatDate(row.dateOfIssue) },
    { key: 'dueDate', header: t('invoice.fields.dueDate.label'), sortable: true, width: 164, render: (row: InvoiceListItem) => formatDate(row.dueDate) },
    { key: 'seller', header: t('invoice.fields.seller.label'), sortable: true, width: 130, render: (row: InvoiceListItem) => getSellerOptionLabel(row.seller) },
    { key: 'buyer', header: t('invoice.fields.buyer.label'), sortable: true, width: 146, render: (row: InvoiceListItem) => getBuyerOptionLabel(row.buyer) },
    { key: 'detailProduct', header: t('invoice.fields.detailProduct.label'), width: 132, render: (row: InvoiceListItem) => { const count = (row.detailProduct ?? []).length; return count > 0 ? t('system.rowCount', { count }) : '-'; } },
    { key: 'created_by', header: t('table.createdBy'), width: 142 },
    {
      key: 'created_date',
      header: t('table.createdDate'),
      width: 156,
      render: (row: InvoiceListItem) => formatDateTime(row.created_date),
    },
    {
      key: 'status',
      header: t('table.status'),
      sortable: false,
      className: 'w-32',
      render: (row: InvoiceListItem) => (
        <Badge variant={row.status === 'active' ? 'success' : 'secondary'}>
          {row.status === 'active' ? t('common.active') : t('common.inactive')}
        </Badge>
      ),
    },
  ];

  return (
    <Table<InvoiceListItem>
      actionWidth="w-40"
      testId={testId}
      columns={columns}
      data={data}
      rowKey={(r) => String(r.id)}
      fixedLayout={true}
      stickyHeader
      stickyAction
      renderAction={(row) => (
        <div className="flex justify-evenly w-full gap-1">
          {onView && (
            <RowActionButton
              action="view"
              testId={`invoice-view-${row.id}`}
              title={`View ${row.id}`}
              onClick={() => onView(row)}
            />
          )}
          {onEdit && (
            <RowActionButton
              action="edit"
              testId={`invoice-edit-${row.id}`}
              title={`Edit ${row.id}`}
              onClick={() => onEdit(row)}
            />
          )}
          {row.status === 'active' && onDelete && (
            <RowActionButton
              action="delete"
              testId={`invoice-delete-${row.id}`}
              title={`Delete ${row.id}`}
              onClick={() => onDelete(row)}
              disabled={isDeleting}
            />
          )}
          {row.status === 'inactive' && onRestore && (
            <RowActionButton
              action="restore"
              testId={`invoice-restore-${row.id}`}
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

export default InvoiceTable;
