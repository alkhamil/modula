import { useProductVariantForm } from '../hooks';
import { ProductVariantForm } from '../components';

function ProductVariantCreatePage() {
  const { defaultValues, onSubmit, onCancel, isSubmitting } = useProductVariantForm();

  return (
    <ProductVariantForm
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      onCancel={onCancel}

      isSubmitting={isSubmitting}
    />
  );
}

export default ProductVariantCreatePage;
