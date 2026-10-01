import { useParams, useNavigate } from 'react-router';
import { Button, DetailCard } from '../../../shared/components/ui';
import { useAuth } from '../../../modules/auth';
import { useNewClaimForm } from '../hooks';
import { NewClaimPermissions } from '../permissions';

function NewClaimViewPage() {
  const { newClaimId } = useParams<{ newClaimId: string }>();
  const navigate = useNavigate();
  const { can } = useAuth();
  const { queryStatus, queryMessage, errorType, detailRows } = useNewClaimForm(newClaimId);

  return (
    <div data-testid="new-claim-view-page" className="flex min-h-full flex-col stack-gap">
      <DetailCard
        testId="new-claim-detail-card"
        title="NewClaim Details"
        state={{ status: queryStatus, message: queryMessage, rows: detailRows, errorType }}
      />
      {queryStatus !== 'error' && (
        <div className="flex justify-end gap-4">
          <Button
            data-testid="new-claim-back-button"
            className="w-30"
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
          {can(NewClaimPermissions.update) && (
            <Button
              data-testid="new-claim-edit-button"
              className="w-30"
              variant="primary"
              onClick={() => navigate(`/new-claims/${newClaimId}/edit`)}
            >
              Edit
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default NewClaimViewPage;
