import { useDefaultItemForm } from '../hooks';
import { DefaultItemForm } from '../components';

function DefaultItemCreatePage() {
  const { defaultValues, onSubmit, onCancel, isSubmitting } = useDefaultItemForm();

  return (
    <DefaultItemForm
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      onCancel={onCancel}

      isSubmitting={isSubmitting}
    />
  );
}

export default DefaultItemCreatePage;
