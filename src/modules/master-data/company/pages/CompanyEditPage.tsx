import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Card, ErrorStatePage, FormSkeleton } from '../../../../shared/components/ui';
import { useCompanyForm } from '../hooks';
import { CompanyForm } from '../components';

function CompanyEditPage() {
  const { t } = useTranslation();
  const { companyId } = useParams<{ companyId: string }>();
  const {
    defaultValues,
    queryStatus,
    errorType,
    onSubmit,
    onCancel,

    isSubmitting,
  } = useCompanyForm(companyId);

  if (errorType) return <ErrorStatePage type={errorType} />;

  if (queryStatus === 'loading') {
    return (
      <Card title={t('runtime.editTitle', { singular: 'Company' })}>
        <FormSkeleton />
      </Card>
    );
  }

  return (
    <CompanyForm
      key={companyId}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isEdit

      isSubmitting={isSubmitting}
    />
  );
}

export default CompanyEditPage;
