import { useParams } from 'react-router';
import { Card, ErrorStatePage, FormSkeleton } from '../../../../shared/components/ui';
import { useProductColorForm } from '../hooks';
import { ProductColorForm } from '../components';

function ProductColorEditPage() {
  const { productColorId } = useParams<{ productColorId: string }>();
  const {
    defaultValues,
    queryStatus,
    errorType,
    onSubmit,
    onCancel,

    isSubmitting,
  } = useProductColorForm(productColorId);

  if (errorType) return <ErrorStatePage type={errorType} />;

  if (queryStatus === 'loading') {
    return (
      <Card title="Edit ProductColor">
        <FormSkeleton />
      </Card>
    );
  }

  return (
    <ProductColorForm
      key={productColorId}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isEdit

      isSubmitting={isSubmitting}
    />
  );
}

export default ProductColorEditPage;
