import { useParams } from 'react-router';
import { Card, ErrorStatePage, FormSkeleton } from '../../../shared/components/ui';
import { useUserForm } from '../hooks';
import { UserForm } from '../components';

function UserEditPage() {
  const { userId } = useParams<{ userId: string }>();
  const {
    defaultValues,
    queryStatus,
    errorType,
    onSubmit,
    onCancel,
    roleOptions,
    isSubmitting,
  } = useUserForm(userId);

  if (errorType) return <ErrorStatePage type={errorType} />;

  if (queryStatus === 'loading') {
    return (
      <Card title="Edit User">
        <FormSkeleton />
      </Card>
    );
  }

  return (
    <UserForm
      key={userId}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isEdit
      roleOptions={roleOptions}
      isSubmitting={isSubmitting}
    />
  );
}

export default UserEditPage;
