import { useParams, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { AltArrowLeft, Pen } from '../../../shared/components/icons';
import { Button, DetailCard } from '../../../shared/components/ui';
import { useAuth } from '../../../app/providers';
import { useDefaultModuleForm } from '../hooks';
import { DefaultModulePermissions } from '../permissions';

function DefaultModuleViewPage() {
  const { t } = useTranslation();
  const { defaultModuleId } = useParams<{ defaultModuleId: string }>();
  const navigate = useNavigate();
  const { can } = useAuth();
  const { queryStatus, queryMessage, errorType, detailRows } = useDefaultModuleForm(defaultModuleId);

  return (
    <div data-testid="default-module-view-page" className="flex min-h-full flex-col stack-gap">
      <DetailCard
        testId="default-module-detail-card"
        title={t('runtime.detailTitle', { singular: t('default_module.label') })}
        state={{ status: queryStatus, message: queryMessage, rows: detailRows, errorType }}
        actions={
          queryStatus !== 'error' ? (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                data-testid="default-module-back-button"
                variant="secondary"
                icon={<AltArrowLeft className="h-4 w-4" />}
                onClick={() => navigate(-1)}
              >
                {t('common.back')}
              </Button>
              {can(DefaultModulePermissions.update) && (
                <Button
                  type="button"
                  data-testid="default-module-edit-button"
                  variant="secondary"
                  icon={<Pen className="h-4 w-4" />}
                  onClick={() => navigate(`/default-modules/${defaultModuleId}/edit`)}
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

export default DefaultModuleViewPage;
