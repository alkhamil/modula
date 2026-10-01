---
name: crud-module
description: Pola modul CRUD dinamis — bentuk ModuleDefinition v1, runtime generik Dynamic*, kontrak API records, seeds, dan mock vs API real.
---

# CRUD Module Pattern

Tidak ada folder per modul di repo ini — setiap modul CRUD adalah satu
`ModuleDefinition v1` yang di-render komponen generik. Referensi hidup:
seed kanonis di `backend/seeds/definitions/*.json` (10 modul).

## Bentuk definisi (v1)

```jsonc
{
  "version": 1,
  "key": "mater-data/company", // kebab path unik, immutable setelah publish
  "label": "Companies", "singularLabel": "Company",
  "parent": "mater-data", // null = root
  "routeBase": "mater-data/companies", // tanpa leading slash
  "permissionKey": "company", // base; 6 suffix diturunkan otomatis
  "apiPlural": "companies", // URL API flat /api/v1/companies
  "moduleType": "crud",
  "features": { "list": true, "detail": true, "create": true, "edit": true,
    "delete": true, "bulkUpload": true, "export": true },
  "fields": [ /* GeneratorFieldConfig: name/label/type/rules/source/
    options/api/sortable/filterable/filterCriteria */ ],
  "layout": {
    "form": [{ "field": "name", "order": 0, "colSpan": 12 }],
    "table": { "order": ["name"], "hidden": [] }
  },
  "deleteMode": "soft", // soft = deactivate + restore, hard = hapus permanen
  "status": "published" // draft = hanya preview, published = live
}
```

## Runtime generik (`src/modules/generator/runtime/`)

- `DynamicRoutes.tsx` — routes list/create/view/edit per definisi +
  preview draft (`useDynamicDefinitions` / `useDynamicDefinition`).
- `DynamicListPage` + `DynamicTable` — tabel + toolbar: search keyword
  (`params.search`), filter kolom per kriteria field, sort, paging,
  tombol Create/Bulk/Export ber-gate permission, aksi baris
  view/edit/delete(+restore bila soft).
- `DynamicForm` + `DynamicFormPages` — create/edit (`NavigationGuard`) +
  detail read-only (`DetailCard`); rules string → React Hook Form
  (`validation.ts`: `fieldRulesToRHF`, termasuk `unique` async).
- `DynamicBulkUploadDialog` + `bulk.ts` — template `.xlsx`, validasi per
  baris, upload multipart.
- `filtering.ts` — filter/sort/paging client (satu helper untuk list +
  export mock); `mutations.ts` — create/update/delete + invalidasi query
  key `['dynamic-records', apiPlural]`.
- Permission: `{base}.view` (list/detail), `.create`, `.update`,
  `.delete`, `.bulk_upload`, `.export` — via `definitionPermissions`.

## Kontrak API records (flat per `apiPlural`)

- `GET /api/v1/{plural}` (list + `search/page/size/sort/order/`filter
  kolom), `GET /api/v1/{plural}/:id`, `POST`, `PUT`,
  `DELETE /api/v1/{plural}/:id`, `PATCH /api/v1/{plural}/:id/restore`,
  `GET /api/v1/{plural}/{field}s` (options berpaging),
  `GET .../export` (blob, query = filter aktif),
  `GET .../bulk-template` (blob),
  `POST .../bulk-upload` (multipart `file` →
  `{totalRows, successCount, failedCount, errors[]}`).
- Envelope `{ response_schema, response_output }`; detail kontrak di
  `docs/backend-contract.md`.

## Mock vs API real + seeds

- `definitionsApi.ts` / `recordsApi.ts` — pola mock-first: flag `USE_MOCK`
  per operasi memilih mock vs service axios; mock definisi membaca seed
  JSON BE via `import.meta.glob` (satu sumber kanonis, anti-drift) dan
  `saveDefinition` upsert ke cache in-memory (PUT bila key ada, POST
  bila 404 di service).
- Mock records tanpa seed file (modul baru) mulai dari daftar kosong.
- Untuk API real: jalankan MySQL (`backend/compose.yaml`) + migrasi +
  `npm run seed`, jalankan BE, lalu ubah flag `USE_MOCK` terkait ke
  `false` dan pastikan permission list user mencakup keys modul.

## Membuat & mengubah modul

- Modul CRUD baru → wizard `/generator` (skill `module-generator`),
  jangan tulis folder modul manual.
- Ubah perilaku satu modul → ubah definisinya (publish ulang key yang
  sama menimpa); ubah perilaku semua modul → ubah runtime generik.
- Tulis kode modul manual hanya untuk kebutuhan non-CRUD di luar pola
  ini — tetap ikuti skill `frontend-conventions`.
