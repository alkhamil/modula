/** Halaman list generik — difokuskan baca (filter/sort/paging); aksi tulis menyusul Fase 5. */
import { useNavigate } from 'react-router';
import { Button, Card, FilterToolbar } from '../../../shared/components/ui';
import { PlusIcon } from '../../../shared/components/icons';
import { useAuth } from '../../auth';
import { listEmptyState } from '../../../shared/constants';
import type { ModuleDefinition } from '../definitions';
import { definitionPermissions, definitionTestId } from './types';
import { useDynamicList, useDynamicListFilter } from './hooks';
import DynamicTable from './DynamicTable';

function DynamicListPage({ def }: { def: ModuleDefinition }) {
  const navigate = useNavigate();
  const { can } = useAuth();
  const permissions = definitionPermissions(def.permissionKey);
  const canCreate = can(permissions.create);
  const testPrefix = definitionTestId(def.key);
  const emptyState = listEmptyState(def.singularLabel);

  const {
    filterFields,
    page,
    setPage,
    pageSize,
    handlePageSizeChange,
    sortKey,
    sortDir,
    searchQuery,
    filterValues,
    queryParams,
    isFilterActive,
    handleSearchChange,
    handleApply,
    handleReset,
    handleSort,
  } = useDynamicListFilter(def);

  const { rows, totalRecords, isLoading, error, refresh } = useDynamicList(def, queryParams);

  const isEmptyState = !isFilterActive && rows.length === 0;
  const isFilteredEmptyState = isFilterActive && rows.length === 0;

  return (
    <div data-testid={`${testPrefix}-list-page`}>
      <Card
        testId={`${testPrefix}-list-card`}
        title={`${def.singularLabel} List`}
        actions={
          def.features.create && canCreate ? (
            <div className="flex flex-wrap items-center gap-2">
              <Button
                data-testid={`${testPrefix}-create-button`}
                icon={<PlusIcon />}
                onClick={() => navigate(`/${def.routeBase}/create`)}
              >
                Create {def.singularLabel}
              </Button>
            </div>
          ) : undefined
        }
      >
        <div className="mb-4">
          <FilterToolbar
            testId={`${testPrefix}-filter`}
            searchValue={searchQuery}
            onSearchChange={handleSearchChange}
            filterFields={filterFields}
            filterValues={filterValues}
            onApply={handleApply}
            onReset={handleReset}
            searchPlaceholder="Search"
            searchParamName="search"
          />
        </div>
        <DynamicTable
          testId={`${testPrefix}-table`}
          def={def}
          data={rows}
          totalRecords={totalRecords}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={handlePageSizeChange}
          stickyAction
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
          isEmptyState={isEmptyState}
          isFilteredEmptyState={isFilteredEmptyState}
          emptyStateTitle={emptyState.title}
          emptyStateDescription={emptyState.description}
          loading={isLoading}
          error={error}
          onRetry={refresh}
        />
      </Card>
    </div>
  );
}

export default DynamicListPage;
