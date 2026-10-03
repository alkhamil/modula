import type { TemplateContext } from '../../engine/context';

export function listPageTemplate(ctx: TemplateContext): string {
  const { names, features } = ctx;
  const withCreate = features.create;
  const withView = features.detail;
  const withEdit = features.edit;
  const withDelete = features.delete;
  const withBulk = features.bulkUpload;
  const withExport = features.export;
  const hasActions = withCreate || withBulk || withExport;
  const iconList = [
    withCreate ? 'PlusIcon' : '',
    withDelete ? 'ConfirmInfoIcon' : '',
    withExport ? 'ExportIcon' : '',
    withBulk ? 'UploadFileIcon' : '',
  ].filter(Boolean);
  const needView = withView;
  const needCreate = withCreate;
  const needUpdate = withEdit;
  const needDelete = withDelete;
  const needAuth = needView || needCreate || needUpdate || needDelete || withExport || withBulk;

  return `${withBulk ? `import { useState } from 'react';\n` : ''}import { useNavigate } from 'react-router';
import { Card${hasActions ? ', Button' : ''}, FilterToolbar${withDelete ? ', Dialog' : ''} } from '${names.sharedPrefix}shared/components/ui';
${iconList.length > 0 ? `import { ${iconList.join(', ')} } from '${names.sharedPrefix}shared/components/icons';\n` : ''}
${needAuth ? `import { useAuth } from '${names.sharedPrefix}modules/auth';\n` : ''}import { use${names.entity}List, use${names.entity}ListFilter${withExport ? `, use${names.entity}Export` : ''} } from '../hooks';
import { ${names.entity}Table${withBulk ? `, ${names.entity}BulkUploadDialog` : ''} } from '../components';
${needAuth ? `import { ${names.entity}Permissions } from '../permissions';\n` : ''}import { listEmptyState } from '${names.sharedPrefix}shared/constants';

const EMPTY_STATE = listEmptyState('${names.entity}');

function ${names.entity}ListPage() {
  const navigate = useNavigate();
${needAuth ? '  const { can } = useAuth();\n' : ''}${needView ? `  const canView = can(${names.entity}Permissions.view);\n` : ''}${needCreate ? `  const canCreate = can(${names.entity}Permissions.create);\n` : ''}${needUpdate ? `  const canUpdate = can(${names.entity}Permissions.update);\n` : ''}${needDelete ? `  const canDelete = can(${names.entity}Permissions.delete);\n` : ''}${withExport ? `  const canExport = can(${names.entity}Permissions.export);\n` : ''}${withBulk ? `  const canBulkUpload = can(${names.entity}Permissions.bulkUpload);\n` : ''}${withBulk ? '  const [bulkOpen, setBulkOpen] = useState(false);\n' : ''}${withExport ? `  const { exportData, isExporting } = use${names.entity}Export();\n` : ''}
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
  } = use${names.entity}ListFilter();

  const {
    ${names.camel}s,
    totalRecords,
    isLoading,
    error,
    refresh,${withDelete ? `
    deleteTarget,
    isDeleting,
    handleDeleteClick,
    handleDeleteCancel,
    handleDelete,
    restoreTarget,
    isRestoring,
    handleRestoreClick,
    handleRestoreCancel,
    handleRestore,` : ''}
  } = use${names.entity}List(queryParams);

  const isEmptyState = !isFilterActive && ${names.camel}s.length === 0;
  const isFilteredEmptyState = isFilterActive && ${names.camel}s.length === 0;

  return (
    <div data-testid="${names.testId}-list-page">
      <Card
        testId="${names.testId}-list-card"
        title="${names.entity} List"
${
  withCreate || withBulk || withExport
    ? `        actions={
          <div className="flex flex-wrap items-center gap-2">
${withExport ? `            {canExport && (\n              <Button\n                data-testid="${names.testId}-export-button"\n                variant="secondary"\n                icon={<ExportIcon />}\n                onClick={() => exportData(queryParams)}\n                disabled={isExporting}\n              >\n                {isExporting ? 'Mengekspor…' : 'Export'}\n              </Button>\n            )}\n` : ''}${withBulk ? `            {canBulkUpload && (\n              <Button\n                data-testid="${names.testId}-bulk-upload-button"\n                variant="secondary"\n                icon={<UploadFileIcon />}\n                onClick={() => setBulkOpen(true)}\n              >\n                Bulk Upload\n              </Button>\n            )}\n` : ''}${withCreate ? `            {canCreate && (\n              <Button\n                data-testid="${names.testId}-create-button"\n                icon={<PlusIcon />}\n                onClick={() => navigate('/${names.routeBase}/create')}\n              >\n                Create ${names.entity}\n              </Button>\n            )}\n` : ''}          </div>
        }
`
    : ''
}      >
        <div className="mb-4">
          <FilterToolbar
            testId="${names.testId}-filter"
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
        <${names.entity}Table
          testId="${names.testId}-table"
          data={${names.camel}s}
          totalRecords={totalRecords}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={handlePageSizeChange}
          stickyAction
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
${withView ? `          onView={canView ? (item) => navigate(\`/${names.routeBase}/\${item.id}/view\`) : undefined}\n` : ''}${withEdit ? `          onEdit={canUpdate ? (item) => navigate(\`/${names.routeBase}/\${item.id}/edit\`) : undefined}\n` : ''}${withDelete ? `          onDelete={canDelete ? handleDeleteClick : undefined}
          onRestore={canDelete ? handleRestoreClick : undefined}
          isDeleting={isDeleting}
          isRestoring={isRestoring}
` : ''}          isEmptyState={isEmptyState}
          isFilteredEmptyState={isFilteredEmptyState}
          emptyStateTitle={EMPTY_STATE.title}
          emptyStateDescription={EMPTY_STATE.description}
          loading={isLoading}
          error={error}
          onRetry={refresh}
        />
      </Card>
${withBulk ? `      <${names.entity}BulkUploadDialog open={bulkOpen} onClose={() => setBulkOpen(false)} />\n` : ''}${withDelete ? `
      <Dialog
        testId="${names.testId}-deactivate-dialog"
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
            data-testid="${names.testId}-deactivate-cancel"
            onClick={handleDeleteCancel}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            data-testid="${names.testId}-deactivate-confirm"
            className="w-25"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            Delete
          </Button>
        </div>
      </Dialog>

      <Dialog
        testId="${names.testId}-restore-dialog"
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
            data-testid="${names.testId}-restore-cancel"
            onClick={handleRestoreCancel}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            data-testid="${names.testId}-restore-confirm"
            className="w-25"
            onClick={handleRestore}
            disabled={isRestoring}
          >
            Restore
          </Button>
        </div>
      </Dialog>
` : ''}    </div>
  );
}

