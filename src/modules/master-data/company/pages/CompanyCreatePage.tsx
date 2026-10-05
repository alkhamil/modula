import { useCompanyForm } from '../hooks';
import { CompanyForm } from '../components';

function CompanyCreatePage() {
  const { defaultValues, onSubmit, onCancel, isSubmitting } = useCompanyForm();

  return (
    <CompanyForm
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      onCancel={onCancel}

      isSubmitting={isSubmitting}
    />
  );
}

export default CompanyCreatePage;
