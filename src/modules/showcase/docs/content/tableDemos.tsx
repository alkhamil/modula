import { useState, type ComponentProps } from 'react';
import { Badge, Pagination, Table, TableToolbar } from '../../../../shared/components/ui';

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
}

const ROWS: Row[] = [
  { id: 1, name: 'Ayu Lestari', email: 'ayu@example.com', status: 'active' },
  { id: 2, name: 'Budi Santoso', email: 'budi@example.com', status: 'inactive' },
  { id: 3, name: 'Citra Dewi', email: 'citra@example.com', status: 'active' },
];

/** Demo Table: data contoh tetap; pagination disembunyikan (ada di halaman Pagination). */
export function TableDemo(
  props: Pick<
    ComponentProps<typeof Table<Row>>,
    'headerStyle' | 'dense' | 'showRowNumber' | 'loading' | 'isRowHighlighted'
  > & { highlightFirst?: boolean },
) {
  const { highlightFirst, ...rest } = props;
  return (
    <div className="w-full">
      <Table<Row>
        {...rest}
        isRowHighlighted={highlightFirst ? (row) => row.id === 1 : undefined}
        columns={[
          { key: 'name', header: 'Name', sortable: true },
          { key: 'email', header: 'Email' },
          {
            key: 'status',
            header: 'Status',
            render: (row) => (
              <Badge variant={row.status === 'active' ? 'success' : 'neutral'}>{row.status}</Badge>
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
        hidePagination
        hideTotalRecords
        hideActionColumn
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
