# Integrasi modul ProductColor

File ini dibuat otomatis oleh generator. Hapus setelah modul terintegrasi.

## 1. Salin folder modul (otomatis)

Folder `src/modules/mater-data/product-color/` sudah ditulis langsung ke repo oleh dev-server saat klik Generate.
Jika generate di luar dev-server (copy/download manual), salin folder tersebut ke repo.

## 2. Routes (otomatis)

Sudah didaftarkan otomatis di `src/app/router.tsx` saat generate via dev-server.
Referensi manual bila perlu:

```tsx
import {
  ProductColorListPage,
  ProductColorCreatePage,
  ProductColorViewPage,
  ProductColorEditPage,
} from '../modules/mater-data/product-color';

// di dalam children AppShell, sebelum catch-all:
      {
        path: 'mater-data/product-colors',
        element: <ProductColorListPage />,
        handle: {
          breadcrumb: [{ label: 'ProductColors' }],
          requiredPermission: 'product_color.view',
        },
      },
      {
        path: 'mater-data/product-colors/create',
        element: <ProductColorCreatePage />,
        handle: {
          breadcrumb: [{ label: 'ProductColors', path: '/mater-data/product-colors' }, { label: 'Create' }],
          requiredPermission: 'product_color.create',
        },
      },
      {
        path: 'mater-data/product-colors/:productColorId/view',
        element: <ProductColorViewPage />,
        handle: {
          breadcrumb: [{ label: 'ProductColors', path: '/mater-data/product-colors' }, { label: 'Detail' }],
          requiredPermission: 'product_color.view',
        },
      },
      {
        path: 'mater-data/product-colors/:productColorId/edit',
        element: <ProductColorEditPage />,
        handle: {
          breadcrumb: [{ label: 'ProductColors', path: '/mater-data/product-colors' }, { label: 'Edit' }],
          requiredPermission: 'product_color.update',
        },
      },
```

## 3. Navigasi (otomatis)

Sudah ditambahkan otomatis di `src/app/navigation.tsx` saat generate via dev-server.
Referensi manual bila perlu:

```tsx
  // __GENERATOR_PARENT mater-data__
  {
    label: 'Mater Data',
    icon: <NavMasterDataIcon className="h-5 w-5" />,
    children: [
      { label: 'ProductColors', path: '/mater-data/product-colors', permissionKey: 'product_color.view' },
    ],
  },
```

## 4. Permission keys (otomatis dari base `product_color`)

| Aksi | Key |
| --- | --- |
| Lihat list & detail + menu navigasi | `product_color.view` |
| Buat data | `product_color.create` |
| Ubah data | `product_color.update` |
| Hapus / restore data | `product_color.delete` |
| Bulk upload | `product_color.bulk_upload` |
| Export | `product_color.export` |

Konstanta tersedia di `permissions.ts` (`ProductColorPermissions`).
Pastikan permission user (mis. `localStorage["permissions"]`) memuat key di atas
agar menu dan aksi tampil.

## 5. API real (bulk/export)

Kontrak endpoint yang diharapkan service saat `USE_MOCK` dimatikan:

| Aksi | Method & endpoint | Catatan |
| --- | --- | --- |
| Export | `GET /api/v1/product-colors/export` | Query params sama seperti list; response blob `.xlsx`. |
| Bulk upload | `POST /api/v1/product-colors/bulk-upload` | Multipart field `file` (.xlsx); response `BulkUploadResult`. |
| Template bulk | `GET /api/v1/product-colors/bulk-template` | Response blob `.xlsx` template. |


## 6. Verifikasi

```bash
npm run lint && npm run build
```

Mock aktif secara default (`USE_MOCK` semua `true` di `api/mock.ts`).
Untuk memakai API real, ubah flag yang relevan menjadi `false`.
