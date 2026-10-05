import { useParams, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Button, DetailCard } from '../../../../shared/components/ui';
import { useAuth } from '../../../../app/providers';
import { useCompanyForm } from '../hooks';
import { CompanyPermissions } from '../permissions';

function CompanyViewPage() {
  const { t } = useTranslation();
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();
  const { can } = useAuth();
  const { queryStatus, queryMessage, errorType, detailRows } = useCompanyForm(companyId);

  return (
    <div data-testid="company-view-page" className="flex min-h-full flex-col stack-gap">
      <DetailCard
        testId="company-detail-card"
        title={t('runtime.detailTitle', { singular: 'Company' })}
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
            {t('common.back')}
          </Button>
          {can(CompanyPermissions.update) && (
            <Button
              data-testid="company-edit-button"
              className="w-30"
              variant="primary"
              onClick={() => navigate(`/master-data/companies/${companyId}/edit`)}
            >
              {t('common.edit')}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default CompanyViewPage;
