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
import type { ProductColor } from '../types';
import { useProductColorDetailQuery, useUpsertProductColor } from '../api';

export interface FormValues {
  colorName: string;
  hexCode: string;
}

function buildDefaultValues(item?: ProductColor): FormValues {
  return item
    ? {
        colorName: item.colorName,
        hexCode: item.hexCode,
      }
    : {
        colorName: '',
        hexCode: '',
      };
}

export function useProductColorForm(id?: string) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isEdit = !!id;

  const query = useProductColorDetailQuery(id);

  const upsertMutation = useUpsertProductColor();

  const productColor = query.data;

  async function onSubmit(data: FormValues): Promise<SubmitResult> {
    try {
      const res = await upsertMutation.mutateAsync({
        id: isEdit ? id : undefined,
        data: {
          colorName: data.colorName,
          hexCode: data.hexCode,
        },
      });

      showToast({ message: res.message, variant: 'success' });
      setTimeout(() => navigate('/mater-data/product-colors'), 500);
      return { success: true };
    } catch (err: unknown) {
      const fallback = `Failed to ${isEdit ? 'update' : 'create'} productColor`;
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
    if (!productColor) {
      return [
        { label: 'Status', value: '' },
        { label: 'colorName', value: '' },
        { label: 'hexCode', value: '' },
      ];
    }
    return [
      {
        label: 'Status',
        value: (
          <Badge variant={productColor.status === 'active' ? 'success' : 'secondary'}>
            {capitalize(productColor.status)}
          </Badge>
        ),
      },
      { label: 'colorName', value: productColor.colorName },
      { label: 'hexCode', value: productColor.hexCode },
      { label: 'Created By', value: productColor.createdBy },
      { label: 'Created Date', value: productColor.createdDate },
    ];
  }, [productColor]);

  const queryStatus: 'loading' | 'error' | 'success' = query.isLoading
    ? 'loading'
    : query.error
      ? 'error'
      : 'success';

  const defaultValues = useMemo(() => buildDefaultValues(productColor), [productColor]);

  return {
    queryStatus,
    queryMessage: query.error?.message ?? undefined,
    errorType: query.error ? getErrorStateType(query.error) : undefined,
    isNetworkError: query.error ? isConnectionError(query.error) : false,
    productColor,
    refresh: () => query.refetch(),
    detailRows,
    defaultValues,
    isSubmitting: upsertMutation.isPending,
    isEdit,
    onSubmit,
    onCancel,

  };
}
