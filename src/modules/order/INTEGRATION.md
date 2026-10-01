# Integrasi modul Order

File ini dibuat otomatis oleh generator. Hapus setelah modul terintegrasi.

## 1. Salin folder modul (otomatis)

Folder `src/modules/order/` sudah ditulis langsung ke repo oleh dev-server saat klik Generate.
Jika generate di luar dev-server (copy/download manual), salin folder tersebut ke repo.

## 2. Routes (otomatis)

Sudah didaftarkan otomatis di `src/app/router.tsx` saat generate via dev-server.
Referensi manual bila perlu:

```tsx
import {
  OrderListPage,
  OrderViewPage,
} from '../modules/order';

// di dalam children AppShell, sebelum catch-all:
      {
        path: 'orders',
        element: <OrderListPage />,
        handle: {
          breadcrumb: [{ label: 'Orders' }],
          requiredPermission: 'order.view',
        },
      },
      {
        path: 'orders/:orderId/view',
        element: <OrderViewPage />,
        handle: {
          breadcrumb: [{ label: 'Orders', path: '/orders' }, { label: 'Detail' }],
          requiredPermission: 'order.view',
        },
      },
```

## 3. Navigasi (otomatis)

Sudah ditambahkan otomatis di `src/app/navigation.tsx` saat generate via dev-server.
Referensi manual bila perlu:

```tsx
  {
    label: 'Orders',
    path: '/orders',
    icon: <NavMasterDataIcon className="h-5 w-5" />,
    permissionKey: 'order.view',
  },
```

## 4. Permission keys (otomatis dari base `order`)

| Aksi | Key |
| --- | --- |
| Lihat list & detail + menu navigasi | `order.view` |
| Buat data | `order.create` |
| Ubah data | `order.update` |
| Hapus / restore data | `order.delete` |

Konstanta tersedia di `permissions.ts` (`OrderPermissions`).
Pastikan permission user (mis. `localStorage["permissions"]`) memuat key di atas
agar menu dan aksi tampil.

## 5. Verifikasi

```bash
npm run lint && npm run build
```

Mock aktif secara default (`USE_MOCK` semua `true` di `api/mock.ts`).
Untuk memakai API real, ubah flag yang relevan menjadi `false`.
