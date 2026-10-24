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

## Alur wizard (7 langkah, `builder/` + `GeneratorPage.tsx`)

Config → Form Canvas → Live Preview → List Canvas → Detail Canvas →
Translation → Review & Generate. Navigasi Kembali/Lanjut (+
Simpan/Publish) di header Card tiap langkah. Config = Module Info (nama,
parent, tipe, permission auto dari nama, ikon) + Features saja; field
dibuat di Form Canvas via palet (validasi minimal 1 field di langkah
kanvas). Draft autosave ke localStorage tiap langkah (`builder/draft.ts`);
**Simpan sebagai Draft** atau **Publish**. Translation = preview
`en.json` otomatis (`buildModuleLocales`) + editor manual per key
(`InputField` + pencarian) untuk bahasa `id`; terisi disimpan ke
draft/definisi (`i18n.id`, key dot `"<base>..."`), kosong = fallback `en`;
dipakai Generate-to-repo untuk `i18n/id.json`. Review (langkah akhir)
tanpa editor translasi.
Publish = upsert definisi ke mock store (seed + localStorage,
persisten tahan refresh); modul `published` langsung live di navigasi
+ routes tanpa tulis file dan tanpa restart. Tombol **Buka pratinjau**
membuka `/preview/:definitionKey` (bisa untuk draft). Review memuat
**ContractPanel** (download JSON kontrak endpoint untuk BE masa depan).

## Daftar Modul (tab di `/generator`)

Tab **Daftar Modul** (`components/ModulesTab.tsx`) = listing semua definisi
(draft + published): Pratinjau (`/preview/:key`), **Edit** (muat definisi
ke Builder; publish menimpa key sama, ganti key = definisi + records lama
dihapus), **Generate ke repo**, **Hapus** (definisi + seluruh records mock
modul, konfirmasi dialog; `deleteDefinition` + `deleteModuleRecords` +
invalidate `dynamic-definitions*`/`dynamic-records*`/`dynamic-record*`).

## Generate ke repo (engine + templates + writer)

`engine/fromDefinition.ts` (`definitionToConfig`) → `generateModule(config)`
(±24 file: types, api mock-only, hooks, components, pages, validation,
permissions, index, INTEGRATION.md) + `buildRegistration(config)` →
`api/writeToRepo.ts` POST `/__api/write-module` (plugin dev-only
`vite-plugin/moduleWriter.ts`, hanya di `npm run dev`; konflik → 409 →
dialog Timpa). Tiap modul membawa `routes.tsx` (`xRoutes: RouteObject[]`)
dan `navigation.tsx` (`xNav: ModuleNavEntry`); registrasi hanya menyisipkan
satu import + satu entri (`...xRoutes,` / `xNav,`) per file, idempoten via
anchor `// __GENERATOR_IMPORTS__`/`_ROUTES__`/`_NAV_IMPORTS__`/`_NAV_ENTRIES__`
di `router.tsx`/`navigation.tsx` (`vite-plugin/moduleRegistration.ts`).
Nav digabung `buildModuleNavItems` (`shared/utils/moduleNav.ts`): tanpa
`parent` → item flat, dengan `parent.key` sama → satu group.
Batasan: tanpa `service.ts` (axios), layout kanvas/relation tak
ikut template, field relation jadi select biasa. Modul statis menutupi
versi dinamis di route sama + memakai mock-nya sendiri; duplikat nav
dicegah `mergeNavItems` (statis menang, anak grup digabung per path).

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
- `menuIcon?: {name}` — satu ikon menu (nama ikon WDS PascalCase, mis.
  `UsersGroupRounded`; divalidasi ke `shared/components/icons/names.ts`).
  Nama lucide lama di definisi tersimpan dipetakan `cleanMenuIcon`
  (`definitions/normalize.ts`), yang tak dikenal dibuang. Mapping otomatis:
  menempel di menu modul bila root, di grup parent bila ber-parent
  (grup = definisi pertama urut label yang mengaturnya). Diatur lewat
  popup `IconPickerDialog` (listing + pencarian ikon WDS, baris Ikon
  menu di Module Info, langkah Config); render via `ModuleMenuIcon`
  (`WdsIcon`, fallback `Database`), dipakai juga di `navigation.tsx` hasil
  Generate (`<WdsIcon name="…" />`).
