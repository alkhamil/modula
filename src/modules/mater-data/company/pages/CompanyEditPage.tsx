import { useParams } from 'react-router';
import { Card, ErrorStatePage, FormSkeleton } from '../../../../shared/components/ui';
import { useCompanyForm } from '../hooks';
import { CompanyForm } from '../components';

function CompanyEditPage() {
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
      <Card title="Edit Company">
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