export default ${names.entity}ListPage;
`;
}

export function createPageTemplate(ctx: TemplateContext): string {
  const { names, fields } = ctx;
  const optionsFields = fields.filter((f) => f.isOptionsQuery);
  return `import { use${names.entity}Form } from '../hooks';
import { ${names.entity}Form } from '../components';

function ${names.entity}CreatePage() {
  const { defaultValues, onSubmit, onCancel${optionsFields.map((f) => `, ${f.name}Options`).join('')}, isSubmitting } = use${names.entity}Form();

  return (
    <${names.entity}Form
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      onCancel={onCancel}
${optionsFields.map((f) => `      ${f.name}Options={${f.name}Options}`).join('\n')}
${optionsFields.length > 0 ? '' : ''}      isSubmitting={isSubmitting}
    />
  );
}

export default ${names.entity}CreatePage;
`;
}

export function viewPageTemplate(ctx: TemplateContext): string {
  const { names, features } = ctx;
  return `import { useParams, useNavigate } from 'react-router';
import { Button, DetailCard } from '${names.sharedPrefix}shared/components/ui';
${features.edit ? `import { useAuth } from '${names.sharedPrefix}modules/auth';\n` : ''}import { use${names.entity}Form } from '../hooks';
${features.edit ? `import { ${names.entity}Permissions } from '../permissions';\n` : ''}
function ${names.entity}ViewPage() {
  const { ${names.paramId} } = useParams<{ ${names.paramId}: string }>();
  const navigate = useNavigate();
${features.edit ? '  const { can } = useAuth();\n' : ''}  const { queryStatus, queryMessage, errorType, detailRows } = use${names.entity}Form(${names.paramId});

  return (
    <div data-testid="${names.testId}-view-page" className="flex min-h-full flex-col stack-gap">
      <DetailCard
        testId="${names.testId}-detail-card"
        title="${names.entity} Details"
        state={{ status: queryStatus, message: queryMessage, rows: detailRows, errorType }}
      />
      {queryStatus !== 'error' && (
        <div className="flex justify-end gap-4">
          <Button
            data-testid="${names.testId}-back-button"
            className="w-30"
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
${
  features.edit
    ? `          {can(${names.entity}Permissions.update) && (
            <Button
              data-testid="${names.testId}-edit-button"
              className="w-30"
              variant="primary"
              onClick={() => navigate(\`/${names.routeBase}/\${${names.paramId}}/edit\`)}
            >
              Edit
            </Button>
          )}
`
    : ''
}        </div>
      )}
    </div>
  );
}

export default ${names.entity}ViewPage;
`;
}

export function editPageTemplate(ctx: TemplateContext): string {
  const { names, fields } = ctx;
  const optionsFields = fields.filter((f) => f.isOptionsQuery);
  return `import { useParams } from 'react-router';
import { Card, ErrorStatePage, FormSkeleton } from '${names.sharedPrefix}shared/components/ui';
import { use${names.entity}Form } from '../hooks';
import { ${names.entity}Form } from '../components';

function ${names.entity}EditPage() {
  const { ${names.paramId} } = useParams<{ ${names.paramId}: string }>();
  const {
    defaultValues,
    queryStatus,
    errorType,
    onSubmit,
    onCancel,
${optionsFields.map((f) => `    ${f.name}Options,`).join('\n')}
${optionsFields.length > 0 ? '' : ''}    isSubmitting,
  } = use${names.entity}Form(${names.paramId});

  if (errorType) return <ErrorStatePage type={errorType} />;

  if (queryStatus === 'loading') {
    return (
      <Card title="Edit ${names.entity}">
        <FormSkeleton />
      </Card>
    );
  }

  return (
    <${names.entity}Form
      key={${names.paramId}}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isEdit
${optionsFields.map((f) => `      ${f.name}Options={${f.name}Options}`).join('\n')}
${optionsFields.length > 0 ? '' : ''}      isSubmitting={isSubmitting}
    />
  );
}

export default ${names.entity}EditPage;
`;
}
