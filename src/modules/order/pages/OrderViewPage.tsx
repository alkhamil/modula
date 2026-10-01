import { useParams, useNavigate } from 'react-router';
import { Button, DetailCard } from '../../../shared/components/ui';
import { useOrderForm } from '../hooks';

function OrderViewPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { queryStatus, queryMessage, errorType, detailRows } = useOrderForm(orderId);

  return (
    <div data-testid="order-view-page" className="flex min-h-full flex-col stack-gap">
      <DetailCard
        testId="order-detail-card"
        title="Order Details"
        state={{ status: queryStatus, message: queryMessage, rows: detailRows, errorType }}
      />
      {queryStatus !== 'error' && (
        <div className="flex justify-end gap-4">
          <Button
            data-testid="order-back-button"
            className="w-30"
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
        </div>
      )}
    </div>
  );
}

export default OrderViewPage;
