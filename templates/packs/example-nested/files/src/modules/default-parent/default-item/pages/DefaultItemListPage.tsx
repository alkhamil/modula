import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Card, Button, TableToolbar, Dialog } from '../../../../shared/components/ui';
import { AddCircle, InfoCircle, Download, Upload } from '../../../../shared/components/icons';

import { useAuth } from '../../../../app/providers';
import { useDefaultItemList, useDefaultItemListFilter, useDefaultItemExport } from '../hooks';
import { DefaultItemTable, DefaultItemBulkUploadDialog } from '../components';
import { DefaultItemPermissions } from '../permissions';
import { listEmptyState } from '../../../../shared/constants';
import '../../../../shared/i18n';

function DefaultItemListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // EMPTY_STATE di dalam komponen: t() modul dievaluasi saat render,
  // setelah addModuleLocales terdaftar (konstanta level-modul membeku jadi key mentah).
  const EMPTY_STATE = listEmptyState(t('default_item.label'));
  const { can } = useAuth();
  const canView = can(DefaultItemPermissions.view);
  const canCreate = can(DefaultItemPermissions.create);
  const canUpdate = can(DefaultItemPermissions.update);
  const canDelete = can(DefaultItemPermissions.delete);
  const canExport = can(DefaultItemPermissions.export);
  const canBulkUpload = can(DefaultItemPermissions.bulkUpload);
  const [bulkOpen, setBulkOpen] = useState(false);
  const { exportData, isExporting } = useDefaultItemExport();

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
  } = useDefaultItemListFilter();

  const {
    defaultItems,
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
  } = useDefaultItemList(queryParams);

  const isEmptyState = !isFilterActive && defaultItems.length === 0;
  const isFilteredEmptyState = isFilterActive && defaultItems.length === 0;

  return (
    <div data-testid="default-item-list-page">
      <Card
        testId="default-item-list-card"
        flush
        title={t('runtime.listTitle', { singular: t('default_item.label') })}
        description={t('runtime.listDescription', { plural: t('default_item.labelPlural').toLowerCase() })}
        actions={
          <>
            {canBulkUpload && (
              <Button
                data-testid="default-item-bulk-upload-button"
                hierarchy="secondary"
                leadingIcon={<Upload />}
                onClick={() => setBulkOpen(true)}
              >
                {t('common.bulkUpload')}
              </Button>
            )}
            {canCreate && (
              <Button
                data-testid="default-item-create-button"
                leadingIcon={<AddCircle />}
                onClick={() => navigate('/default-parent/default-items/create')}
              >
                {t('runtime.createTitle', { singular: t('default_item.label') })}
              </Button>
            )}
          </>
        }
      >
        <TableToolbar
          testId="default-item-filter"
          searchValue={searchQuery}
          onSearchChange={handleSearchChange}
          filterFields={filterFields}
          filterValues={filterValues}
          onApply={handleApply}
          onReset={handleReset}
          searchParamName="search"
          loading={isLoading}
          actions={
            canExport && (
              <Button
                data-testid="default-item-export-button"
                hierarchy="secondary"
                leadingIcon={<Download />}
                onClick={() => exportData(queryParams)}
                disabled={isExporting || isLoading}
              >
                {isExporting ? t('runtime.exporting') : t('common.export')}
              </Button>
            )
          }
        />
        <DefaultItemTable
          testId="default-item-table"
          data={defaultItems}
          totalRecords={totalRecords}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={handlePageSizeChange}
          stickyAction
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
          onView={canView ? (item) => navigate(`/default-parent/default-items/${item.id}/view`) : undefined}
          onEdit={canUpdate ? (item) => navigate(`/default-parent/default-items/${item.id}/edit`) : undefined}
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
      <DefaultItemBulkUploadDialog open={bulkOpen} onClose={() => setBulkOpen(false)} />

      <Dialog
        testId="default-item-deactivate-dialog"
        open={!!deleteTarget}
        onClose={handleDeleteCancel}
        maxWidth="md"
        closeOnEscape
        closeOnBackdropClick
      >
        <div className="flex items-start gap-4">
          <InfoCircle className="h-12 w-12 shrink-0" />
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
            data-testid="default-item-deactivate-cancel"
            onClick={handleDeleteCancel}
            disabled={isDeleting}
          >
            {t('common.cancel')}
          </Button>
          <Button
            data-testid="default-item-deactivate-confirm"
            className="w-25"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {t('common.delete')}
          </Button>
        </div>
      </Dialog>

      <Dialog
        testId="default-item-restore-dialog"
        open={!!restoreTarget}
        onClose={handleRestoreCancel}
        maxWidth="md"
        closeOnEscape
        closeOnBackdropClick
      >
        <div className="flex items-start gap-4">
          <InfoCircle className="h-12 w-12 shrink-0" />
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
            data-testid="default-item-restore-cancel"
            onClick={handleRestoreCancel}
            disabled={isDeleting}
          >
            {t('common.cancel')}
          </Button>
          <Button
            data-testid="default-item-restore-confirm"
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

export default DefaultItemListPage;
