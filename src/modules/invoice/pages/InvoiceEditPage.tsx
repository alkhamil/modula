import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Card, ErrorStatePage, FormSkeleton } from '../../../shared/components/ui';
import { useInvoiceForm } from '../hooks';
import { InvoiceForm } from '../components';

function InvoiceEditPage() {
  const { t } = useTranslation();
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const {
    defaultValues,
    queryStatus,
    errorType,
    onSubmit,
    onCancel,

    isSubmitting,
  } = useInvoiceForm(invoiceId);

  if (errorType) return <ErrorStatePage type={errorType} />;

  if (queryStatus === 'loading') {
    return (
      <Card title={t('runtime.editTitle', { singular: t('invoice.label') })}>
        <FormSkeleton />
      </Card>
    );
  }

  return (
    <InvoiceForm
      key={invoiceId}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isEdit

      isSubmitting={isSubmitting}
    />
  );
}

export default InvoiceEditPage;
