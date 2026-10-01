import { useParams, useNavigate } from 'react-router';
import { Button, DetailCard } from '../../../../shared/components/ui';
import { useBranchForm } from '../hooks';

function BranchViewPage() {
  const { branchId } = useParams<{ branchId: string }>();
  const navigate = useNavigate();
  const { queryStatus, queryMessage, errorType, detailRows } = useBranchForm(branchId);

  return (
    <div data-testid="branch-view-page" className="flex min-h-full flex-col stack-gap">
      <DetailCard
        testId="branch-detail-card"
        title="Branch Details"
        state={{ status: queryStatus, message: queryMessage, rows: detailRows, errorType }}
      />
      {queryStatus !== 'error' && (
        <div className="flex justify-end gap-4">
          <Button
            data-testid="branch-back-button"
            className="w-30"
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
          <Button
            data-testid="branch-edit-button"
            className="w-30"
            variant="primary"
            onClick={() => navigate(`/mater-data/branches/${branchId}/edit`)}
          >
            Edit
          </Button>
        </div>
      )}
    </div>
  );
}

export default BranchViewPage;
