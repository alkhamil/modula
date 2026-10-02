---
name: frontend-conventions
description: Konvensi frontend generator-module-app — token thema, spacing semantik, layout single-app, shared components, dan auth guard.
---

# Frontend Conventions

Aturan wajib saat menulis atau mengubah kode frontend di repo ini
(React 19 + TypeScript + Vite + Tailwind CSS 4 + TanStack Query + axios).

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
  `src/app/router.tsx`; halaman di `src/pages/`. Jangan tambah route/nav
  statis per modul bisnis — modul = data definisi (lihat skill
  `module-generator`).
- `Sidebar`/`AppShell` menerima `navItems` via props (bukan registry); session
  user dari `AuthProvider` (`src/modules/auth`) dialirkan ke `AppShell` via
  `src/app/ProtectedAppShell.tsx`.

## Shared components

- File berisi JSX berekstensi `.tsx`.
- Komponen shared mendukung prop `testId?: string` → `data-testid`.
- `shared` tidak import dari `modules` (arah dependensi satu arah).
- Ikon SVG di `src/shared/components/icons/` memakai token thema /
  `currentColor`, bukan warna hardcode.
- Referensi pola yang benar adalah komponen di `src/shared/components/`
  milik repo ini.

## Auth & permission

- Login/logout di `src/modules/auth` memakai BE (`POST /api/v1/auth/login`
  → JWT + permission list; `USE_MOCK` di `api/mock.ts` = fallback mock,
  akun cermin seed di `api/mockUsers.ts`). Token tersimpan di localStorage
  key `auth_token` dan dikirim via interceptor axios
  (`Authorization: Bearer`).
- Guard ganda: `RequireAuth` (belum login → redirect `/login`) dan
  `PermissionGate` (baca `handle.requiredPermission` route → 403 bila key
  tidak dimiliki).
- Sidebar memfilter `permissionKey` nav; `'*'` = wildcard akses penuh.
- Cek manual di komponen: `useAuth().can(key)`.

## Verifikasi

Setelah perubahan: `npm run lint` dan `npm run build` (tambah
`cd backend && npm test` bila menyentuh BE); perbaiki error yang muncul
sebelum selesai.
