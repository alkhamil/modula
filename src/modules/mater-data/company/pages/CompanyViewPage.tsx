import { useParams, useNavigate } from 'react-router';
import { Button, DetailCard } from '../../../../shared/components/ui';
import { useCompanyForm } from '../hooks';

function CompanyViewPage() {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();
  const { queryStatus, queryMessage, errorType, detailRows } = useCompanyForm(companyId);

  return (
    <div data-testid="company-view-page" className="flex min-h-full flex-col stack-gap">
      <DetailCard
        testId="company-detail-card"
        title="Company Details"
        state={{ status: queryStatus, message: queryMessage, rows: detailRows, errorType }}
      />
      {queryStatus !== 'error' && (
        <div className="flex justify-end gap-4">
          <Button
            data-testid="company-back-button"
            className="w-30"
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
          <Button
            data-testid="company-edit-button"
            className="w-30"
            variant="primary"
            onClick={() => navigate(`/mater-data/companies/${companyId}/edit`)}
          >
            Edit
          </Button>
        </div>
      )}
    </div>
  );
}

export default CompanyViewPage;
