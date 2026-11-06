import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../../shared/components/ui';
import type { DefaultItemListItem, GetDefaultItemsParams } from '../types';
import { useDefaultItemListQuery, useDeleteDefaultItem, useRestoreDefaultItem } from '../api';
import { mapSubmitError } from '../../../../shared/utils';

export function useDefaultItemList(params: GetDefaultItemsParams) {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [deleteTarget, setDeleteTarget] = useState<DefaultItemListItem | null>(null);
  const [restoreTarget, setRestoreTarget] = useState<DefaultItemListItem | null>(null);

  const query = useDefaultItemListQuery(params);
  const deleteMutation = useDeleteDefaultItem();
  const restoreMutation = useRestoreDefaultItem();

  function handleDeleteClick(defaultItem: DefaultItemListItem) {
    setDeleteTarget(defaultItem);
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
      const fallback = t('runtime.deleteFailed', { singular: t('default_item.label') });
      const result = mapSubmitError(err, fallback);
      showToast({ message: result.toastMessage ?? fallback, variant: 'error' });
    }
  }

  function handleRestoreClick(defaultItem: DefaultItemListItem) {
    setRestoreTarget(defaultItem);
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
      const fallback = t('runtime.restoreFailed', { singular: t('default_item.label') });
      const result = mapSubmitError(err, fallback);
      showToast({ message: result.toastMessage ?? fallback, variant: 'error' });
    }
  }

  return {
    defaultItems: query.data?.list.content ?? [],
    totalRecords: query.data?.list.pagination?.total_elements ?? 0,
    // Spinner juga saat parameter berubah (cari/filter/sort): data lama hanya placeholder (Figma "Table - Search Loading").
    isLoading: query.isLoading || query.isPlaceholderData,
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
