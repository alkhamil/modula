import { useParams } from 'react-router';
import { Card, ErrorStatePage, FormSkeleton } from '../../../../shared/components/ui';
import { useCategoryForm } from '../hooks';
import { CategoryForm } from '../components';

function CategoryEditPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const {
    defaultValues,
    queryStatus,
    errorType,
    onSubmit,
    onCancel,

    isSubmitting,
  } = useCategoryForm(categoryId);

  if (errorType) return <ErrorStatePage type={errorType} />;

  if (queryStatus === 'loading') {
    return (
      <Card title="Edit Category">
        <FormSkeleton />
      </Card>
    );
  }

  return (
    <CategoryForm
      key={categoryId}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isEdit

      isSubmitting={isSubmitting}
    />
  );
}

export default CategoryEditPage;
