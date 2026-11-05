import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Card, ErrorStatePage, FormSkeleton } from '../../../../shared/components/ui';
import { useDefaultItemForm } from '../hooks';
import { DefaultItemForm } from '../components';

function DefaultItemEditPage() {
  const { t } = useTranslation();
  const { defaultItemId } = useParams<{ defaultItemId: string }>();
  const {
    defaultValues,
    queryStatus,
    errorType,
    onSubmit,
    onCancel,

    isSubmitting,
  } = useDefaultItemForm(defaultItemId);

  if (errorType) return <ErrorStatePage type={errorType} />;

  if (queryStatus === 'loading') {
    return (
      <Card title={t('runtime.editTitle', { singular: t('default_item.label') })}>
        <FormSkeleton />
      </Card>
    );
  }

  return (
    <DefaultItemForm
      key={defaultItemId}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isEdit

      isSubmitting={isSubmitting}
    />
  );
}

export default DefaultItemEditPage;
