import { useParams, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Button, DetailCard } from '../../../shared/components/ui';
import { useAuth } from '../../../app/providers';
import { useMasterDivisiForm } from '../hooks';
import { MasterDivisiPermissions } from '../permissions';

function MasterDivisiViewPage() {
  const { t } = useTranslation();
  const { masterDivisiId } = useParams<{ masterDivisiId: string }>();
  const navigate = useNavigate();
  const { can } = useAuth();
  const { queryStatus, queryMessage, errorType, detailRows } = useMasterDivisiForm(masterDivisiId);

  return (
    <div data-testid="master-divisi-view-page" className="flex min-h-full flex-col stack-gap">
      <DetailCard
        testId="master-divisi-detail-card"
        title={t('runtime.detailTitle', { singular: t('master_division.label') })}
        state={{ status: queryStatus, message: queryMessage, rows: detailRows, errorType }}
      />
      {queryStatus !== 'error' && (
        <div className="flex justify-end gap-4">
          <Button
            data-testid="master-divisi-back-button"
            className="w-30"
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            {t('common.back')}
          </Button>
          {can(MasterDivisiPermissions.update) && (
            <Button
              data-testid="master-divisi-edit-button"
              className="w-30"
              variant="primary"
              onClick={() => navigate(`/master-divisis/${masterDivisiId}/edit`)}
            >
              {t('common.edit')}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default MasterDivisiViewPage;
