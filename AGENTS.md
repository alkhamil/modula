# AGENTS.md

Muse Code reads this file as project rules when it runs in this directory.

## Project

- Name: generator-module-app
- Stack: React 19 + TypeScript + Vite + Tailwind CSS 4 + TanStack Query +
  React Hook Form + axios + react-router 7. Package manager: npm.
- Backend in-repo: `backend/` (NestJS + TypeORM + MySQL, lihat
  `backend/README.md`).
- App ini adalah **dynamic module platform**: tidak ada kode per modul di
  `src/modules/` (isinya hanya `auth/` + `generator/`). Modul bisnis
  (users, orders, mater-data/*, …) didefinisikan sebagai data
  `ModuleDefinition v1`, disimpan di BE, dan di-render generik saat runtime.
  Wizard `/generator` membuat definisi lewat publish (Draft/Publish),
  bukan dengan menulis file.

## Skills (baca sebelum bekerja di area terkait)

- `frontend-conventions` — token thema, spacing semantik, layout single-app,
  shared components, auth guard. Wajib untuk semua perubahan UI.
- `module-generator` — wizard generator (info → features → fields →
  layout canvas → review → publish), `ModuleDefinition v1`, naming,
  runtime render (routes/nav dinamis), bulk/export `.xlsx`.
- `crud-module` — pola modul CRUD dinamis: bentuk definisi, runtime generik
  (`Dynamic*`), kontrak API records, seeds, mock vs API real.

## Common Commands

- Dev FE: `npm run dev` (Node 22, lihat `nvm use 22`)
- Build FE: `npm run build` (typecheck `tsc -b` + `vite build`)
- Lint: `npm run lint` (oxlint atas `src`, `backend/src`, `vite.config.ts`)
- Preview: `npm run preview`
- Dev BE: `cd backend && npm run start:dev` (butuh MySQL via `compose.yaml`)
- Test BE: `cd backend && npm test` (`tsc` + `node --test`)

## Project Layout

- `src/app/` — `navigation.tsx` (nav statis: Dashboard/Generator/Component
  + `useDynamicNavItems` dari definisi), `router.tsx` (routes statis +
  `DynamicModuleRoutes` + `preview/:definitionKey`),
  `ProtectedAppShell.tsx` (shell + session user).
- `src/pages/` — Login, Dashboard, `components/` (dokumentasi shared).
- `src/modules/` — hanya `auth/` (login mock + guard + `useAuth`) dan
  `generator/` (`definitions/` = `ModuleDefinition v1` murni + Node-safe,
  `runtime/` = render generik + client API + mock, `components/` +
  `pages/` = wizard, `parser.ts`/`naming.ts`/`registry/` = bantu wizard).
- `src/shared/` — `theme/` (token thema), `lib/`, `hooks/`, `utils/`,
  `types/`, `components/` (`layout/`, `ui/`, `icons/`).
- `backend/` — NestJS: `module-definitions` CRUD + API records generik
  `/:plural` + export/bulk `.xlsx`; `seeds/` = sumber kanonis 10 definisi
  modul + records (juga dipakai mock FE).
- `docs/backend-contract.md` — kontrak API FE↔BE.
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
- Modul CRUD baru dibuat via wizard `/generator` (publish Draft/Publish),
  bukan dengan menulis folder modul manual — `src/modules/` tetap hanya
  `auth/` + `generator/`.
- `definitions/` (types/normalize/validate/configToDefinition/parents) murni
  dan Node-safe: dilarang dependensi Vite/browser (`import.meta.glob`,
  CSS, komponen) — hanya `definitionsApi.ts`/`recordsApi.ts` yang boleh
  memakai `import.meta.glob` untuk seed mock.
- Setelah perubahan: `npm run lint` dan `npm run build` (+ `npm test` di
  `backend/` bila menyentuh BE).
