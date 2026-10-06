import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Card, Button, FilterToolbar, Dialog } from '../../../shared/components/ui';
import { Plus, Info, Download, Upload } from 'lucide-react';

import { useAuth } from '../../../app/providers';
import { useInvoiceList, useInvoiceListFilter, useInvoiceExport } from '../hooks';
import { InvoiceTable, InvoiceBulkUploadDialog } from '../components';
import { InvoicePermissions } from '../permissions';
import { listEmptyState } from '../../../shared/constants';
import { t } from 'i18next';
import '../../../shared/i18n';

const EMPTY_STATE = listEmptyState(t('invoice.label'));

function InvoiceListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { can } = useAuth();
  const canView = can(InvoicePermissions.view);
  const canCreate = can(InvoicePermissions.create);
  const canUpdate = can(InvoicePermissions.update);
  const canDelete = can(InvoicePermissions.delete);
  const canExport = can(InvoicePermissions.export);
  const canBulkUpload = can(InvoicePermissions.bulkUpload);
  const [bulkOpen, setBulkOpen] = useState(false);
  const { exportData, isExporting } = useInvoiceExport();

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
  } = useInvoiceListFilter();

  const {
    invoices,
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
  } = useInvoiceList(queryParams);

  const isEmptyState = !isFilterActive && invoices.length === 0;
  const isFilteredEmptyState = isFilterActive && invoices.length === 0;

  return (
    <div data-testid="invoice-list-page">
      <Card
        testId="invoice-list-card"
        title={t('runtime.listTitle', { singular: t('invoice.label') })}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {canExport && (
              <Button
                data-testid="invoice-export-button"
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
                data-testid="invoice-bulk-upload-button"
                variant="secondary"
                icon={<Upload />}
                onClick={() => setBulkOpen(true)}
              >
                {t('common.bulkUpload')}
              </Button>
            )}
            {canCreate && (
              <Button
                data-testid="invoice-create-button"
                icon={<Plus />}
                onClick={() => navigate('/invoices/create')}
              >
                {t('runtime.createTitle', { singular: t('invoice.label') })}
              </Button>
            )}
          </div>
        }
      >
        <div className="mb-4">
          <FilterToolbar
            testId="invoice-filter"
            searchValue={searchQuery}
            onSearchChange={handleSearchChange}
            filterFields={filterFields}
            filterValues={filterValues}
            onApply={handleApply}
            onReset={handleReset}
            searchParamName="search"
          />
        </div>
        <InvoiceTable
          testId="invoice-table"
          data={invoices}
          totalRecords={totalRecords}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={handlePageSizeChange}
          stickyAction
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
          onView={canView ? (item) => navigate(`/invoices/${item.id}/view`) : undefined}
          onEdit={canUpdate ? (item) => navigate(`/invoices/${item.id}/edit`) : undefined}
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
      <InvoiceBulkUploadDialog open={bulkOpen} onClose={() => setBulkOpen(false)} />

      <Dialog
        testId="invoice-deactivate-dialog"
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
            data-testid="invoice-deactivate-cancel"
            onClick={handleDeleteCancel}
            disabled={isDeleting}
          >
            {t('common.cancel')}
          </Button>
          <Button
            data-testid="invoice-deactivate-confirm"
            className="w-25"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {t('common.delete')}
          </Button>
        </div>
      </Dialog>

      <Dialog
        testId="invoice-restore-dialog"
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
            data-testid="invoice-restore-cancel"
            onClick={handleRestoreCancel}
            disabled={isDeleting}
          >
            {t('common.cancel')}
          </Button>
          <Button
            data-testid="invoice-restore-confirm"
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

export default InvoiceListPage;
