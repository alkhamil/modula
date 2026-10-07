import { useParams, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Button, DetailCard } from '../../../../shared/components/ui';
import { useAuth } from '../../../../app/providers';
import { useCategoryForm } from '../hooks';
import { CategoryPermissions } from '../permissions';

function CategoryViewPage() {
  const { t } = useTranslation();
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { can } = useAuth();
  const { queryStatus, queryMessage, errorType, detailRows } = useCategoryForm(categoryId);

  return (
    <div data-testid="category-view-page" className="flex min-h-full flex-col stack-gap">
      <DetailCard
        testId="category-detail-card"
        title={t('runtime.detailTitle', { singular: t('category.label') })}
        state={{ status: queryStatus, message: queryMessage, rows: detailRows, errorType }}
      />
      {queryStatus !== 'error' && (
        <div className="flex justify-end gap-4">
          <Button
            data-testid="category-back-button"
            className="w-30"
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            {t('common.back')}
          </Button>
          {can(CategoryPermissions.update) && (
            <Button
              data-testid="category-edit-button"
              className="w-30"
              variant="primary"
              onClick={() => navigate(`/master-data/categories/${categoryId}/edit`)}
            >
              {t('common.edit')}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default CategoryViewPage;
