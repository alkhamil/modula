import { useParams, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { AltArrowLeft, Pen } from '../../../../shared/components/icons';
import { Button, DetailCard } from '../../../../shared/components/ui';
import { useAuth } from '../../../../app/providers';
import { useDefaultItemForm } from '../hooks';
import { DefaultItemPermissions } from '../permissions';

function DefaultItemViewPage() {
  const { t } = useTranslation();
  const { defaultItemId } = useParams<{ defaultItemId: string }>();
  const navigate = useNavigate();
  const { can } = useAuth();
  const { queryStatus, queryMessage, errorType, detailRows } = useDefaultItemForm(defaultItemId);

  return (
    <div data-testid="default-item-view-page" className="flex min-h-full flex-col stack-gap">
      <DetailCard
        testId="default-item-detail-card"
        title={t('runtime.detailTitle', { singular: t('default_item.label') })}
        state={{ status: queryStatus, message: queryMessage, rows: detailRows, errorType }}
        actions={
          queryStatus !== 'error' ? (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                data-testid="default-item-back-button"
                variant="secondary"
                icon={<AltArrowLeft className="h-4 w-4" />}
                onClick={() => navigate(-1)}
              >
                {t('common.back')}
              </Button>
              {can(DefaultItemPermissions.update) && (
                <Button
                  type="button"
                  data-testid="default-item-edit-button"
                  variant="secondary"
                  icon={<Pen className="h-4 w-4" />}
                  onClick={() => navigate(`/default-parent/default-items/${defaultItemId}/edit`)}
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

export default DefaultItemViewPage;
