# Integrasi modul Company

File ini dibuat otomatis oleh generator. Hapus setelah modul terintegrasi.

## 1. Salin folder modul (otomatis)

Folder `src/modules/mater-data/company/` sudah ditulis langsung ke repo oleh dev-server saat klik Generate.
Jika generate di luar dev-server (copy/download manual), salin folder tersebut ke repo.

## 2. Daftarkan routes (`src/app/router.tsx`)

```tsx
import {
  CompanyListPage,
  CompanyCreatePage,
  CompanyViewPage,
  CompanyEditPage,
} from '../modules/mater-data/company';

// di dalam children AppShell:
      { path: 'companies', element: <CompanyListPage /> },
      { path: 'companies/create', element: <CompanyCreatePage /> },
      { path: 'companies/:companyId/view', element: <CompanyViewPage /> },
      { path: 'companies/:companyId/edit', element: <CompanyEditPage /> },
```

## 3. Tambahkan navigasi (`src/app/navigation.tsx` + icon)

```tsx
{
  label: 'Companies',
  path: '/mater-data/companies',
  icon: <NavMasterDataIcon className="h-5 w-5" />,
  permissionKey: 'company.view',
},
```

## 4. Permission keys (otomatis dari base `company`)

| Aksi | Key |
| --- | --- |
| Lihat list & detail + menu navigasi | `company.view` |
| Buat data | `company.create` |
| Ubah data | `company.update` |
| Hapus / restore data | `company.delete` |

Konstanta tersedia di `permissions.ts` (`CompanyPermissions`).
Pastikan permission user (mis. `localStorage["permissions"]`) memuat key di atas
agar menu dan aksi tampil.

## 5. Verifikasi

```bash
npm run lint && npm run build
```

Mock aktif secara default (`USE_MOCK` semua `true` di `api/mock.ts`).
Untuk memakai API real, ubah flag yang relevan menjadi `false`.
