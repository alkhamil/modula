import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Card, ErrorStatePage, FormSkeleton } from '../../../../shared/components/ui';
import { useDefaultRecordForm } from '../hooks';
import { DefaultRecordForm } from '../components';

function DefaultRecordEditPage() {
  const { t } = useTranslation();
  const { defaultRecordId } = useParams<{ defaultRecordId: string }>();
  const {
    defaultValues,
    queryStatus,
    errorType,
    onSubmit,
    onCancel,

    isSubmitting,
  } = useDefaultRecordForm(defaultRecordId);

  if (errorType) return <ErrorStatePage type={errorType} />;

  if (queryStatus === 'loading') {
    return (
      <Card title={t('runtime.editTitle', { singular: t('default_record.label') })}>
        <FormSkeleton />
      </Card>
    );
  }

  return (
    <DefaultRecordForm
      key={defaultRecordId}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isEdit

      isSubmitting={isSubmitting}
    />
  );
}

export default DefaultRecordEditPage;
