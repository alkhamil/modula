# Integrasi modul Branch

File ini dibuat otomatis oleh generator. Hapus setelah modul terintegrasi.

## 1. Salin folder modul (otomatis)

Folder `src/modules/mater-data/branch/` sudah ditulis langsung ke repo oleh dev-server saat klik Generate.
Jika generate di luar dev-server (copy/download manual), salin folder tersebut ke repo.

## 2. Routes (otomatis)

Sudah didaftarkan otomatis di `src/app/router.tsx` saat generate via dev-server.
Referensi manual bila perlu:

```tsx
import {
  BranchListPage,
  BranchCreatePage,
  BranchViewPage,
  BranchEditPage,
} from '../modules/mater-data/branch';

// di dalam children AppShell, sebelum catch-all:
      {
        path: 'branches',
        element: <BranchListPage />,
        handle: {
          breadcrumb: [{ label: 'Branches' }],
          requiredPermission: 'branch.view',
        },
      },
      {
        path: 'branches/create',
        element: <BranchCreatePage />,
        handle: {
          breadcrumb: [{ label: 'Branches', path: '/mater-data/branches' }, { label: 'Create' }],
          requiredPermission: 'branch.create',
        },
      },
      {
        path: 'branches/:branchId/view',
        element: <BranchViewPage />,
        handle: {
          breadcrumb: [{ label: 'Branches', path: '/mater-data/branches' }, { label: 'Detail' }],
          requiredPermission: 'branch.view',
        },
      },
      {
        path: 'branches/:branchId/edit',
        element: <BranchEditPage />,
        handle: {
          breadcrumb: [{ label: 'Branches', path: '/mater-data/branches' }, { label: 'Edit' }],
          requiredPermission: 'branch.update',
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
      { label: 'Branches', path: '/mater-data/branches', permissionKey: 'branch.view' },
    ],
  },
```

## 4. Permission keys (otomatis dari base `branch`)

| Aksi | Key |
| --- | --- |
| Lihat list & detail + menu navigasi | `branch.view` |
| Buat data | `branch.create` |
| Ubah data | `branch.update` |
| Hapus / restore data | `branch.delete` |

Konstanta tersedia di `permissions.ts` (`BranchPermissions`).
Pastikan permission user (mis. `localStorage["permissions"]`) memuat key di atas
agar menu dan aksi tampil.

## 5. Verifikasi

```bash
npm run lint && npm run build
```

Mock aktif secara default (`USE_MOCK` semua `true` di `api/mock.ts`).
Untuk memakai API real, ubah flag yang relevan menjadi `false`.
