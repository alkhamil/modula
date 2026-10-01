import { useState } from 'react';
import { useToast } from '../../../../shared/components/ui';
import type { ProductListItem, GetProductsParams } from '../types';
import { useProductListQuery, useDeleteProduct, useRestoreProduct } from '../api';
import { mapSubmitError } from '../../../../shared/utils';

export function useProductList(params: GetProductsParams) {
  const { showToast } = useToast();
  const [deleteTarget, setDeleteTarget] = useState<ProductListItem | null>(null);
  const [restoreTarget, setRestoreTarget] = useState<ProductListItem | null>(null);

  const query = useProductListQuery(params);
  const deleteMutation = useDeleteProduct();
  const restoreMutation = useRestoreProduct();

  function handleDeleteClick(product: ProductListItem) {
    setDeleteTarget(product);
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
      const fallback = 'Failed to delete product';
      const result = mapSubmitError(err, fallback);
      showToast({ message: result.toastMessage ?? fallback, variant: 'error' });
    }
  }

  function handleRestoreClick(product: ProductListItem) {
    setRestoreTarget(product);
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
      const fallback = 'Failed to restore product';
      const result = mapSubmitError(err, fallback);
      showToast({ message: result.toastMessage ?? fallback, variant: 'error' });
    }
  }

  return {
    products: query.data?.list.content ?? [],
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
