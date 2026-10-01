# generator-module-app

React 19 + TypeScript + Vite + Tailwind CSS 4 + TanStack Query + axios.
Backend in-repo: `backend/` (NestJS + TypeORM + MySQL).

Platform modul dinamis: tidak ada kode per modul di `src/modules/`
(isinya hanya `auth/` + `generator/`). Modul bisnis (users, orders,
mater-data/*, …) adalah data `ModuleDefinition v1` yang disimpan di BE
dan di-render generik saat runtime. Modul baru dibuat lewat wizard
`/generator` (publish Draft/Publish), bukan dengan menulis file.

## Mulai

```bash
nvm use 22
npm install
npm run dev        # FE saja (mock aktif, tanpa butuh MySQL)
```

Dengan backend sungguhan:

```bash
cd backend
npm install
docker compose -f compose.yaml up -d   # MySQL
npm run migration:run
npm run seed                             # 10 definisi modul + records
npm run start:dev                        # :3000, prefix /api/v1
```

Lalu ubah flag `USE_MOCK` terkait di
`src/modules/generator/runtime/*Api.ts` menjadi `false`.

## Struktur

```
src/
├── main.tsx            (entry)
├── App.tsx             (QueryClient + Theme + Toast + Router providers)
├── index.css           (Tailwind v4, utility thema via @theme inline)
├── app/
│   ├── navigation.tsx       (nav statis + useDynamicNavItems dari definisi)
│   ├── ProtectedAppShell.tsx (shell + RequireAuth + user/permissions)
│   └── router.tsx           (routes statis + DynamicModuleRoutes + preview/*)
├── pages/              (Login, Dashboard, components/ — dokumentasi shared)
├── modules/
│   ├── auth/           (login/logout mock + guard + useAuth)
│   └── generator/      (wizard /generator + ModuleDefinition v1 + runtime)
│       ├── definitions/  (types/normalize/validate/configToDefinition/parents)
│       ├── runtime/      (Dynamic* generik + client API + mock)
│       ├── components/ + pages/  (langkah wizard)
│       └── parser.ts, naming.ts, registry/  (bantu wizard)
├── shared/
│   ├── theme/          (theme.ts = sumber kebenaran token thema)
│   ├── lib/            (api.ts axios instance, queryClient.ts)
│   ├── hooks/          (useMediaQuery, useClickOutside, dsb)
│   ├── utils/          (format, filterNavItems, submitError, excel)
│   ├── types/          (navigation, form, api)
│   └── components/
│       ├── layout/     (AppShell, Sidebar, PageHeader, AvatarUser, PageContent)
│       ├── ui/         (Button, Table, Dialog, Form*, Toast, dsb)
│       └── icons/      (SVG, warna via token thema / currentColor)
backend/
├── src/
│   ├── module-definitions/  (CRUD definisi: GET/POST/PUT/DELETE)
│   ├── records/             (API generik /:plural + export/bulk .xlsx)
│   ├── health/              (GET /api/v1/health)
│   ├── migrations/ + seeds/ (skema + seed dari backend/seeds/*.json)
│   └── common/              (envelope response_output + exception filter)
├── seeds/              (kanonis: 10 definisi modul + records; dipakai mock FE)
└── compose.yaml        (MySQL dev)
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
- `docs/backend-contract.md` — kontrak API FE↔BE.

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

Buka `/generator` untuk membuat modul CRUD lewat wizard (info modul →
features → fields → layout canvas drag-and-drop → review → **Simpan
sebagai Draft** / **Publish**). Publish menyimpan definisi ke BE
(mock: cache in-memory); modul `published` langsung live di navigasi +
routes, modul `draft` hanya bisa dibuka via `/preview/:definitionKey`.

Wizard mengatur per field: tipe kontrol, rules validasi, sumber data,
sortable, filterable + kriteria filter, posisi + lebar grid form, dan
kolom tampil/sembunyi tabel. Features Bulk Upload & Export memakai alur
`.xlsx` (template + validasi per baris + export sesuai filter).
Aturan main: skill `module-generator` di `.agents/skills/`.
