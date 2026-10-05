import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useToast, Badge } from '../../../../shared/components/ui';
import type { DetailRow } from '../../../../shared/components/ui';
import type { SubmitResult } from '../../../../shared/types';
import {
  isConnectionError,
  mapSubmitError,
  splitFieldErrors,
  getErrorStateType,
} from '../../../../shared/utils';
import type { User } from '../types';
import { useUserDetailQuery, useUpsertUser } from '../api';

export interface FormValues {
  name: string;
  role_id: string;
  username: string;
  email: string;
  password: string;
  status: boolean;
}

function buildDefaultValues(user?: User): FormValues {
  return user
    ? {
        name: user.name,
        role_id: user.role_id,
        username: user.username,
        email: user.email,
        password: '',
        status: user.status === 'active',
      }
    : {
        name: '',
        role_id: '',
        username: '',
        email: '',
        password: '',
        status: true,
      };
}

export function useUserForm(userId?: string) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isEdit = !!userId;

  const query = useUserDetailQuery(userId);
  const upsertMutation = useUpsertUser();

  const user = query.data;

  async function onSubmit(data: FormValues): Promise<SubmitResult> {
    try {
      const res = await upsertMutation.mutateAsync({
        userId: isEdit ? userId : undefined,
        data: {
          name: data.name,
          role_id: data.role_id,
          username: data.username,
          email: data.email,
          // Password hanya dikirim saat create / bila diisi saat edit.
          password: data.password || (isEdit ? user?.password ?? '' : ''),
          status: data.status ? 'active' : 'inactive',
        },
      });
      showToast({
        message: res.message,
        variant: 'success',
      });
      setTimeout(() => navigate('/user-management/user'), 500);
      return { success: true };
    } catch (err: unknown) {
      const fallback = `Failed to ${isEdit ? 'update' : 'create'} user`;
      const result = mapSubmitError(err, fallback);
      if (result.fieldErrors) {
        const { fieldErrors, unknownMessage } = splitFieldErrors(
          result.fieldErrors,
          (field) => field,
        );
        if (unknownMessage) showToast({ message: unknownMessage, variant: 'error' });
        return Object.keys(fieldErrors).length > 0
          ? { success: false, fieldErrors }
          : { success: false };
      }
      if (result.toastMessage) {
        showToast({ message: result.toastMessage, variant: 'error' });
      }
      return result;
    }
  }

  function onCancel() {
    navigate(-1);
  }

  const detailRows = useMemo<DetailRow[]>(() => {
    if (!user) return [];

    return [
      { label: 'Name', value: user.name },
      { label: 'Username', value: user.username },
      { label: 'Email', value: user.email },
      { label: 'Role', value: user.role_name },
      {
        label: 'Status',
        value: (
          <Badge variant={user.status === 'active' ? 'success' : 'secondary'}>
            {user.status === 'active' ? 'Active' : 'Inactive'}
          </Badge>
        ),
      },
    ];
  }, [user]);

  const queryStatus: 'loading' | 'error' | 'success' = query.isLoading
    ? 'loading'
    : query.error
      ? 'error'
      : 'success';

  return {
    queryStatus,
    queryMessage: query.error?.message ?? undefined,
    errorType: query.error ? getErrorStateType(query.error) : undefined,
    isNetworkError: query.error ? isConnectionError(query.error) : false,
    user,
    refresh: () => query.refetch(),
    detailRows,
    defaultValues: buildDefaultValues(user),
    isSubmitting: upsertMutation.isPending,
    isEdit,
    onSubmit,
    onCancel,
  };
}
