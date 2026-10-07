# Integrasi modul Vendor

File ini dibuat otomatis oleh generator. Hapus setelah modul terintegrasi.

## 1. Salin folder modul (otomatis)

Folder `src/modules/master-data/vendor/` sudah ditulis langsung ke repo oleh dev-server saat klik Generate.
Jika generate di luar dev-server (copy/download manual), salin folder tersebut ke repo.

## 2. Routes (otomatis)

Sudah didaftarkan otomatis di `src/app/router.tsx` saat generate via dev-server.
Referensi manual bila perlu:

```tsx
import {
  VendorListPage,
  VendorCreatePage,
  VendorViewPage,
  VendorEditPage,
} from '../modules/master-data/vendor';

// di dalam children AppShell, sebelum catch-all:
      {
        path: 'master-data/vendors',
        element: <VendorListPage />,
        handle: {
          breadcrumb: [{ label: 'Vendors', labelKey: 'vendor.breadcrumbs.list' }],
          requiredPermission: 'vendor.view',
        },
      },
      {
        path: 'master-data/vendors/create',
        element: <VendorCreatePage />,
        handle: {
          breadcrumb: [{ label: 'Vendors', labelKey: 'vendor.breadcrumbs.list', path: '/master-data/vendors' }, { label: 'Create', labelKey: 'vendor.breadcrumbs.create' }],
          requiredPermission: 'vendor.create',
        },
      },
      {
        path: 'master-data/vendors/:vendorId/view',
        element: <VendorViewPage />,
        handle: {
          breadcrumb: [{ label: 'Vendors', labelKey: 'vendor.breadcrumbs.list', path: '/master-data/vendors' }, { label: 'Detail', labelKey: 'vendor.breadcrumbs.detail' }],
          requiredPermission: 'vendor.view',
        },
      },
      {
        path: 'master-data/vendors/:vendorId/edit',
        element: <VendorEditPage />,
        handle: {
          breadcrumb: [{ label: 'Vendors', labelKey: 'vendor.breadcrumbs.list', path: '/master-data/vendors' }, { label: 'Edit', labelKey: 'vendor.breadcrumbs.edit' }],
          requiredPermission: 'vendor.update',
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
    labelKey: 'vendor.parentLabel',
    icon: <Database className="h-5 w-5" />,
    children: [
      { label: 'Vendors', labelKey: 'vendor.labelPlural', path: '/master-data/vendors', permissionKey: 'vendor.view' },
    ],
  },
```

## 4. Permission keys (otomatis dari base `vendor`)

| Aksi | Key |
| --- | --- |
| Lihat list & detail + menu navigasi | `vendor.view` |
| Buat data | `vendor.create` |
| Ubah data | `vendor.update` |
| Hapus / restore data | `vendor.delete` |
| Bulk upload | `vendor.bulk_upload` |
| Export | `vendor.export` |

Konstanta tersedia di `permissions.ts` (`VendorPermissions`).
Pastikan permission user (mis. `localStorage["permissions"]`) memuat key di atas
agar menu dan aksi tampil.

## 5. API real (`api/service.ts`)

Saklar sumber data ada di `api/resolver.ts` via flag `USE_MOCK` (di `mock.ts`,
default semua `true` = mock lokal tanpa backend): ubah flag yang relevan menjadi
`false` untuk memakai Real API via `service.ts` (axios `shared/lib/api`).
Nama export resolver sama untuk kedua sumber, jadi `queries.ts`/`mutations.ts`
tidak perlu berubah.

Kontrak endpoint (contoh module vendors):

| Aksi | Method & endpoint | Catatan |
| --- | --- | --- |
| List | `GET /api/v1/vendors` | Query params sama seperti filter list; response `ApiList`. |
| Detail | `GET /api/v1/vendors/:id` | Response entity. |
| Buat data | `POST /api/v1/vendors` | Body JSON payload; response `{ message, data }`. |
| Ubah data | `PUT /api/v1/vendors/:id` | Body JSON payload; response `{ message, data }`. |
| Hapus (soft) | `DELETE /api/v1/vendors/:id` | Response `{ message }`. |
| Restore | `PATCH /api/v1/vendors/:id/restore` | Response `{ message, data }`. |
| Export | `GET /api/v1/vendors/export` | Query params sama seperti list; response blob `.xlsx`. |
| Bulk upload | `POST /api/v1/vendors/bulk-upload` | Multipart field `file` (.xlsx); response `BulkUploadResult`. |
| Template bulk | `GET /api/v1/vendors/bulk-template` | Response blob `.xlsx` template. |
Error mengikuti envelope axios `{ response: { status, data } }` agar
kompatibel dengan `mapSubmitError` (`response_output.errors` untuk field error).

## 6. Verifikasi

```bash
npm run lint && npm run build
```

Mock aktif secara default (`USE_MOCK` semua `true` di `api/mock.ts`).
Untuk memakai API real, ubah flag yang relevan menjadi `false`.
