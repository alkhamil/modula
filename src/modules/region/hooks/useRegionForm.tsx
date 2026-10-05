import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useToast, Badge } from '../../../shared/components/ui';
import type { DetailRow } from '../../../shared/components/ui';
import type { SubmitResult } from '../../../shared/types';
import {
  isConnectionError,
  mapSubmitError,
  splitFieldErrors,
  getErrorStateType,
} from '../../../shared/utils';
import type { Region } from '../types';
import { useRegionDetailQuery, useUpsertRegion } from '../api';

export interface FormValues {
  name: string;
  code: string;
}

function buildDefaultValues(item?: Region): FormValues {
  return item
    ? {
        name: item.name,
        code: item.code,
      }
    : {
        name: '',
        code: '',
      };
}

export function useRegionForm(id?: string) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isEdit = !!id;

  const query = useRegionDetailQuery(id);

  const upsertMutation = useUpsertRegion();

  const region = query.data;

  async function onSubmit(data: FormValues): Promise<SubmitResult> {
    try {
      const res = await upsertMutation.mutateAsync({
        id: isEdit ? id : undefined,
        data: {
          name: data.name,
          code: data.code,
        },
      });

      showToast({ message: res.message, variant: 'success' });
      setTimeout(() => navigate('/regions'), 500);
      return { success: true };
    } catch (err: unknown) {
      const fallback = isEdit
        ? t('runtime.saveFailedUpdate', { singular: t('region.label') })
        : t('runtime.saveFailedCreate', { singular: t('region.label') });
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
    if (!region) {
      return [
        { label: t('table.status'), value: '' },
        { label: t('region.fields.name.label'), value: '' },
        { label: t('region.fields.code.label'), value: '' },
      ];
    }
    return [
      {
        label: t('table.status'),
        value: (
          <Badge variant={region.status === 'active' ? 'success' : 'secondary'}>
            {region.status === 'active' ? t('common.active') : t('common.inactive')}
          </Badge>
        ),
      },
      { label: t('region.fields.name.label'), value: region.name },
      { label: t('region.fields.code.label'), value: region.code },
      { label: t('table.createdBy'), value: region.createdBy },
      { label: t('table.createdDate'), value: region.createdDate },
    ];
  }, [region]);

  const queryStatus: 'loading' | 'error' | 'success' = query.isLoading
    ? 'loading'
    : query.error
      ? 'error'
      : 'success';

  const defaultValues = useMemo(() => buildDefaultValues(region), [region]);

  return {
    queryStatus,
    queryMessage: query.error?.message ?? undefined,
    errorType: query.error ? getErrorStateType(query.error) : undefined,
    isNetworkError: query.error ? isConnectionError(query.error) : false,
    region,
    refresh: () => query.refetch(),
    detailRows,
    defaultValues,
    isSubmitting: upsertMutation.isPending,
    isEdit,
    onSubmit,
    onCancel,

  };
}
