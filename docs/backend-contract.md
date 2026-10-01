# Kontrak Backend (v1)

Acuan tunggal integrasi FE ↔ BE untuk dynamic module runtime.
Diimplementasikan oleh `backend/` (NestJS + MySQL); FE mengonsumsinya via
axios (`src/shared/lib/api.ts`, baseURL `VITE_API_BASE_URL`).

## Konvensi umum

- Base path: `/api/v1`. BE serve di `:3000` (default `VITE_API_BASE_URL`),
  CORS mengizinkan origin dev Vite.
- Semua response JSON memakai envelope (kecuali `.xlsx` blob):

```json
{
  "response_schema": { "response_code": "200", "response_message": "OK" },
  "response_output": { }
}
```

- List: `response_output = { "list": { "pagination": { "page": 1, "size": 10, "total_pages": 5, "total_elements": 48 }, "content": [ ] } }`
- Detail: `response_output = { "detail": { } }` → key `detail`.
- Error: HTTP status semestinya (400 validasi, 404 tidak ada, 409 konflik)
  dengan `response_output: null` dan `response_schema.response_message` terisi.
- Update memakai `PUT` (bukan PATCH); restore memakai `PATCH /{id}/restore`.
- Auth: v1 belum ada guard JWT — endpoint terbuka; cek permission tetap di FE.
  (Endpoint `/api/v1/auth/*` = follow-up.)

## Health

- `GET /api/v1/health` → 200 `{ "status": "ok" }` (tanpa envelope).

## Module definitions

- `GET /api/v1/module-definitions?status=published` → list definisi
  (pagination standar; tanpa `status` = semua).
- `GET /api/v1/module-definitions/:key` → detail satu definisi.
  (`:key` boleh mengandung `/`, mis. `mater-data/company` — FE meng-encode.)
- `POST /api/v1/module-definitions` → buat (default `status: draft`).
- `PUT /api/v1/module-definitions/:key` → ganti penuh (body `key` harus sama
  dengan path; `key` immutable).
- `DELETE /api/v1/module-definitions/:key` → hapus definisi (data records
  ikut terhapus).
- Body = `ModuleDefinition` v1 (`src/modules/generator/definitions/types.ts`):
  `version: 1`, `key`, `label`, `singularLabel`, `parent`, `routeBase`,
  `permissionKey`, `apiPlural`, `moduleType: 'crud'`, `features`, `fields`,
  `layout`, `deleteMode`, `status`.

## Records generik (`{plural}` = `apiPlural` definisi)

Bentuk record: `{ "id": 1, "<fieldCamel>": ..., "status": "active|inactive", "created_by": "...", "created_date": "YYYY-MM-DD HH:mm" }`.

- `GET /api/v1/{plural}` → list + query:
  - `search` — keyword lintas field teks (case-insensitive).
  - Filter per kriteria (nama param = nama field):
    `contains/exact/numberExact/numberMin/numberMax/dateExact/booleanExact/optionExact`
    → `{f}={value}`; `numberRange` → `{f}Min`, `{f}Max`;
    `dateRange`/`dateOverlap` → `{f}={start},{end}` (YYYY-MM-DD);
    `optionAny` → `{f}={v1},{v2}`.
  - Sort: `order={field}`, `sort={asc|desc}`.
  - Paging: `page` (1-based), `size`.
- `GET /api/v1/{plural}/:id` → detail.
- `POST /api/v1/{plural}` → create; body = nilai field (tanpa `id`/system).
  Field ber-rule `unique` yang duplikat → 409.
- `PUT /api/v1/{plural}/:id` → update penuh; 404 bila tidak ada.
- `DELETE /api/v1/{plural}/:id` → hapus; `deleteMode: soft` mengubah status
  menjadi `inactive`, `hard` menghapus permanen.
- `PATCH /api/v1/{plural}/:id/restore` → status kembali `active`
  (hanya bila `deleteMode: soft`; selain itu 409).
- `GET /api/v1/{plural}/{field}s?search=&page=&size=` → options untuk
  field option (`{field}` = nama field kebab + `s`, mis. `/users/roles`);
  response list `{label, value}[]`. Bila definisi field memakai
  `source: api` dengan endpoint custom, FE memanggil endpoint itu langsung.
- `GET /api/v1/{plural}/export` → `.xlsx` (query = filter aktif, tanpa paging;
  dibatasi 10.000 baris).
- `GET /api/v1/{plural}/bulk-template` → `.xlsx` template (header + contoh).
- `POST /api/v1/{plural}/bulk-upload` → multipart field `file` (`.xlsx`,
  maks 10 MB, maks 5.000 baris);
  response `BulkUploadResult`: `{totalRows, successCount, failedCount,
  errors: [{row, field?, message}]}` (`row` 1-based termasuk header).
  Validasi per baris meniru aturan form + cek `unique` (existing + dalam file).
