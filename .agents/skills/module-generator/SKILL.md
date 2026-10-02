---
name: module-generator
description: Memakai dan merawat wizard generator modul dinamis di /generator — alur publish definisi, ModuleDefinition v1, canvas layout, dan runtime render.
---

# Module Generator

Repo ini tidak punya kode per modul — modul bisnis adalah data
`ModuleDefinition v1` yang di-render generik saat runtime. Wizard di route
`/generator` (`src/modules/generator/`) adalah cara membuat modul baru.
Pakai skill ini saat user meminta modul baru, mengubah wizard, menambah
tipe field/fitur/validasi, atau mengubah cara definisi di-render.

## Alur wizard (6 langkah, `builder/` + `GeneratorPage.tsx`)

Config → Form Canvas → Test Data → List Canvas → Detail Canvas →
Review & Generate. Draft autosave ke localStorage tiap langkah
(`builder/draft.ts`); **Simpan sebagai Draft** atau **Publish**.
Publish = upsert definisi ke mock store (seed + localStorage,
persisten tahan refresh); modul `published` langsung live di navigasi
+ routes tanpa tulis file dan tanpa restart. Tombol **Buka pratinjau**
membuka `/preview/:definitionKey` (bisa untuk draft). Review memuat
**ContractPanel** (download JSON kontrak endpoint untuk BE masa depan).

## GeneratorConfig → ModuleDefinition v1

`src/modules/generator/types.ts` + `definitions/`:

- `parentName: string | null` — null = root; selain itu path kebab
  (`mater-data`, nested `a/b`). Dropdown parent diisi dari parent definisi
  yang sudah terdaftar (`parentOptionsFromDefinitions`) + opsi `(root)` dan
  `+ Parent baru…` (maks 50 char, regex `^[a-zA-Z0-9 /_-]*$`).
- `moduleName` — nama bisnis; `naming.ts` menurunkan `entity`,
  `entityPlural`, `routeBase` (parent + plural, mis.
  `mater-data/companies`), `apiPlural` flat (`companies`).
- `type: 'crud'` — registry di `registry/moduleTypes.ts`.
- `permissionKey` — wajib, single value tanpa titik (mis. `region`;
  regex `^[a-z][a-z0-9_]*$`, maks 100 char). Runtime menurunkan
  `{base}.view/.create/.update/.delete/.bulk_upload/.export`.
- `features: Record<FeatureKey, boolean>` — `list/detail/create/edit/delete/
  bulkUpload/export`; hanya fitur aktif yang di-route + tombolnya tampil.
- `fields: GeneratorFieldConfig[]` — dipakai apa adanya oleh definisi:
  `name` camelCase, `label`, `type` (13 tipe kontrol di
  `registry/fieldTypes.ts`), `rules` string (`required|min:3|max:100|
  withoutemoticon`, 9 rule di `registry/validationRules.ts`), `source`
  (`none/mockStatic/mockPagingInfinityScroll/api`), `options`/`api`,
  `sortable` (default true), `filterable`, `filterCriteria` (12 kriteria
  di `registry/filterCriteria.ts`, opsi valid tergantung tipe field).
- `configToDefinition(config, { status, deleteMode, layout })`
  (`definitions/normalize.ts`, murni & Node-safe) membangun definisi:
  `key` = path kebab (`mater-data/region`), `label`/`singularLabel`,
  `routeBase`, `apiPlural`, `deleteMode` default `soft`, `layout` hasil
  `normalizeLayout` (form grid 12 kolom `{field,order,colSpan}` + tabel
  `{order,hidden}`).
- `validateDefinition` (`definitions/validate.ts`) wajib 0 issues sebelum
  publish; Review + `handlePublish` sama-sama menjalankannya.

## Canvas layout (`@dnd-kit`, drag-drop hanya di dalam `PageContent`)

- **Form Canvas** (`builder/FormBuilderCanvas.tsx`): palet field/section/
  divider → kanvas 12 kolom (`runtime/grid.ts`) + panel properti
  (`colSpan`, required, label section) + preview live. Item form
  `{kind: field|section|divider}`; id section/divider tidak boleh
  bertabrakan dengan nama field.
- **Test Data** (`builder/TestDataPanel.tsx`): tambah data contoh lewat
  form asli hasil kanvas; dipakai untuk memvalidasi tampilan List/Detail.
- **List Canvas** (`builder/ListBuilderCanvas.tsx`): susun + show/hide
  kolom, atur lebar kolom px (`widths`, clamp 40–1200 di normalize).
- **Detail Canvas** (`builder/DetailBuilderCanvas.tsx`): susun + show/hide
  baris detail (read-only v1, `buildDetailRows`) — tidak mewarisi layout
  form lagi.
- State antar langkah = `ModuleLayout` apa adanya; mutasi via
  `runtime/layoutOps.ts` (termasuk `setTableWidth`, `moveDetail`,
  `toggleDetail`).
- Jangan ubah `PageHeader`/`Sidebar`; kanvas hidup di dalam
  `PageContent` wizard saja.

## Render runtime (routes/nav dinamis)

- `runtime/DynamicRoutes.tsx` — `DynamicModuleRoutes` (`useRoutes` dari
  definisi `published`: list/create/view/edit; host route WAJIB `path: '*'`,
  tanpa match → redirect `/not-found`) + 4 halaman `preview/:definitionKey[/
  create|/:recordId/view|/:recordId/edit]` (draft & published). Guard
  dinamis via `RequireDynamicPermission` per halaman (match `useRoutes`
  dalam tak terlihat `PermissionGate`); breadcrumb halaman dinamis kosong
  (judul dari menu sidebar).
- `runtime/dynamicNav.tsx` — `buildDynamicNavItems`: root jadi item flat,
  ber-parent jadi group (`mater-data` → `Mater Data`); digabung statis di
  `ProtectedAppShell` (`[...navItems, ...dynamicNavItems]`).
- `runtime/DynamicListPage/Table/Form/FormPages/BulkUploadDialog` +
  `filtering.ts`/`validation.ts`/`mutations.ts`/`bulk.ts` — perilaku CRUD
  generik 1:1 dengan pola modul lama (search keyword, filter kolom,
  sort, paging, soft/hard delete + restore, bulk, export).
- `src/app/router.tsx` + `src/app/navigation.tsx` hanya berisi shell
  statis (Dashboard/Generator/Component, login, 404) — jangan tambah
  route/nav statis per modul bisnis.

## Bulk upload & export

- Format file selalu Excel `.xlsx` via `shared/utils/excel.ts` (+ `xlsx`).
- Bulk: tombol digate `{base}.bulk_upload`, dialog upload + unduh template +
  validasi per baris (termasuk cek `unique` existing + dalam file).
- Export: tombol digate `{base}.export`, unduh `.xlsx` sesuai filter aktif;
  mock list + export memakai satu helper filter agar konsisten.
- Batas mock: 10000 baris export, 5000 baris bulk (cermin batas BE lama).

## Batasan arsitektur

- `definitions/` + `parser.ts` + `naming.ts` murni dan Node-safe (bisa
  di-probe via Node/jiti); hanya client API runtime + komponen UI yang
  bergantung Vite/browser.
- Jangan hardcode nama modul contoh (`Region`) di kode generik.
- `src/modules/` tetap hanya `auth/` + `generator/` — modul baru =
  definisi baru, bukan folder baru.
