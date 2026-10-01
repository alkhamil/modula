import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useToast, Badge } from '../../../../shared/components/ui';
import type { DetailRow } from '../../../../shared/components/ui';
import type { SubmitResult } from '../../../../shared/types';
import {
  capitalize,
  isConnectionError,
  mapSubmitError,
  splitFieldErrors,
  getErrorStateType,
} from '../../../../shared/utils';
import type { Branch } from '../types';
import { useBranchDetailQuery, useUpsertBranch } from '../api';

export interface FormValues {
  branchName: string;
  branchCode: string;
}

function buildDefaultValues(item?: Branch): FormValues {
  return item
    ? {
        branchName: item.branchName,
        branchCode: item.branchCode,
      }
    : {
        branchName: '',
        branchCode: '',
      };
}

export function useBranchForm(id?: string) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isEdit = !!id;

  const query = useBranchDetailQuery(id);

  const upsertMutation = useUpsertBranch();

  const branch = query.data;

  async function onSubmit(data: FormValues): Promise<SubmitResult> {
    try {
      const res = await upsertMutation.mutateAsync({
        id: isEdit ? id : undefined,
        data: {
          branchName: data.branchName,
          branchCode: data.branchCode,
        },
      });

      showToast({ message: res.message, variant: 'success' });
      setTimeout(() => navigate('/mater-data/branches'), 500);
      return { success: true };
    } catch (err: unknown) {
      const fallback = `Failed to ${isEdit ? 'update' : 'create'} branch`;
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
    if (!branch) {
      return [
        { label: 'Status', value: '' },
        { label: 'Branch Name', value: '' },
        { label: 'Branch Code', value: '' },
      ];
    }
    return [
      {
        label: 'Status',
        value: (
          <Badge variant={branch.status === 'active' ? 'success' : 'secondary'}>
            {capitalize(branch.status)}
          </Badge>
        ),
      },
      { label: 'Branch Name', value: branch.branchName },
      { label: 'Branch Code', value: branch.branchCode },
      { label: 'Created By', value: branch.createdBy },
      { label: 'Created Date', value: branch.createdDate },
    ];
  }, [branch]);

  const queryStatus: 'loading' | 'error' | 'success' = query.isLoading
    ? 'loading'
    : query.error
      ? 'error'
      : 'success';

  const defaultValues = useMemo(() => buildDefaultValues(branch), [branch]);

  return {
    queryStatus,
    queryMessage: query.error?.message ?? undefined,
    errorType: query.error ? getErrorStateType(query.error) : undefined,
    isNetworkError: query.error ? isConnectionError(query.error) : false,
    branch,
    refresh: () => query.refetch(),
    detailRows,
    defaultValues,
    isSubmitting: upsertMutation.isPending,
    isEdit,
    onSubmit,
    onCancel,

  };
}
