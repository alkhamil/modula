import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useToast, Badge } from '../../../shared/components/ui';
import type { DetailRow } from '../../../shared/components/ui';
import type { SubmitResult } from '../../../shared/types';
import {
  capitalize,
  isConnectionError,
  mapSubmitError,
  splitFieldErrors,
  getErrorStateType,
} from '../../../shared/utils';
import type { User } from '../types';
import { useUserDetailQuery, useUpsertUser, useRoleOptionsQuery } from '../api';

export interface FormValues {
  name: string;
  email: string;
  role: string;
}

function buildDefaultValues(user?: User): FormValues {
  return user
    ? { name: user.name, email: user.email, role: user.role }
    : { name: '', email: '', role: '' };
}

export function useUserForm(id?: string) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isEdit = !!id;

  const query = useUserDetailQuery(id);
  const roleOptionsQuery = useRoleOptionsQuery();
  const upsertMutation = useUpsertUser();

  const user = query.data;

  async function onSubmit(data: FormValues): Promise<SubmitResult> {
    try {
      const res = await upsertMutation.mutateAsync({
        id: isEdit ? id : undefined,
        data: { name: data.name, email: data.email, role: data.role },
      });

      showToast({ message: res.message, variant: 'success' });
      setTimeout(() => navigate('/users'), 500);
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
    if (!user) {
      return [
        { label: 'Status', value: '' },
        { label: 'Name', value: '' },
        { label: 'Email', value: '' },
        { label: 'Role', value: '' },
      ];
    }
    return [
      {
        label: 'Status',
        value: (
          <Badge variant={user.status === 'active' ? 'success' : 'secondary'}>
            {capitalize(user.status)}
          </Badge>
        ),
      },
      { label: 'Name', value: user.name },
      { label: 'Email', value: user.email },
      { label: 'Role', value: capitalize(user.role) },
      { label: 'Created By', value: user.createdBy },
      { label: 'Created Date', value: user.createdDate },
    ];
  }, [user]);

  const queryStatus: 'loading' | 'error' | 'success' = query.isLoading
    ? 'loading'
    : query.error
      ? 'error'
      : 'success';

  const defaultValues = useMemo(() => buildDefaultValues(user), [user]);

  return {
    queryStatus,
    queryMessage: query.error?.message ?? undefined,
    errorType: query.error ? getErrorStateType(query.error) : undefined,
    isNetworkError: query.error ? isConnectionError(query.error) : false,
    user,
    refresh: () => query.refetch(),
    detailRows,
    defaultValues,
    isSubmitting: upsertMutation.isPending,
    isEdit,
    onSubmit,
    onCancel,
    roleOptions: roleOptionsQuery.data ?? [],
  };
}
