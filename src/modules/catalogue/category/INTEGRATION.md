# Integrasi modul Category

File ini dibuat otomatis oleh generator. Hapus setelah modul terintegrasi.

## 1. Salin folder modul (otomatis)

Folder `src/modules/catalogue/category/` sudah ditulis langsung ke repo oleh dev-server saat klik Generate.
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
} from '../modules/catalogue/category';

// di dalam children AppShell, sebelum catch-all:
      {
        path: 'catalogue/categories',
        element: <CategoryListPage />,
        handle: {
          breadcrumb: [{ label: 'Categories', labelKey: 'category.breadcrumbs.list' }],
          requiredPermission: 'category.view',
        },
      },
      {
        path: 'catalogue/categories/create',
        element: <CategoryCreatePage />,
        handle: {
          breadcrumb: [{ label: 'Categories', labelKey: 'category.breadcrumbs.list', path: '/catalogue/categories' }, { label: 'Create', labelKey: 'category.breadcrumbs.create' }],
          requiredPermission: 'category.create',
        },
      },
      {
        path: 'catalogue/categories/:categoryId/view',
        element: <CategoryViewPage />,
        handle: {
          breadcrumb: [{ label: 'Categories', labelKey: 'category.breadcrumbs.list', path: '/catalogue/categories' }, { label: 'Detail', labelKey: 'category.breadcrumbs.detail' }],
          requiredPermission: 'category.view',
        },
      },
      {
        path: 'catalogue/categories/:categoryId/edit',
        element: <CategoryEditPage />,
        handle: {
          breadcrumb: [{ label: 'Categories', labelKey: 'category.breadcrumbs.list', path: '/catalogue/categories' }, { label: 'Edit', labelKey: 'category.breadcrumbs.edit' }],
          requiredPermission: 'category.update',
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
    labelKey: 'category.parentLabel',
    icon: <Database className="h-5 w-5" />,
    children: [
      { label: 'Categories', labelKey: 'category.labelPlural', path: '/catalogue/categories', permissionKey: 'category.view' },
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

## 5. API real (`api/service.ts`)

Saklar sumber data ada di `api/resolver.ts` via flag `USE_MOCK` (di `mock.ts`,
default semua `true` = mock lokal tanpa backend): ubah flag yang relevan menjadi
`false` untuk memakai Real API via `service.ts` (axios `shared/lib/api`).
Nama export resolver sama untuk kedua sumber, jadi `queries.ts`/`mutations.ts`
tidak perlu berubah.

Kontrak endpoint (contoh module categories):

| Aksi | Method & endpoint | Catatan |
| --- | --- | --- |
| List | `GET /api/v1/categories` | Query params sama seperti filter list; response `ApiList`. |
| Detail | `GET /api/v1/categories/:id` | Response entity. |
| Buat data | `POST /api/v1/categories` | Body JSON payload; response `{ message, data }`. |
| Ubah data | `PUT /api/v1/categories/:id` | Body JSON payload; response `{ message, data }`. |
| Hapus (soft) | `DELETE /api/v1/categories/:id` | Response `{ message }`. |
| Restore | `PATCH /api/v1/categories/:id/restore` | Response `{ message, data }`. |
| Export | `GET /api/v1/categories/export` | Query params sama seperti list; response blob `.xlsx`. |
| Bulk upload | `POST /api/v1/categories/bulk-upload` | Multipart field `file` (.xlsx); response `BulkUploadResult`. |
| Template bulk | `GET /api/v1/categories/bulk-template` | Response blob `.xlsx` template. |
Error mengikuti envelope axios `{ response: { status, data } }` agar
kompatibel dengan `mapSubmitError` (`response_output.errors` untuk field error).

## 6. Verifikasi

```bash
npm run lint && npm run build
```

Mock aktif secara default (`USE_MOCK` semua `true` di `api/mock.ts`).
Untuk memakai API real, ubah flag yang relevan menjadi `false`.
