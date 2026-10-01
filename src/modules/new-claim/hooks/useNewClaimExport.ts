import { useState } from 'react';
import { useToast } from '../../../shared/components/ui';
import { downloadBlob, mapSubmitError } from '../../../shared/utils';
import type { GetNewClaimsParams } from '../types';
import { exportNewClaims } from '../api';

export function useNewClaimExport() {
  const { showToast } = useToast();
  const [isExporting, setExporting] = useState(false);

  async function exportData(params: GetNewClaimsParams): Promise<void> {
    setExporting(true);
    try {
      const blob = await exportNewClaims(params);
      const stamp = new Date().toISOString().slice(0, 10);
      downloadBlob(blob, `new-claim-${stamp}.xlsx`);
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
