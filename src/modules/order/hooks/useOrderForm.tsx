import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useToast, Badge } from '../../../shared/components/ui';
import type { DetailRow } from '../../../shared/components/ui';
import type { SubmitResult } from '../../../shared/types';
import {
  capitalize,
  isConnectionError,
  mapSubmitError,
  splitFieldErrors,
  getErrorStateType,
  formatDate,
} from '../../../shared/utils';
import type { Order } from '../types';
import { useOrderDetailQuery, useUpsertOrder } from '../api';

export interface FormValues {
  orderNumber: string;
  orderDate: string;
}

function buildDefaultValues(item?: Order): FormValues {
  return item
    ? {
        orderNumber: item.orderNumber,
        orderDate: item.orderDate,
      }
    : {
        orderNumber: '',
        orderDate: '',
      };
}

export function useOrderForm(id?: string) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isEdit = !!id;

  const query = useOrderDetailQuery(id);

  const upsertMutation = useUpsertOrder();

  const order = query.data;

  async function onSubmit(data: FormValues): Promise<SubmitResult> {
    try {
      const res = await upsertMutation.mutateAsync({
        id: isEdit ? id : undefined,
        data: {
          orderNumber: data.orderNumber,
          orderDate: data.orderDate,
        },
      });

      showToast({ message: res.message, variant: 'success' });
      setTimeout(() => navigate('/orders'), 500);
      return { success: true };
    } catch (err: unknown) {
      const fallback = `Failed to ${isEdit ? 'update' : 'create'} order`;
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
    if (!order) {
      return [
        { label: 'Status', value: '' },
        { label: 'Order Number', value: '' },
        { label: 'Order Date', value: '' },
      ];
    }
    return [
      {
        label: 'Status',
        value: (
          <Badge variant={order.status === 'active' ? 'success' : 'secondary'}>
            {capitalize(order.status)}
          </Badge>
        ),
      },
      { label: 'Order Number', value: order.orderNumber },
      { label: 'Order Date', value: formatDate(order.orderDate) },
      { label: 'Created By', value: order.createdBy },
      { label: 'Created Date', value: order.createdDate },
    ];
  }, [order]);

  const queryStatus: 'loading' | 'error' | 'success' = query.isLoading
    ? 'loading'
    : query.error
      ? 'error'
      : 'success';

  const defaultValues = useMemo(() => buildDefaultValues(order), [order]);

  return {
    queryStatus,
    queryMessage: query.error?.message ?? undefined,
    errorType: query.error ? getErrorStateType(query.error) : undefined,
    isNetworkError: query.error ? isConnectionError(query.error) : false,
    order,
    refresh: () => query.refetch(),
    detailRows,
    defaultValues,
    isSubmitting: upsertMutation.isPending,
    isEdit,
    onSubmit,
    onCancel,

  };
}
