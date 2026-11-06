import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Card, Button, TableToolbar, Dialog } from '../../../../shared/components/ui';
import { AddCircle, InfoCircle, Download, Upload } from '../../../../shared/components/icons';

import { useAuth } from '../../../../app/providers';
import { useDefaultRecordList, useDefaultRecordListFilter, useDefaultRecordExport } from '../hooks';
import { DefaultRecordTable, DefaultRecordBulkUploadDialog } from '../components';
import { DefaultRecordPermissions } from '../permissions';
import { listEmptyState } from '../../../../shared/constants';
import '../../../../shared/i18n';

function DefaultRecordListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // EMPTY_STATE di dalam komponen: t() modul dievaluasi saat render,
  // setelah addModuleLocales terdaftar (konstanta level-modul membeku jadi key mentah).
  const EMPTY_STATE = listEmptyState(t('default_record.label'));
  const { can } = useAuth();
  const canView = can(DefaultRecordPermissions.view);
  const canCreate = can(DefaultRecordPermissions.create);
  const canUpdate = can(DefaultRecordPermissions.update);
  const canDelete = can(DefaultRecordPermissions.delete);
  const canExport = can(DefaultRecordPermissions.export);
  const canBulkUpload = can(DefaultRecordPermissions.bulkUpload);
  const [bulkOpen, setBulkOpen] = useState(false);
  const { exportData, isExporting } = useDefaultRecordExport();

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
  } = useDefaultRecordListFilter();

  const {
    defaultRecords,
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
  } = useDefaultRecordList(queryParams);

  const isEmptyState = !isFilterActive && defaultRecords.length === 0;
  const isFilteredEmptyState = isFilterActive && defaultRecords.length === 0;

  return (
    <div data-testid="default-record-list-page">
      <Card
        testId="default-record-list-card"
        flush
        title={t('runtime.listTitle', { singular: t('default_record.label') })}
        description={t('runtime.listDescription', { plural: t('default_record.labelPlural').toLowerCase() })}
        actions={
          <>
            {canBulkUpload && (
              <Button
                data-testid="default-record-bulk-upload-button"
                hierarchy="secondary"
                leadingIcon={<Upload />}
                onClick={() => setBulkOpen(true)}
              >
                {t('common.bulkUpload')}
              </Button>
            )}
            {canCreate && (
              <Button
                data-testid="default-record-create-button"
                leadingIcon={<AddCircle />}
                onClick={() => navigate('/default-parent/default-records/create')}
              >
                {t('runtime.createTitle', { singular: t('default_record.label') })}
              </Button>
            )}
          </>
        }
      >
        <TableToolbar
          testId="default-record-filter"
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
                data-testid="default-record-export-button"
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
        <DefaultRecordTable
          testId="default-record-table"
          data={defaultRecords}
          totalRecords={totalRecords}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={handlePageSizeChange}
          stickyAction
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
          onView={canView ? (item) => navigate(`/default-parent/default-records/${item.id}/view`) : undefined}
          onEdit={canUpdate ? (item) => navigate(`/default-parent/default-records/${item.id}/edit`) : undefined}
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
      <DefaultRecordBulkUploadDialog open={bulkOpen} onClose={() => setBulkOpen(false)} />

      <Dialog
        testId="default-record-deactivate-dialog"
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
            data-testid="default-record-deactivate-cancel"
            onClick={handleDeleteCancel}
            disabled={isDeleting}
          >
            {t('common.cancel')}
          </Button>
          <Button
            data-testid="default-record-deactivate-confirm"
            className="w-25"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {t('common.delete')}
          </Button>
        </div>
      </Dialog>

      <Dialog
        testId="default-record-restore-dialog"
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
            data-testid="default-record-restore-cancel"
            onClick={handleRestoreCancel}
            disabled={isDeleting}
          >
            {t('common.cancel')}
          </Button>
          <Button
            data-testid="default-record-restore-confirm"
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

export default DefaultRecordListPage;
