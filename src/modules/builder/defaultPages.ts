import type { ProjectPageDefinition } from './types';

export function createDefaultPagesForProject(projectSlug: string, projectName: string): ProjectPageDefinition[] {
  const timestamp = new Date().toISOString();

  return [
    {
      id: `page-${projectSlug}-list`,
      key: 'daftar-data',
      title: `Daftar Data ${projectName}`,
      type: 'LIST',
      path: `/${projectSlug}`,
      createdAt: timestamp,
      updatedAt: timestamp,
      components: [
        {
          id: 'comp-list-btn-add',
          type: 'button',
          category: 'action',
          name: 'Tombol Tambah',
          props: {
            label: '+ Tambah Data Baru',
            hierarchy: 'primary',
            size: 'md',
            colSpan: 12,
          },
          actions: {
            onClick: 'navigate',
            targetPageKey: 'formulir-baru',
          },
        },
        {
          id: 'comp-list-table',
          type: 'data-table',
          category: 'data',
          name: 'Tabel Master',
          props: {
            title: `Data Record ${projectName}`,
            colSpan: 12,
            showSearch: true,
            showFilter: true,
            columns: [
              { key: 'code', label: 'Kode', width: '120px' },
              { key: 'name', label: 'Nama Record', width: 'auto' },
              { key: 'category', label: 'Kategori', width: '180px' },
              { key: 'status', label: 'Status', width: '120px' },
              { key: 'date', label: 'Terdaftar', width: '140px' },
            ],
            rows: [
              { id: '1', code: 'REC-001', name: 'Master Data Alfa', category: 'Operasional', status: 'ACTIVE', date: '01 Nov 2026' },
              { id: '2', code: 'REC-002', name: 'Master Data Beta', category: 'Administrasi', status: 'ACTIVE', date: '02 Nov 2026' },
              { id: '3', code: 'REC-003', name: 'Master Data Gamma', category: 'Teknologi', status: 'PENDING', date: '04 Nov 2026' },
              { id: '4', code: 'REC-004', name: 'Master Data Delta', category: 'Logistik', status: 'INACTIVE', date: '05 Nov 2026' },
            ],
          },
        },
      ],
    },
    {
      id: `page-${projectSlug}-form`,
      key: 'formulir-baru',
      title: 'Formulir Input Data',
      type: 'FORM',
      path: `/${projectSlug}/new`,
      createdAt: timestamp,
      updatedAt: timestamp,
      components: [
        {
          id: 'comp-form-alert',
          type: 'alert',
          category: 'feedback',
          name: 'Petunjuk Formulir',
          props: {
            title: 'Petunjuk Pengisian',
            message: 'Isi semua data mandatori yang bertanda bintang merah (*). Tekan tombol Simpan di bawah bila telah selesai.',
            variant: 'info',
            colSpan: 12,
          },
        },
        {
          id: 'comp-form-card',
          type: 'card',
          category: 'layout',
          name: 'Card Informasi Utama',
          props: {
            title: 'Informasi Utama Record',
            subtitle: 'Masukkan detail informasi dasar untuk record baru ini',
            colSpan: 12,
          },
          children: [
            {
              id: 'comp-form-name',
              type: 'input-field',
              category: 'form',
              name: 'Field Nama',
              props: {
                label: 'Nama Lengkap Record',
                placeholder: 'Contoh: PT Solusi Digital Mandiri',
                helperText: 'Minimal 3 karakter',
                colSpan: 6,
                required: true,
              },
            },
            {
              id: 'comp-form-category',
              type: 'select',
              category: 'form',
              name: 'Field Kategori',
              props: {
                label: 'Kategori Modul',
                placeholder: 'Pilih kategori...',
                colSpan: 6,
                required: true,
                options: [
                  { label: 'Administrasi & Keuangan', value: 'finance' },
                  { label: 'Operasional Bisnis', value: 'operations' },
                  { label: 'Teknologi Informasi', value: 'it' },
                ],
                defaultValue: 'operations',
              },
            },
            {
              id: 'comp-form-date',
              type: 'date-picker',
              category: 'form',
              name: 'Field Tanggal',
              props: {
                label: 'Tanggal Berlaku',
                colSpan: 6,
                required: false,
                defaultValue: '2026-11-07',
              },
            },
            {
              id: 'comp-form-status',
              type: 'toggle',
              category: 'form',
              name: 'Field Status',
              props: {
                label: 'Status Aktif',
                description: 'Aktifkan agar langsung muncul di listing',
                colSpan: 6,
                checked: true,
              },
            },
            {
              id: 'comp-form-notes',
              type: 'textarea',
              category: 'form',
              name: 'Field Catatan',
              props: {
                label: 'Catatan Khusus / Deskripsi',
                placeholder: 'Tuliskan deskripsi lengkap di sini...',
                colSpan: 12,
                rows: 3,
              },
            },
          ],
        },
        {
          id: 'comp-form-btn-submit',
          type: 'button',
          category: 'action',
          name: 'Tombol Simpan',
          props: {
            label: 'Simpan Data',
            hierarchy: 'primary',
            size: 'md',
            colSpan: 3,
          },
          actions: {
            onClick: 'toast',
            toastMessage: 'Data berhasil disimpan ke sistem!',
            toastType: 'success',
          },
        },
        {
          id: 'comp-form-btn-cancel',
          type: 'button',
          category: 'action',
          name: 'Tombol Batal',
          props: {
            label: 'Kembali ke Daftar',
            hierarchy: 'secondary',
            size: 'md',
            colSpan: 3,
          },
          actions: {
            onClick: 'navigate',
            targetPageKey: 'daftar-data',
          },
        },
      ],
    },
    {
      id: `page-${projectSlug}-dashboard`,
      key: 'ringkasan-dashboard',
      title: 'Dashboard Ringkasan',
      type: 'DASHBOARD',
      path: `/${projectSlug}/dashboard`,
      createdAt: timestamp,
      updatedAt: timestamp,
      components: [
        {
          id: 'comp-dash-metric-1',
          type: 'metric-card',
          category: 'data',
          name: 'Metric Total Data',
          props: {
            title: 'Total Record Aktif',
            value: '1.248 Record',
            change: '+8.4%',
            trend: 'up',
            period: 'dari bulan lalu',
            colSpan: 4,
          },
        },
        {
          id: 'comp-dash-metric-2',
          type: 'metric-card',
          category: 'data',
          name: 'Metric Pending Approval',
          props: {
            title: 'Menunggu Verifikasi',
            value: '19 Record',
            change: '-2.1%',
            trend: 'down',
            period: 'butuh tindakan tim',
            colSpan: 4,
          },
        },
        {
          id: 'comp-dash-metric-3',
          type: 'metric-card',
          category: 'data',
          name: 'Metric Akurasi Data',
          props: {
            title: 'Tingkat Kelengkapan',
            value: '99.2%',
            change: '+0.5%',
            trend: 'up',
            period: 'target SLA terpenuhi',
            colSpan: 4,
          },
        },
        {
          id: 'comp-dash-card',
          type: 'card',
          category: 'layout',
          name: 'Card Aktivitas Terakhir',
          props: {
            title: 'Aktivitas Terakhir Modul',
            subtitle: 'Log perubahan status dan penambahan data terbaru',
            colSpan: 12,
          },
          children: [
            {
              id: 'comp-dash-table',
              type: 'data-table',
              category: 'data',
              name: 'Tabel Ringkasan',
              props: {
                title: 'Data Terbaru',
                colSpan: 12,
                showSearch: false,
                showFilter: false,
                columns: [
                  { key: 'code', label: 'Kode', width: '120px' },
                  { key: 'name', label: 'Nama Record', width: 'auto' },
                  { key: 'status', label: 'Status', width: '120px' },
                ],
                rows: [
                  { id: '1', code: 'REC-001', name: 'Master Data Alfa', status: 'ACTIVE' },
                  { id: '2', code: 'REC-002', name: 'Master Data Beta', status: 'ACTIVE' },
                  { id: '3', code: 'REC-003', name: 'Master Data Gamma', status: 'PENDING' },
                ],
              },
            },
          ],
        },
      ],
    },
  ];
}
