# Integrasi modul NewClaim

File ini dibuat otomatis oleh generator. Hapus setelah modul terintegrasi.

## 1. Salin folder modul (otomatis)

Folder `src/modules/new-claim/` sudah ditulis langsung ke repo oleh dev-server saat klik Generate.
Jika generate di luar dev-server (copy/download manual), salin folder tersebut ke repo.

## 2. Routes (otomatis)

Sudah didaftarkan otomatis di `src/app/router.tsx` saat generate via dev-server.
Referensi manual bila perlu:

```tsx
import {
  NewClaimListPage,
  NewClaimCreatePage,
  NewClaimViewPage,
  NewClaimEditPage,
} from '../modules/new-claim';

// di dalam children AppShell, sebelum catch-all:
      {
        path: 'new-claims',
        element: <NewClaimListPage />,
        handle: {
          breadcrumb: [{ label: 'NewClaims' }],
          requiredPermission: 'new_claim.view',
        },
      },
      {
        path: 'new-claims/create',
        element: <NewClaimCreatePage />,
        handle: {
          breadcrumb: [{ label: 'NewClaims', path: '/new-claims' }, { label: 'Create' }],
          requiredPermission: 'new_claim.create',
        },
      },
      {
        path: 'new-claims/:newClaimId/view',
        element: <NewClaimViewPage />,
        handle: {
          breadcrumb: [{ label: 'NewClaims', path: '/new-claims' }, { label: 'Detail' }],
          requiredPermission: 'new_claim.view',
        },
      },
      {
        path: 'new-claims/:newClaimId/edit',
        element: <NewClaimEditPage />,
        handle: {
          breadcrumb: [{ label: 'NewClaims', path: '/new-claims' }, { label: 'Edit' }],
          requiredPermission: 'new_claim.update',
        },
      },
```

## 3. Navigasi (otomatis)

Sudah ditambahkan otomatis di `src/app/navigation.tsx` saat generate via dev-server.
Referensi manual bila perlu:

```tsx
  {
    label: 'NewClaims',
    path: '/new-claims',
    icon: <NavMasterDataIcon className="h-5 w-5" />,
    permissionKey: 'new_claim.view',
  },
```

## 4. Permission keys (otomatis dari base `new_claim`)

| Aksi | Key |
| --- | --- |
| Lihat list & detail + menu navigasi | `new_claim.view` |
| Buat data | `new_claim.create` |
| Ubah data | `new_claim.update` |
| Hapus / restore data | `new_claim.delete` |
| Bulk upload | `new_claim.bulk_upload` |
| Export | `new_claim.export` |

Konstanta tersedia di `permissions.ts` (`NewClaimPermissions`).
Pastikan permission user (mis. `localStorage["permissions"]`) memuat key di atas
agar menu dan aksi tampil.

## 5. API real (bulk/export)

Kontrak endpoint yang diharapkan service saat `USE_MOCK` dimatikan:

| Aksi | Method & endpoint | Catatan |
| --- | --- | --- |
| Export | `GET /api/v1/new-claims/export` | Query params sama seperti list; response blob `.xlsx`. |
| Bulk upload | `POST /api/v1/new-claims/bulk-upload` | Multipart field `file` (.xlsx); response `BulkUploadResult`. |
| Template bulk | `GET /api/v1/new-claims/bulk-template` | Response blob `.xlsx` template. |


## 6. Verifikasi

```bash
npm run lint && npm run build
```

Mock aktif secara default (`USE_MOCK` semua `true` di `api/mock.ts`).
Untuk memakai API real, ubah flag yang relevan menjadi `false`.
