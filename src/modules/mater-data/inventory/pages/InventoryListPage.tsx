import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, Button, FilterToolbar, Dialog } from '../../../../shared/components/ui';
import { PlusIcon, ConfirmInfoIcon, ExportIcon, UploadFileIcon } from '../../../../shared/components/icons';

import { useAuth } from '../../../../modules/auth';
import { useInventoryList, useInventoryListFilter, useInventoryExport } from '../hooks';
import { InventoryTable, InventoryBulkUploadDialog } from '../components';
import { InventoryPermissions } from '../permissions';
import { listEmptyState } from '../../../../shared/constants';

const EMPTY_STATE = listEmptyState('Inventory');

function InventoryListPage() {
  const navigate = useNavigate();
  const { can } = useAuth();
  const canView = can(InventoryPermissions.view);
  const canCreate = can(InventoryPermissions.create);
  const canUpdate = can(InventoryPermissions.update);
  const canDelete = can(InventoryPermissions.delete);
  const canExport = can(InventoryPermissions.export);
  const canBulkUpload = can(InventoryPermissions.bulkUpload);
  const [bulkOpen, setBulkOpen] = useState(false);
  const { exportData, isExporting } = useInventoryExport();

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
  } = useInventoryListFilter();

  const {
    inventorys,
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
  } = useInventoryList(queryParams);

  const isEmptyState = !isFilterActive && inventorys.length === 0;
  const isFilteredEmptyState = isFilterActive && inventorys.length === 0;

  return (
    <div data-testid="inventory-list-page">
      <Card
        testId="inventory-list-card"
        title="Inventory List"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {canExport && (
              <Button
                data-testid="inventory-export-button"
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
                data-testid="inventory-bulk-upload-button"
                variant="secondary"
                icon={<UploadFileIcon />}
                onClick={() => setBulkOpen(true)}
              >
                Bulk Upload
              </Button>
            )}
            {canCreate && (
              <Button
                data-testid="inventory-create-button"
                icon={<PlusIcon />}
                onClick={() => navigate('/mater-data/inventories/create')}
              >
                Create Inventory
              </Button>
            )}
          </div>
        }
      >
        <div className="mb-4">
          <FilterToolbar
            testId="inventory-filter"
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
        <InventoryTable
          testId="inventory-table"
          data={inventorys}
          totalRecords={totalRecords}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={handlePageSizeChange}
          stickyAction
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
          onView={canView ? (item) => navigate(`/mater-data/inventories/${item.id}/view`) : undefined}
          onEdit={canUpdate ? (item) => navigate(`/mater-data/inventories/${item.id}/edit`) : undefined}
          onDelete={canDelete ? handleDeleteClick : undefined}
          onRestore={canDelete ? handleRestoreClick : undefined}
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
      <InventoryBulkUploadDialog open={bulkOpen} onClose={() => setBulkOpen(false)} />

      <Dialog
        testId="inventory-deactivate-dialog"
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
            data-testid="inventory-deactivate-cancel"
            onClick={handleDeleteCancel}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            data-testid="inventory-deactivate-confirm"
            className="w-25"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            Delete
          </Button>
        </div>
      </Dialog>

      <Dialog
        testId="inventory-restore-dialog"
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
            data-testid="inventory-restore-cancel"
            onClick={handleRestoreCancel}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            data-testid="inventory-restore-confirm"
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

export default InventoryListPage;
