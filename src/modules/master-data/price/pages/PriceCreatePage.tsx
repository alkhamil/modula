import { usePriceForm } from '../hooks';
import { PriceForm } from '../components';

function PriceCreatePage() {
  const { defaultValues, onSubmit, onCancel, isSubmitting } = usePriceForm();

  return (
    <PriceForm
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      onCancel={onCancel}

      isSubmitting={isSubmitting}
    />
  );
}

export default PriceCreatePage;
