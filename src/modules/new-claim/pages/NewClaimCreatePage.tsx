import { useNewClaimForm } from '../hooks';
import { NewClaimForm } from '../components';

function NewClaimCreatePage() {
  const { defaultValues, onSubmit, onCancel, isSubmitting } = useNewClaimForm();

  return (
    <NewClaimForm
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      onCancel={onCancel}

      isSubmitting={isSubmitting}
    />
  );
}

export default NewClaimCreatePage;
