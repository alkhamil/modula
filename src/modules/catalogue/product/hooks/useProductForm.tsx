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
import type { Product } from '../types';
import { useProductDetailQuery, useUpsertProduct, loadCategoryOptions } from '../api';

export interface FormValues {
  name: string;
  price: string;
  category: string;
}

function buildDefaultValues(item?: Product): FormValues {
  return item
    ? {
        name: item.name,
        price: String(item.price ?? ''),
        category: item.category,
      }
    : {
        name: '',
        price: '',
        category: '',
      };
}

export function useProductForm(id?: string) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isEdit = !!id;

  const query = useProductDetailQuery(id);

  const upsertMutation = useUpsertProduct();

  const product = query.data;

  async function onSubmit(data: FormValues): Promise<SubmitResult> {
    try {
      const res = await upsertMutation.mutateAsync({
        id: isEdit ? id : undefined,
        data: {
          name: data.name,
          price: parseCurrency(data.price),
          category: data.category,
        },
      });

      showToast({ message: res.message, variant: 'success' });
      setTimeout(() => navigate('/catalogue/products'), 500);
      return { success: true };
    } catch (err: unknown) {
      const fallback = isEdit
        ? t('runtime.saveFailedUpdate', { singular: t('product.label') })
        : t('runtime.saveFailedCreate', { singular: t('product.label') });
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
    if (!product) {
      return [
        { label: t('table.status'), value: '' },
        { label: t('product.fields.name.label'), value: '' },
        { label: t('product.fields.price.label'), value: '' },
        { label: t('product.fields.category.label'), value: '' },
      ];
    }
    return [
      {
        label: t('table.status'),
        value: (
          <Badge variant={product.status === 'active' ? 'success' : 'secondary'}>
            {product.status === 'active' ? t('common.active') : t('common.inactive')}
          </Badge>
        ),
      },
      { label: t('product.fields.name.label'), value: product.name },
      { label: t('product.fields.price.label'), value: formatNumber(product.price) },
      { label: t('product.fields.category.label'), value: <RelationLabel loader={loadCategoryOptions} value={product.category} /> },
      { label: t('table.createdBy'), value: product.createdBy },
      { label: t('table.createdDate'), value: product.createdDate },
    ];
  }, [product]);

  const queryStatus: 'loading' | 'error' | 'success' = query.isLoading
    ? 'loading'
    : query.error
      ? 'error'
      : 'success';

  const defaultValues = useMemo(() => buildDefaultValues(product), [product]);

  return {
    queryStatus,
    queryMessage: query.error?.message ?? undefined,
    errorType: query.error ? getErrorStateType(query.error) : undefined,
    isNetworkError: query.error ? isConnectionError(query.error) : false,
    product,
    refresh: () => query.refetch(),
    detailRows,
    defaultValues,
    isSubmitting: upsertMutation.isPending,
    isEdit,
    onSubmit,
    onCancel,

  };
}
