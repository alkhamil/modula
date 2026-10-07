import { useMasterDivisiForm } from '../hooks';
import { MasterDivisiForm } from '../components';

function MasterDivisiCreatePage() {
  const { defaultValues, onSubmit, onCancel, isSubmitting } = useMasterDivisiForm();

  return (
    <MasterDivisiForm
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      onCancel={onCancel}

      isSubmitting={isSubmitting}
    />
  );
}

export default MasterDivisiCreatePage;
