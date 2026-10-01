# Integrasi modul Inventory

File ini dibuat otomatis oleh generator. Hapus setelah modul terintegrasi.

## 1. Salin folder modul (otomatis)

Folder `src/modules/mater-data/inventory/` sudah ditulis langsung ke repo oleh dev-server saat klik Generate.
Jika generate di luar dev-server (copy/download manual), salin folder tersebut ke repo.

## 2. Routes (otomatis)

Sudah didaftarkan otomatis di `src/app/router.tsx` saat generate via dev-server.
Referensi manual bila perlu:

```tsx
import {
  InventoryListPage,
  InventoryCreatePage,
  InventoryViewPage,
  InventoryEditPage,
} from '../modules/mater-data/inventory';

// di dalam children AppShell, sebelum catch-all:
      {
        path: 'mater-data/inventories',
        element: <InventoryListPage />,
        handle: {
          breadcrumb: [{ label: 'Inventories' }],
          requiredPermission: 'inventory.view',
        },
      },
      {
        path: 'mater-data/inventories/create',
        element: <InventoryCreatePage />,
        handle: {
          breadcrumb: [{ label: 'Inventories', path: '/mater-data/inventories' }, { label: 'Create' }],
          requiredPermission: 'inventory.create',
        },
      },
      {
        path: 'mater-data/inventories/:inventoryId/view',
        element: <InventoryViewPage />,
        handle: {
          breadcrumb: [{ label: 'Inventories', path: '/mater-data/inventories' }, { label: 'Detail' }],
          requiredPermission: 'inventory.view',
        },
      },
      {
        path: 'mater-data/inventories/:inventoryId/edit',
        element: <InventoryEditPage />,
        handle: {
          breadcrumb: [{ label: 'Inventories', path: '/mater-data/inventories' }, { label: 'Edit' }],
          requiredPermission: 'inventory.update',
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
      { label: 'Inventories', path: '/mater-data/inventories', permissionKey: 'inventory.view' },
    ],
  },
```

## 4. Permission keys (otomatis dari base `inventory`)

| Aksi | Key |
| --- | --- |
| Lihat list & detail + menu navigasi | `inventory.view` |
| Buat data | `inventory.create` |
| Ubah data | `inventory.update` |
| Hapus / restore data | `inventory.delete` |
| Bulk upload | `inventory.bulk_upload` |
| Export | `inventory.export` |

Konstanta tersedia di `permissions.ts` (`InventoryPermissions`).
Pastikan permission user (mis. `localStorage["permissions"]`) memuat key di atas
agar menu dan aksi tampil.

## 5. API real (bulk/export)

Kontrak endpoint yang diharapkan service saat `USE_MOCK` dimatikan:

| Aksi | Method & endpoint | Catatan |
| --- | --- | --- |
| Export | `GET /api/v1/inventories/export` | Query params sama seperti list; response blob `.xlsx`. |
| Bulk upload | `POST /api/v1/inventories/bulk-upload` | Multipart field `file` (.xlsx); response `BulkUploadResult`. |
| Template bulk | `GET /api/v1/inventories/bulk-template` | Response blob `.xlsx` template. |


## 6. Verifikasi

```bash
npm run lint && npm run build
```

Mock aktif secara default (`USE_MOCK` semua `true` di `api/mock.ts`).
Untuk memakai API real, ubah flag yang relevan menjadi `false`.
