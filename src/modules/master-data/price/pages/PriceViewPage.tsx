import { useParams, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Button, DetailCard } from '../../../../shared/components/ui';
import { useAuth } from '../../../../app/providers';
import { usePriceForm } from '../hooks';
import { PricePermissions } from '../permissions';

function PriceViewPage() {
  const { t } = useTranslation();
  const { priceId } = useParams<{ priceId: string }>();
  const navigate = useNavigate();
  const { can } = useAuth();
  const { queryStatus, queryMessage, errorType, detailRows } = usePriceForm(priceId);

  return (
    <div data-testid="price-view-page" className="flex min-h-full flex-col stack-gap">
      <DetailCard
        testId="price-detail-card"
        title={t('runtime.detailTitle', { singular: t('price.label') })}
        state={{ status: queryStatus, message: queryMessage, rows: detailRows, errorType }}
      />
      {queryStatus !== 'error' && (
        <div className="flex justify-end gap-4">
          <Button
            data-testid="price-back-button"
            className="w-30"
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            {t('common.back')}
          </Button>
          {can(PricePermissions.update) && (
            <Button
              data-testid="price-edit-button"
              className="w-30"
              variant="primary"
              onClick={() => navigate(`/master-data/prices/${priceId}/edit`)}
            >
              {t('common.edit')}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default PriceViewPage;
