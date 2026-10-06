import { useInvoiceForm } from '../hooks';
import { InvoiceForm } from '../components';

function InvoiceCreatePage() {
  const { defaultValues, onSubmit, onCancel, isSubmitting } = useInvoiceForm();

  return (
    <InvoiceForm
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      onCancel={onCancel}

      isSubmitting={isSubmitting}
    />
  );
}

export default InvoiceCreatePage;
