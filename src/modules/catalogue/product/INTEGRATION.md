# Integrasi modul Product

File ini dibuat otomatis oleh generator. Hapus setelah modul terintegrasi.

## 1. Salin folder modul (otomatis)

Folder `src/modules/catalogue/product/` sudah ditulis langsung ke repo oleh dev-server saat klik Generate.
Jika generate di luar dev-server (copy/download manual), salin folder tersebut ke repo.

## 2. Routes (otomatis)

Sudah didaftarkan otomatis di `src/app/router.tsx` saat generate via dev-server.
Referensi manual bila perlu:

```tsx
import {
  ProductListPage,
  ProductCreatePage,
  ProductViewPage,
  ProductEditPage,
} from '../modules/catalogue/product';

// di dalam children AppShell, sebelum catch-all:
      {
        path: 'catalogue/products',
        element: <ProductListPage />,
        handle: {
          breadcrumb: [{ label: 'Products', labelKey: 'product.breadcrumbs.list' }],
          requiredPermission: 'product.view',
        },
      },
      {
        path: 'catalogue/products/create',
        element: <ProductCreatePage />,
        handle: {
          breadcrumb: [{ label: 'Products', labelKey: 'product.breadcrumbs.list', path: '/catalogue/products' }, { label: 'Create', labelKey: 'product.breadcrumbs.create' }],
          requiredPermission: 'product.create',
        },
      },
      {
        path: 'catalogue/products/:productId/view',
        element: <ProductViewPage />,
        handle: {
          breadcrumb: [{ label: 'Products', labelKey: 'product.breadcrumbs.list', path: '/catalogue/products' }, { label: 'Detail', labelKey: 'product.breadcrumbs.detail' }],
          requiredPermission: 'product.view',
        },
      },
      {
        path: 'catalogue/products/:productId/edit',
        element: <ProductEditPage />,
        handle: {
          breadcrumb: [{ label: 'Products', labelKey: 'product.breadcrumbs.list', path: '/catalogue/products' }, { label: 'Edit', labelKey: 'product.breadcrumbs.edit' }],
          requiredPermission: 'product.update',
        },
      },
```

## 3. Navigasi (otomatis)

Sudah ditambahkan otomatis di `src/app/navigation.tsx` saat generate via dev-server.
Referensi manual bila perlu:

```tsx
  // __GENERATOR_PARENT catalogue__
  {
    label: 'Catalogue',
    labelKey: 'product.parentLabel',
    icon: <Database className="h-5 w-5" />,
    children: [
      { label: 'Products', labelKey: 'product.labelPlural', path: '/catalogue/products', permissionKey: 'product.view' },
    ],
  },
```

## 4. Permission keys (otomatis dari base `product`)

| Aksi | Key |
| --- | --- |
| Lihat list & detail + menu navigasi | `product.view` |
| Buat data | `product.create` |
| Ubah data | `product.update` |
| Hapus / restore data | `product.delete` |
| Bulk upload | `product.bulk_upload` |
| Export | `product.export` |

Konstanta tersedia di `permissions.ts` (`ProductPermissions`).
Pastikan permission user (mis. `localStorage["permissions"]`) memuat key di atas
agar menu dan aksi tampil.

## 5. API real (`api/service.ts`)

Saklar sumber data ada di `api/resolver.ts` via flag `USE_MOCK` (di `mock.ts`,
default semua `true` = mock lokal tanpa backend): ubah flag yang relevan menjadi
`false` untuk memakai Real API via `service.ts` (axios `shared/lib/api`).
Nama export resolver sama untuk kedua sumber, jadi `queries.ts`/`mutations.ts`
tidak perlu berubah.

Kontrak endpoint (contoh module products):

| Aksi | Method & endpoint | Catatan |
| --- | --- | --- |
| List | `GET /api/v1/products` | Query params sama seperti filter list; response `ApiList`. |
| Detail | `GET /api/v1/products/:id` | Response entity. |
| Buat data | `POST /api/v1/products` | Body JSON payload; response `{ message, data }`. |
| Ubah data | `PUT /api/v1/products/:id` | Body JSON payload; response `{ message, data }`. |
| Hapus (soft) | `DELETE /api/v1/products/:id` | Response `{ message }`. |
| Restore | `PATCH /api/v1/products/:id/restore` | Response `{ message, data }`. |
| Export | `GET /api/v1/products/export` | Query params sama seperti list; response blob `.xlsx`. |
| Bulk upload | `POST /api/v1/products/bulk-upload` | Multipart field `file` (.xlsx); response `BulkUploadResult`. |
| Template bulk | `GET /api/v1/products/bulk-template` | Response blob `.xlsx` template. |
Error mengikuti envelope axios `{ response: { status, data } }` agar
kompatibel dengan `mapSubmitError` (`response_output.errors` untuk field error).

## 6. Verifikasi

```bash
npm run lint && npm run build
```

Mock aktif secara default (`USE_MOCK` semua `true` di `api/mock.ts`).
Untuk memakai API real, ubah flag yang relevan menjadi `false`.
