import { useNavigate } from 'react-router';
import { Card, Button, FilterToolbar, Dialog } from '../../../../shared/components/ui';
import { PlusIcon, ConfirmInfoIcon } from '../../../../shared/components/icons';
import { useCompanyList, useCompanyListFilter } from '../hooks';
import { CompanyTable } from '../components';
import { listEmptyState } from '../../../../shared/constants';

const EMPTY_STATE = listEmptyState('Company');

function CompanyListPage() {
  const navigate = useNavigate();
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
  } = useCompanyListFilter();

  const {
    companys,
    totalRecords,
    isLoading,
    error,
    refresh,
    deleteTarget,
    isDeleting,
    handleDeleteClick,
    handleDeleteCancel,
    handleDelete,
    restoreTarget,
    isRestoring,
    handleRestoreClick,
    handleRestoreCancel,
    handleRestore,
  } = useCompanyList(queryParams);

  const isEmptyState = !isFilterActive && companys.length === 0;
  const isFilteredEmptyState = isFilterActive && companys.length === 0;

  return (
    <div data-testid="company-list-page">
      <Card
        testId="company-list-card"
        title="Company List"
        actions={
          <Button
            data-testid="company-create-button"
            icon={<PlusIcon />}
            onClick={() => navigate('/mater-data/companies/create')}
          >
            Create Company
          </Button>
        }
      >
        <div className="mb-4">
          <FilterToolbar
            testId="company-filter"
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
        <CompanyTable
          testId="company-table"
          data={companys}
          totalRecords={totalRecords}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={handlePageSizeChange}
          stickyAction
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
          onView={(item) => navigate(`/mater-data/companies/${item.id}/view`)}
          onEdit={(item) => navigate(`/mater-data/companies/${item.id}/edit`)}
          onDelete={handleDeleteClick}
          onRestore={handleRestoreClick}
          isDeleting={isDeleting}
          isRestoring={isRestoring}
          isEmptyState={isEmptyState}
          isFilteredEmptyState={isFilteredEmptyState}
          emptyStateTitle={EMPTY_STATE.title}
          emptyStateDescription={EMPTY_STATE.description}
          loading={isLoading}
          error={error}
          onRetry={refresh}
        />
      </Card>

      <Dialog
        testId="company-deactivate-dialog"
        open={!!deleteTarget}
        onClose={handleDeleteCancel}
        maxWidth="md"
        closeOnEscape
        closeOnBackdropClick
      >
        <div className="flex items-start gap-4">
          <ConfirmInfoIcon className="h-12 w-12 shrink-0" />
          <div>
            <p className="text-base font-medium text-foreground">
              Are you sure you want to delete this item?
            </p>
            <p className="mt-1 text-sm font-normal text-muted-foreground">
              The selected item will be deactivated but not permanently deleted. You can restore it
              later if needed.
            </p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            className="w-25"
            data-testid="company-deactivate-cancel"
            onClick={handleDeleteCancel}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            data-testid="company-deactivate-confirm"
            className="w-25"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            Delete
          </Button>
        </div>
      </Dialog>

      <Dialog
        testId="company-restore-dialog"
        open={!!restoreTarget}
        onClose={handleRestoreCancel}
        maxWidth="md"
        closeOnEscape
        closeOnBackdropClick
      >
        <div className="flex items-start gap-4">
          <ConfirmInfoIcon className="h-12 w-12 shrink-0" />
          <div>
            <p className="text-base font-medium text-foreground">
              Are you sure you want to restore this item?
            </p>
            <p className="mt-1 text-sm font-normal text-muted-foreground">
              The item will become active again and available for use.
            </p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            className="w-25"
            data-testid="company-restore-cancel"
            onClick={handleRestoreCancel}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            data-testid="company-restore-confirm"
            className="w-25"
            onClick={handleRestore}
            disabled={isRestoring}
          >
            Restore
          </Button>
        </div>
      </Dialog>
    </div>
  );
}

export default CompanyListPage;
