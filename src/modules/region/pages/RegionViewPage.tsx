import { useParams, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Button, DetailCard } from '../../../shared/components/ui';
import { useAuth } from '../../../app/providers';
import { useRegionForm } from '../hooks';
import { RegionPermissions } from '../permissions';

function RegionViewPage() {
  const { t } = useTranslation();
  const { regionId } = useParams<{ regionId: string }>();
  const navigate = useNavigate();
  const { can } = useAuth();
  const { queryStatus, queryMessage, errorType, detailRows } = useRegionForm(regionId);

  return (
    <div data-testid="region-view-page" className="flex min-h-full flex-col stack-gap">
      <DetailCard
        testId="region-detail-card"
        title={t('runtime.detailTitle', { singular: t('region.label') })}
        state={{ status: queryStatus, message: queryMessage, rows: detailRows, errorType }}
      />
      {queryStatus !== 'error' && (
        <div className="flex justify-end gap-4">
          <Button
            data-testid="region-back-button"
            className="w-30"
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            {t('common.back')}
          </Button>
          {can(RegionPermissions.update) && (
            <Button
              data-testid="region-edit-button"
              className="w-30"
              variant="primary"
              onClick={() => navigate(`/regions/${regionId}/edit`)}
            >
              {t('common.edit')}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default RegionViewPage;
