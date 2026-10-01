import type { OrderListItem } from '../types';
import { Table, Badge } from '../../../shared/components/ui';
import {
  ViewIcon,
} from '../../../shared/components/icons';
import { capitalize, formatDateTime, formatDate } from '../../../shared/utils';

interface Props {
  testId?: string;
  data: OrderListItem[];
  totalRecords: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  sortKey?: string;
  sortDir?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  stickyAction?: boolean;
  onView?: (item: OrderListItem) => void;
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

function OrderTable({
  testId,
  onView,
  data,
  isEmptyState,
  isFilteredEmptyState,
  ...rest
}: Props) {
  const columns = [
    { key: 'orderNumber', header: 'Order Number', sortable: true },
    { key: 'orderDate', header: 'Order Date', sortable: true, render: (row: OrderListItem) => formatDate(row.orderDate) },
    { key: 'created_by', header: 'Created By' },
    {
      key: 'created_date',
      header: 'Created Date',
      render: (row: OrderListItem) => formatDateTime(row.created_date),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: false,
      className: 'w-32',
      render: (row: OrderListItem) => (
        <Badge variant={row.status === 'active' ? 'success' : 'secondary'}>
          {capitalize(row.status)}
        </Badge>
      ),
    },
  ];

  return (
    <Table<OrderListItem>
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
              data-testid={`order-view-${row.id}`}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md hover:bg-muted"
              title={`View ${row.id}`}
              onClick={() => onView(row)}
            >
              <ViewIcon />
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

export default OrderTable;
