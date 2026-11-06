import { t } from 'i18next';
import '../../../../shared/i18n';
import type { UserListItem } from '../types';
import { Table, Badge, RowActionButton } from '../../../../shared/components/ui';

import { formatDateTime } from '../../../../shared/utils';

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
      header: t('user.fields.name.label'),
      sortable: true,
      className: 'w-44',
    },
    { key: 'username', header: t('user.fields.username.label'), sortable: true, className: 'w-40' },
    { key: 'email', header: t('user.fields.email.label'), className: 'w-60' },
    { key: 'role_name', header: t('user.fields.role.label'), className: 'w-32' },
    { key: 'created_by', header: t('table.createdBy'), className: 'w-24' },
    {
      key: 'created_date',
      header: t('table.createdDate'),
      render: (user: UserListItem) => formatDateTime(user.created_date),
      className: 'w-40',
    },
    {
      key: 'status',
      header: t('table.status'),
      sortable: false,
      className: 'w-28',
      render: (user: UserListItem) => (
        <Badge variant={user.status === 'active' ? 'success' : 'secondary'}>
          {user.status === 'active' ? t('common.active') : t('common.inactive')}
        </Badge>
      ),
    },
  ];

  return (
    <Table<UserListItem>
      actionWidth="w-32"
      testId={testId}
      columns={columns}
      data={data}
      rowKey={(r) => String(r.id)}
      fixedLayout={true}
      headerStyle="gray"
      showRowNumber
      hideTotalRecords
      renderAction={(user) => (
        <div className="flex justify-evenly w-full gap-1">
          {onView && (
            <RowActionButton
              action="view"
              testId={`user-view-${user.id}`}
              title={`View ${user.name}`}
              onClick={() => onView(user)}
            />
          )}
          {onEdit && (
            <RowActionButton
              action="edit"
              testId={`user-edit-${user.id}`}
              title={`Edit ${user.name}`}
              onClick={() => onEdit(user)}
            />
          )}
          {user.status === 'active' && onDelete && (
            <RowActionButton
              action="delete"
              testId={`user-delete-${user.id}`}
              title={`Delete ${user.name}`}
              onClick={() => onDelete(user)}
              disabled={isDeleting}
            />
          )}
          {user.status === 'inactive' && onRestore && (
            <RowActionButton
              action="restore"
              testId={`user-restore-${user.id}`}
              title={`Restore ${user.name}`}
              onClick={() => onRestore(user)}
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

export default UserTable;
