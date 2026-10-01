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
import type { Product } from '../types';
import { useProductDetailQuery, useUpsertProduct } from '../api';

export interface FormValues {
  productName: string;
  productCode: string;
  category: string;
}

function buildDefaultValues(item?: Product): FormValues {
  return item
    ? {
        productName: item.productName,
        productCode: item.productCode,
        category: item.category,
      }
    : {
        productName: '',
        productCode: '',
        category: '',
      };
}

export function useProductForm(id?: string) {
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
          productName: data.productName,
          productCode: data.productCode,
          category: data.category,
        },
      });

      showToast({ message: res.message, variant: 'success' });
      setTimeout(() => navigate('/mater-data/products'), 500);
      return { success: true };
    } catch (err: unknown) {
      const fallback = `Failed to ${isEdit ? 'update' : 'create'} product`;
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
        { label: 'Status', value: '' },
        { label: 'Product Name', value: '' },
        { label: 'Product Code', value: '' },
        { label: 'Category', value: '' },
      ];
    }
    return [
      {
        label: 'Status',
        value: (
          <Badge variant={product.status === 'active' ? 'success' : 'secondary'}>
            {capitalize(product.status)}
          </Badge>
        ),
      },
      { label: 'Product Name', value: product.productName },
      { label: 'Product Code', value: product.productCode },
      { label: 'Category', value: capitalize(String(product.category)) },
      { label: 'Created By', value: product.createdBy },
      { label: 'Created Date', value: product.createdDate },
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
