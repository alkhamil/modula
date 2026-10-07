import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Card, ErrorStatePage, FormSkeleton } from '../../../../shared/components/ui';
import { usePriceForm } from '../hooks';
import { PriceForm } from '../components';

function PriceEditPage() {
  const { t } = useTranslation();
  const { priceId } = useParams<{ priceId: string }>();
  const {
    defaultValues,
    queryStatus,
    errorType,
    onSubmit,
    onCancel,

    isSubmitting,
  } = usePriceForm(priceId);

  if (errorType) return <ErrorStatePage type={errorType} />;

  if (queryStatus === 'loading') {
    return (
      <Card title={t('runtime.editTitle', { singular: t('price.label') })}>
        <FormSkeleton />
      </Card>
    );
  }

  return (
    <PriceForm
      key={priceId}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isEdit

      isSubmitting={isSubmitting}
    />
  );
}

export default PriceEditPage;
