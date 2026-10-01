# Integrasi modul Product

File ini dibuat otomatis oleh generator. Hapus setelah modul terintegrasi.

## 1. Salin folder modul (otomatis)

Folder `src/modules/mater-data/product/` sudah ditulis langsung ke repo oleh dev-server saat klik Generate.
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
} from '../modules/mater-data/product';

// di dalam children AppShell, sebelum catch-all:
      {
        path: 'mater-data/products',
        element: <ProductListPage />,
        handle: {
          breadcrumb: [{ label: 'Products' }],
          requiredPermission: 'product.view',
        },
      },
      {
        path: 'mater-data/products/create',
        element: <ProductCreatePage />,
        handle: {
          breadcrumb: [{ label: 'Products', path: '/mater-data/products' }, { label: 'Create' }],
          requiredPermission: 'product.create',
        },
      },
      {
        path: 'mater-data/products/:productId/view',
        element: <ProductViewPage />,
        handle: {
          breadcrumb: [{ label: 'Products', path: '/mater-data/products' }, { label: 'Detail' }],
          requiredPermission: 'product.view',
        },
      },
      {
        path: 'mater-data/products/:productId/edit',
        element: <ProductEditPage />,
        handle: {
          breadcrumb: [{ label: 'Products', path: '/mater-data/products' }, { label: 'Edit' }],
          requiredPermission: 'product.update',
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
      { label: 'Products', path: '/mater-data/products', permissionKey: 'product.view' },
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
| Bulk upload | `product.create` |
| Export | `product.view` |

Konstanta tersedia di `permissions.ts` (`ProductPermissions`).
Pastikan permission user (mis. `localStorage["permissions"]`) memuat key di atas
agar menu dan aksi tampil.

## 5. API real (bulk/export)

Kontrak endpoint yang diharapkan service saat `USE_MOCK` dimatikan:

| Aksi | Method & endpoint | Catatan |
| --- | --- | --- |
| Export | `GET /api/v1/products/export` | Query params sama seperti list; response blob `.xlsx`. |
| Bulk upload | `POST /api/v1/products/bulk-upload` | Multipart field `file` (.xlsx); response `BulkUploadResult`. |
| Template bulk | `GET /api/v1/products/bulk-template` | Response blob `.xlsx` template. |


## 6. Verifikasi

```bash
npm run lint && npm run build
```

Mock aktif secara default (`USE_MOCK` semua `true` di `api/mock.ts`).
Untuk memakai API real, ubah flag yang relevan menjadi `false`.
