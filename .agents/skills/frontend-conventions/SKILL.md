---
name: frontend-conventions
description: Konvensi frontend modula — token thema, spacing semantik, layout single-app, shared components, dan auth guard.
---

# Frontend Conventions

Aturan wajib saat menulis atau mengubah kode frontend di repo ini
(React 19 + TypeScript + Vite + Tailwind CSS 4 + TanStack Query, mock-only tanpa backend).

## Thema (sumber kebenaran tunggal)

- `src/shared/theme/theme.ts` adalah satu-satunya sumber kebenaran token thema
  (light/dark). Nilai token diterapkan saat runtime sebagai CSS variables
  (`--theme-*`) lewat `applyTheme()`.
- Utility Tailwind seperti `bg-primary`, `text-foreground`,
  `text-muted-foreground`, `border-border` otomatis mengikuti thema aktif
  (dipetakan di `src/index.css` via `@theme inline`).
- Semua shared components **wajib** memakai token thema — **dilarang** hardcode
  warna/hex (mis. `bg-blue-600`, `#2563eb`) di komponen. Bila butuh warna baru,
  tambahkan token di `theme.ts` (light + dark) dan fallback `:root` di
  `src/index.css`, jangan menaruh hex di komponen.
- `ThemeCustomizer` (floating button) mengubah mode/warna primary/radius saat
  runtime via `useTheme()` (`updateOverrides`/`resetOverrides`, tersimpan di
  localStorage). Tampilkan lewat prop `showThemeCustomizer` di `AppShell`.

## Spacing semantik

- Token spacing di `theme.ts` (`pagePadding`, `cardPaddingX/Y`, `sectionGap`,
  `stackGap`, `fieldGap`) dipakai via class semantik di `src/index.css`:
  `.page-padding`, `.section-gap`, `.stack-gap`, `.field-gap`.
- Angka Tailwind (`p-4`, `gap-6`) hanya untuk kasus khusus yang memang
  menyimpang dari standar.

## Layout single-app

- Layout: `AppShell` + `SideNavbar` + `PageHeader` + `Profile` + `PageContent`
  di `src/shared/components/layout/`. Tidak ada konsep multi-app/registry.
- `src/app/navigation.tsx` + `router.tsx` hanya shell (daftar `moduleNavEntries`,
  guard, 404, catch-all dinamis); semua modul (dashboard, generator, showcase,
  user, role, settings) dan hasil Generate ke repo membawa
  `routes.tsx` (`xRoutes: RouteObject[]`) + `navigation.tsx` (`xNav:
  ModuleNavEntry`) sendiri — host cukup import lalu `...xRoutes,` /
  `xNav,` di `router.tsx` / `moduleNavEntries`. Item dinamis dari definisi published (`useDynamicNavItems`); route
  statis + `DynamicModuleRoutes` + `preview/:definitionKey` di
  `src/app/router.tsx`; halaman statis di modulnya masing-masing
  (`auth/login/pages`, `dashboard/pages`, `showcase/pages` — tanpa folder
  `src/pages/`, mirror `boilerplate-fe`). Jangan tambah route/nav
  statis per modul bisnis — modul = data definisi (lihat skill
  `module-generator`).
- `SideNavbar`/`AppShell` menerima `navItems` via props (bukan registry); session
  user dari `AuthProvider` (`src/app/providers`, mirror `boilerplate-fe`)
  dialirkan ke `AppShell` via `src/app/ProtectedAppShell.tsx`.

## Shared components

