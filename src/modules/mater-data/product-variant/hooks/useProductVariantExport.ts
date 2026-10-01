import { useState } from 'react';
import { useToast } from '../../../../shared/components/ui';
import { downloadBlob, mapSubmitError } from '../../../../shared/utils';
import type { GetProductVariantsParams } from '../types';
import { exportProductVariants } from '../api';

export function useProductVariantExport() {
  const { showToast } = useToast();
  const [isExporting, setExporting] = useState(false);

  async function exportData(params: GetProductVariantsParams): Promise<void> {
    setExporting(true);
    try {
      const blob = await exportProductVariants(params);
      const stamp = new Date().toISOString().slice(0, 10);
      downloadBlob(blob, `product-variant-${stamp}.xlsx`);
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
