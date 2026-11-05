import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Card, ErrorStatePage, FormSkeleton } from '../../../shared/components/ui';
import { useDefaultModuleForm } from '../hooks';
import { DefaultModuleForm } from '../components';

function DefaultModuleEditPage() {
  const { t } = useTranslation();
  const { defaultModuleId } = useParams<{ defaultModuleId: string }>();
  const {
    defaultValues,
    queryStatus,
    errorType,
    onSubmit,
    onCancel,

    isSubmitting,
  } = useDefaultModuleForm(defaultModuleId);

  if (errorType) return <ErrorStatePage type={errorType} />;

  if (queryStatus === 'loading') {
    return (
      <Card title={t('runtime.editTitle', { singular: t('default_module.label') })}>
        <FormSkeleton />
      </Card>
    );
  }

  return (
    <DefaultModuleForm
      key={defaultModuleId}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isEdit

      isSubmitting={isSubmitting}
    />
  );
}

export default DefaultModuleEditPage;