- File berisi JSX berekstensi `.tsx`.
- Komponen shared mendukung prop `testId?: string` → `data-testid`.
- `shared` tidak import dari `modules` (arah dependensi satu arah).
- Token desain berasal dari **WDS** (`tokens/tokens.json`, ekspor variable Figma):
  `npm run tokens:build` (`scripts/build-wds-tokens.mjs`) menghasilkan
  `src/shared/theme/wds/tokens.generated.css` (primitif `--wds-*`, semantic
  light/dark mengikuti `data-theme`, token Size per `data-wds-size` xs–xl),
  `button.generated.css` (matriks hierarchy × state), `selection.generated.css`
  (Checkbox/RadioButton/Toggle: style × state; dasar CSS di `selection.css`) dan `wds.generated.ts`
  (hex semantic → `theme.ts` memetakan token legacy `bg-primary`, dst.). Jangan
  edit file `*.generated.*`; ubah `tokens.json` lalu jalankan ulang. Komponen WDS
  hanya menetapkan atribut data (`data-hierarchy`, `data-wds-size`, ...), gaya di CSS
  (`wds/<komponen>.css`, @layer components; CSS tulisan tangan memakai token
  semantic langsung: feedback, overlay, table, surface, upload, layout, nav, content, controls,
  inputs, surfaces2, data). Nilai warna kosong hasil ekspor
  (`#NaNNaNNaN`) dibaca sebagai `transparent`.
- Penamaan komponen mengikuti nama di Figma WDS (lihat AGENTS.md); komponen baru/yang
  diganti ke WDS memakai nama WDS-nya, bukan akhiran `Field`.
- Dokumentasi komponen (pengganti Storybook) ada di `/components` (menu Docs):
  data teknis `ComponentDoc` di `src/modules/showcase/docs/content/<komponen>.ts`
  (didaftarkan di `docs/registry.ts`) + semua kalimatnya di
  `showcase/i18n/{en,id}.json` bawah `docs.<slug>` (summary, figma.<id>.note,
  examples.<id>, props.<id>, tokens.<--var>, behavior[], accessibility[],
  guidelines.do/dont) — wajib dua bahasa; slug dokumen tidak boleh sama dengan kunci
  bersama (`labels`, `sections`, `nav`, ...; dijaga `registry.ts`); dirender `DocPage` — playground, pemetaan
  properti Figma → props, contoh + kode (dibuat dari props yang sama), matriks
  state (dipaksa via `data-wds-state`), tabel props, token (nilai live), behavior,
  aksesibilitas. Setiap komponen yang dibuat/diubah mengikuti Figma WDS wajib
  punya dokumen ini; properti & behavior harus dicocokkan dengan node Figma dan
  token (`tokens/tokens.json`).
- Ikon memakai **WDS** 5 gaya (Outline, Bold, Bold Duotone, Broken, Line Duotone; `src/shared/components/icons/`), tanpa
  `lucide-react`. Pakai statis: `import { Pen, TrashBinTrash } from
  '<…>/shared/components/icons'` (styling via `className` `h-4 w-4`, warna
  ikut `text-*` karena `currentColor`). Nama dinamis (ikon menu dari definisi,
  picker): `<WdsIcon name="Database" />` (dimuat lazy per kategori;
  `variant` = `outline` (default) | `bold` | `bold-duotone` | `broken` | `line-duotone`). Ikon baru
  di app: tambahkan ke `CURATED` di `scripts/build-wds-icons.mjs` lalu
  `npm run icons:build` (file `core.tsx`, `wds/*.tsx`, `wds/index.json` hasil
  generate — jangan edit manual; sumber SVG `src/assets/icons/wds/`, diunduh
  `scripts/download-wds-icons.py`). Pengecualian: `SvgIcon`
  (`src/shared/components/ui/`) me-render string SVG mentah via
  `dangerouslySetInnerHTML`.
- Referensi pola yang benar adalah komponen di `src/shared/components/`
  milik repo ini.

## Auth & permission

- Login/logout mock di modul `src/modules/auth/login` (`api/` =
  service/mock/resolver/mutations, akun demo inline di `api/mock.ts`; response login
  membawa permission list user). Sesi tersimpan di localStorage
  (`auth_token`, `auth_user`, `permissions`).
- Guard ganda: `RequireAuth` (belum login → redirect `/login`) dan
  `PermissionGate` (baca `handle.requiredPermission` route statis → 403 bila
  key tidak dimiliki; halaman dinamis dijaga `RequireDynamicPermission`).
- SideNavbar memfilter `permissionKey` nav; `'*'` = wildcard akses penuh.
- Cek manual di komponen: `useAuth().can(key)`.

## Verifikasi

Setelah perubahan: `npm run lint` dan `npm run build`; perbaiki error
yang muncul sebelum selesai.
