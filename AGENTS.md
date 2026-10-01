# AGENTS.md

Muse Code reads this file as project rules when it runs in this directory.

## Project

- Name: generator-module-app
- Stack: React 19 + TypeScript + Vite + Tailwind CSS 4 + TanStack Query +
  React Hook Form + axios + react-router 7. Package manager: npm.
- App ini adalah **UI-based module scaffolding generator**: wizard di
  `/generator` menghasilkan modul CRUD baru ke `src/modules/` + registrasi
  route/nav otomatis.

## Skills (baca sebelum bekerja di area terkait)

- `frontend-conventions` — token thema, spacing semantik, layout single-app,
  shared components, auth guard. Wajib untuk semua perubahan UI.
- `module-generator` — wizard/engine/registry generator, kontrak
  `GeneratorConfig`, naming, registrasi route/nav, bulk/export `.xlsx`.
- `crud-module` — pola modul CRUD (`src/modules/user/` sebagai referensi),
  API mock-first, hooks, validasi, permission, integrasi API real.

## Common Commands

- Dev: `npm run dev` (Node 22, lihat `nvm use 22`)
- Build: `npm run build` (typecheck `tsc -b` + `vite build`)
- Lint: `npm run lint` (oxlint atas `src`, `vite.config.ts`, `vite-plugin`)
- Preview: `npm run preview`

## Project Layout

- `src/app/` — `navigation.tsx` (nav statis), `router.tsx` (routes),
  `ProtectedAppShell.tsx` (shell + session user).
- `src/pages/` — Login, Dashboard, `components/` (dokumentasi shared).
- `src/modules/` — `auth/` (login mock + guard + `useAuth`), `user/`
  (referensi CRUD), `generator/` (wizard scaffolding), modul fitur lain.
- `src/shared/` — `theme/` (token thema), `lib/`, `hooks/`, `utils/`,
  `types/`, `components/` (`layout/`, `ui/`, `icons/`).
- `vite-plugin/` — plugin dev-only `POST /__api/write-module`.
- `.agents/skills/` — project skills (hasil `muse skills validate` harus
  `valid: true` tanpa diagnostics setelah diubah).

## Core Rules

- Thema: `src/shared/theme/theme.ts` satu-satunya sumber kebenaran token;
  dilarang hardcode warna/hex di komponen — pakai utility token
  (`bg-primary`, `text-muted-foreground`, `border-border`) atau
  `var(--theme-*)`.
- Spacing: class semantik `.page-padding`, `.section-gap`, `.stack-gap`,
  `.field-gap`; angka Tailwind hanya untuk penyimpangan khusus.
- File JSX berekstensi `.tsx`; komponen shared mendukung `testId`;
  `shared` tidak import dari `modules`.
- Modul CRUD standar dibuat via wizard `/generator`, bukan manual.
- Jangan edit manual blok/marker `// __GENERATOR_*__` di `router.tsx` /
  `navigation.tsx`.
- Setelah perubahan: `npm run lint` dan `npm run build`.
