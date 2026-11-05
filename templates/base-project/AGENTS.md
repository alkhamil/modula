# AGENTS.md

Aturan project untuk coding agent (dan developer) di project hasil Modula.

## Project

- Stack: React 19 + TypeScript + Vite + Tailwind CSS 4 + TanStack Query + React Hook Form + react-router 7 + i18next. Package manager: npm.
- Mock-only: tanpa backend. Data dari modul `api/mock.ts`; saklar `USE_MOCK` per aksi di `api/resolver.ts`.
- Komponen UI (design system WDS) ada di `src/shared/components/{ui,layout,icons}` dan **disalin ke project ini** — boleh diubah langsung. Nama komponen mengikuti WDS (`InputField`, `RadioButton`, `SideNavbar`, ...). Dilarang memakai paket ikon pihak ketiga; ikon dari `shared/components/icons`.

## Struktur

- `src/app/` — `router.tsx`, `navigation.tsx`, `moduleLocales.ts`, `ProtectedAppShell.tsx`, `project.config.ts`, `providers/` (sesi auth, `RequireAuth`, `PermissionGate`).
- `src/modules/<modul>/` — satu folder per modul: `pages/`, `components/`, `api/` (service + mock + resolver + mutations), `hooks/`, `types/`, `validation/`, `i18n/`, `routes.tsx`, `navigation.tsx`. Parent-child: `src/modules/<parent>/<child>/`.
- `src/shared/` — `components`, `theme`, `hooks`, `lib`, `utils`, `types`, `i18n`, `constants`.

## Aturan

- Arah dependensi: `modules` → `shared`. `shared` tidak import dari `modules`.
- Registrasi modul baru lewat anchor di `router.tsx` (`// __GENERATOR_IMPORTS__`, `// __GENERATOR_ROUTES__`), `navigation.tsx` (`// __GENERATOR_NAV_IMPORTS__`, `// __GENERATOR_NAV_ENTRIES__`), dan `moduleLocales.ts` (`// __LOCALE_IMPORTS__`, `// __LOCALES_EN__`, `// __LOCALES_ID__`). Jangan hapus anchor.
- Warna/radius/spacing hanya dari token (`bg-primary`, `text-muted-foreground`, `.page-padding`, `.stack-gap`, `.field-gap`); dilarang hardcode hex.
- Semua teks lewat i18n (en + id); elemen penting punya `testId` / `data-testid` berpola `<modul>-<elemen>`.
- Setelah perubahan: `npm run typecheck` dan `npm run build`.
