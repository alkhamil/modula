# __PROJECT_NAME__

Project React hasil wizard **Modula**: shell aplikasi (router, navigasi, auth mock, guard permission), komponen design system di `src/shared/components`, dan fitur auth yang dipilih saat project dibuat. Mock-only (tanpa backend) dengan lapisan `api/` yang siap diganti ke backend nyata.

## Menjalankan

Butuh Node.js **__PROJECT_NODE__** (lihat `.nvmrc`; dengan nvm cukup `nvm use`).

```bash
cp .env.example .env
npm install
npm run dev
```

Login demo (mock): `admin` / `admin123`.

## Struktur

- `src/app/` — `router.tsx`, `navigation.tsx`, `moduleLocales.ts`, `ProtectedAppShell.tsx`, `providers/` (sesi auth + guard).
- `src/modules/<modul>/` — satu folder per fitur/modul bisnis (`pages/`, `components/`, `api/`, `hooks/`, `types/`, `validation/`, `i18n/`).
- `src/shared/` — design system (`components/ui`, `layout`, `icons`), `theme`, `hooks`, `lib`, `utils`, `types`, `i18n`.

## Beralih ke backend nyata

Tiap modul memakai `api/resolver.ts` dengan saklar `USE_MOCK` di `api/mock.ts`. Set ke `false` untuk memakai `api/service.ts` (axios, base URL dari `VITE_API_BASE_URL`).
