import { useNavigate } from 'react-router';
import { Card, FilterToolbar } from '../../../shared/components/ui';
import { useAuth } from '../../../modules/auth';
import { useOrderList, useOrderListFilter } from '../hooks';
import { OrderTable } from '../components';
import { OrderPermissions } from '../permissions';
import { listEmptyState } from '../../../shared/constants';

const EMPTY_STATE = listEmptyState('Order');

function OrderListPage() {
  const navigate = useNavigate();
  const { can } = useAuth();
  const canView = can(OrderPermissions.view);

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
  } = useOrderListFilter();

  const {
    orders,
    totalRecords,
    isLoading,
    error,
    refresh,
  } = useOrderList(queryParams);

  const isEmptyState = !isFilterActive && orders.length === 0;
  const isFilteredEmptyState = isFilterActive && orders.length === 0;

  return (
    <div data-testid="order-list-page">
      <Card
        testId="order-list-card"
        title="Order List"
      >
        <div className="mb-4">
          <FilterToolbar
            testId="order-filter"
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
        <OrderTable
          testId="order-table"
          data={orders}
          totalRecords={totalRecords}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={handlePageSizeChange}
          stickyAction
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
          onView={canView ? (item) => navigate(`/orders/${item.id}/view`) : undefined}
          isEmptyState={isEmptyState}
          isFilteredEmptyState={isFilteredEmptyState}
          emptyStateTitle={EMPTY_STATE.title}
          emptyStateDescription={EMPTY_STATE.description}
          loading={isLoading}
          error={error}
          onRetry={refresh}
        />
      </Card>
    </div>
  );
}

export default OrderListPage;
