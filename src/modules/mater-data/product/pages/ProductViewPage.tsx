import { useParams, useNavigate } from 'react-router';
import { Button, DetailCard } from '../../../../shared/components/ui';
import { useAuth } from '../../../../modules/auth';
import { useProductForm } from '../hooks';
import { ProductPermissions } from '../permissions';

function ProductViewPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { can } = useAuth();
  const { queryStatus, queryMessage, errorType, detailRows } = useProductForm(productId);

  return (
    <div data-testid="product-view-page" className="flex min-h-full flex-col stack-gap">
      <DetailCard
        testId="product-detail-card"
        title="Product Details"
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
            Back
          </Button>
          {can(ProductPermissions.update) && (
            <Button
              data-testid="product-edit-button"
              className="w-30"
              variant="primary"
              onClick={() => navigate(`/mater-data/products/${productId}/edit`)}
            >
              Edit
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default ProductViewPage;
