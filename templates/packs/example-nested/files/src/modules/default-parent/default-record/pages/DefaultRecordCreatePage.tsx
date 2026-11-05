import { useDefaultRecordForm } from '../hooks';
import { DefaultRecordForm } from '../components';

function DefaultRecordCreatePage() {
  const { defaultValues, onSubmit, onCancel, isSubmitting } = useDefaultRecordForm();

  return (
    <DefaultRecordForm
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      onCancel={onCancel}

      isSubmitting={isSubmitting}
    />
  );
}

export default DefaultRecordCreatePage;
