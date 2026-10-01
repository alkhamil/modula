import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, Button, FilterToolbar, Dialog } from '../../../../shared/components/ui';
import { PlusIcon, ConfirmInfoIcon, ExportIcon, UploadFileIcon } from '../../../../shared/components/icons';

import { useAuth } from '../../../../modules/auth';
import { useProductVariantList, useProductVariantListFilter, useProductVariantExport } from '../hooks';
import { ProductVariantTable, ProductVariantBulkUploadDialog } from '../components';
import { ProductVariantPermissions } from '../permissions';
import { listEmptyState } from '../../../../shared/constants';

const EMPTY_STATE = listEmptyState('ProductVariant');

function ProductVariantListPage() {
  const navigate = useNavigate();
  const { can } = useAuth();
  const canView = can(ProductVariantPermissions.view);
  const canCreate = can(ProductVariantPermissions.create);
  const canUpdate = can(ProductVariantPermissions.update);
  const canDelete = can(ProductVariantPermissions.delete);
  const canExport = can(ProductVariantPermissions.export);
  const canBulkUpload = can(ProductVariantPermissions.bulkUpload);
  const [bulkOpen, setBulkOpen] = useState(false);
  const { exportData, isExporting } = useProductVariantExport();

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
  } = useProductVariantListFilter();

  const {
    productVariants,
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
  } = useProductVariantList(queryParams);

  const isEmptyState = !isFilterActive && productVariants.length === 0;
  const isFilteredEmptyState = isFilterActive && productVariants.length === 0;

  return (
    <div data-testid="product-variant-list-page">
      <Card
        testId="product-variant-list-card"
        title="ProductVariant List"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {canExport && (
              <Button
                data-testid="product-variant-export-button"
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
                data-testid="product-variant-bulk-upload-button"
                variant="secondary"
                icon={<UploadFileIcon />}
                onClick={() => setBulkOpen(true)}
              >
                Bulk Upload
              </Button>
            )}
            {canCreate && (
              <Button
                data-testid="product-variant-create-button"
                icon={<PlusIcon />}
                onClick={() => navigate('/mater-data/product-variants/create')}
              >
                Create ProductVariant
              </Button>
            )}
          </div>
        }
      >
        <div className="mb-4">
          <FilterToolbar
            testId="product-variant-filter"
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
        <ProductVariantTable
          testId="product-variant-table"
          data={productVariants}
          totalRecords={totalRecords}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={handlePageSizeChange}
          stickyAction
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
          onView={canView ? (item) => navigate(`/mater-data/product-variants/${item.id}/view`) : undefined}
          onEdit={canUpdate ? (item) => navigate(`/mater-data/product-variants/${item.id}/edit`) : undefined}
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
      <ProductVariantBulkUploadDialog open={bulkOpen} onClose={() => setBulkOpen(false)} />

      <Dialog
        testId="product-variant-deactivate-dialog"
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
            data-testid="product-variant-deactivate-cancel"
            onClick={handleDeleteCancel}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            data-testid="product-variant-deactivate-confirm"
            className="w-25"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            Delete
          </Button>
        </div>
      </Dialog>

      <Dialog
        testId="product-variant-restore-dialog"
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
            data-testid="product-variant-restore-cancel"
            onClick={handleRestoreCancel}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            data-testid="product-variant-restore-confirm"
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

export default ProductVariantListPage;
