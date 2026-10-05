import { useState } from 'react';
import { useToast } from '../../../../shared/components/ui';
import { mapSubmitError } from '../../../../shared/utils';
import type { UserListItem, GetUsersParams } from '../types';
import { useUserListQuery, useDeleteUser, useRestoreUser } from '../api';

export function useUserList(params: GetUsersParams) {
  const { showToast } = useToast();
  const [deleteTarget, setDeleteTarget] = useState<UserListItem | null>(null);
  const [restoreTarget, setRestoreTarget] = useState<UserListItem | null>(null);

  const query = useUserListQuery(params);
  const deleteMutation = useDeleteUser();
  const restoreMutation = useRestoreUser();

  function handleDeleteClick(user: UserListItem) {
    setDeleteTarget(user);
  }

  function handleDeleteCancel() {
    setDeleteTarget(null);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      const res = await deleteMutation.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
      showToast({ message: res.message, variant: 'success' });
    } catch (err: unknown) {
      const fallback = 'Failed to delete user';
      const result = mapSubmitError(err, fallback);
      showToast({ message: result.toastMessage ?? fallback, variant: 'error' });
    }
  }

  function handleRestoreClick(user: UserListItem) {
    setRestoreTarget(user);
  }

  function handleRestoreCancel() {
    setRestoreTarget(null);
  }

  async function handleRestore() {
    if (!restoreTarget) return;
    try {
      const res = await restoreMutation.mutateAsync(restoreTarget.id);
      setRestoreTarget(null);
      showToast({ message: res.message, variant: 'success' });
    } catch (err: unknown) {
      const fallback = 'Failed to restore user';
      const result = mapSubmitError(err, fallback);
      showToast({ message: result.toastMessage ?? fallback, variant: 'error' });
    }
  }

  return {
    users: query.data?.list.content ?? [],
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
