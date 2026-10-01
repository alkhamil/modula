import type { BranchListItem } from '../types';
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
  data: BranchListItem[];
  totalRecords: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  sortKey?: string;
  sortDir?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  stickyAction?: boolean;
  onView?: (item: BranchListItem) => void;
  onEdit?: (item: BranchListItem) => void;
  onDelete?: (item: BranchListItem) => void;
  onRestore?: (item: BranchListItem) => void;
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

function BranchTable({
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
    { key: 'branchName', header: 'Branch Name', sortable: true },
    { key: 'branchCode', header: 'Branch Code', sortable: true },
    { key: 'created_by', header: 'Created By' },
    {
      key: 'created_date',
      header: 'Created Date',
      render: (row: BranchListItem) => formatDateTime(row.created_date),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: false,
      className: 'w-32',
      render: (row: BranchListItem) => (
        <Badge variant={row.status === 'active' ? 'success' : 'secondary'}>
          {capitalize(row.status)}
        </Badge>
      ),
    },
  ];

  return (
    <Table<BranchListItem>
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
              data-testid={`branch-view-${row.id}`}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md hover:bg-muted"
              title={`View ${row.id}`}
              onClick={() => onView(row)}
            >
              <ViewIcon />
            </button>
          )}
          {onEdit && (
            <button
              data-testid={`branch-edit-${row.id}`}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md hover:bg-muted"
              title={`Edit ${row.id}`}
              onClick={() => onEdit(row)}
            >
              <PencilIcon />
            </button>
          )}
          {row.status === 'active' && onDelete && (
            <button
              data-testid={`branch-delete-${row.id}`}
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
              data-testid={`branch-restore-${row.id}`}
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

export default BranchTable;
