# Integrasi modul Invoice

File ini dibuat otomatis oleh generator. Hapus setelah modul terintegrasi.

## 1. Salin folder modul (otomatis)

Folder `src/modules/invoice/` sudah ditulis langsung ke repo oleh dev-server saat klik Generate.
Jika generate di luar dev-server (copy/download manual), salin folder tersebut ke repo.

## 2. Routes (otomatis)

Sudah didaftarkan otomatis di `src/app/router.tsx` saat generate via dev-server.
Referensi manual bila perlu:

```tsx
import {
  InvoiceListPage,
  InvoiceCreatePage,
  InvoiceViewPage,
  InvoiceEditPage,
} from '../modules/invoice';

// di dalam children AppShell, sebelum catch-all:
      {
        path: 'invoices',
        element: <InvoiceListPage />,
        handle: {
          breadcrumb: [{ label: 'Invoices', labelKey: 'invoice.breadcrumbs.list' }],
          requiredPermission: 'invoice.view',
        },
      },
      {
        path: 'invoices/create',
        element: <InvoiceCreatePage />,
        handle: {
          breadcrumb: [{ label: 'Invoices', labelKey: 'invoice.breadcrumbs.list', path: '/invoices' }, { label: 'Create', labelKey: 'invoice.breadcrumbs.create' }],
          requiredPermission: 'invoice.create',
        },
      },
      {
        path: 'invoices/:invoiceId/view',
        element: <InvoiceViewPage />,
        handle: {
          breadcrumb: [{ label: 'Invoices', labelKey: 'invoice.breadcrumbs.list', path: '/invoices' }, { label: 'Detail', labelKey: 'invoice.breadcrumbs.detail' }],
          requiredPermission: 'invoice.view',
        },
      },
      {
        path: 'invoices/:invoiceId/edit',
        element: <InvoiceEditPage />,
        handle: {
          breadcrumb: [{ label: 'Invoices', labelKey: 'invoice.breadcrumbs.list', path: '/invoices' }, { label: 'Edit', labelKey: 'invoice.breadcrumbs.edit' }],
          requiredPermission: 'invoice.update',
        },
      },
```

## 3. Navigasi (otomatis)

Sudah ditambahkan otomatis di `src/app/navigation.tsx` saat generate via dev-server.
Referensi manual bila perlu:

```tsx
  {
    label: 'Invoices',
    labelKey: 'invoice.labelPlural',
    path: '/invoices',
    icon: <NotebookText className="h-5 w-5" />,
    permissionKey: 'invoice.view',
  },
```

## 4. Permission keys (otomatis dari base `invoice`)

| Aksi | Key |
| --- | --- |
| Lihat list & detail + menu navigasi | `invoice.view` |
| Buat data | `invoice.create` |
| Ubah data | `invoice.update` |
| Hapus / restore data | `invoice.delete` |
| Bulk upload | `invoice.bulk_upload` |
| Export | `invoice.export` |

Konstanta tersedia di `permissions.ts` (`InvoicePermissions`).
Pastikan permission user (mis. `localStorage["permissions"]`) memuat key di atas
agar menu dan aksi tampil.

## 5. API real (`api/service.ts`)

Saklar sumber data ada di `api/resolver.ts` via flag `USE_MOCK` (di `mock.ts`,
default semua `true` = mock lokal tanpa backend): ubah flag yang relevan menjadi
`false` untuk memakai Real API via `service.ts` (axios `shared/lib/api`).
Nama export resolver sama untuk kedua sumber, jadi `queries.ts`/`mutations.ts`
tidak perlu berubah.

Kontrak endpoint (contoh module invoices):

| Aksi | Method & endpoint | Catatan |
| --- | --- | --- |
| List | `GET /api/v1/invoices` | Query params sama seperti filter list; response `ApiList`. |
| Detail | `GET /api/v1/invoices/:id` | Response entity. |
| Buat data | `POST /api/v1/invoices` | Body JSON payload; response `{ message, data }`. |
| Ubah data | `PUT /api/v1/invoices/:id` | Body JSON payload; response `{ message, data }`. |
| Hapus (soft) | `DELETE /api/v1/invoices/:id` | Response `{ message }`. |
| Restore | `PATCH /api/v1/invoices/:id/restore` | Response `{ message, data }`. |
| Export | `GET /api/v1/invoices/export` | Query params sama seperti list; response blob `.xlsx`. |
| Bulk upload | `POST /api/v1/invoices/bulk-upload` | Multipart field `file` (.xlsx); response `BulkUploadResult`. |
| Template bulk | `GET /api/v1/invoices/bulk-template` | Response blob `.xlsx` template. |
| Opsi field | `GET` endpoint per field (lihat `service.ts`) | Response list opsi. |
Error mengikuti envelope axios `{ response: { status, data } }` agar
kompatibel dengan `mapSubmitError` (`response_output.errors` untuk field error).

## 6. Verifikasi

```bash
npm run lint && npm run build
```

Mock aktif secara default (`USE_MOCK` semua `true` di `api/mock.ts`).
Untuk memakai API real, ubah flag yang relevan menjadi `false`.
