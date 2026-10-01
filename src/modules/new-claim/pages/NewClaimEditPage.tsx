import { useParams } from 'react-router';
import { Card, ErrorStatePage, FormSkeleton } from '../../../shared/components/ui';
import { useNewClaimForm } from '../hooks';
import { NewClaimForm } from '../components';

function NewClaimEditPage() {
  const { newClaimId } = useParams<{ newClaimId: string }>();
  const {
    defaultValues,
    queryStatus,
    errorType,
    onSubmit,
    onCancel,

    isSubmitting,
  } = useNewClaimForm(newClaimId);

  if (errorType) return <ErrorStatePage type={errorType} />;

  if (queryStatus === 'loading') {
    return (
      <Card title="Edit NewClaim">
        <FormSkeleton />
      </Card>
    );
  }

  return (
    <NewClaimForm
      key={newClaimId}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isEdit

      isSubmitting={isSubmitting}
    />
  );
}

export default NewClaimEditPage;
