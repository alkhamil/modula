import { useVendorForm } from '../hooks';
import { VendorForm } from '../components';

function VendorCreatePage() {
  const { defaultValues, onSubmit, onCancel, isSubmitting } = useVendorForm();

  return (
    <VendorForm
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      onCancel={onCancel}

      isSubmitting={isSubmitting}
    />
  );
}

export default VendorCreatePage;
