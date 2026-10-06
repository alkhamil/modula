import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../shared/components/ui';
import type { InvoiceListItem, GetInvoicesParams } from '../types';
import { useInvoiceListQuery, useDeleteInvoice, useRestoreInvoice } from '../api';
import { mapSubmitError } from '../../../shared/utils';

export function useInvoiceList(params: GetInvoicesParams) {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [deleteTarget, setDeleteTarget] = useState<InvoiceListItem | null>(null);
  const [restoreTarget, setRestoreTarget] = useState<InvoiceListItem | null>(null);

  const query = useInvoiceListQuery(params);
  const deleteMutation = useDeleteInvoice();
  const restoreMutation = useRestoreInvoice();

  function handleDeleteClick(invoice: InvoiceListItem) {
    setDeleteTarget(invoice);
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
      const fallback = t('runtime.deleteFailed', { singular: t('invoice.label') });
      const result = mapSubmitError(err, fallback);
      showToast({ message: result.toastMessage ?? fallback, variant: 'error' });
    }
  }

  function handleRestoreClick(invoice: InvoiceListItem) {
    setRestoreTarget(invoice);
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
      const fallback = t('runtime.restoreFailed', { singular: t('invoice.label') });
      const result = mapSubmitError(err, fallback);
      showToast({ message: result.toastMessage ?? fallback, variant: 'error' });
    }
  }

  return {
    invoices: query.data?.list.content ?? [],
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
