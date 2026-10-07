import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Card, ErrorStatePage, FormSkeleton } from '../../../../shared/components/ui';
import { useVendorForm } from '../hooks';
import { VendorForm } from '../components';

function VendorEditPage() {
  const { t } = useTranslation();
  const { vendorId } = useParams<{ vendorId: string }>();
  const {
    defaultValues,
    queryStatus,
    errorType,
    onSubmit,
    onCancel,

    isSubmitting,
  } = useVendorForm(vendorId);

  if (errorType) return <ErrorStatePage type={errorType} />;

  if (queryStatus === 'loading') {
    return (
      <Card title={t('runtime.editTitle', { singular: t('vendor.label') })}>
        <FormSkeleton />
      </Card>
    );
  }

  return (
    <VendorForm
      key={vendorId}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isEdit

      isSubmitting={isSubmitting}
    />
  );
}

export default VendorEditPage;
