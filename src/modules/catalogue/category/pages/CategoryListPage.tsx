import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Card, Button, FilterToolbar, Dialog } from '../../../../shared/components/ui';
import { Plus, Info, Download, Upload } from 'lucide-react';

import { useAuth } from '../../../../app/providers';
import { useCategoryList, useCategoryListFilter, useCategoryExport } from '../hooks';
import { CategoryTable, CategoryBulkUploadDialog } from '../components';
import { CategoryPermissions } from '../permissions';
import { listEmptyState } from '../../../../shared/constants';
import { t } from 'i18next';
import '../../../../shared/i18n';

const EMPTY_STATE = listEmptyState(t('category.label'));

function CategoryListPage() {
  const { t } = useTranslation();
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
        title={t('runtime.listTitle', { singular: t('category.label') })}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {canExport && (
              <Button
                data-testid="category-export-button"
                variant="secondary"
                icon={<Download />}
                onClick={() => exportData(queryParams)}
                disabled={isExporting}
              >
                {isExporting ? t('runtime.exporting') : t('common.export')}
              </Button>
            )}
            {canBulkUpload && (
              <Button
                data-testid="category-bulk-upload-button"
                variant="secondary"
                icon={<Upload />}
                onClick={() => setBulkOpen(true)}
              >
                {t('common.bulkUpload')}
              </Button>
            )}
            {canCreate && (
              <Button
                data-testid="category-create-button"
                icon={<Plus />}
                onClick={() => navigate('/catalogue/categories/create')}
              >
                {t('runtime.createTitle', { singular: t('category.label') })}
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
          onView={canView ? (item) => navigate(`/catalogue/categories/${item.id}/view`) : undefined}
          onEdit={canUpdate ? (item) => navigate(`/catalogue/categories/${item.id}/edit`) : undefined}
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
          <Info className="h-12 w-12 shrink-0" />
          <div>
            <p className="text-base font-medium text-foreground">{t('runtime.deleteTitle')}</p>
            <p className="mt-1 text-sm font-normal text-muted-foreground">{t('runtime.deleteSoft')}</p>
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
            {t('common.cancel')}
          </Button>
          <Button
            data-testid="category-deactivate-confirm"
            className="w-25"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {t('common.delete')}
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
          <Info className="h-12 w-12 shrink-0" />
          <div>
            <p className="text-base font-medium text-foreground">{t('runtime.restoreTitle')}</p>
            <p className="mt-1 text-sm font-normal text-muted-foreground">{t('runtime.restoreDesc')}</p>
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
            {t('common.cancel')}
          </Button>
          <Button
            data-testid="category-restore-confirm"
            className="w-25"
            onClick={handleRestore}
            disabled={isRestoring}
          >
            {t('common.restore')}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}

export default CategoryListPage;
