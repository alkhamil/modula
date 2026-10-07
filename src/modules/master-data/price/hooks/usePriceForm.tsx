import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useToast, Badge, RelationLabel } from '../../../../shared/components/ui';
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
import type { Price } from '../types';
import { usePriceDetailQuery, useUpsertPrice, loadProductOptions } from '../api';

export interface FormValues {
  product: string;
  price: string;
}

function buildDefaultValues(item?: Price): FormValues {
  return item
    ? {
        product: item.product,
        price: String(item.price ?? ''),
      }
    : {
        product: '',
        price: '',
      };
}

export function usePriceForm(id?: string) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isEdit = !!id;

  const query = usePriceDetailQuery(id);

  const upsertMutation = useUpsertPrice();

  const price = query.data;

  async function onSubmit(data: FormValues): Promise<SubmitResult> {
    try {
      const res = await upsertMutation.mutateAsync({
        id: isEdit ? id : undefined,
        data: {
          product: data.product,
          price: parseCurrency(data.price),
        },
      });

      showToast({ message: res.message, variant: 'success' });
      setTimeout(() => navigate('/master-data/prices'), 500);
      return { success: true };
    } catch (err: unknown) {
      const fallback = isEdit
        ? t('runtime.saveFailedUpdate', { singular: t('price.label') })
        : t('runtime.saveFailedCreate', { singular: t('price.label') });
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
    if (!price) {
      return [
        { label: t('table.status'), value: '' },
        { label: t('price.fields.product.label'), value: '' },
        { label: t('price.fields.price.label'), value: '' },
      ];
    }
    return [
      {
        label: t('table.status'),
        value: (
          <Badge variant={price.status === 'active' ? 'success' : 'secondary'}>
            {price.status === 'active' ? t('common.active') : t('common.inactive')}
          </Badge>
        ),
      },
      { label: t('price.fields.product.label'), value: <RelationLabel loader={loadProductOptions} value={price.product} /> },
      { label: t('price.fields.price.label'), value: formatNumber(price.price) },
      { label: t('table.createdBy'), value: price.createdBy },
      { label: t('table.createdDate'), value: price.createdDate },
    ];
  }, [price]);

  const queryStatus: 'loading' | 'error' | 'success' = query.isLoading
    ? 'loading'
    : query.error
      ? 'error'
      : 'success';

  const defaultValues = useMemo(() => buildDefaultValues(price), [price]);

  return {
    queryStatus,
    queryMessage: query.error?.message ?? undefined,
    errorType: query.error ? getErrorStateType(query.error) : undefined,
    isNetworkError: query.error ? isConnectionError(query.error) : false,
    price,
    refresh: () => query.refetch(),
    detailRows,
    defaultValues,
    isSubmitting: upsertMutation.isPending,
    isEdit,
    onSubmit,
    onCancel,

  };
}
