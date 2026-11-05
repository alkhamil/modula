import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../../shared/components/ui';
import type { DefaultRecordListItem, GetDefaultRecordsParams } from '../types';
import { useDefaultRecordListQuery, useDeleteDefaultRecord, useRestoreDefaultRecord } from '../api';
import { mapSubmitError } from '../../../../shared/utils';

export function useDefaultRecordList(params: GetDefaultRecordsParams) {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [deleteTarget, setDeleteTarget] = useState<DefaultRecordListItem | null>(null);
  const [restoreTarget, setRestoreTarget] = useState<DefaultRecordListItem | null>(null);

  const query = useDefaultRecordListQuery(params);
  const deleteMutation = useDeleteDefaultRecord();
  const restoreMutation = useRestoreDefaultRecord();

  function handleDeleteClick(defaultRecord: DefaultRecordListItem) {
    setDeleteTarget(defaultRecord);
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
      const fallback = t('runtime.deleteFailed', { singular: t('default_record.label') });
      const result = mapSubmitError(err, fallback);
      showToast({ message: result.toastMessage ?? fallback, variant: 'error' });
    }
  }

  function handleRestoreClick(defaultRecord: DefaultRecordListItem) {
    setRestoreTarget(defaultRecord);
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
      const fallback = t('runtime.restoreFailed', { singular: t('default_record.label') });
      const result = mapSubmitError(err, fallback);
      showToast({ message: result.toastMessage ?? fallback, variant: 'error' });
    }
  }

  return {
    defaultRecords: query.data?.list.content ?? [],
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
