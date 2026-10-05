# Integrasi modul Company

File ini dibuat otomatis oleh generator. Hapus setelah modul terintegrasi.

## 1. Salin folder modul (otomatis)

Folder `src/modules/master-data/company/` sudah ditulis langsung ke repo oleh dev-server saat klik Generate.
Jika generate di luar dev-server (copy/download manual), salin folder tersebut ke repo.

## 2. Routes (otomatis)

Sudah didaftarkan otomatis di `src/app/router.tsx` saat generate via dev-server.
Referensi manual bila perlu:

```tsx
import {
  CompanyListPage,
  CompanyCreatePage,
  CompanyViewPage,
  CompanyEditPage,
} from '../modules/master-data/company';

// di dalam children AppShell, sebelum catch-all:
      {
        path: 'master-data/companies',
        element: <CompanyListPage />,
        handle: {
          breadcrumb: [{ label: 'Companies' }],
          requiredPermission: 'company.view',
        },
      },
      {
        path: 'master-data/companies/create',
        element: <CompanyCreatePage />,
        handle: {
          breadcrumb: [{ label: 'Companies', path: '/master-data/companies' }, { label: 'Create' }],
          requiredPermission: 'company.create',
        },
      },
      {
        path: 'master-data/companies/:companyId/view',
        element: <CompanyViewPage />,
        handle: {
          breadcrumb: [{ label: 'Companies', path: '/master-data/companies' }, { label: 'Detail' }],
          requiredPermission: 'company.view',
        },
      },
      {
        path: 'master-data/companies/:companyId/edit',
        element: <CompanyEditPage />,
        handle: {
          breadcrumb: [{ label: 'Companies', path: '/master-data/companies' }, { label: 'Edit' }],
          requiredPermission: 'company.update',
        },
      },
```

## 3. Navigasi (otomatis)

Sudah ditambahkan otomatis di `src/app/navigation.tsx` saat generate via dev-server.
Referensi manual bila perlu:

```tsx
  // __GENERATOR_PARENT master-data__
  {
    label: 'Master Data',
    icon: <Database className="h-5 w-5" />,
    children: [
      { label: 'Companies', path: '/master-data/companies', permissionKey: 'company.view' },
    ],
  },
```

## 4. Permission keys (otomatis dari base `company`)

| Aksi | Key |
| --- | --- |
| Lihat list & detail + menu navigasi | `company.view` |
| Buat data | `company.create` |
| Ubah data | `company.update` |
| Hapus / restore data | `company.delete` |
| Bulk upload | `company.bulk_upload` |
| Export | `company.export` |

Konstanta tersedia di `permissions.ts` (`CompanyPermissions`).
Pastikan permission user (mis. `localStorage["permissions"]`) memuat key di atas
agar menu dan aksi tampil.

## 5. API real (`api/service.ts`)

Saklar sumber data ada di `api/resolver.ts` via flag `USE_MOCK` (di `mock.ts`,
default semua `true` = mock lokal tanpa backend): ubah flag yang relevan menjadi
`false` untuk memakai Real API via `service.ts` (axios `shared/lib/api`).
Nama export resolver sama untuk kedua sumber, jadi `queries.ts`/`mutations.ts`
tidak perlu berubah.

Kontrak endpoint (contoh module companies):

| Aksi | Method & endpoint | Catatan |
| --- | --- | --- |
| List | `GET /api/v1/companies` | Query params sama seperti filter list; response `ApiList`. |
| Detail | `GET /api/v1/companies/:id` | Response entity. |
| Buat data | `POST /api/v1/companies` | Body JSON payload; response `{ message, data }`. |
| Ubah data | `PUT /api/v1/companies/:id` | Body JSON payload; response `{ message, data }`. |
| Hapus (soft) | `DELETE /api/v1/companies/:id` | Response `{ message }`. |
| Restore | `PATCH /api/v1/companies/:id/restore` | Response `{ message, data }`. |
| Export | `GET /api/v1/companies/export` | Query params sama seperti list; response blob `.xlsx`. |
| Bulk upload | `POST /api/v1/companies/bulk-upload` | Multipart field `file` (.xlsx); response `BulkUploadResult`. |
| Template bulk | `GET /api/v1/companies/bulk-template` | Response blob `.xlsx` template. |
Error mengikuti envelope axios `{ response: { status, data } }` agar
kompatibel dengan `mapSubmitError` (`response_output.errors` untuk field error).

## 6. Verifikasi

```bash
npm run lint && npm run build
```

Mock aktif secara default (`USE_MOCK` semua `true` di `api/mock.ts`).
Untuk memakai API real, ubah flag yang relevan menjadi `false`.
