import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../../shared/components/ui';
import type { CompanyListItem, GetCompaniesParams } from '../types';
import { useCompanyListQuery, useDeleteCompany, useRestoreCompany } from '../api';
import { mapSubmitError } from '../../../../shared/utils';

export function useCompanyList(params: GetCompaniesParams) {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [deleteTarget, setDeleteTarget] = useState<CompanyListItem | null>(null);
  const [restoreTarget, setRestoreTarget] = useState<CompanyListItem | null>(null);

  const query = useCompanyListQuery(params);
  const deleteMutation = useDeleteCompany();
  const restoreMutation = useRestoreCompany();

  function handleDeleteClick(company: CompanyListItem) {
    setDeleteTarget(company);
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
      const fallback = t('runtime.deleteFailed', { singular: 'company' });
      const result = mapSubmitError(err, fallback);
      showToast({ message: result.toastMessage ?? fallback, variant: 'error' });
    }
  }

  function handleRestoreClick(company: CompanyListItem) {
    setRestoreTarget(company);
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
      const fallback = t('runtime.restoreFailed', { singular: 'company' });
      const result = mapSubmitError(err, fallback);
      showToast({ message: result.toastMessage ?? fallback, variant: 'error' });
    }
  }

  return {
    companys: query.data?.list.content ?? [],
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
