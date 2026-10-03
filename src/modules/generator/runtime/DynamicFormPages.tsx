/** Halaman create/edit/detail generik — meniru halaman hasil generate. */
import { useNavigate, useParams } from 'react-router';
import { Button, Card, DetailCard, ErrorStatePage, FormSkeleton } from '../../../shared/components/ui';
import { useAuth } from '../../auth';
import type { ModuleDefinition } from '../definitions';
import { definitionPermissions, definitionTestId } from './types';
import { useDynamicForm } from './hooks';
import DynamicForm from './DynamicForm';

export function DynamicCreatePage({ def }: { def: ModuleDefinition }) {
  const { defaultValues, onSubmit, onCancel, isSubmitting, optionsOf, loaderOf } =
    useDynamicForm(def);
  return (
    <DynamicForm
      def={def}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isSubmitting={isSubmitting}
      optionsOf={optionsOf}
      loaderOf={loaderOf}
    />
  );
}

export function DynamicEditPage({ def }: { def: ModuleDefinition }) {
  const { recordId } = useParams<{ recordId: string }>();
  const {
    defaultValues,
    queryStatus,
    errorType,
    onSubmit,
    onCancel,
    isSubmitting,
    optionsOf,
    loaderOf,
  } = useDynamicForm(def, recordId);

  if (errorType) return <ErrorStatePage type={errorType} />;

  if (queryStatus === 'loading') {
    return (
      <Card title={`Edit ${def.singularLabel}`}>
        <FormSkeleton />
      </Card>
    );
  }

  return (
    <DynamicForm
      key={recordId}
      def={def}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isEdit
      isSubmitting={isSubmitting}
      optionsOf={optionsOf}
      loaderOf={loaderOf}
    />
  );
}

export function DynamicDetailPage({ def }: { def: ModuleDefinition }) {
  const { recordId } = useParams<{ recordId: string }>();
  const navigate = useNavigate();
  const { can } = useAuth();
  const testPrefix = definitionTestId(def.key);
  const permissions = definitionPermissions(def.permissionKey);
  const { queryStatus, queryMessage, errorType, detailRows } = useDynamicForm(def, recordId);

  return (
    <div data-testid={`${testPrefix}-view-page`} className="flex min-h-full flex-col stack-gap">
      <DetailCard
        testId={`${testPrefix}-detail-card`}
        title={def.layout.detail?.card?.title?.trim() || `${def.singularLabel} Details`}
        collapsible={def.layout.detail?.card?.collapsible === true}
        state={{ status: queryStatus, message: queryMessage, rows: detailRows, errorType }}
      />
      {queryStatus !== 'error' && (
        <div className="flex justify-end gap-4">
          <Button
            data-testid={`${testPrefix}-back-button`}
            className="w-30"
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
          {def.features.edit && can(permissions.update) && (
            <Button
              data-testid={`${testPrefix}-edit-button`}
              className="w-30"
              variant="primary"
              onClick={() => navigate(`/${def.routeBase}/${recordId}/edit`)}
            >
              Edit
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
