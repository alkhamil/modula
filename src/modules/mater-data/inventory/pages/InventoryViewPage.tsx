import { useParams, useNavigate } from 'react-router';
import { Button, DetailCard } from '../../../../shared/components/ui';
import { useAuth } from '../../../../modules/auth';
import { useInventoryForm } from '../hooks';
import { InventoryPermissions } from '../permissions';

function InventoryViewPage() {
  const { inventoryId } = useParams<{ inventoryId: string }>();
  const navigate = useNavigate();
  const { can } = useAuth();
  const { queryStatus, queryMessage, errorType, detailRows } = useInventoryForm(inventoryId);

  return (
    <div data-testid="inventory-view-page" className="flex min-h-full flex-col stack-gap">
      <DetailCard
        testId="inventory-detail-card"
        title="Inventory Details"
        state={{ status: queryStatus, message: queryMessage, rows: detailRows, errorType }}
      />
      {queryStatus !== 'error' && (
        <div className="flex justify-end gap-4">
          <Button
            data-testid="inventory-back-button"
            className="w-30"
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
          {can(InventoryPermissions.update) && (
            <Button
              data-testid="inventory-edit-button"
              className="w-30"
              variant="primary"
              onClick={() => navigate(`/mater-data/inventories/${inventoryId}/edit`)}
            >
              Edit
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default InventoryViewPage;
