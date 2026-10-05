import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, Button, FilterToolbar, Dialog } from '../../../../shared/components/ui';

import { useRoleList, useRoleListFilter, useRoleExport } from '../hooks';
import { RoleTable, RoleBulkUploadDialog } from '../components';
import { RolePermissions } from '../permissions';
import { useAuth } from '../../../../app/providers';
import { listEmptyState } from '../../../../shared/constants';
import { Info, Plus, Download, Upload } from 'lucide-react';

const EMPTY_STATE = listEmptyState('Role');

function RoleList() {
  const navigate = useNavigate();
  const { can } = useAuth();
  const canView = can(RolePermissions.view);
  const canCreate = can(RolePermissions.create);
  const canUpdate = can(RolePermissions.update);
  const canDelete = can(RolePermissions.delete);
  const canExport = can(RolePermissions.export);
  const canBulkUpload = can(RolePermissions.bulkUpload);
  const [bulkOpen, setBulkOpen] = useState(false);
  const { exportData, isExporting } = useRoleExport();
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
  } = useRoleListFilter();

  const {
    roles,
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
  } = useRoleList(queryParams);

  const isEmptyState = !isFilterActive && roles.length === 0;
  const isFilteredEmptyState = isFilterActive && roles.length === 0;

  return (
    <div data-testid="role-list-page">
      <Card
        testId="role-list-card"
        title="Role List"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {canExport && (
              <Button
                data-testid="role-export-button"
                variant="secondary"
                icon={<Download className="h-4 w-4" />}
                onClick={() => exportData(queryParams)}
                disabled={isExporting}
              >
                {isExporting ? 'Exporting...' : 'Export'}
              </Button>
            )}
            {canBulkUpload && (
              <Button
                data-testid="role-bulk-upload-button"
                variant="secondary"
                icon={<Upload className="h-4 w-4" />}
                onClick={() => setBulkOpen(true)}
              >
                Bulk Upload
              </Button>
            )}
            {canCreate && (
              <Button
                data-testid="role-create-button"
                icon={<Plus className="h-4 w-4" />}
                onClick={() => navigate('/user-management/role/create')}
              >
                Create Role
              </Button>
            )}
          </div>
        }
      >
        <div className="mb-4">
          <FilterToolbar
            testId="role-filter"
            searchValue={searchQuery}
            onSearchChange={handleSearchChange}
            filterFields={filterFields}
            filterValues={filterValues}
            onApply={handleApply}
            onReset={handleReset}
            searchPlaceholder="Search"
            searchParamName="search"
            withFilterButton={false}
          />
        </div>
        <RoleTable
          testId="role-table"
          data={roles}
          totalRecords={totalRecords}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={handlePageSizeChange}
          stickyAction
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
          onView={
            canView
              ? (role) => navigate(`/user-management/role/${role.id}/view`)
              : undefined
          }
          onEdit={
            canUpdate
              ? (role) => navigate(`/user-management/role/${role.id}/edit`)
              : undefined
          }
          onDelete={canDelete ? handleDeleteClick : undefined}
          onRestore={canUpdate ? handleRestoreClick : undefined}
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
      <RoleBulkUploadDialog open={bulkOpen} onClose={() => setBulkOpen(false)} />

      <Dialog
        testId="role-deactivate-dialog"
        open={!!deleteTarget}
        onClose={handleDeleteCancel}
        maxWidth="md"
        closeOnEscape
        closeOnBackdropClick
      >
        <div className="flex items-start gap-4">
          <Info className="h-12 w-12 shrink-0 text-warning" />
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
            data-testid="role-deactivate-cancel"
            onClick={handleDeleteCancel}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            data-testid="role-deactivate-confirm"
            className="w-25"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            Delete
          </Button>
        </div>
      </Dialog>

      <Dialog
        testId="role-restore-dialog"
        open={!!restoreTarget}
        onClose={handleRestoreCancel}
        maxWidth="md"
        closeOnEscape
        closeOnBackdropClick
      >
        <div className="flex items-start gap-4">
          <Info className="h-12 w-12 shrink-0 text-success" />
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
            data-testid="role-restore-cancel"
            onClick={handleRestoreCancel}
            disabled={isRestoring}
          >
            Cancel
          </Button>
          <Button
            data-testid="role-restore-confirm"
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

export default RoleList;
