import { useParams, useNavigate } from 'react-router';
import { Button, DetailCard } from '../../../shared/components/ui';
import { useAuth } from '../../auth';
import { useUserForm } from '../hooks';
import { UserPermissions } from '../permissions';

function UserViewPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { can } = useAuth();
  const { queryStatus, queryMessage, errorType, detailRows } = useUserForm(userId);

  return (
    <div data-testid="user-view-page" className="flex min-h-full flex-col stack-gap">
      <DetailCard
        testId="user-detail-card"
        title="User Details"
        state={{ status: queryStatus, message: queryMessage, rows: detailRows, errorType }}
      />
      {queryStatus !== 'error' && (
        <div className="flex justify-end gap-4">
          <Button
            data-testid="user-back-button"
            className="w-30"
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
          {can(UserPermissions.update) && (
            <Button
              data-testid="user-edit-button"
              className="w-30"
              variant="primary"
              onClick={() => navigate(`/users/${userId}/edit`)}
            >
              Edit
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default UserViewPage;
