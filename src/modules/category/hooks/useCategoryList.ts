import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../shared/components/ui';
import type { CategoryListItem, GetCategoriesParams } from '../types';
import { useCategoryListQuery, useDeleteCategory, useRestoreCategory } from '../api';
import { mapSubmitError } from '../../../shared/utils';

export function useCategoryList(params: GetCategoriesParams) {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [deleteTarget, setDeleteTarget] = useState<CategoryListItem | null>(null);
  const [restoreTarget, setRestoreTarget] = useState<CategoryListItem | null>(null);

  const query = useCategoryListQuery(params);
  const deleteMutation = useDeleteCategory();
  const restoreMutation = useRestoreCategory();

  function handleDeleteClick(category: CategoryListItem) {
    setDeleteTarget(category);
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
      const fallback = t('runtime.deleteFailed', { singular: t('category.label') });
      const result = mapSubmitError(err, fallback);
      showToast({ message: result.toastMessage ?? fallback, variant: 'error' });
    }
  }

  function handleRestoreClick(category: CategoryListItem) {
    setRestoreTarget(category);
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
      const fallback = t('runtime.restoreFailed', { singular: t('category.label') });
      const result = mapSubmitError(err, fallback);
      showToast({ message: result.toastMessage ?? fallback, variant: 'error' });
    }
  }

  return {
    categorys: query.data?.list.content ?? [],
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
