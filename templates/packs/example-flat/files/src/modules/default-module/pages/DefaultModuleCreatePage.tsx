import { useDefaultModuleForm } from '../hooks';
import { DefaultModuleForm } from '../components';

function DefaultModuleCreatePage() {
  const { defaultValues, onSubmit, onCancel, isSubmitting } = useDefaultModuleForm();

  return (
    <DefaultModuleForm
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      onCancel={onCancel}

      isSubmitting={isSubmitting}
    />
  );
}

export default DefaultModuleCreatePage;
