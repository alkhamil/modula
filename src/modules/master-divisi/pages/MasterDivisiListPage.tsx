import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Card, Button, FilterToolbar, Dialog } from '../../../shared/components/ui';
import { Plus, Info, Download, Upload } from 'lucide-react';

import { useAuth } from '../../../app/providers';
import { useMasterDivisiList, useMasterDivisiListFilter, useMasterDivisiExport } from '../hooks';
import { MasterDivisiTable, MasterDivisiBulkUploadDialog } from '../components';
import { MasterDivisiPermissions } from '../permissions';
import { listEmptyState } from '../../../shared/constants';
import { t } from 'i18next';
import '../../../shared/i18n';

const EMPTY_STATE = listEmptyState(t('master_division.label'));

function MasterDivisiListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { can } = useAuth();
  const canView = can(MasterDivisiPermissions.view);
  const canCreate = can(MasterDivisiPermissions.create);
  const canUpdate = can(MasterDivisiPermissions.update);
  const canDelete = can(MasterDivisiPermissions.delete);
  const canExport = can(MasterDivisiPermissions.export);
  const canBulkUpload = can(MasterDivisiPermissions.bulkUpload);
  const [bulkOpen, setBulkOpen] = useState(false);
  const { exportData, isExporting } = useMasterDivisiExport();

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
  } = useMasterDivisiListFilter();

  const {
    masterDivisis,
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
  } = useMasterDivisiList(queryParams);

  const isEmptyState = !isFilterActive && masterDivisis.length === 0;
  const isFilteredEmptyState = isFilterActive && masterDivisis.length === 0;

  return (
    <div data-testid="master-divisi-list-page">
      <Card
        testId="master-divisi-list-card"
        title={t('runtime.listTitle', { singular: t('master_division.label') })}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {canExport && (
              <Button
                data-testid="master-divisi-export-button"
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
                data-testid="master-divisi-bulk-upload-button"
                variant="secondary"
                icon={<Upload />}
                onClick={() => setBulkOpen(true)}
              >
                {t('common.bulkUpload')}
              </Button>
            )}
            {canCreate && (
              <Button
                data-testid="master-divisi-create-button"
                icon={<Plus />}
                onClick={() => navigate('/master-divisis/create')}
              >
                {t('runtime.createTitle', { singular: t('master_division.label') })}
              </Button>
            )}
          </div>
        }
      >
        <div className="mb-4">
          <FilterToolbar
            testId="master-divisi-filter"
            searchValue={searchQuery}
            onSearchChange={handleSearchChange}
            filterFields={filterFields}
            filterValues={filterValues}
            onApply={handleApply}
            onReset={handleReset}
            searchParamName="search"
          />
        </div>
        <MasterDivisiTable
          testId="master-divisi-table"
          data={masterDivisis}
          totalRecords={totalRecords}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={handlePageSizeChange}
          stickyAction
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
          onView={canView ? (item) => navigate(`/master-divisis/${item.id}/view`) : undefined}
          onEdit={canUpdate ? (item) => navigate(`/master-divisis/${item.id}/edit`) : undefined}
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
      <MasterDivisiBulkUploadDialog open={bulkOpen} onClose={() => setBulkOpen(false)} />

      <Dialog
        testId="master-divisi-deactivate-dialog"
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
            data-testid="master-divisi-deactivate-cancel"
            onClick={handleDeleteCancel}
            disabled={isDeleting}
          >
            {t('common.cancel')}
          </Button>
          <Button
            data-testid="master-divisi-deactivate-confirm"
            className="w-25"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {t('common.delete')}
          </Button>
        </div>
      </Dialog>

      <Dialog
        testId="master-divisi-restore-dialog"
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
            data-testid="master-divisi-restore-cancel"
            onClick={handleRestoreCancel}
            disabled={isDeleting}
          >
            {t('common.cancel')}
          </Button>
          <Button
            data-testid="master-divisi-restore-confirm"
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

export default MasterDivisiListPage;
