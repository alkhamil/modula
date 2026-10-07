# Integrasi modul MasterDivisi

File ini dibuat otomatis oleh generator. Hapus setelah modul terintegrasi.

## 1. Salin folder modul (otomatis)

Folder `src/modules/master-divisi/` sudah ditulis langsung ke repo oleh dev-server saat klik Generate.
Jika generate di luar dev-server (copy/download manual), salin folder tersebut ke repo.

## 2. Routes (otomatis)

Sudah didaftarkan otomatis di `src/app/router.tsx` saat generate via dev-server.
Referensi manual bila perlu:

```tsx
import {
  MasterDivisiListPage,
  MasterDivisiCreatePage,
  MasterDivisiViewPage,
  MasterDivisiEditPage,
} from '../modules/master-divisi';

// di dalam children AppShell, sebelum catch-all:
      {
        path: 'master-divisis',
        element: <MasterDivisiListPage />,
        handle: {
          breadcrumb: [{ label: 'MasterDivisis', labelKey: 'master_division.breadcrumbs.list' }],
          requiredPermission: 'master_division.view',
        },
      },
      {
        path: 'master-divisis/create',
        element: <MasterDivisiCreatePage />,
        handle: {
          breadcrumb: [{ label: 'MasterDivisis', labelKey: 'master_division.breadcrumbs.list', path: '/master-divisis' }, { label: 'Create', labelKey: 'master_division.breadcrumbs.create' }],
          requiredPermission: 'master_division.create',
        },
      },
      {
        path: 'master-divisis/:masterDivisiId/view',
        element: <MasterDivisiViewPage />,
        handle: {
          breadcrumb: [{ label: 'MasterDivisis', labelKey: 'master_division.breadcrumbs.list', path: '/master-divisis' }, { label: 'Detail', labelKey: 'master_division.breadcrumbs.detail' }],
          requiredPermission: 'master_division.view',
        },
      },
      {
        path: 'master-divisis/:masterDivisiId/edit',
        element: <MasterDivisiEditPage />,
        handle: {
          breadcrumb: [{ label: 'MasterDivisis', labelKey: 'master_division.breadcrumbs.list', path: '/master-divisis' }, { label: 'Edit', labelKey: 'master_division.breadcrumbs.edit' }],
          requiredPermission: 'master_division.update',
        },
      },
```

## 3. Navigasi (otomatis)

Sudah ditambahkan otomatis di `src/app/navigation.tsx` saat generate via dev-server.
Referensi manual bila perlu:

```tsx
  {
    label: 'MasterDivisis',
    labelKey: 'master_division.labelPlural',
    path: '/master-divisis',
    icon: <CircleDivide className="h-5 w-5" />,
    permissionKey: 'master_division.view',
  },
```

## 4. Permission keys (otomatis dari base `master_division`)

| Aksi | Key |
| --- | --- |
| Lihat list & detail + menu navigasi | `master_division.view` |
| Buat data | `master_division.create` |
| Ubah data | `master_division.update` |
| Hapus / restore data | `master_division.delete` |
| Bulk upload | `master_division.bulk_upload` |
| Export | `master_division.export` |

Konstanta tersedia di `permissions.ts` (`MasterDivisiPermissions`).
Pastikan permission user (mis. `localStorage["permissions"]`) memuat key di atas
agar menu dan aksi tampil.

## 5. API real (`api/service.ts`)

Saklar sumber data ada di `api/resolver.ts` via flag `USE_MOCK` (di `mock.ts`,
default semua `true` = mock lokal tanpa backend): ubah flag yang relevan menjadi
`false` untuk memakai Real API via `service.ts` (axios `shared/lib/api`).
Nama export resolver sama untuk kedua sumber, jadi `queries.ts`/`mutations.ts`
tidak perlu berubah.

Kontrak endpoint (contoh module master-divisis):

| Aksi | Method & endpoint | Catatan |
| --- | --- | --- |
| List | `GET /api/v1/master-divisis` | Query params sama seperti filter list; response `ApiList`. |
| Detail | `GET /api/v1/master-divisis/:id` | Response entity. |
| Buat data | `POST /api/v1/master-divisis` | Body JSON payload; response `{ message, data }`. |
| Ubah data | `PUT /api/v1/master-divisis/:id` | Body JSON payload; response `{ message, data }`. |
| Hapus (soft) | `DELETE /api/v1/master-divisis/:id` | Response `{ message }`. |
| Restore | `PATCH /api/v1/master-divisis/:id/restore` | Response `{ message, data }`. |
| Export | `GET /api/v1/master-divisis/export` | Query params sama seperti list; response blob `.xlsx`. |
| Bulk upload | `POST /api/v1/master-divisis/bulk-upload` | Multipart field `file` (.xlsx); response `BulkUploadResult`. |
| Template bulk | `GET /api/v1/master-divisis/bulk-template` | Response blob `.xlsx` template. |
Error mengikuti envelope axios `{ response: { status, data } }` agar
kompatibel dengan `mapSubmitError` (`response_output.errors` untuk field error).

## 6. Verifikasi

```bash
npm run lint && npm run build
```

Mock aktif secara default (`USE_MOCK` semua `true` di `api/mock.ts`).
Untuk memakai API real, ubah flag yang relevan menjadi `false`.
