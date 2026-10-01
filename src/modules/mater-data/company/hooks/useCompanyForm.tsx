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
import type { Company } from '../types';
import { useCompanyDetailQuery, useUpsertCompany } from '../api';

export interface FormValues {
  companyName: string;
  companyGroup: string;
  companyAddress: string;
}

function buildDefaultValues(item?: Company): FormValues {
  return item
    ? {
        companyName: item.companyName,
        companyGroup: item.companyGroup,
        companyAddress: item.companyAddress,
      }
    : {
        companyName: '',
        companyGroup: '',
        companyAddress: '',
      };
}

export function useCompanyForm(id?: string) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isEdit = !!id;

  const query = useCompanyDetailQuery(id);

  const upsertMutation = useUpsertCompany();

  const company = query.data;

  async function onSubmit(data: FormValues): Promise<SubmitResult> {
    try {
      const res = await upsertMutation.mutateAsync({
        id: isEdit ? id : undefined,
        data: {
          companyName: data.companyName,
          companyGroup: data.companyGroup,
          companyAddress: data.companyAddress,
        },
      });

      showToast({ message: res.message, variant: 'success' });
      setTimeout(() => navigate('/mater-data/companies'), 500);
      return { success: true };
    } catch (err: unknown) {
      const fallback = `Failed to ${isEdit ? 'update' : 'create'} company`;
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
    if (!company) {
      return [
        { label: 'Status', value: '' },
        { label: 'Company Name', value: '' },
        { label: 'Company Group', value: '' },
        { label: 'Company Address', value: '' },
      ];
    }
    return [
      {
        label: 'Status',
        value: (
          <Badge variant={company.status === 'active' ? 'success' : 'secondary'}>
            {capitalize(company.status)}
          </Badge>
        ),
      },
      { label: 'Company Name', value: company.companyName },
      { label: 'Company Group', value: capitalize(String(company.companyGroup)) },
      { label: 'Company Address', value: company.companyAddress },
      { label: 'Created By', value: company.createdBy },
      { label: 'Created Date', value: company.createdDate },
    ];
  }, [company]);

  const queryStatus: 'loading' | 'error' | 'success' = query.isLoading
    ? 'loading'
    : query.error
      ? 'error'
      : 'success';

  const defaultValues = useMemo(() => buildDefaultValues(company), [company]);

  return {
    queryStatus,
    queryMessage: query.error?.message ?? undefined,
    errorType: query.error ? getErrorStateType(query.error) : undefined,
    isNetworkError: query.error ? isConnectionError(query.error) : false,
    company,
    refresh: () => query.refetch(),
    detailRows,
    defaultValues,
    isSubmitting: upsertMutation.isPending,
    isEdit,
    onSubmit,
    onCancel,

  };
}
