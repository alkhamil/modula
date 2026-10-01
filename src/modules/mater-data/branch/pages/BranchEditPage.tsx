import { useParams } from 'react-router';
import { Card, ErrorStatePage, FormSkeleton } from '../../../../shared/components/ui';
import { useBranchForm } from '../hooks';
import { BranchForm } from '../components';

function BranchEditPage() {
  const { branchId } = useParams<{ branchId: string }>();
  const {
    defaultValues,
    queryStatus,
    errorType,
    onSubmit,
    onCancel,

    isSubmitting,
  } = useBranchForm(branchId);

  if (errorType) return <ErrorStatePage type={errorType} />;

  if (queryStatus === 'loading') {
    return (
      <Card title="Edit Branch">
        <FormSkeleton />
      </Card>
    );
  }

  return (
    <BranchForm
      key={branchId}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isEdit

      isSubmitting={isSubmitting}
    />
  );
}

export default BranchEditPage;
