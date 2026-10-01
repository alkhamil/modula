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
import type { Inventory } from '../types';
import { useInventoryDetailQuery, useUpsertInventory } from '../api';

export interface FormValues {
  inventoryName: string;
}

function buildDefaultValues(item?: Inventory): FormValues {
  return item
    ? {
        inventoryName: item.inventoryName,
      }
    : {
        inventoryName: '',
      };
}

export function useInventoryForm(id?: string) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isEdit = !!id;

  const query = useInventoryDetailQuery(id);

  const upsertMutation = useUpsertInventory();

  const inventory = query.data;

  async function onSubmit(data: FormValues): Promise<SubmitResult> {
    try {
      const res = await upsertMutation.mutateAsync({
        id: isEdit ? id : undefined,
        data: {
          inventoryName: data.inventoryName,
        },
      });

      showToast({ message: res.message, variant: 'success' });
      setTimeout(() => navigate('/mater-data/inventories'), 500);
      return { success: true };
    } catch (err: unknown) {
      const fallback = `Failed to ${isEdit ? 'update' : 'create'} inventory`;
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
    if (!inventory) {
      return [
        { label: 'Status', value: '' },
        { label: 'Inventory Name', value: '' },
      ];
    }
    return [
      {
        label: 'Status',
        value: (
          <Badge variant={inventory.status === 'active' ? 'success' : 'secondary'}>
            {capitalize(inventory.status)}
          </Badge>
        ),
      },
      { label: 'Inventory Name', value: inventory.inventoryName },
      { label: 'Created By', value: inventory.createdBy },
      { label: 'Created Date', value: inventory.createdDate },
    ];
  }, [inventory]);

  const queryStatus: 'loading' | 'error' | 'success' = query.isLoading
    ? 'loading'
    : query.error
      ? 'error'
      : 'success';

  const defaultValues = useMemo(() => buildDefaultValues(inventory), [inventory]);

  return {
    queryStatus,
    queryMessage: query.error?.message ?? undefined,
    errorType: query.error ? getErrorStateType(query.error) : undefined,
    isNetworkError: query.error ? isConnectionError(query.error) : false,
    inventory,
    refresh: () => query.refetch(),
    detailRows,
    defaultValues,
    isSubmitting: upsertMutation.isPending,
    isEdit,
    onSubmit,
    onCancel,

  };
}
