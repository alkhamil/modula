import { t } from 'i18next';
import '../../../../shared/i18n';
import type { RegionListItem } from '../types';
import { Table, Badge, RowActionButton } from '../../../../shared/components/ui';
import { formatDateTime } from '../../../../shared/utils';

interface Props {
  testId?: string;
  data: RegionListItem[];
  totalRecords: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  sortKey?: string;
  sortDir?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  stickyAction?: boolean;
  onView?: (item: RegionListItem) => void;
  onEdit?: (item: RegionListItem) => void;
  onDelete?: (item: RegionListItem) => void;
  onRestore?: (item: RegionListItem) => void;
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

function RegionTable({
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
    { key: 'name', header: t('region.fields.name.label'), sortable: true },
    { key: 'code', header: t('region.fields.code.label') },
    { key: 'created_by', header: t('table.createdBy') },
    {
      key: 'created_date',
      header: t('table.createdDate'),
      render: (row: RegionListItem) => formatDateTime(row.created_date),
    },
    {
      key: 'status',
      header: t('table.status'),
      sortable: false,
      className: 'w-32',
      render: (row: RegionListItem) => (
        <Badge variant={row.status === 'active' ? 'success' : 'secondary'}>
          {row.status === 'active' ? t('common.active') : t('common.inactive')}
        </Badge>
      ),
    },
  ];

  return (
    <Table<RegionListItem>
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
              testId={`region-view-${row.id}`}
              title={`View ${row.id}`}
              onClick={() => onView(row)}
            />
          )}
          {onEdit && (
            <RowActionButton
              action="edit"
              testId={`region-edit-${row.id}`}
              title={`Edit ${row.id}`}
              onClick={() => onEdit(row)}
            />
          )}
          {row.status === 'active' && onDelete && (
            <RowActionButton
              action="delete"
              testId={`region-delete-${row.id}`}
              title={`Delete ${row.id}`}
              onClick={() => onDelete(row)}
              disabled={isDeleting}
            />
          )}
          {row.status === 'inactive' && onRestore && (
            <RowActionButton
              action="restore"
              testId={`region-restore-${row.id}`}
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

export default RegionTable;
