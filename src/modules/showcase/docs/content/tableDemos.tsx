import { useState, type ComponentProps } from 'react';
import { Badge, Pagination, Table, TableToolbar, UserCell } from '../../../../shared/components/ui';
import { Download, TrashBinTrash } from '../../../../shared/components/icons';

/** Demo Pagination: state halaman dikelola di sini; jumlah halaman tetap. */
export function PaginationDemo(
  props: Omit<ComponentProps<typeof Pagination>, 'page' | 'onPageChange' | 'totalPages'>,
) {
  const [page, setPage] = useState(3);
  const [pageSize, setPageSize] = useState(10);
  return (
    <div className="w-full">
      <Pagination
        {...props}
        page={page}
        totalPages={12}
        onPageChange={setPage}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}

interface Row {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  role: string;
  labels: string[];
}

const ROWS: Row[] = [
  { id: 1, name: 'Olivia Rhye', email: 'olivia@example.com', status: 'active', role: 'Product Designer', labels: ['Design', 'Product', 'Research'] },
  { id: 2, name: 'Phoenix Baker', email: 'phoenix@example.com', status: 'inactive', role: 'Product Manager', labels: ['Product', 'Strategy'] },
  { id: 3, name: 'Lana Steiner', email: 'lana@example.com', status: 'active', role: 'Frontend Developer', labels: ['Engineering'] },
];

/** Demo Table: komposisi sel seperti Figma (avatar + nama, badge status, label, ikon aksi). */
export function TableDemo(
  props: Pick<
    ComponentProps<typeof Table<Row>>,
    'headerStyle' | 'dense' | 'showRowNumber' | 'loading' | 'isRowHighlighted'
  > & { highlightFirst?: boolean },
) {
  const { highlightFirst, ...rest } = props;
  return (
    <div className="w-[760px] max-w-none">
      <Table<Row>
        {...rest}
        isRowHighlighted={highlightFirst ? (row) => row.id === 1 : undefined}
        columns={[
          { key: 'name', header: 'Name', sortable: true, render: (row) => <UserCell name={row.name} supporting={row.email} /> },
          { key: 'status', header: 'Status', render: (row) => <Badge variant={row.status === 'active' ? 'success' : 'neutral'}>{row.status}</Badge> },
          { key: 'role', header: 'Role' },
          {
            key: 'labels',
            header: 'Label',
            render: (row) => (
              <div className="flex gap-1">
                {row.labels.map((l) => (
                  <Badge key={l} variant="info">
                    {l}
                  </Badge>
                ))}
              </div>
            ),
          },
        ]}
        data={ROWS}
        totalRecords={ROWS.length}
        page={1}
        pageSize={10}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
        rowKey={(row) => row.id}
        renderAction={() => (
          <>
            <Download className="h-5 w-5 text-(--wds-icons-secondary)" />
            <TrashBinTrash className="h-5 w-5 text-(--wds-icons-danger)" />
          </>
        )}
        hidePagination
        hideTotalRecords
      />
    </div>
  );
}

const FILTER_FIELDS = [
  {
    name: 'status',
    label: 'Status',
    type: 'select' as const,
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
    ],
  },
];

/** Demo TableToolbar: pencarian + tombol filter; `filtered` mensimulasikan filter aktif. */
export function TableToolbarDemo(
  props: Pick<ComponentProps<typeof TableToolbar>, 'searchPlaceholder' | 'withFilterButton' | 'filterTitle'> & {
    filtered?: boolean;
  },
) {
  const { filtered, ...rest } = props;
  const [search, setSearch] = useState('');
  const [values, setValues] = useState<Record<string, string>>({});
  return (
    <div className="w-full">
      <TableToolbar
        {...rest}
        searchValue={search}
        onSearchChange={setSearch}
        filterFields={FILTER_FIELDS}
        filterValues={filtered ? { status: 'active' } : values}
        onApply={setValues}
        onReset={() => setValues({})}
      />
    </div>
  );
}
