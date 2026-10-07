import { useParams, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Button, DetailCard } from '../../../shared/components/ui';
import { useAuth } from '../../../app/providers';
import { useProductForm } from '../hooks';
import { ProductPermissions } from '../permissions';

function ProductViewPage() {
  const { t } = useTranslation();
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { can } = useAuth();
  const { queryStatus, queryMessage, errorType, detailRows } = useProductForm(productId);

  return (
    <div data-testid="product-view-page" className="flex min-h-full flex-col stack-gap">
      <DetailCard
        testId="product-detail-card"
        title={t('runtime.detailTitle', { singular: t('product.label') })}
        state={{ status: queryStatus, message: queryMessage, rows: detailRows, errorType }}
      />
      {queryStatus !== 'error' && (
        <div className="flex justify-end gap-4">
          <Button
            data-testid="product-back-button"
            className="w-30"
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            {t('common.back')}
          </Button>
          {can(ProductPermissions.update) && (
            <Button
              data-testid="product-edit-button"
              className="w-30"
              variant="primary"
              onClick={() => navigate(`/products/${productId}/edit`)}
            >
              {t('common.edit')}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default ProductViewPage;
