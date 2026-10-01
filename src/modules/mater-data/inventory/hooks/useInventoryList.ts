import { useState } from 'react';
import { useToast } from '../../../../shared/components/ui';
import type { InventoryListItem, GetInventoriesParams } from '../types';
import { useInventoryListQuery, useDeleteInventory, useRestoreInventory } from '../api';
import { mapSubmitError } from '../../../../shared/utils';

export function useInventoryList(params: GetInventoriesParams) {
  const { showToast } = useToast();
  const [deleteTarget, setDeleteTarget] = useState<InventoryListItem | null>(null);
  const [restoreTarget, setRestoreTarget] = useState<InventoryListItem | null>(null);

  const query = useInventoryListQuery(params);
  const deleteMutation = useDeleteInventory();
  const restoreMutation = useRestoreInventory();

  function handleDeleteClick(inventory: InventoryListItem) {
    setDeleteTarget(inventory);
  }

  function handleDeleteCancel() {
    setDeleteTarget(null);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      const res = await deleteMutation.mutateAsync(String(deleteTarget.id));
      setDeleteTarget(null);
      showToast({ message: res.message, variant: 'success' });
    } catch (err: unknown) {
      const fallback = 'Failed to delete inventory';
      const result = mapSubmitError(err, fallback);
      showToast({ message: result.toastMessage ?? fallback, variant: 'error' });
    }
  }

  function handleRestoreClick(inventory: InventoryListItem) {
    setRestoreTarget(inventory);
  }

  function handleRestoreCancel() {
    setRestoreTarget(null);
  }

  async function handleRestore() {
    if (!restoreTarget) return;
    try {
      const res = await restoreMutation.mutateAsync(String(restoreTarget.id));
      setRestoreTarget(null);
      showToast({ message: res.message, variant: 'success' });
    } catch (err: unknown) {
      const fallback = 'Failed to restore inventory';
      const result = mapSubmitError(err, fallback);
      showToast({ message: result.toastMessage ?? fallback, variant: 'error' });
    }
  }

  return {
    inventorys: query.data?.list.content ?? [],
    totalRecords: query.data?.list.pagination?.total_elements ?? 0,
    isLoading: query.isLoading,
    error: query.error?.message ?? null,
    refresh: () => query.refetch(),
    deleteTarget,
    isDeleting: deleteMutation.isPending,
    handleDeleteClick,
    handleDeleteCancel,
    handleDelete,
    restoreTarget,
    isRestoring: restoreMutation.isPending,
    handleRestoreClick,
    handleRestoreCancel,
    handleRestore,
  };
}
