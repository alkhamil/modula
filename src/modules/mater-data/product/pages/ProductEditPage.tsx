import { useParams } from 'react-router';
import { Card, ErrorStatePage, FormSkeleton } from '../../../../shared/components/ui';
import { useProductForm } from '../hooks';
import { ProductForm } from '../components';

function ProductEditPage() {
  const { productId } = useParams<{ productId: string }>();
  const {
    defaultValues,
    queryStatus,
    errorType,
    onSubmit,
    onCancel,

    isSubmitting,
  } = useProductForm(productId);

  if (errorType) return <ErrorStatePage type={errorType} />;

  if (queryStatus === 'loading') {
    return (
      <Card title="Edit Product">
        <FormSkeleton />
      </Card>
    );
  }

  return (
    <ProductForm
      key={productId}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isEdit

      isSubmitting={isSubmitting}
    />
  );
}

export default ProductEditPage;
