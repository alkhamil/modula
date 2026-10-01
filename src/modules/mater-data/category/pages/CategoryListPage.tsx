import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, Button, FilterToolbar, Dialog } from '../../../../shared/components/ui';
import { PlusIcon, ConfirmInfoIcon, ExportIcon, UploadFileIcon } from '../../../../shared/components/icons';

import { useAuth } from '../../../../modules/auth';
import { useCategoryList, useCategoryListFilter, useCategoryExport } from '../hooks';
import { CategoryTable, CategoryBulkUploadDialog } from '../components';
import { CategoryPermissions } from '../permissions';
import { listEmptyState } from '../../../../shared/constants';

const EMPTY_STATE = listEmptyState('Category');

function CategoryListPage() {
  const navigate = useNavigate();
  const { can } = useAuth();
  const canView = can(CategoryPermissions.view);
  const canCreate = can(CategoryPermissions.create);
  const canUpdate = can(CategoryPermissions.update);
  const canDelete = can(CategoryPermissions.delete);
  const canExport = can(CategoryPermissions.export);
  const canBulkUpload = can(CategoryPermissions.bulkUpload);
  const [bulkOpen, setBulkOpen] = useState(false);
  const { exportData, isExporting } = useCategoryExport();

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
  } = useCategoryListFilter();

  const {
    categorys,
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
  } = useCategoryList(queryParams);

  const isEmptyState = !isFilterActive && categorys.length === 0;
  const isFilteredEmptyState = isFilterActive && categorys.length === 0;

  return (
    <div data-testid="category-list-page">
      <Card
        testId="category-list-card"
        title="Category List"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {canExport && (
              <Button
                data-testid="category-export-button"
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
                data-testid="category-bulk-upload-button"
                variant="secondary"
                icon={<UploadFileIcon />}
                onClick={() => setBulkOpen(true)}
              >
                Bulk Upload
              </Button>
            )}
            {canCreate && (
              <Button
                data-testid="category-create-button"
                icon={<PlusIcon />}
                onClick={() => navigate('/mater-data/categories/create')}
              >
                Create Category
              </Button>
            )}
          </div>
        }
      >
        <div className="mb-4">
          <FilterToolbar
            testId="category-filter"
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
        <CategoryTable
          testId="category-table"
          data={categorys}
          totalRecords={totalRecords}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={handlePageSizeChange}
          stickyAction
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
          onView={canView ? (item) => navigate(`/mater-data/categories/${item.id}/view`) : undefined}
          onEdit={canUpdate ? (item) => navigate(`/mater-data/categories/${item.id}/edit`) : undefined}
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
      <CategoryBulkUploadDialog open={bulkOpen} onClose={() => setBulkOpen(false)} />

      <Dialog
        testId="category-deactivate-dialog"
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
            data-testid="category-deactivate-cancel"
            onClick={handleDeleteCancel}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            data-testid="category-deactivate-confirm"
            className="w-25"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            Delete
          </Button>
        </div>
      </Dialog>

      <Dialog
        testId="category-restore-dialog"
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
            data-testid="category-restore-cancel"
            onClick={handleRestoreCancel}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            data-testid="category-restore-confirm"
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

export default CategoryListPage;
