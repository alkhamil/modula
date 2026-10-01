import { useState } from 'react';
import { useToast } from '../../../../shared/components/ui';
import type { ProductColorListItem, GetProductColorsParams } from '../types';
import { useProductColorListQuery, useDeleteProductColor, useRestoreProductColor } from '../api';
import { mapSubmitError } from '../../../../shared/utils';

export function useProductColorList(params: GetProductColorsParams) {
  const { showToast } = useToast();
  const [deleteTarget, setDeleteTarget] = useState<ProductColorListItem | null>(null);
  const [restoreTarget, setRestoreTarget] = useState<ProductColorListItem | null>(null);

  const query = useProductColorListQuery(params);
  const deleteMutation = useDeleteProductColor();
  const restoreMutation = useRestoreProductColor();

  function handleDeleteClick(productColor: ProductColorListItem) {
    setDeleteTarget(productColor);
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
      const fallback = 'Failed to delete productColor';
      const result = mapSubmitError(err, fallback);
      showToast({ message: result.toastMessage ?? fallback, variant: 'error' });
    }
  }

  function handleRestoreClick(productColor: ProductColorListItem) {
    setRestoreTarget(productColor);
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
      const fallback = 'Failed to restore productColor';
      const result = mapSubmitError(err, fallback);
      showToast({ message: result.toastMessage ?? fallback, variant: 'error' });
    }
  }

  return {
    productColors: query.data?.list.content ?? [],
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
