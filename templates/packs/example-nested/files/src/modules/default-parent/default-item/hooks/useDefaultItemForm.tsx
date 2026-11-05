import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useToast, Badge } from '../../../../shared/components/ui';
import type { DetailRow } from '../../../../shared/components/ui';
import type { SubmitResult } from '../../../../shared/types';
import {
  isConnectionError,
  mapSubmitError,
  parseCurrency,
  splitFieldErrors,
  getErrorStateType,
  formatNumber,
} from '../../../../shared/utils';
import type { DefaultItem } from '../types';
import { useDefaultItemDetailQuery, useUpsertDefaultItem } from '../api';

export interface FormValues {
  name: string;
  code: string;
  sortOrder: string;
  description: string;
}

function buildDefaultValues(item?: DefaultItem): FormValues {
  return item
    ? {
        name: item.name,
        code: item.code,
        sortOrder: String(item.sortOrder ?? ''),
        description: item.description,
      }
    : {
        name: '',
        code: '',
        sortOrder: '',
        description: '',
      };
}

export function useDefaultItemForm(id?: string) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isEdit = !!id;

  const query = useDefaultItemDetailQuery(id);

  const upsertMutation = useUpsertDefaultItem();

  const defaultItem = query.data;

  async function onSubmit(data: FormValues): Promise<SubmitResult> {
    try {
      const res = await upsertMutation.mutateAsync({
        id: isEdit ? id : undefined,
        data: {
          name: data.name,
          code: data.code,
          sortOrder: parseCurrency(data.sortOrder),
          description: data.description,
        },
      });

      showToast({ message: res.message, variant: 'success' });
      setTimeout(() => navigate('/default-parent/default-items'), 500);
      return { success: true };
    } catch (err: unknown) {
      const fallback = isEdit
        ? t('runtime.saveFailedUpdate', { singular: t('default_item.label') })
        : t('runtime.saveFailedCreate', { singular: t('default_item.label') });
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
    if (!defaultItem) {
      return [
        { label: t('table.status'), value: '' },
        { label: t('default_item.fields.name.label'), value: '' },
        { label: t('default_item.fields.code.label'), value: '' },
        { label: t('default_item.fields.sortOrder.label'), value: '' },
        { label: t('default_item.fields.description.label'), value: '' },
      ];
    }
    return [
      {
        label: t('table.status'),
        value: (
          <Badge variant={defaultItem.status === 'active' ? 'success' : 'secondary'}>
            {defaultItem.status === 'active' ? t('common.active') : t('common.inactive')}
          </Badge>
        ),
      },
      { label: t('default_defaultItem.fields.name.label'), value: defaultItem.name },
      { label: t('default_defaultItem.fields.code.label'), value: defaultItem.code },
      { label: t('default_defaultItem.fields.sortOrder.label'), value: formatNumber(defaultItem.sortOrder) },
      { label: t('default_defaultItem.fields.description.label'), value: defaultItem.description },
      { label: t('table.createdBy'), value: defaultItem.createdBy },
      { label: t('table.createdDate'), value: defaultItem.createdDate },
    ];
  }, [defaultItem]);

  const queryStatus: 'loading' | 'error' | 'success' = query.isLoading
    ? 'loading'
    : query.error
      ? 'error'
      : 'success';

  const defaultValues = useMemo(() => buildDefaultValues(defaultItem), [defaultItem]);

  return {
    queryStatus,
    queryMessage: query.error?.message ?? undefined,
    errorType: query.error ? getErrorStateType(query.error) : undefined,
    isNetworkError: query.error ? isConnectionError(query.error) : false,
    defaultItem,
    refresh: () => query.refetch(),
    detailRows,
    defaultValues,
    isSubmitting: upsertMutation.isPending,
    isEdit,
    onSubmit,
    onCancel,

  };
}
