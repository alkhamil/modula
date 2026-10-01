import { useState } from 'react';
import { useToast } from '../../../../shared/components/ui';
import { downloadBlob, mapSubmitError } from '../../../../shared/utils';
import type { GetProductColorsParams } from '../types';
import { exportProductColors } from '../api';

export function useProductColorExport() {
  const { showToast } = useToast();
  const [isExporting, setExporting] = useState(false);

  async function exportData(params: GetProductColorsParams): Promise<void> {
    setExporting(true);
    try {
      const blob = await exportProductColors(params);
      const stamp = new Date().toISOString().slice(0, 10);
      downloadBlob(blob, `product-color-${stamp}.xlsx`);
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
