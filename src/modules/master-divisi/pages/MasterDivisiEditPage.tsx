import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Card, ErrorStatePage, FormSkeleton } from '../../../shared/components/ui';
import { useMasterDivisiForm } from '../hooks';
import { MasterDivisiForm } from '../components';

function MasterDivisiEditPage() {
  const { t } = useTranslation();
  const { masterDivisiId } = useParams<{ masterDivisiId: string }>();
  const {
    defaultValues,
    queryStatus,
    errorType,
    onSubmit,
    onCancel,

    isSubmitting,
  } = useMasterDivisiForm(masterDivisiId);

  if (errorType) return <ErrorStatePage type={errorType} />;

  if (queryStatus === 'loading') {
    return (
      <Card title={t('runtime.editTitle', { singular: t('master_division.label') })}>
        <FormSkeleton />
      </Card>
    );
  }

  return (
    <MasterDivisiForm
      key={masterDivisiId}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isEdit

      isSubmitting={isSubmitting}
    />
  );
}

export default MasterDivisiEditPage;
