import { t } from 'i18next';
import '../../../../shared/i18n';
import type { RoleListItem } from '../types';
import { Table, Badge, RowActionButton } from '../../../../shared/components/ui';

import { formatDateTime } from '../../../../shared/utils';

interface Props {
  testId?: string;
  data: RoleListItem[];
  totalRecords: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  sortKey?: string;
  sortDir?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  stickyAction?: boolean;
  onView?: (role: RoleListItem) => void;
  onEdit?: (role: RoleListItem) => void;
  onDelete?: (role: RoleListItem) => void;
  onRestore?: (role: RoleListItem) => void;
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

function RoleTable({
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
      header: t('role.fields.name.label'),
      sortable: true,
      className: 'w-64',
    },
    {
      key: 'permissions',
      header: t('role.fields.permissions.label'),
      render: (role: RoleListItem) => role.permissions.join(', ') || '-',
    },
    { key: 'created_by', header: t('table.createdBy') },
    {
      key: 'created_date',
      header: t('table.createdDate'),
      render: (role: RoleListItem) => formatDateTime(role.created_date),
    },
    {
      key: 'status',
      header: t('table.status'),
      sortable: false,
      className: 'w-32',
      render: (role: RoleListItem) => (
        <Badge variant={role.status === 'active' ? 'success' : 'secondary'}>
          {role.status === 'active' ? t('common.active') : t('common.inactive')}
        </Badge>
      ),
    },
  ];

  return (
    <Table<RoleListItem>
      actionWidth="w-40"
      testId={testId}
      columns={columns}
      data={data}
      rowKey={(r) => String(r.id)}
      fixedLayout={true}
      headerStyle="gray"
      showRowNumber
      hideTotalRecords
      renderAction={(role) => (
        <div className="flex justify-evenly w-full gap-1">
          {onView && (
            <RowActionButton
              action="view"
              testId={`role-view-${role.id}`}
              title={`View ${role.name}`}
              onClick={() => onView(role)}
            />
          )}
          {onEdit && (
            <RowActionButton
              action="edit"
              testId={`role-edit-${role.id}`}
              title={`Edit ${role.name}`}
              onClick={() => onEdit(role)}
            />
          )}
          {role.status === 'active' && onDelete && (
            <RowActionButton
              action="delete"
              testId={`role-delete-${role.id}`}
              title={`Delete ${role.name}`}
              onClick={() => onDelete(role)}
              disabled={isDeleting}
            />
          )}
          {role.status === 'inactive' && onRestore && (
            <RowActionButton
              action="restore"
              testId={`role-restore-${role.id}`}
              title={`Restore ${role.name}`}
              onClick={() => onRestore(role)}
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

export default RoleTable;
