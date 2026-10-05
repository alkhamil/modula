import { useParams } from 'react-router';
import { Card, ErrorStatePage, FormSkeleton } from '../../../../shared/components/ui';
import { useUserForm } from '../hooks';
import UserForm from '../components/UserForm';

function UserEdit() {
  const { userId } = useParams<{ userId: string }>();
  const { defaultValues, user, queryStatus, errorType, onSubmit, onCancel } = useUserForm(userId);

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
      defaultValues={defaultValues}
      user={user}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isEdit
    />
  );
}

export default UserEdit;
