import { useParams } from 'react-router';
import { Card, ErrorStatePage, FormSkeleton } from '../../../../shared/components/ui';
import { useInventoryForm } from '../hooks';
import { InventoryForm } from '../components';

function InventoryEditPage() {
  const { inventoryId } = useParams<{ inventoryId: string }>();
  const {
    defaultValues,
    queryStatus,
    errorType,
    onSubmit,
    onCancel,

    isSubmitting,
  } = useInventoryForm(inventoryId);

  if (errorType) return <ErrorStatePage type={errorType} />;

  if (queryStatus === 'loading') {
    return (
      <Card title="Edit Inventory">
        <FormSkeleton />
      </Card>
    );
  }

  return (
    <InventoryForm
      key={inventoryId}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isEdit

      isSubmitting={isSubmitting}
    />
  );
}

export default InventoryEditPage;
