import { useParams, useNavigate } from 'react-router';
import { Button, DetailCard } from '../../../../shared/components/ui';
import { useAuth } from '../../../../modules/auth';
import { useProductColorForm } from '../hooks';
import { ProductColorPermissions } from '../permissions';

function ProductColorViewPage() {
  const { productColorId } = useParams<{ productColorId: string }>();
  const navigate = useNavigate();
  const { can } = useAuth();
  const { queryStatus, queryMessage, errorType, detailRows } = useProductColorForm(productColorId);

  return (
    <div data-testid="product-color-view-page" className="flex min-h-full flex-col stack-gap">
      <DetailCard
        testId="product-color-detail-card"
        title="ProductColor Details"
        state={{ status: queryStatus, message: queryMessage, rows: detailRows, errorType }}
      />
      {queryStatus !== 'error' && (
        <div className="flex justify-end gap-4">
          <Button
            data-testid="product-color-back-button"
            className="w-30"
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
          {can(ProductColorPermissions.update) && (
            <Button
              data-testid="product-color-edit-button"
              className="w-30"
              variant="primary"
              onClick={() => navigate(`/mater-data/product-colors/${productColorId}/edit`)}
            >
              Edit
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default ProductColorViewPage;
