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
  formatDate,
} from '../../../shared/utils';
import type { NewClaim } from '../types';
import { useNewClaimDetailQuery, useUpsertNewClaim } from '../api';

export interface FormValues {
  policyNumber: string;
  policyDate: string;
}

function buildDefaultValues(item?: NewClaim): FormValues {
  return item
    ? {
        policyNumber: item.policyNumber,
        policyDate: item.policyDate,
      }
    : {
        policyNumber: '',
        policyDate: '',
      };
}

export function useNewClaimForm(id?: string) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isEdit = !!id;

  const query = useNewClaimDetailQuery(id);

  const upsertMutation = useUpsertNewClaim();

  const newClaim = query.data;

  async function onSubmit(data: FormValues): Promise<SubmitResult> {
    try {
      const res = await upsertMutation.mutateAsync({
        id: isEdit ? id : undefined,
        data: {
          policyNumber: data.policyNumber,
          policyDate: data.policyDate,
        },
      });

      showToast({ message: res.message, variant: 'success' });
      setTimeout(() => navigate('/new-claims'), 500);
      return { success: true };
    } catch (err: unknown) {
      const fallback = `Failed to ${isEdit ? 'update' : 'create'} newClaim`;
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
    if (!newClaim) {
      return [
        { label: 'Status', value: '' },
        { label: 'Policy Number', value: '' },
        { label: 'Policy Date', value: '' },
      ];
    }
    return [
      {
        label: 'Status',
        value: (
          <Badge variant={newClaim.status === 'active' ? 'success' : 'secondary'}>
            {capitalize(newClaim.status)}
          </Badge>
        ),
      },
      { label: 'Policy Number', value: newClaim.policyNumber },
      { label: 'Policy Date', value: formatDate(newClaim.policyDate) },
      { label: 'Created By', value: newClaim.createdBy },
      { label: 'Created Date', value: newClaim.createdDate },
    ];
  }, [newClaim]);

  const queryStatus: 'loading' | 'error' | 'success' = query.isLoading
    ? 'loading'
    : query.error
      ? 'error'
      : 'success';

  const defaultValues = useMemo(() => buildDefaultValues(newClaim), [newClaim]);

  return {
    queryStatus,
    queryMessage: query.error?.message ?? undefined,
    errorType: query.error ? getErrorStateType(query.error) : undefined,
    isNetworkError: query.error ? isConnectionError(query.error) : false,
    newClaim,
    refresh: () => query.refetch(),
    detailRows,
    defaultValues,
    isSubmitting: upsertMutation.isPending,
    isEdit,
    onSubmit,
    onCancel,

  };
}
