import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, Button, FilterToolbar } from '../../../shared/components/ui';
import { PlusIcon, ExportIcon, UploadFileIcon } from '../../../shared/components/icons';

import { useAuth } from '../../../modules/auth';
import { useNewClaimList, useNewClaimListFilter, useNewClaimExport } from '../hooks';
import { NewClaimTable, NewClaimBulkUploadDialog } from '../components';
import { NewClaimPermissions } from '../permissions';
import { listEmptyState } from '../../../shared/constants';

const EMPTY_STATE = listEmptyState('NewClaim');

function NewClaimListPage() {
  const navigate = useNavigate();
  const { can } = useAuth();
  const canView = can(NewClaimPermissions.view);
  const canCreate = can(NewClaimPermissions.create);
  const canUpdate = can(NewClaimPermissions.update);
  const canExport = can(NewClaimPermissions.export);
  const canBulkUpload = can(NewClaimPermissions.bulkUpload);
  const [bulkOpen, setBulkOpen] = useState(false);
  const { exportData, isExporting } = useNewClaimExport();

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
  } = useNewClaimListFilter();

  const {
    newClaims,
    totalRecords,
    isLoading,
    error,
    refresh,
  } = useNewClaimList(queryParams);

  const isEmptyState = !isFilterActive && newClaims.length === 0;
  const isFilteredEmptyState = isFilterActive && newClaims.length === 0;

  return (
    <div data-testid="new-claim-list-page">
      <Card
        testId="new-claim-list-card"
        title="NewClaim List"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {canExport && (
              <Button
                data-testid="new-claim-export-button"
                variant="secondary"
                icon={<ExportIcon />}
                onClick={() => exportData(queryParams)}
                disabled={isExporting}
              >
                {isExporting ? 'Mengekspor…' : 'Export'}
              </Button>
            )}
            {canBulkUpload && (
              <Button
                data-testid="new-claim-bulk-upload-button"
                variant="secondary"
                icon={<UploadFileIcon />}
                onClick={() => setBulkOpen(true)}
              >
                Bulk Upload
              </Button>
            )}
            {canCreate && (
              <Button
                data-testid="new-claim-create-button"
                icon={<PlusIcon />}
                onClick={() => navigate('/new-claims/create')}
              >
                Create NewClaim
              </Button>
            )}
          </div>
        }
      >
        <div className="mb-4">
          <FilterToolbar
            testId="new-claim-filter"
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
        <NewClaimTable
          testId="new-claim-table"
          data={newClaims}
          totalRecords={totalRecords}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={handlePageSizeChange}
          stickyAction
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
          onView={canView ? (item) => navigate(`/new-claims/${item.id}/view`) : undefined}
          onEdit={canUpdate ? (item) => navigate(`/new-claims/${item.id}/edit`) : undefined}
          isEmptyState={isEmptyState}
          isFilteredEmptyState={isFilteredEmptyState}
          emptyStateTitle={EMPTY_STATE.title}
          emptyStateDescription={EMPTY_STATE.description}
          loading={isLoading}
          error={error}
          onRetry={refresh}
        />
      </Card>
      <NewClaimBulkUploadDialog open={bulkOpen} onClose={() => setBulkOpen(false)} />
    </div>
  );
}

export default NewClaimListPage;
