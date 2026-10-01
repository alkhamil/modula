import { useParams, useNavigate } from 'react-router';
import { Button, DetailCard } from '../../../../shared/components/ui';
import { useAuth } from '../../../../modules/auth';
import { useProductVariantForm } from '../hooks';
import { ProductVariantPermissions } from '../permissions';

function ProductVariantViewPage() {
  const { productVariantId } = useParams<{ productVariantId: string }>();
  const navigate = useNavigate();
  const { can } = useAuth();
  const { queryStatus, queryMessage, errorType, detailRows } = useProductVariantForm(productVariantId);

  return (
    <div data-testid="product-variant-view-page" className="flex min-h-full flex-col stack-gap">
      <DetailCard
        testId="product-variant-detail-card"
        title="ProductVariant Details"
        state={{ status: queryStatus, message: queryMessage, rows: detailRows, errorType }}
      />
      {queryStatus !== 'error' && (
        <div className="flex justify-end gap-4">
          <Button
            data-testid="product-variant-back-button"
            className="w-30"
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
          {can(ProductVariantPermissions.update) && (
            <Button
              data-testid="product-variant-edit-button"
              className="w-30"
              variant="primary"
              onClick={() => navigate(`/mater-data/product-variants/${productVariantId}/edit`)}
            >
              Edit
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default ProductVariantViewPage;
