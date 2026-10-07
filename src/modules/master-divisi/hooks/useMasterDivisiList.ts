import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../shared/components/ui';
import type { MasterDivisiListItem, GetMasterDivisisParams } from '../types';
import { useMasterDivisiListQuery, useDeleteMasterDivisi, useRestoreMasterDivisi } from '../api';
import { mapSubmitError } from '../../../shared/utils';

export function useMasterDivisiList(params: GetMasterDivisisParams) {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [deleteTarget, setDeleteTarget] = useState<MasterDivisiListItem | null>(null);
  const [restoreTarget, setRestoreTarget] = useState<MasterDivisiListItem | null>(null);

  const query = useMasterDivisiListQuery(params);
  const deleteMutation = useDeleteMasterDivisi();
  const restoreMutation = useRestoreMasterDivisi();

  function handleDeleteClick(masterDivisi: MasterDivisiListItem) {
    setDeleteTarget(masterDivisi);
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
      const fallback = t('runtime.deleteFailed', { singular: t('master_division.label') });
      const result = mapSubmitError(err, fallback);
      showToast({ message: result.toastMessage ?? fallback, variant: 'error' });
    }
  }

  function handleRestoreClick(masterDivisi: MasterDivisiListItem) {
    setRestoreTarget(masterDivisi);
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
      const fallback = t('runtime.restoreFailed', { singular: t('master_division.label') });
      const result = mapSubmitError(err, fallback);
      showToast({ message: result.toastMessage ?? fallback, variant: 'error' });
    }
  }

  return {
    masterDivisis: query.data?.list.content ?? [],
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
