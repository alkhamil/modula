import type { CompanyListItem } from '../types';
import { Table, Badge } from '../../../../shared/components/ui';
import {
  Eye,
  Pencil,
  Trash2,
  RotateCcw,
} from 'lucide-react';
import { capitalize, formatDateTime } from '../../../../shared/utils';

interface Props {
  testId?: string;
  data: CompanyListItem[];
  totalRecords: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  sortKey?: string;
  sortDir?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  stickyAction?: boolean;
  onView?: (item: CompanyListItem) => void;
  onEdit?: (item: CompanyListItem) => void;
  onDelete?: (item: CompanyListItem) => void;
  onRestore?: (item: CompanyListItem) => void;
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

function CompanyTable({
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
    { key: 'name', header: 'Name', sortable: true, width: 256 },
    { key: 'description', header: 'Description', width: 207 },
    { key: 'created_by', header: 'Created By', width: 186 },
    {
      key: 'created_date',
      header: 'Created Date',
      width: 199,
      render: (row: CompanyListItem) => formatDateTime(row.created_date),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: false,
      width: 198,
      className: 'w-32',
      render: (row: CompanyListItem) => (
        <Badge variant={row.status === 'active' ? 'success' : 'secondary'}>
          {capitalize(row.status)}
        </Badge>
      ),
    },
  ];

  return (
    <Table<CompanyListItem>
      actionWidth="w-40"
      testId={testId}
      columns={columns}
      data={data}
      rowKey={(r) => String(r.id)}
      fixedLayout={true}
      stickyHeader
      stickyAction
      actionPosition="right"
      renderAction={(row) => (
        <div className="flex justify-evenly w-full gap-1">
          {onView && (
            <button
              data-testid={`company-view-${row.id}`}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md hover:bg-muted"
              title={`View ${row.id}`}
              onClick={() => onView(row)}
            >
              <Eye className="h-4 w-4 text-info" />
            </button>
          )}
          {onEdit && (
            <button
              data-testid={`company-edit-${row.id}`}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md hover:bg-muted"
              title={`Edit ${row.id}`}
              onClick={() => onEdit(row)}
            >
              <Pencil className="h-4 w-4 text-warning" />
            </button>
          )}
          {row.status === 'active' && onDelete && (
            <button
              data-testid={`company-delete-${row.id}`}
              className={`flex h-7 w-7 items-center justify-center rounded-md ${isDeleting ? 'cursor-not-allowed opacity-40' : 'hover:bg-muted cursor-pointer'}`}
              title={`Delete ${row.id}`}
              onClick={() => onDelete(row)}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4 text-danger" />
            </button>
          )}
          {row.status === 'inactive' && onRestore && (
            <button
              data-testid={`company-restore-${row.id}`}
              className={`flex h-7 w-7 items-center justify-center rounded-md ${isRestoring ? 'cursor-not-allowed opacity-40' : 'hover:bg-muted cursor-pointer'}`}
              title={`Restore ${row.id}`}
              onClick={() => onRestore(row)}
              disabled={isRestoring}
            >
              <RotateCcw className="h-4 w-4 text-success" />
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

export default CompanyTable;
