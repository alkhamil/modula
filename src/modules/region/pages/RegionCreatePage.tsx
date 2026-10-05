import { useRegionForm } from '../hooks';
import { RegionForm } from '../components';

function RegionCreatePage() {
  const { defaultValues, onSubmit, onCancel, isSubmitting } = useRegionForm();

  return (
    <RegionForm
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      onCancel={onCancel}

      isSubmitting={isSubmitting}
    />
  );
}

export default RegionCreatePage;
