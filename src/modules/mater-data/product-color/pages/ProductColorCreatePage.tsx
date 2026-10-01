import { useProductColorForm } from '../hooks';
import { ProductColorForm } from '../components';

function ProductColorCreatePage() {
  const { defaultValues, onSubmit, onCancel, isSubmitting } = useProductColorForm();

  return (
    <ProductColorForm
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      onCancel={onCancel}

      isSubmitting={isSubmitting}
    />
  );
}

export default ProductColorCreatePage;
