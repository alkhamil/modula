---
name: crud-module
description: Pola modul CRUD referensi (src/modules/user) — struktur folder, API mock-first, hooks, validasi, pages, permission, dan integrasi API real.
---

# CRUD Module Pattern

Pola baku setiap modul fitur di `src/modules/<nama>/`. Referensi hidup:
`src/modules/user/` (dan modul hasil generate yang membawa `INTEGRATION.md`).

## Struktur folder modul

```text
src/modules/<nama>/
├── api/          index.ts, mock.ts, mutations.ts, queries.ts, resolver.ts, service.ts
├── components/   <Ent>Form.tsx, <Ent>Table.tsx (+ <Ent>BulkUploadDialog.tsx bila ada)
├── hooks/        use<Ent>List.ts, use<Ent>ListFilter.ts, use<Ent>Form.tsx (+ use<Ent>Export.ts)
├── pages/        <Ent>ListPage.tsx, <Ent>CreatePage.tsx, <Ent>ViewPage.tsx, <Ent>EditPage.tsx
├── types/        index.ts (entity, response, Create/Update request, params)
├── validation/   <ent>Validation.ts (+ <ent>BulkValidation.ts bila ada)
├── permissions.ts  (konstanta {Ent}Permissions — base + 6 suffix)
├── index.ts        (re-export pages)
└── INTEGRATION.md  (tabel permission keys + langkah integrasi API real)
```

Modul ber-parent tinggal di `src/modules/<parent>/<nama>/`.

## Lapisan API (mock-first)

- `service.ts` — panggilan HTTP via axios instance `shared/lib/api.ts`
  (endpoint flat `/api/v1/{plural}`).
- `mock.ts` — data + operasi mock; flag `USE_MOCK` memilih mock vs real.
- `resolver.ts` — memilih mock/service per operasi berdasarkan `USE_MOCK`.
- `queries.ts` — TanStack Query `useQuery` wrappers (list/detail).
- `mutations.ts` — `useMutation` wrappers (create/update/delete) + invalidasi
  query key modul.
- Search list selalu keyword (`params.search`); filter kolom terpisah per
  kriteria field. Mock list + export memakai satu helper
  `filter<EntityPlural>Records` agar konsisten.

## Hooks, komponen, pages

- `use<Ent>List` — state paging/sort + query list; `use<Ent>ListFilter` —
  state filter kolom; `use<Ent>Form` — React Hook Form + validasi + submit.
- `<Ent>Table` — tabel `shared` (kolom sortable/filterable sesuai config
  field); `<Ent>Form` — field form `shared` (`TextField`,
  `SelectField`, `DatePickerField`, dst).
- Pages: List (tabel + toolbar + tombol Create/Bulk/Export ber-gate
  permission), Create/Edit (form + `NavigationGuard`), View (`DetailCard`).
- Tombol Export digate `{base}.export`, Bulk Upload digate
  `{base}.bulk_upload`, Create `{base}.create`, Edit `{base}.update`,
  List/Detail `{base}.view`.

## Permission & registrasi

- `permissions.ts` mengekspor `{Ent}Permissions`:
  `view/create/update/delete/bulkUpload/export` =
  `{base}.view/.create/.update/.delete/.bulk_upload/.export`.
- Route di `src/app/router.tsx` membawa
  `handle: { breadcrumb, requiredPermission }`; item nav di
  `src/app/navigation.tsx` membawa `permissionKey: '{base}.view'`.
- Jangan mengubah blok/marker `// __GENERATOR_*__` secara manual.

## Integrasi API real

- Endpoint kontrak: `GET /api/v1/{plural}` (list + query paging/sort/
  filter), `GET /api/v1/{plural}/:id`, `POST`, `PATCH/PUT`,
  `DELETE /api/v1/{plural}/:id`, plus bila fitur aktif
  `GET .../export` (blob, query = filter aktif),
  `GET .../bulk-template` (blob),
  `POST .../bulk-upload` (multipart `file` →
  `{totalRows, successCount, failedCount, errors[]}`).
- Untuk beralih ke API real: ubah `USE_MOCK` di `api/mock.ts` menjadi
  `false` dan pastikan permission list user dari backend mencakup keys modul
  (detail per modul ada di `INTEGRATION.md`-nya).

## Membuat modul manual vs generator

- Modul CRUD standar → pakai wizard `/generator` (lihat skill
  `module-generator`), jangan tulis manual.
- Tulis manual hanya untuk modul non-CRUD atau kustomisasi berat — tetap ikuti
  struktur, naming, dan lapisan API di atas.
