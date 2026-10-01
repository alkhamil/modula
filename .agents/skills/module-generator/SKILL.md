---
name: module-generator
description: Memakai dan merawat UI wizard generator scaffolding modul CRUD di /generator — konfigurasi, naming, registrasi route/nav, dan engine.
---

# Module Generator

Repo ini punya UI wizard scaffolding modul CRUD di route `/generator`
(`src/modules/generator/`). Pakai skill ini saat user meminta membuat modul
baru lewat generator, mengubah perilaku generator, atau menambah tipe
field/fitur/validasi baru.

## Alur wizard

Info modul → Features → Fields → Review → Generate. Klik Generate menulis
file langsung ke `src/modules/` + mendaftarkan routes & navigasi otomatis
(via dev-server `npm run dev`); layar output tetap menampilkan preview +
copy/download per file sebagai fallback.

## GeneratorConfig (single source of truth)

`src/modules/generator/types.ts`:

- `parentName: string | null` — null/string kosong = root
  (`src/modules/{module}/`); selain itu
  `src/modules/{parent-kebab}/{module}/` (mendukung nested `a/b`).
  Dropdown parent diisi direktori parent yang ada (terdeteksi build-time via
  `import.meta.glob` marker `permissions.ts` di `parentModules.ts`) +
  opsi `(root)` dan `+ Parent baru…` (normalisasi kebab-case, maks 50 char,
  regex `^[a-zA-Z0-9 /_-]*$`).
- `moduleName` — nama bisnis; generator menurunkan `Region`, `RegionList`,
  `RegionForm`, `useRegion`, `regionService`, dst (lihat `naming.ts`:
  `toKebabCase`/`toPascalCase`/`toCamelCase`/plural).
- `type: 'crud'` — registry di `registry/moduleTypes.ts` (extensible).
- `permissionKey` — wajib, single value tanpa titik (mis. `region`,
  `audit_trail`; regex `^[a-z][a-z0-9_]*$`, maks 100 char). Generator
  menurunkan `{base}.view/.create/.update/.delete/.bulk_upload/.export`.
- `features: Record<FeatureKey, boolean>` — `list/detail/create/edit/delete/
  bulkUpload/export`; hanya fitur terpilih yang di-generate.
- `fields: GeneratorFieldConfig[]` — `name` camelCase, `label`, `type`
  (13 tipe di `registry/fieldTypes.ts`), `rules` string
  (`required|min:3|max:100|withoutemoticon`, 9 rule di
  `registry/validationRules.ts`), `source`
  (`none/mockStatic/mockPagingInfinityScroll/api`), `options`/`api`,
  `sortable` (default true), `filterable` (default true kecuali
  password/file), `filterCriteria` (12 kriteria di
  `registry/filterCriteria.ts`, opsi valid tergantung tipe field).

## Registrasi route & nav

- `engine/registration.ts` (Node-safe, murni string) membangun
  `ModuleRegistration` dari config; dev-server menyisipkannya idempoten ke
  `src/app/router.tsx` dan `src/app/navigation.tsx` pada anchor
  `// __GENERATOR_IMPORTS__`, `// __GENERATOR_ROUTES__`,
  `// __GENERATOR_NAV_ITEMS__` (path yang sudah ada dilewati).
- Route list/detail → `{base}.view`, create → `{base}.create`,
  edit → `{base}.update`, lengkap dengan breadcrumb
  `handle: { breadcrumb, requiredPermission }`.
- Modul ber-parent masuk group navigasi bermarker
  `// __GENERATOR_PARENT <path>__` (dibuat bila belum ada; satu level group).
- **Jangan edit manual** blok/marker generated — sisipan mengandalkan
  formatnya.
- `routeBase` = parent + plural module (`mater-data` + `company` →
  `mater-data/companies`); URL API tetap flat (`/api/v1/companies`).

## Tulis ke repo (dev-only)

- Endpoint `POST /__api/write-module` (`vite-plugin/moduleWriter.ts`,
  `apply: 'serve'` saja): path hanya di dalam `src/modules/` (escape
  `..`/absolute → 400), file existing tanpa `overwrite` → 409 → UI tampil
  dialog konfirmasi timpa, body maks 10 MB.
- Endpoint tidak ada (production/preview) → banner warning + fallback
  copy/download manual.

## Bulk upload & export

- Format file selalu Excel `.xlsx` via `shared/utils/excel.ts` (+ `xlsx`).
- Bulk: tombol digate `{base}.bulk_upload`, dialog upload + unduh template +
  validasi per baris (`validation/<mod>BulkValidation.ts`, termasuk cek
  `unique` existing + dalam file).
- Export: tombol digate `{base}.export`, unduh `.xlsx` sesuai filter aktif
  (`hooks/use<Mod>Export.ts`); mock memakai satu helper
  `filter<EntityPlural>Records` untuk list + export.

## Batasan arsitektur

- Parser/engine/registration murni dan Node-safe (bisa di-unit-test via
  Node); hanya `parentModules.ts` dan komponen UI yang bergantung Vite/browser.
- Jangan hardcode nama modul contoh (`Region`) di engine/template.
- Setiap modul hasil generate membawa `INTEGRATION.md` berisi tabel
  permission keys dan langkah integrasi API real.