- `permissionKey` — wajib, single value tanpa titik (mis. `region`;
  regex `^[a-z][a-z0-9_]*$`, maks 100 char). Runtime menurunkan
  `{base}.view/.create/.update/.delete/.bulk_upload/.export`.
- `features: Record<FeatureKey, boolean>` — `list/detail/create/edit/delete/
  bulkUpload/export`; hanya fitur aktif yang di-route + tombolnya tampil.
- `fields: GeneratorFieldConfig[]` — dipakai apa adanya oleh definisi:
  `name` camelCase (reserved, case-insensitive: `id`, `status`,
  `created_by`, `created_date` — kolom sistem, ditolak `validateConfig`
  + `FieldDialog`), `label`, `type` (12 tipe kontrol di
  `registry/fieldTypes.ts`, semuanya padanan komponen WDS: `textField`,
  `numberField` (InputField, format angka), `textareaField`, `dateField`,
  `dateRangeField`, `selectField`, `selectMultipleField`,
  `radioGroupField`, `checkboxField`, `checkboxGroupField`,
  `switchField` (Toggle), `fileUploadField`). Tipe lama `passwordField`,
  `currencyField`, `colorField`, `editorField`, `formArrayField` sudah
  dihapus; definisi tersimpan lama dimigrasi di `normalizeConfig`
  (`parser.ts` → `LEGACY_FIELD_TYPES`: password/color → text, currency →
  number, editor → textarea, form array → field dibuang)), `rules` string
  (`required|min:3|max:100|withoutemoticon`, 9 rule di
  `registry/validationRules.ts`), `source`
  (`none/mockStatic/mockPagingInfinityScroll/api`), `options`/`api`,
  `sortable` (default true), `filterable`
  (file default false), `filterCriteria`
  (12 kriteria di `registry/filterCriteria.ts`, opsi valid tergantung
  tipe field), `placeholder` (override auto), `disabled`, `rows`
  (textarea), `accept` (upload),
  `componentProps` (props FormItem + komponen per tipe:
  `formItem/text/textarea/select/selectMultiple/date/
  dateRange/radio/checkbox/checkboxGroup/switch/upload` —
  `textField` dan `numberField` berbagi key `text`;
  tri-state — tak di-set = perilaku lama; prune + sanitasi di
  `componentProps.ts`, dipakai `normalizeConfig`). `upload.multiple`
  = multi-file (nilai `File[]`, payload nama join koma);
  `array` = `size/addLabel/editorTitle/emptyTitle/emptyDescription/
  maxRows/lockFirstRow` (min via rules `min:N`). `lockFirstRow` =
  baris pertama selalu ada (otomatis dibuat) dan tidak bisa dihapus.
- `configToDefinition(config, { status, deleteMode, layout })`
  (`definitions/normalize.ts`, murni & Node-safe) membangun definisi:
  `key` = path kebab (`mater-data/region`), `label`/`singularLabel`,
  `routeBase`, `apiPlural`, `deleteMode` default `soft`, `layout` hasil
  `normalizeLayout` (form grid 12 kolom `{field,order,colSpan}` + tabel
  `{order,hidden}`).
- `validateDefinition` (`definitions/validate.ts`) wajib 0 issues sebelum
  publish; Review + `handlePublish` sama-sama menjalankannya.

## Canvas layout (`@dnd-kit`, drag-drop hanya di dalam `PageContent`)

- **Form Canvas** (`builder/FormBuilderCanvas.tsx`): palet field (18
  macam incl. Number/Currency/Color/Editor/Array/Relation, bisa dicari
  via kotak pencarian)/section/divider → kanvas
  12 kolom (`runtime/grid.ts`) + Drawer properti (tanpa Live Preview —
  pratinjau pindah ke langkah Live Preview). Info step memakai Alert.
  Kartu kanvas WYSIWYG: render `FormItem` asli via
  `runtime/fieldRenderer.tsx` (satu renderer dengan form runtime),
  tanpa tombol aksi — klik memilih, drag hanya via gagang
  (`GripIcon`, strip kiri). Drop palet ke posisi (atas kartu =
  insert-before, tanah kosong = append). Dialog `FieldDialog` hanya
  untuk tambah baru; semua edit lewat Drawer Properti (non-modal,
  mengikuti seleksi, `FieldForm` terkontrol: label, name editable
  + rename remap layout, type, tampilan, Props FormItem +
  Props komponen per tipe, sub-fields array, tabel&filter,
  validasi, source/options, lebar `colSpan`, hapus).
  `labelWidth` hanya internal (renderer/template), disembunyikan
  dari UI. Item form `{kind: field|section|divider}`; id
  section/divider tidak boleh bertabrakan dengan nama field.
