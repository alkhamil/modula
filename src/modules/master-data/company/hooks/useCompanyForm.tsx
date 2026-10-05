import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
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
  name: string;
  description: string;
}

function buildDefaultValues(item?: Company): FormValues {
  return item
    ? {
        name: item.name,
        description: item.description,
      }
    : {
        name: '',
        description: '',
      };
}

export function useCompanyForm(id?: string) {
  const { t } = useTranslation();
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
          name: data.name,
          description: data.description,
        },
      });

      showToast({ message: res.message, variant: 'success' });
      setTimeout(() => navigate('/master-data/companies'), 500);
      return { success: true };
    } catch (err: unknown) {
      const fallback = isEdit
        ? t('runtime.saveFailedUpdate', { singular: 'company' })
        : t('runtime.saveFailedCreate', { singular: 'company' });
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
        { label: 'Name', value: '' },
        { label: 'Description', value: '' },
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
      { label: 'Name', value: company.name },
      { label: 'Description', value: company.description },
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
