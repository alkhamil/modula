import { useProductForm } from '../hooks';
import { ProductForm } from '../components';

function ProductCreatePage() {
  const { defaultValues, onSubmit, onCancel, isSubmitting } = useProductForm();

  return (
    <ProductForm
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      onCancel={onCancel}

      isSubmitting={isSubmitting}
    />
  );
}

export default ProductCreatePage;
