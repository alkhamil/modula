import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Card, Button, TableToolbar, Dialog } from '../../../shared/components/ui';
import { AddCircle, InfoCircle, Download, Upload } from '../../../shared/components/icons';

import { useAuth } from '../../../app/providers';
import { useDefaultModuleList, useDefaultModuleListFilter, useDefaultModuleExport } from '../hooks';
import { DefaultModuleTable, DefaultModuleBulkUploadDialog } from '../components';
import { DefaultModulePermissions } from '../permissions';
import { listEmptyState } from '../../../shared/constants';
import '../../../shared/i18n';

function DefaultModuleListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // EMPTY_STATE di dalam komponen: t() modul dievaluasi saat render,
  // setelah addModuleLocales terdaftar (konstanta level-modul membeku jadi key mentah).
  const EMPTY_STATE = listEmptyState(t('default_module.label'));
  const { can } = useAuth();
  const canView = can(DefaultModulePermissions.view);
  const canCreate = can(DefaultModulePermissions.create);
  const canUpdate = can(DefaultModulePermissions.update);
  const canDelete = can(DefaultModulePermissions.delete);
  const canExport = can(DefaultModulePermissions.export);
  const canBulkUpload = can(DefaultModulePermissions.bulkUpload);
  const [bulkOpen, setBulkOpen] = useState(false);
  const { exportData, isExporting } = useDefaultModuleExport();

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
  } = useDefaultModuleListFilter();

  const {
    defaultModules,
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
  } = useDefaultModuleList(queryParams);

  const isEmptyState = !isFilterActive && defaultModules.length === 0;
  const isFilteredEmptyState = isFilterActive && defaultModules.length === 0;

  return (
    <div data-testid="default-module-list-page">
      <Card
        testId="default-module-list-card"
        flush
        title={t('runtime.listTitle', { singular: t('default_module.label') })}
        description={t('runtime.listDescription', { plural: t('default_module.labelPlural').toLowerCase() })}
        actions={
          <>
            {canBulkUpload && (
              <Button
                data-testid="default-module-bulk-upload-button"
                hierarchy="secondary"
                leadingIcon={<Upload />}
                onClick={() => setBulkOpen(true)}
              >
                {t('common.bulkUpload')}
              </Button>
            )}
            {canCreate && (
              <Button
                data-testid="default-module-create-button"
                leadingIcon={<AddCircle />}
                onClick={() => navigate('/default-modules/create')}
              >
                {t('runtime.createTitle', { singular: t('default_module.label') })}
              </Button>
            )}
          </>
        }
      >
        <TableToolbar
          testId="default-module-filter"
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
                data-testid="default-module-export-button"
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
        <DefaultModuleTable
          testId="default-module-table"
          data={defaultModules}
          totalRecords={totalRecords}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={handlePageSizeChange}
          stickyAction
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
          onView={canView ? (item) => navigate(`/default-modules/${item.id}/view`) : undefined}
          onEdit={canUpdate ? (item) => navigate(`/default-modules/${item.id}/edit`) : undefined}
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
      <DefaultModuleBulkUploadDialog open={bulkOpen} onClose={() => setBulkOpen(false)} />

      <Dialog
        testId="default-module-deactivate-dialog"
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
            data-testid="default-module-deactivate-cancel"
            onClick={handleDeleteCancel}
            disabled={isDeleting}
          >
            {t('common.cancel')}
          </Button>
          <Button
            data-testid="default-module-deactivate-confirm"
            className="w-25"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {t('common.delete')}
          </Button>
        </div>
      </Dialog>

      <Dialog
        testId="default-module-restore-dialog"
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
            data-testid="default-module-restore-cancel"
            onClick={handleRestoreCancel}
            disabled={isDeleting}
          >
            {t('common.cancel')}
          </Button>
          <Button
            data-testid="default-module-restore-confirm"
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

export default DefaultModuleListPage;
