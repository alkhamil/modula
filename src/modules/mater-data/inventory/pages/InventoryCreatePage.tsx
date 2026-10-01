import { useInventoryForm } from '../hooks';
import { InventoryForm } from '../components';

function InventoryCreatePage() {
  const { defaultValues, onSubmit, onCancel, isSubmitting } = useInventoryForm();

  return (
    <InventoryForm
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      onCancel={onCancel}

      isSubmitting={isSubmitting}
    />
  );
}

export default InventoryCreatePage;
