import { useParams, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Button, DetailCard } from '../../../../shared/components/ui';
import { useAuth } from '../../../../app/providers';
import { useVendorForm } from '../hooks';
import { VendorPermissions } from '../permissions';

function VendorViewPage() {
  const { t } = useTranslation();
  const { vendorId } = useParams<{ vendorId: string }>();
  const navigate = useNavigate();
  const { can } = useAuth();
  const { queryStatus, queryMessage, errorType, detailRows } = useVendorForm(vendorId);

  return (
    <div data-testid="vendor-view-page" className="flex min-h-full flex-col stack-gap">
      <DetailCard
        testId="vendor-detail-card"
        title={t('runtime.detailTitle', { singular: t('vendor.label') })}
        state={{ status: queryStatus, message: queryMessage, rows: detailRows, errorType }}
      />
      {queryStatus !== 'error' && (
        <div className="flex justify-end gap-4">
          <Button
            data-testid="vendor-back-button"
            className="w-30"
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            {t('common.back')}
          </Button>
          {can(VendorPermissions.update) && (
            <Button
              data-testid="vendor-edit-button"
              className="w-30"
              variant="primary"
              onClick={() => navigate(`/master-data/vendors/${vendorId}/edit`)}
            >
              {t('common.edit')}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default VendorViewPage;
