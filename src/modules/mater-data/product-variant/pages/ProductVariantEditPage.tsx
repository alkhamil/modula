import { useParams } from 'react-router';
import { Card, ErrorStatePage, FormSkeleton } from '../../../../shared/components/ui';
import { useProductVariantForm } from '../hooks';
import { ProductVariantForm } from '../components';

function ProductVariantEditPage() {
  const { productVariantId } = useParams<{ productVariantId: string }>();
  const {
    defaultValues,
    queryStatus,
    errorType,
    onSubmit,
    onCancel,

    isSubmitting,
  } = useProductVariantForm(productVariantId);

  if (errorType) return <ErrorStatePage type={errorType} />;

  if (queryStatus === 'loading') {
    return (
      <Card title="Edit ProductVariant">
        <FormSkeleton />
      </Card>
    );
  }

  return (
    <ProductVariantForm
      key={productVariantId}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isEdit

      isSubmitting={isSubmitting}
    />
  );
}

export default ProductVariantEditPage;
