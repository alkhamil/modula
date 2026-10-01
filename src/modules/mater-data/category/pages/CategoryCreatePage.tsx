import { useCategoryForm } from '../hooks';
import { CategoryForm } from '../components';

function CategoryCreatePage() {
  const { defaultValues, onSubmit, onCancel, isSubmitting } = useCategoryForm();

  return (
    <CategoryForm
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      onCancel={onCancel}

      isSubmitting={isSubmitting}
    />
  );
}

export default CategoryCreatePage;
