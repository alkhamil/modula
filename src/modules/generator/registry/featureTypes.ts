import type { FeatureKey } from '../types';

export interface FeatureDef {
  label: string;
  description: string;
  /** File kunci yang dihasilkan saat feature aktif (dokumentatif). */
  outputs: string[];
}

export const featureRegistry: Record<FeatureKey, FeatureDef> = {
  list: {
    label: 'List',
    description: 'Halaman daftar + tabel + filter + pagination.',
    outputs: ['pages/XListPage', 'components/XTable', 'hooks/useXList+Filter'],
  },
  detail: {
    label: 'Detail',
    description: 'Halaman detail read-only.',
    outputs: ['pages/XViewPage'],
  },
  create: {
    label: 'Create',
    description: 'Halaman tambah data.',
    outputs: ['pages/XCreatePage', 'components/XForm'],
  },
  edit: {
    label: 'Edit',
    description: 'Halaman ubah data.',
    outputs: ['pages/XEditPage', 'components/XForm'],
  },
  delete: {
    label: 'Delete',
    description: 'Soft delete (nonaktif) + restore dari halaman list.',
    outputs: ['mutations', 'dialogs'],
  },
  bulkUpload: {
    label: 'Bulk Upload',
    description: 'Dialog upload Excel (.xlsx) + unduh template + laporan hasil per baris.',
    outputs: ['components/XBulkUploadDialog', 'validation/xBulkValidation', 'mutations'],
  },
  export: {
    label: 'Export',
    description: 'Tombol unduh Excel (.xlsx) sesuai filter, sort, dan search aktif.',
    outputs: ['hooks/useXExport'],
  },
};

export const featureKeys = Object.keys(featureRegistry) as FeatureKey[];
