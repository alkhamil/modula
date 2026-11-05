import { useParams, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { AltArrowLeft, Pen } from '../../../../shared/components/icons';
import { Button, DetailCard } from '../../../../shared/components/ui';
import { useAuth } from '../../../../app/providers';
import { useDefaultRecordForm } from '../hooks';
import { DefaultRecordPermissions } from '../permissions';

function DefaultRecordViewPage() {
  const { t } = useTranslation();
  const { defaultRecordId } = useParams<{ defaultRecordId: string }>();
  const navigate = useNavigate();
  const { can } = useAuth();
  const { queryStatus, queryMessage, errorType, detailRows } = useDefaultRecordForm(defaultRecordId);

  return (
    <div data-testid="default-record-view-page" className="flex min-h-full flex-col stack-gap">
      <DetailCard
        testId="default-record-detail-card"
        title={t('runtime.detailTitle', { singular: t('default_record.label') })}
        state={{ status: queryStatus, message: queryMessage, rows: detailRows, errorType }}
        actions={
          queryStatus !== 'error' ? (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                data-testid="default-record-back-button"
                variant="secondary"
                icon={<AltArrowLeft className="h-4 w-4" />}
                onClick={() => navigate(-1)}
              >
                {t('common.back')}
              </Button>
              {can(DefaultRecordPermissions.update) && (
                <Button
                  type="button"
                  data-testid="default-record-edit-button"
                  variant="secondary"
                  icon={<Pen className="h-4 w-4" />}
                  onClick={() => navigate(`/default-parent/default-records/${defaultRecordId}/edit`)}
                >
                  {t('common.edit')}
                </Button>
              )}
            </div>
          ) : undefined
        }
      />
    </div>
  );
}

export default DefaultRecordViewPage;
