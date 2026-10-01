# Integrasi modul Category

File ini dibuat otomatis oleh generator. Hapus setelah modul terintegrasi.

## 1. Salin folder modul (otomatis)

Folder `src/modules/mater-data/category/` sudah ditulis langsung ke repo oleh dev-server saat klik Generate.
Jika generate di luar dev-server (copy/download manual), salin folder tersebut ke repo.

## 2. Routes (otomatis)

Sudah didaftarkan otomatis di `src/app/router.tsx` saat generate via dev-server.
Referensi manual bila perlu:

```tsx
import {
  CategoryListPage,
  CategoryCreatePage,
  CategoryViewPage,
  CategoryEditPage,
} from '../modules/mater-data/category';

// di dalam children AppShell, sebelum catch-all:
      {
        path: 'mater-data/categories',
        element: <CategoryListPage />,
        handle: {
          breadcrumb: [{ label: 'Categories' }],
          requiredPermission: 'category.view',
        },
      },
      {
        path: 'mater-data/categories/create',
        element: <CategoryCreatePage />,
        handle: {
          breadcrumb: [{ label: 'Categories', path: '/mater-data/categories' }, { label: 'Create' }],
          requiredPermission: 'category.create',
        },
      },
      {
        path: 'mater-data/categories/:categoryId/view',
        element: <CategoryViewPage />,
        handle: {
          breadcrumb: [{ label: 'Categories', path: '/mater-data/categories' }, { label: 'Detail' }],
          requiredPermission: 'category.view',
        },
      },
      {
        path: 'mater-data/categories/:categoryId/edit',
        element: <CategoryEditPage />,
        handle: {
          breadcrumb: [{ label: 'Categories', path: '/mater-data/categories' }, { label: 'Edit' }],
          requiredPermission: 'category.update',
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
      { label: 'Categories', path: '/mater-data/categories', permissionKey: 'category.view' },
    ],
  },
```

## 4. Permission keys (otomatis dari base `category`)

| Aksi | Key |
| --- | --- |
| Lihat list & detail + menu navigasi | `category.view` |
| Buat data | `category.create` |
| Ubah data | `category.update` |
| Hapus / restore data | `category.delete` |
| Bulk upload | `category.bulk_upload` |
| Export | `category.export` |

Konstanta tersedia di `permissions.ts` (`CategoryPermissions`).
Pastikan permission user (mis. `localStorage["permissions"]`) memuat key di atas
agar menu dan aksi tampil.

## 5. API real (bulk/export)

Kontrak endpoint yang diharapkan service saat `USE_MOCK` dimatikan:

| Aksi | Method & endpoint | Catatan |
| --- | --- | --- |
| Export | `GET /api/v1/categories/export` | Query params sama seperti list; response blob `.xlsx`. |
| Bulk upload | `POST /api/v1/categories/bulk-upload` | Multipart field `file` (.xlsx); response `BulkUploadResult`. |
| Template bulk | `GET /api/v1/categories/bulk-template` | Response blob `.xlsx` template. |


## 6. Verifikasi

```bash
npm run lint && npm run build
```

Mock aktif secara default (`USE_MOCK` semua `true` di `api/mock.ts`).
Untuk memakai API real, ubah flag yang relevan menjadi `false`.