- **Live Preview** (`builder/TestDataPanel.tsx`): form asli hasil
  kanvas (`DynamicForm` tombol di footer Card via `actionsInFooter`);
  submit menambah data contoh lalu otomatis lanjut ke List Canvas.
  Data dipakai memvalidasi tampilan List/Detail.
- **List Canvas** (`builder/ListBuilderCanvas.tsx`): cerminan halaman
  list asli tanpa tab — Card judul + tombol Create/Bulk/Export (demo
  toast), `TableToolbar` fungsional (search + filter drawer ke data
  contoh via `filtering.ts`), tabel sungguhan (kolom sistem Created
  By/Created Date/Status ikut bisa diseret + klik header Aksi membuka
  drawer aksi baris; kolom aksi bisa kiri/kanan via
  `actionPosition`). Header tanpa ikon drag (seret dari area mana pun,
  info via tooltip + hint); resize lebar dinamis via garis tepi antar
  header (kursor ew-resize, komit live, clamp 40–1200). Klik header =
  highlight satu kolom penuh + drawer properti kolom:
  tampil/sortable/filterable+kriteria/lebar px; tombol Pengaturan
  tabel (ikon gear, di atas) = drawer props tabel: tombol list
  bulk/export + `TableDisplayProps`: dense/fixedLayout/stickyHeader/
  stickyAction/hidePagination/hideTotalRecords/actionPosition,
  tersimpan di `layout.table.props` (kolom sistem selalu ada di
  `order`, tak bisa disembunyikan). Sort header dimatikan di kanvas
  (klik = pilih). State via `runtime/layoutOps.ts` (`moveTableColumn`,
  `toggleTableColumn`, `setTableWidth`, `setTableProps`). Runtime
  (`DynamicTable`) + kode statis (bake literal di template, relasi
  sub→none, urutan/sembunyi kanvas tak ikut template) menghormati
  props yang sama.
- **Detail Canvas** (`builder/DetailBuilderCanvas.tsx`): kartu detail
  langsung fullwidth (tanpa tab, tanpa History) — baris diseret dari
  area mana pun (tanpa grip), klik baris = drawer properti
  (tampil/fullWidth/noDivider/heading via `layout.detail.props`),
  tombol Pengaturan kartu = drawer props `DetailCard`
  (`layout.detail.card`: judul + collapsible). Baris Status/Created
  selalu di ujung (cermin runtime `buildDetailRows`, dinamis saja).
- State antar langkah = `ModuleLayout` apa adanya; mutasi via
  `runtime/layoutOps.ts` (termasuk `setTableWidth`, `moveDetail`,
  `toggleDetail`).
- Jangan ubah `PageHeader`/`SideNavbar`; kanvas hidup di dalam
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

- `definitions/` + `parser.ts` + `naming.ts` + `componentProps.ts` +
  `engine/fieldGenerator.ts` murni dan Node-safe (bisa di-probe via
  Node/jiti); hanya client API runtime + komponen UI yang bergantung
  Vite/browser.
- Jangan hardcode nama modul contoh (`Region`) di kode generik.
- Modul statis di `src/modules/` hanya yang non-CRUD/shell (`auth/`,
  `dashboard/`, `showcase/`, `generator/`) — modul bisnis baru =
  definisi baru, bukan folder baru.
- Verifikasi generator: `npm run verify:generator`
  (`scripts/verify-generator/`: asersi emisi template + generate
  modul kaya ke dir tmp + `tsc`, lalu bersih). E2E browser
  (puppeteer, butuh dev/preview server) tetap skrip sekali-pakai
  di luar repo.

## Komponen field baru (shared)

- `FileUpload` — state initial → progress simulasi (mock-only)
  → uploaded (nama + ukuran + hapus per file); `multiple` menambah
  (append) dan menampilkan daftar; testid `data-testid` mengikuti
  pola field lain.
