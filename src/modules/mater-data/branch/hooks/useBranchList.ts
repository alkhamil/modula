import { useState } from 'react';
import { useToast } from '../../../../shared/components/ui';
import type { BranchListItem, GetBranchesParams } from '../types';
import { useBranchListQuery, useDeleteBranch, useRestoreBranch } from '../api';
import { mapSubmitError } from '../../../../shared/utils';

export function useBranchList(params: GetBranchesParams) {
  const { showToast } = useToast();
  const [deleteTarget, setDeleteTarget] = useState<BranchListItem | null>(null);
  const [restoreTarget, setRestoreTarget] = useState<BranchListItem | null>(null);

  const query = useBranchListQuery(params);
  const deleteMutation = useDeleteBranch();
  const restoreMutation = useRestoreBranch();

  function handleDeleteClick(branch: BranchListItem) {
    setDeleteTarget(branch);
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
      const fallback = 'Failed to delete branch';
      const result = mapSubmitError(err, fallback);
      showToast({ message: result.toastMessage ?? fallback, variant: 'error' });
    }
  }

  function handleRestoreClick(branch: BranchListItem) {
    setRestoreTarget(branch);
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
      const fallback = 'Failed to restore branch';
      const result = mapSubmitError(err, fallback);
      showToast({ message: result.toastMessage ?? fallback, variant: 'error' });
    }
  }

  return {
    branchs: query.data?.list.content ?? [],
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
