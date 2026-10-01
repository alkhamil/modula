import { useUserForm } from '../hooks';
import { UserForm } from '../components';

function UserCreatePage() {
  const { defaultValues, onSubmit, onCancel, roleOptions, isSubmitting } = useUserForm();

  return (
    <UserForm
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      onCancel={onCancel}
      roleOptions={roleOptions}
      isSubmitting={isSubmitting}
    />
  );
}

export default UserCreatePage;
