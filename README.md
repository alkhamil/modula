# generator-module-app

React 19 + TypeScript + Vite + Tailwind CSS 4 + TanStack Query + axios.

## Mulai

```bash
nvm use 22
npm install
npm run dev
```

## Struktur

```
src/
├── main.tsx            (entry)
├── App.tsx             (QueryClient + Theme + Toast + Router providers)
├── index.css           (Tailwind v4, utility thema via @theme inline)
├── app/
│   ├── navigation.tsx       (nav statis single-app)
│   ├── ProtectedAppShell.tsx (shell + RequireAuth + user/permissions)
│   └── router.tsx           (AuthProvider → shell → PermissionGate → pages)
├── pages/              (Login, Dashboard, components/ — dokumentasi shared)
├── modules/
│   ├── auth/           (login/logout mock + guard + useAuth)
│   ├── user/           (referensi modul CRUD + mock)
│   └── generator/      (UI wizard scaffolding modul — /generator)
└── shared/
    ├── theme/          (theme.ts = sumber kebenaran token thema)
    ├── lib/            (api.ts axios instance, queryClient.ts)
    ├── hooks/          (useMediaQuery, useClickOutside, dsb)
    ├── utils/          (format, filterNavItems, submitError)
    ├── types/          (navigation, form, api)
    └── components/
        ├── layout/     (AppShell, Sidebar, PageHeader, AvatarUser, PageContent)
        ├── ui/         (Button, Table, Dialog, Form*, Toast, dsb)
        └── icons/      (SVG, warna via token thema / currentColor)
```

## Thema

Token thema didefinisikan di `src/shared/theme/theme.ts` (light/dark) dan diterapkan
saat runtime sebagai CSS variables (`--theme-*`). Utility Tailwind seperti
`bg-primary`, `text-muted-foreground`, `border-border` otomatis mengikuti thema aktif.

Aturan: shared components **wajib** memakai token thema — dilarang hardcode warna.

## Aturan agen & skills

- `AGENTS.md` — aturan project untuk coding agent (dibaca otomatis oleh Muse Code).
- `.agents/skills/` — skills project: `frontend-conventions`,
  `module-generator`, `crud-module`.

## Auth (mock)

Login di `/login` memakai akun demo dari config (`src/modules/auth/api/mockUsers.ts`).
Response login membawa permission list user; guard membaca permission key:

- `RequireAuth`: belum login → redirect `/login`.
- `PermissionGate`: route dengan `handle.requiredPermission` → 403 bila key tidak dimiliki.
- Sidebar menyembunyikan menu tanpa `permissionKey` yang cocok; `'*'` = wildcard penuh.

| Username | Password  | Role   |
| -------- | --------- | ------ |
| admin    | admin123  | penuh  |
| editor   | editor123 | kelola tanpa hapus |
| viewer   | viewer123 | lihat + export saja |

Klik baris akun di halaman login untuk isi otomatis. Untuk API real, ubah
`USE_MOCK` di `src/modules/auth/api/mock.ts` menjadi `false`.

## Generator modul

Buka `/generator` untuk scaffolding modul CRUD baru lewat wizard (info modul →
features → fields → review → generate). Output meniru struktur `src/modules/user/`
dengan mock selalu aktif. Klik Generate langsung menulis file ke `src/modules/`
dan mendaftarkan routes + navigasi otomatis (via dev-server `npm run dev`);
permission key wajib diisi single value (suffix `.view/.create/.update/.delete/.bulk_upload/.export`
otomatis), parent dipilih dari direktori parent yang ada. Wizard juga mengatur
per field: sortable, filterable + kriteria filter (12 kriteria tergantung tipe),
urutan via drag-and-drop; features Bulk Upload & Export menghasilkan alur
`.xlsx` (template + validasi per baris + export sesuai filter). Detail
integrasi ada di `INTEGRATION.md` hasil generate. Aturan main:
skill `module-generator` di `.agents/skills/`.
