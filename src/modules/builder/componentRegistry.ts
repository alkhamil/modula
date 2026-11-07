import type { ComponentCatalogItem } from './types';

export const COMPONENT_CATALOG: ComponentCatalogItem[] = [
  // LAYOUT
  {
    type: 'card',
    name: 'Card Container',
    category: 'layout',
    description: 'Panel pembungkus berbingkai dengan header dan padding semantik.',
    defaultProps: {
      title: 'Informasi Section',
      subtitle: 'Deskripsi singkat mengenai konten panel ini',
      colSpan: 12,
      bordered: true,
    },
    childrenAllowed: true,
  },
  {
    type: 'grid-2',
    name: 'Grid 2 Kolom',
    category: 'layout',
    description: 'Baris tata letak dua kolom responsif (50% - 50%).',
    defaultProps: {
      gap: 4,
      colSpan: 12,
    },
    childrenAllowed: true,
  },
  {
    type: 'grid-3',
    name: 'Grid 3 Kolom',
    category: 'layout',
    description: 'Baris tata letak tiga kolom responsif (33% - 33% - 33%).',
    defaultProps: {
      gap: 4,
      colSpan: 12,
    },
    childrenAllowed: true,
  },
  {
    type: 'divider',
    name: 'Divider',
    category: 'layout',
    description: 'Garis pemisah horizontal antar elemen atau section.',
    defaultProps: {
      label: '',
      colSpan: 12,
    },
  },

  // FORM
  {
    type: 'input-field',
    name: 'Input Field',
    category: 'form',
    description: 'Input teks standar untuk teks, email, atau angka.',
    defaultProps: {
      label: 'Nama Lengkap',
      placeholder: 'Masukkan nama lengkap...',
      helperText: 'Pastikan sesuai dengan kartu identitas',
      inputType: 'text',
      colSpan: 6,
      required: true,
      disabled: false,
      defaultValue: '',
    },
    defaultValidation: {
      required: true,
      minLength: 3,
      maxLength: 100,
      errorMessage: 'Field ini wajib diisi minimal 3 karakter',
    },
  },
  {
    type: 'textarea',
    name: 'Textarea',
    category: 'form',
    description: 'Area input teks multibaris untuk catatan atau deskripsi panjang.',
    defaultProps: {
      label: 'Catatan / Keterangan',
      placeholder: 'Tuliskan catatan tambahan di sini...',
      helperText: 'Maksimal 500 karakter',
      rows: 3,
      colSpan: 12,
      required: false,
      disabled: false,
      defaultValue: '',
    },
    defaultValidation: {
      required: false,
      maxLength: 500,
    },
  },
  {
    type: 'select',
    name: 'Select Dropdown',
    category: 'form',
    description: 'Pilihan dropdown tunggal dengan daftar opsi terdefinisi.',
    defaultProps: {
      label: 'Kategori / Departemen',
      placeholder: 'Pilih opsi...',
      colSpan: 6,
      required: true,
      options: [
        { label: 'Administrasi & Keuangan', value: 'finance' },
        { label: 'Operasional Bisnis', value: 'operations' },
        { label: 'Teknologi Informasi', value: 'it' },
        { label: 'Pemasaran & Penjualan', value: 'sales' },
      ],
      defaultValue: 'operations',
    },
  },
  {
    type: 'date-picker',
    name: 'Date Picker',
    category: 'form',
    description: 'Pemilih tanggal kalender format lokal.',
    defaultProps: {
      label: 'Tanggal Transaksi',
      placeholder: 'Pilih tanggal...',
      colSpan: 6,
      required: false,
      defaultValue: '2026-11-07',
    },
  },
  {
    type: 'checkbox',
    name: 'Checkbox',
    category: 'form',
    description: 'Pilihan checklist tunggal atau persetujuan syarat & ketentuan.',
    defaultProps: {
      label: 'Saya menyetujui syarat & ketentuan yang berlaku',
      colSpan: 12,
      checked: true,
    },
  },
  {
    type: 'toggle',
    name: 'Toggle Switch',
    category: 'form',
    description: 'Saklar toggle aktif / non-aktif untuk pengaturan status.',
    defaultProps: {
      label: 'Status Aktif Akun',
      description: 'Pengguna dapat mengakses sistem secara langsung bila aktif',
      colSpan: 6,
      checked: true,
    },
  },
  {
    type: 'file-upload',
    name: 'File Upload',
    category: 'form',
    description: 'Area unggah berkas atau lampiran dengan preview.',
    defaultProps: {
      label: 'Lampiran Berkas (PDF / Image)',
      helperText: 'Ukuran berkas maksimal 5MB (Format PDF, PNG, JPG)',
      colSpan: 12,
    },
  },

  // DATA
  {
    type: 'data-table',
    name: 'Data Table',
    category: 'data',
    description: 'Tabel data interaktif dengan kolom terstruktur, search bar, dan pagination.',
    defaultProps: {
      title: 'Daftar Record Pengguna',
      colSpan: 12,
      showSearch: true,
      showFilter: true,
      columns: [
        { key: 'code', label: 'Kode', width: '120px' },
        { key: 'name', label: 'Nama Lengkap', width: 'auto' },
        { key: 'category', label: 'Departemen', width: '180px' },
        { key: 'status', label: 'Status', width: '120px' },
        { key: 'date', label: 'Terdaftar', width: '140px' },
      ],
      rows: [
        { id: '1', code: 'USR-001', name: 'Ahmad Faisal', category: 'Teknologi Informasi', status: 'ACTIVE', date: '01 Nov 2026' },
        { id: '2', code: 'USR-002', name: 'Siti Rahmawati', category: 'Administrasi & Keuangan', status: 'ACTIVE', date: '02 Nov 2026' },
        { id: '3', code: 'USR-003', name: 'Budi Santoso', category: 'Operasional Bisnis', status: 'PENDING', date: '04 Nov 2026' },
        { id: '4', code: 'USR-004', name: 'Dewi Lestari', category: 'Pemasaran & Penjualan', status: 'INACTIVE', date: '05 Nov 2026' },
      ],
    },
  },
  {
    type: 'metric-card',
    name: 'Metric Card',
    category: 'data',
    description: 'Kartu ringkasan angka statistik/KPI dengan tren dan persentase.',
    defaultProps: {
      title: 'Total Transaksi',
      value: 'Rp 148.500.000',
      change: '+14.2%',
      trend: 'up',
      period: 'dibandingkan bulan lalu',
      colSpan: 4,
    },
  },
  {
    type: 'badge',
    name: 'Badge / Tag Status',
    category: 'data',
    description: 'Label status warna dengan varian WDS (Primary, Success, Warning, Error).',
    defaultProps: {
      text: 'Terverifikasi Aktif',
      variant: 'success',
      size: 'sm',
      colSpan: 3,
    },
  },
  {
    type: 'empty-state',
    name: 'Empty State',
    category: 'data',
    description: 'Visual ilustrasi dan pesan instruktif saat data belum tersedia.',
    defaultProps: {
      title: 'Belum Ada Data Tersimpan',
      description: 'Klik tombol di bawah untuk membuat data pertama Anda dalam modul ini.',
      buttonText: 'Tambah Data Baru',
      colSpan: 12,
    },
  },

  // ACTION & FEEDBACK
  {
    type: 'button',
    name: 'Button Action',
    category: 'action',
    description: 'Tombol aksi (Primary, Secondary, Destructive) dengan aksi navigasi/toast.',
    defaultProps: {
      label: 'Simpan Perubahan',
      hierarchy: 'primary',
      size: 'md',
      colSpan: 3,
      disabled: false,
    },
    defaultActions: {
      onClick: 'toast',
      toastMessage: 'Data berhasil disimpan!',
      toastType: 'success',
    },
  },
  {
    type: 'alert',
    name: 'Alert Notification',
    category: 'feedback',
    description: 'Banner informasi peringatan atau petunjuk alur kerja.',
    defaultProps: {
      title: 'Pemberitahuan Sistem',
      message: 'Pastikan seluruh berkas pendukung telah diunggah sebelum mengirim formulir ini.',
      variant: 'info',
      colSpan: 12,
    },
  },
];

export function getCatalogItem(type: string): ComponentCatalogItem | undefined {
  return COMPONENT_CATALOG.find((item) => item.type === type);
}
