import { useBranchForm } from '../hooks';
import { BranchForm } from '../components';

function BranchCreatePage() {
  const { defaultValues, onSubmit, onCancel, isSubmitting } = useBranchForm();

  return (
    <BranchForm
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      onCancel={onCancel}

      isSubmitting={isSubmitting}
    />
  );
}

export default BranchCreatePage;
