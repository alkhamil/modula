---
name: crud-module
description: Pola modul CRUD dinamis mock-only — bentuk ModuleDefinition v1, runtime generik Dynamic*, mock store persisten, dan seeds.
---

# CRUD Module Pattern

Tidak ada folder per modul dan tidak ada backend di repo ini — setiap
modul CRUD adalah satu `ModuleDefinition v1` yang di-render komponen
generik, dengan data dari mock store (seed JSON + localStorage).
Referensi: seed di `src/modules/generator/seeds/definitions/*.json`
(dibuat via wizard/publish) + contoh bentuk di bawah.

## Bentuk definisi (v1)

```jsonc
{
  "version": 1,
  "key": "mater-data/company", // kebab path unik, immutable setelah publish
  "label": "Companies", "singularLabel": "Company",
  "parent": "mater-data", // null = root
  "routeBase": "mater-data/companies", // tanpa leading slash
  "permissionKey": "company", // base; 6 suffix diturunkan otomatis
  "apiPlural": "companies", // namespace data di mock store
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
- `DynamicListPage` + `DynamicTable` — tabel + toolbar: search keyword,
  filter kolom per kriteria field, sort, paging, tombol Create/Bulk/Export
  ber-gate permission, aksi baris view/edit/delete(+restore bila soft).
- `DynamicForm` + `DynamicFormPages` — create/edit (`NavigationGuard`) +
  detail read-only (`DetailCard`); rules string → React Hook Form
  (`validation.ts`: `fieldRulesToRHF`, termasuk `unique` async).
- `DynamicBulkUploadDialog` + `bulk.ts` — template `.xlsx`, validasi per
  baris, upload dari file.
- `filtering.ts` — filter/sort/paging (satu helper untuk list + export);
  `mutations.ts` — create/update/delete + invalidasi query key
  `['dynamic-records', apiPlural]`.
- Permission: `{base}.view` (list/detail), `.create`, `.update`,
  `.delete`, `.bulk_upload`, `.export` — via `definitionPermissions`.

## Mock store (pengganti API)

- `definitionsApi.ts` — list/get/save definisi; baca seed JSON
  (`seeds/definitions/`) saat pertama, persist ke localStorage
  `mock_definitions_v1` tiap save; `resetMockDefinitions()` kembali ke seed.
- `recordsApi.ts` — list/get/create/update/delete/restore/export/template/
  bulk per `apiPlural`; seed per modul (`seeds/records/`), persist ke
  `mock_records_v1` tiap mutasi; `resetMockRecords()` kembali ke seed.
- Modul baru tanpa seed mulai dari daftar kosong; cek `unique` jalan
  terhadap store; error konflik meniru bentuk error API
  (`response_schema` + `errors[]`) agar handler FE tidak berubah.

## Membuat & mengubah modul

- Modul CRUD baru → wizard `/generator` (skill `module-generator`),
  jangan tulis folder modul manual.
- Ubah perilaku satu modul → publish ulang key yang sama (menimpa);
  ubah perilaku semua modul → ubah runtime generik.
- Tulis kode modul manual hanya untuk kebutuhan non-CRUD di luar pola
  ini — tetap ikuti skill `frontend-conventions`.
