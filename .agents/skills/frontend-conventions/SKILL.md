---
name: frontend-conventions
description: Konvensi frontend generator-module-app — token thema, spacing semantik, layout single-app, shared components, dan auth guard.
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

- Layout: `AppShell` + `Sidebar` + `PageHeader` + `AvatarUser` + `PageContent`
  di `src/shared/components/layout/`. Tidak ada konsep multi-app/registry.
- Navigasi statis (Dashboard/Generator/Component) di `src/app/navigation.tsx`
  + item dinamis dari definisi published (`useDynamicNavItems`); route
  statis + `DynamicModuleRoutes` + `preview/:definitionKey` di
  `src/app/router.tsx`; halaman statis di modulnya masing-masing
  (`auth/login/pages`, `dashboard/pages`, `showcase/pages` — tanpa folder
  `src/pages/`, mirror `boilerplate-fe`). Jangan tambah route/nav
  statis per modul bisnis — modul = data definisi (lihat skill
  `module-generator`).
- `Sidebar`/`AppShell` menerima `navItems` via props (bukan registry); session
  user dari `AuthProvider` (`src/app/providers`, mirror `boilerplate-fe`)
  dialirkan ke `AppShell` via `src/app/ProtectedAppShell.tsx`.

## Shared components

- File berisi JSX berekstensi `.tsx`.
- Komponen shared mendukung prop `testId?: string` → `data-testid`.
- `shared` tidak import dari `modules` (arah dependensi satu arah).
- Ikon memakai `lucide-react` (import langsung per komponen, styling via
  `className` seperti `h-4 w-4`); tidak ada set ikon SVG kustom di repo.
  Pengecualian: `SvgIcon` (`src/shared/components/ui/`) me-render string SVG
  mentah (ikon menu kustom modul dari wizard) via `dangerouslySetInnerHTML`.
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
- Sidebar memfilter `permissionKey` nav; `'*'` = wildcard akses penuh.
- Cek manual di komponen: `useAuth().can(key)`.

## Verifikasi

Setelah perubahan: `npm run lint` dan `npm run build`; perbaiki error
yang muncul sebelum selesai.
