import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Card, Button, FilterToolbar, Dialog } from '../../../../shared/components/ui';
import { Plus, Info, Download, Upload } from 'lucide-react';

import { useAuth } from '../../../../app/providers';
import { useCompanyList, useCompanyListFilter, useCompanyExport } from '../hooks';
import { CompanyTable, CompanyBulkUploadDialog } from '../components';
import { CompanyPermissions } from '../permissions';
import { listEmptyState } from '../../../../shared/constants';

const EMPTY_STATE = listEmptyState('Company');

function CompanyListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { can } = useAuth();
  const canView = can(CompanyPermissions.view);
  const canCreate = can(CompanyPermissions.create);
  const canUpdate = can(CompanyPermissions.update);
  const canDelete = can(CompanyPermissions.delete);
  const canExport = can(CompanyPermissions.export);
  const canBulkUpload = can(CompanyPermissions.bulkUpload);
  const [bulkOpen, setBulkOpen] = useState(false);
  const { exportData, isExporting } = useCompanyExport();

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
        title={t('runtime.listTitle', { singular: 'Company' })}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {canExport && (
              <Button
                data-testid="company-export-button"
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
                data-testid="company-bulk-upload-button"
                variant="secondary"
                icon={<Upload />}
                onClick={() => setBulkOpen(true)}
              >
                {t('common.bulkUpload')}
              </Button>
            )}
            {canCreate && (
              <Button
                data-testid="company-create-button"
                icon={<Plus />}
                onClick={() => navigate('/master-data/companies/create')}
              >
                {t('runtime.createTitle', { singular: 'Company' })}
              </Button>
            )}
          </div>
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
          onView={canView ? (item) => navigate(`/master-data/companies/${item.id}/view`) : undefined}
          onEdit={canUpdate ? (item) => navigate(`/master-data/companies/${item.id}/edit`) : undefined}
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
      <CompanyBulkUploadDialog open={bulkOpen} onClose={() => setBulkOpen(false)} />

      <Dialog
        testId="company-deactivate-dialog"
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
            data-testid="company-deactivate-cancel"
            onClick={handleDeleteCancel}
            disabled={isDeleting}
          >
            {t('common.cancel')}
          </Button>
          <Button
            data-testid="company-deactivate-confirm"
            className="w-25"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {t('common.delete')}
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
            data-testid="company-restore-cancel"
            onClick={handleRestoreCancel}
            disabled={isDeleting}
          >
            {t('common.cancel')}
          </Button>
          <Button
            data-testid="company-restore-confirm"
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

export default CompanyListPage;
