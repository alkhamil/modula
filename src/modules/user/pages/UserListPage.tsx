import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, Button, FilterToolbar, Dialog } from '../../../shared/components/ui';
import { PlusIcon, ConfirmInfoIcon, ExportIcon, UploadFileIcon } from '../../../shared/components/icons';
import { useAuth } from '../../auth';
import { useUserList, useUserListFilter, useUserExport } from '../hooks';
import { UserTable, UserBulkUploadDialog } from '../components';
import { UserPermissions } from '../permissions';
import { listEmptyState } from '../../../shared/constants';

const EMPTY_STATE = listEmptyState('User');

function UserListPage() {
  const navigate = useNavigate();
  const { can } = useAuth();
  const canView = can(UserPermissions.view);
  const canCreate = can(UserPermissions.create);
  const canUpdate = can(UserPermissions.update);
  const canDelete = can(UserPermissions.delete);
  const canExport = can(UserPermissions.export);
  const canBulkUpload = can(UserPermissions.bulkUpload);
  const [bulkOpen, setBulkOpen] = useState(false);
  const { exportData, isExporting } = useUserExport();
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
  } = useUserListFilter();

  const {
    users,
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
  } = useUserList(queryParams);

  const isEmptyState = !isFilterActive && users.length === 0;
  const isFilteredEmptyState = isFilterActive && users.length === 0;

  return (
    <div data-testid="user-list-page">
      <Card
        testId="user-list-card"
        title="User List"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {canExport && (
              <Button
                data-testid="user-export-button"
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
                data-testid="user-bulk-upload-button"
                variant="secondary"
                icon={<UploadFileIcon />}
                onClick={() => setBulkOpen(true)}
              >
                Bulk Upload
              </Button>
            )}
            {canCreate && (
              <Button
                data-testid="user-create-button"
                icon={<PlusIcon />}
                onClick={() => navigate('/users/create')}
              >
                Create User
              </Button>
            )}
          </div>
        }
      >
        <div className="mb-4">
          <FilterToolbar
            testId="user-filter"
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
        <UserTable
          testId="user-table"
          data={users}
          totalRecords={totalRecords}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={handlePageSizeChange}
          stickyAction
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
          onView={canView ? (user) => navigate(`/users/${user.id}/view`) : undefined}
          onEdit={canUpdate ? (user) => navigate(`/users/${user.id}/edit`) : undefined}
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

      <UserBulkUploadDialog open={bulkOpen} onClose={() => setBulkOpen(false)} />

      <Dialog
        testId="user-deactivate-dialog"
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
            data-testid="user-deactivate-cancel"
            onClick={handleDeleteCancel}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            data-testid="user-deactivate-confirm"
            className="w-25"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            Delete
          </Button>
        </div>
      </Dialog>

      <Dialog
        testId="user-restore-dialog"
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
            data-testid="user-restore-cancel"
            onClick={handleRestoreCancel}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            data-testid="user-restore-confirm"
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

export default UserListPage;
