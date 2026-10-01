# Integrasi modul ProductVariant

File ini dibuat otomatis oleh generator. Hapus setelah modul terintegrasi.

## 1. Salin folder modul (otomatis)

Folder `src/modules/mater-data/product-variant/` sudah ditulis langsung ke repo oleh dev-server saat klik Generate.
Jika generate di luar dev-server (copy/download manual), salin folder tersebut ke repo.

## 2. Routes (otomatis)

Sudah didaftarkan otomatis di `src/app/router.tsx` saat generate via dev-server.
Referensi manual bila perlu:

```tsx
import {
  ProductVariantListPage,
  ProductVariantCreatePage,
  ProductVariantViewPage,
  ProductVariantEditPage,
} from '../modules/mater-data/product-variant';

// di dalam children AppShell, sebelum catch-all:
      {
        path: 'mater-data/product-variants',
        element: <ProductVariantListPage />,
        handle: {
          breadcrumb: [{ label: 'ProductVariants' }],
          requiredPermission: 'product_variant.view',
        },
      },
      {
        path: 'mater-data/product-variants/create',
        element: <ProductVariantCreatePage />,
        handle: {
          breadcrumb: [{ label: 'ProductVariants', path: '/mater-data/product-variants' }, { label: 'Create' }],
          requiredPermission: 'product_variant.create',
        },
      },
      {
        path: 'mater-data/product-variants/:productVariantId/view',
        element: <ProductVariantViewPage />,
        handle: {
          breadcrumb: [{ label: 'ProductVariants', path: '/mater-data/product-variants' }, { label: 'Detail' }],
          requiredPermission: 'product_variant.view',
        },
      },
      {
        path: 'mater-data/product-variants/:productVariantId/edit',
        element: <ProductVariantEditPage />,
        handle: {
          breadcrumb: [{ label: 'ProductVariants', path: '/mater-data/product-variants' }, { label: 'Edit' }],
          requiredPermission: 'product_variant.update',
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
      { label: 'ProductVariants', path: '/mater-data/product-variants', permissionKey: 'product_variant.view' },
    ],
  },
```

## 4. Permission keys (otomatis dari base `product_variant`)

| Aksi | Key |
| --- | --- |
| Lihat list & detail + menu navigasi | `product_variant.view` |
| Buat data | `product_variant.create` |
| Ubah data | `product_variant.update` |
| Hapus / restore data | `product_variant.delete` |
| Bulk upload | `product_variant.bulk_upload` |
| Export | `product_variant.export` |

Konstanta tersedia di `permissions.ts` (`ProductVariantPermissions`).
Pastikan permission user (mis. `localStorage["permissions"]`) memuat key di atas
agar menu dan aksi tampil.

## 5. API real (bulk/export)

Kontrak endpoint yang diharapkan service saat `USE_MOCK` dimatikan:

| Aksi | Method & endpoint | Catatan |
| --- | --- | --- |
| Export | `GET /api/v1/product-variants/export` | Query params sama seperti list; response blob `.xlsx`. |
| Bulk upload | `POST /api/v1/product-variants/bulk-upload` | Multipart field `file` (.xlsx); response `BulkUploadResult`. |
| Template bulk | `GET /api/v1/product-variants/bulk-template` | Response blob `.xlsx` template. |


## 6. Verifikasi

```bash
npm run lint && npm run build
```

Mock aktif secara default (`USE_MOCK` semua `true` di `api/mock.ts`).
Untuk memakai API real, ubah flag yang relevan menjadi `false`.
