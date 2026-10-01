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
import type { ProductVariant } from '../types';
import { useProductVariantDetailQuery, useUpsertProductVariant } from '../api';

export interface FormValues {
  name: string;
  description: string;
}

function buildDefaultValues(item?: ProductVariant): FormValues {
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

export function useProductVariantForm(id?: string) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isEdit = !!id;

  const query = useProductVariantDetailQuery(id);

  const upsertMutation = useUpsertProductVariant();

  const productVariant = query.data;

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
      setTimeout(() => navigate('/mater-data/product-variants'), 500);
      return { success: true };
    } catch (err: unknown) {
      const fallback = `Failed to ${isEdit ? 'update' : 'create'} productVariant`;
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
    if (!productVariant) {
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
          <Badge variant={productVariant.status === 'active' ? 'success' : 'secondary'}>
            {capitalize(productVariant.status)}
          </Badge>
        ),
      },
      { label: 'Name', value: productVariant.name },
      { label: 'Description', value: productVariant.description },
      { label: 'Created By', value: productVariant.createdBy },
      { label: 'Created Date', value: productVariant.createdDate },
    ];
  }, [productVariant]);

  const queryStatus: 'loading' | 'error' | 'success' = query.isLoading
    ? 'loading'
    : query.error
      ? 'error'
      : 'success';

  const defaultValues = useMemo(() => buildDefaultValues(productVariant), [productVariant]);

  return {
    queryStatus,
    queryMessage: query.error?.message ?? undefined,
    errorType: query.error ? getErrorStateType(query.error) : undefined,
    isNetworkError: query.error ? isConnectionError(query.error) : false,
    productVariant,
    refresh: () => query.refetch(),
    detailRows,
    defaultValues,
    isSubmitting: upsertMutation.isPending,
    isEdit,
    onSubmit,
    onCancel,

  };
}
