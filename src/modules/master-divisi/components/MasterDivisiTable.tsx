import { t } from 'i18next';
import '../../../shared/i18n';
import type { MasterDivisiListItem } from '../types';
import { Table, Badge, RowActionButton } from '../../../shared/components/ui';
import { formatDateTime, formatNumber } from '../../../shared/utils';

interface Props {
  testId?: string;
  data: MasterDivisiListItem[];
  totalRecords: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  sortKey?: string;
  sortDir?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  stickyAction?: boolean;
  onView?: (item: MasterDivisiListItem) => void;
  onEdit?: (item: MasterDivisiListItem) => void;
  onDelete?: (item: MasterDivisiListItem) => void;
  onRestore?: (item: MasterDivisiListItem) => void;
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

function MasterDivisiTable({
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
    { key: 'divisionName', header: t('master_division.fields.divisionName.label'), sortable: true },
    { key: 'idAjalah', header: t('master_division.fields.idAjalah.label'), sortable: true, render: (row: MasterDivisiListItem) => formatNumber(row.idAjalah) },
    { key: 'created_by', header: t('table.createdBy') },
    {
      key: 'created_date',
      header: t('table.createdDate'),
      render: (row: MasterDivisiListItem) => formatDateTime(row.created_date),
    },
    {
      key: 'status',
      header: t('table.status'),
      sortable: false,
      className: 'w-32',
      render: (row: MasterDivisiListItem) => (
        <Badge variant={row.status === 'active' ? 'success' : 'secondary'}>
          {row.status === 'active' ? t('common.active') : t('common.inactive')}
        </Badge>
      ),
    },
  ];

  return (
    <Table<MasterDivisiListItem>
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
              testId={`master-divisi-view-${row.id}`}
              title={`View ${row.id}`}
              onClick={() => onView(row)}
            />
          )}
          {onEdit && (
            <RowActionButton
              action="edit"
              testId={`master-divisi-edit-${row.id}`}
              title={`Edit ${row.id}`}
              onClick={() => onEdit(row)}
            />
          )}
          {row.status === 'active' && onDelete && (
            <RowActionButton
              action="delete"
              testId={`master-divisi-delete-${row.id}`}
              title={`Delete ${row.id}`}
              onClick={() => onDelete(row)}
              disabled={isDeleting}
            />
          )}
          {row.status === 'inactive' && onRestore && (
            <RowActionButton
              action="restore"
              testId={`master-divisi-restore-${row.id}`}
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

export default MasterDivisiTable;
