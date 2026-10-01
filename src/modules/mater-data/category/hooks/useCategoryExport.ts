import { useState } from 'react';
import { useToast } from '../../../../shared/components/ui';
import { downloadBlob, mapSubmitError } from '../../../../shared/utils';
import type { GetCategoriesParams } from '../types';
import { exportCategories } from '../api';

export function useCategoryExport() {
  const { showToast } = useToast();
  const [isExporting, setExporting] = useState(false);

  async function exportData(params: GetCategoriesParams): Promise<void> {
    setExporting(true);
    try {
      const blob = await exportCategories(params);
      const stamp = new Date().toISOString().slice(0, 10);
      downloadBlob(blob, `category-${stamp}.xlsx`);
      showToast({ variant: 'success', message: 'Export berhasil diunduh.' });
    } catch (err: unknown) {
      const fallback = 'Gagal mengekspor data.';
      const result = mapSubmitError(err, fallback);
      showToast({ message: result.toastMessage ?? fallback, variant: 'error' });
    } finally {
      setExporting(false);
    }
  }

  return { exportData, isExporting };
}
