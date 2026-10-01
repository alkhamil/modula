import type { ProductListItem } from '../types';
import { Table, Badge } from '../../../../shared/components/ui';
import {
  ViewIcon,
  PencilIcon,
  TrashIcon,
  RestoreIcon,
} from '../../../../shared/components/icons';
import { capitalize, formatDateTime } from '../../../../shared/utils';

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
    { key: 'productName', header: 'Product Name', sortable: true },
    { key: 'productCode', header: 'Product Code' },
    { key: 'category', header: 'Category', render: (row: ProductListItem) => capitalize(String(row.category)) },
    { key: 'created_by', header: 'Created By' },
    {
      key: 'created_date',
      header: 'Created Date',
      render: (row: ProductListItem) => formatDateTime(row.created_date),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: false,
      className: 'w-32',
      render: (row: ProductListItem) => (
        <Badge variant={row.status === 'active' ? 'success' : 'secondary'}>
          {capitalize(row.status)}
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
            <button
              data-testid={`product-view-${row.id}`}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md hover:bg-muted"
              title={`View ${row.id}`}
              onClick={() => onView(row)}
            >
              <ViewIcon />
            </button>
          )}
          {onEdit && (
            <button
              data-testid={`product-edit-${row.id}`}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md hover:bg-muted"
              title={`Edit ${row.id}`}
              onClick={() => onEdit(row)}
            >
              <PencilIcon />
            </button>
          )}
          {row.status === 'active' && onDelete && (
            <button
              data-testid={`product-delete-${row.id}`}
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
              data-testid={`product-restore-${row.id}`}
              className={`flex h-7 w-7 items-center justify-center rounded-md ${isRestoring ? 'cursor-not-allowed opacity-40' : 'hover:bg-muted cursor-pointer'}`}
              title={`Restore ${row.id}`}
              onClick={() => onRestore(row)}
              disabled={isRestoring}
            >
              <RestoreIcon />
            </button>
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
