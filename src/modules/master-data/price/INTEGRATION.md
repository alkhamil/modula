# Integrasi modul Price

File ini dibuat otomatis oleh generator. Hapus setelah modul terintegrasi.

## 1. Salin folder modul (otomatis)

Folder `src/modules/master-data/price/` sudah ditulis langsung ke repo oleh dev-server saat klik Generate.
Jika generate di luar dev-server (copy/download manual), salin folder tersebut ke repo.

## 2. Routes (otomatis)

Sudah didaftarkan otomatis di `src/app/router.tsx` saat generate via dev-server.
Referensi manual bila perlu:

```tsx
import {
  PriceListPage,
  PriceCreatePage,
  PriceViewPage,
  PriceEditPage,
} from '../modules/master-data/price';

// di dalam children AppShell, sebelum catch-all:
      {
        path: 'master-data/prices',
        element: <PriceListPage />,
        handle: {
          breadcrumb: [{ label: 'Prices', labelKey: 'price.breadcrumbs.list' }],
          requiredPermission: 'price.view',
        },
      },
      {
        path: 'master-data/prices/create',
        element: <PriceCreatePage />,
        handle: {
          breadcrumb: [{ label: 'Prices', labelKey: 'price.breadcrumbs.list', path: '/master-data/prices' }, { label: 'Create', labelKey: 'price.breadcrumbs.create' }],
          requiredPermission: 'price.create',
        },
      },
      {
        path: 'master-data/prices/:priceId/view',
        element: <PriceViewPage />,
        handle: {
          breadcrumb: [{ label: 'Prices', labelKey: 'price.breadcrumbs.list', path: '/master-data/prices' }, { label: 'Detail', labelKey: 'price.breadcrumbs.detail' }],
          requiredPermission: 'price.view',
        },
      },
      {
        path: 'master-data/prices/:priceId/edit',
        element: <PriceEditPage />,
        handle: {
          breadcrumb: [{ label: 'Prices', labelKey: 'price.breadcrumbs.list', path: '/master-data/prices' }, { label: 'Edit', labelKey: 'price.breadcrumbs.edit' }],
          requiredPermission: 'price.update',
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
    labelKey: 'price.parentLabel',
    icon: <Database className="h-5 w-5" />,
    children: [
      { label: 'Prices', labelKey: 'price.labelPlural', path: '/master-data/prices', permissionKey: 'price.view' },
    ],
  },
```

## 4. Permission keys (otomatis dari base `price`)

| Aksi | Key |
| --- | --- |
| Lihat list & detail + menu navigasi | `price.view` |
| Buat data | `price.create` |
| Ubah data | `price.update` |
| Hapus / restore data | `price.delete` |
| Bulk upload | `price.bulk_upload` |
| Export | `price.export` |

Konstanta tersedia di `permissions.ts` (`PricePermissions`).
Pastikan permission user (mis. `localStorage["permissions"]`) memuat key di atas
agar menu dan aksi tampil.

## 5. API real (`api/service.ts`)

Saklar sumber data ada di `api/resolver.ts` via flag `USE_MOCK` (di `mock.ts`,
default semua `true` = mock lokal tanpa backend): ubah flag yang relevan menjadi
`false` untuk memakai Real API via `service.ts` (axios `shared/lib/api`).
Nama export resolver sama untuk kedua sumber, jadi `queries.ts`/`mutations.ts`
tidak perlu berubah.

Kontrak endpoint (contoh module prices):

| Aksi | Method & endpoint | Catatan |
| --- | --- | --- |
| List | `GET /api/v1/prices` | Query params sama seperti filter list; response `ApiList`. |
| Detail | `GET /api/v1/prices/:id` | Response entity. |
| Buat data | `POST /api/v1/prices` | Body JSON payload; response `{ message, data }`. |
| Ubah data | `PUT /api/v1/prices/:id` | Body JSON payload; response `{ message, data }`. |
| Hapus (soft) | `DELETE /api/v1/prices/:id` | Response `{ message }`. |
| Restore | `PATCH /api/v1/prices/:id/restore` | Response `{ message, data }`. |
| Export | `GET /api/v1/prices/export` | Query params sama seperti list; response blob `.xlsx`. |
| Bulk upload | `POST /api/v1/prices/bulk-upload` | Multipart field `file` (.xlsx); response `BulkUploadResult`. |
| Template bulk | `GET /api/v1/prices/bulk-template` | Response blob `.xlsx` template. |
Error mengikuti envelope axios `{ response: { status, data } }` agar
kompatibel dengan `mapSubmitError` (`response_output.errors` untuk field error).

## 6. Verifikasi

```bash
npm run lint && npm run build
```

Mock aktif secara default (`USE_MOCK` semua `true` di `api/mock.ts`).
Untuk memakai API real, ubah flag yang relevan menjadi `false`.
