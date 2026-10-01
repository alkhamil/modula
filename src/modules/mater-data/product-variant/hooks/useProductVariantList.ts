import { useState } from 'react';
import { useToast } from '../../../../shared/components/ui';
import type { ProductVariantListItem, GetProductVariantsParams } from '../types';
import { useProductVariantListQuery, useDeleteProductVariant, useRestoreProductVariant } from '../api';
import { mapSubmitError } from '../../../../shared/utils';

export function useProductVariantList(params: GetProductVariantsParams) {
  const { showToast } = useToast();
  const [deleteTarget, setDeleteTarget] = useState<ProductVariantListItem | null>(null);
  const [restoreTarget, setRestoreTarget] = useState<ProductVariantListItem | null>(null);

  const query = useProductVariantListQuery(params);
  const deleteMutation = useDeleteProductVariant();
  const restoreMutation = useRestoreProductVariant();

  function handleDeleteClick(productVariant: ProductVariantListItem) {
    setDeleteTarget(productVariant);
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
      const fallback = 'Failed to delete productVariant';
      const result = mapSubmitError(err, fallback);
      showToast({ message: result.toastMessage ?? fallback, variant: 'error' });
    }
  }

  function handleRestoreClick(productVariant: ProductVariantListItem) {
    setRestoreTarget(productVariant);
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
      const fallback = 'Failed to restore productVariant';
      const result = mapSubmitError(err, fallback);
      showToast({ message: result.toastMessage ?? fallback, variant: 'error' });
    }
  }

  return {
    productVariants: query.data?.list.content ?? [],
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
