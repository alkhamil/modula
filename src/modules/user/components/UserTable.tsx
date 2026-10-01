import type { UserListItem } from '../types';
import { Table, Badge } from '../../../shared/components/ui';
import {
  PencilIcon,
  TrashIcon,
  ViewIcon,
  RestoreIcon,
} from '../../../shared/components/icons';
import { capitalize, formatDateTime } from '../../../shared/utils';

interface Props {
  testId?: string;
  data: UserListItem[];
  totalRecords: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  sortKey?: string;
  sortDir?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  stickyAction?: boolean;
  onView?: (user: UserListItem) => void;
  onEdit?: (user: UserListItem) => void;
  onDelete?: (user: UserListItem) => void;
  onRestore?: (user: UserListItem) => void;
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

function UserTable({
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
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      className: 'w-64',
    },
    { key: 'email', header: 'Email', sortable: true, className: 'w-72' },
    { key: 'role', header: 'Role', sortable: true, className: 'w-32' },
    { key: 'created_by', header: 'Created By', className: 'w-40' },
    {
      key: 'created_date',
      header: 'Created Date',
      className: 'w-44',
      render: (user: UserListItem) => formatDateTime(user.created_date),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: false,
      className: 'w-32',
      render: (user: UserListItem) => (
        <Badge variant={user.status === 'active' ? 'success' : 'secondary'}>
          {capitalize(user.status)}
        </Badge>
      ),
    },
  ];

  return (
    <Table<UserListItem>
      actionWidth="w-40"
      testId={testId}
      columns={columns}
      data={data}
      rowKey={(r) => String(r.id)}
      fixedLayout={true}
      renderAction={(user) => (
        <div className="flex justify-evenly w-full gap-1">
          {onView && (
            <button
              data-testid={`user-view-${user.id}`}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md hover:bg-muted"
              title={`View ${user.name}`}
              onClick={() => onView(user)}
            >
              <ViewIcon />
            </button>
          )}
          {onEdit && (
            <button
              data-testid={`user-edit-${user.id}`}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md hover:bg-muted"
              title={`Edit ${user.name}`}
              onClick={() => onEdit(user)}
            >
              <PencilIcon />
            </button>
          )}
          {user.status === 'active' && onDelete && (
            <button
              data-testid={`user-delete-${user.id}`}
              className={`flex h-7 w-7 items-center justify-center rounded-md ${isDeleting ? 'cursor-not-allowed opacity-40' : 'hover:bg-muted cursor-pointer'}`}
              title={`Delete ${user.name}`}
              onClick={() => onDelete(user)}
              disabled={isDeleting}
            >
              <TrashIcon />
            </button>
          )}
          {user.status === 'inactive' && onRestore && (
            <button
              data-testid={`user-restore-${user.id}`}
              className={`flex h-7 w-7 items-center justify-center rounded-md ${isRestoring ? 'cursor-not-allowed opacity-40' : 'hover:bg-muted cursor-pointer'}`}
              title={`Restore ${user.name}`}
              onClick={() => onRestore(user)}
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

export default UserTable;
