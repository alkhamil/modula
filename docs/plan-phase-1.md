# Plan Eksekusi Phase 1: Authentication & Project Workspace Foundation

Dokumen ini merinci rencana teknis dan tahapan eksekusi untuk **Phase 1** sesuai dengan spesifikasi [`docs/development-revamp-spec.md`](./development-revamp-spec.md) dan [`revamp.md`](../revamp.md).

---

## 1. Tujuan Phase 1

1. **Pondasi Akun Internal & RBAC**:
   - Menggantikan login bebas/terbuka dengan **Internal Account Model** (tanpa registrasi publik).
   - Menerapkan 7 peran awal (*SUPER_ADMIN, ADMIN, PRESALES, BPA, UI_UX, DEVELOPER, QA*) beserta matriks hak aksesnya.
   - Melindungi seluruh rute aplikasi di balik sesi login (*Protected Routes & Session Guard*).

2. **Pondasi Project Workspace**:
   - Menyediakan dashboard utama di mana pengguna dapat melihat, membuat, mengelola, dan mengelompokkan proyek (*My Projects*, *Shared Projects*, *Recently Updated*).
   - Menetapkan kepemilikan proyek (*Project Ownership*: `OWNER`, `EDITOR`, `VIEWER`) dan isolasi data per proyek.
   - Mengintegrasikan modal pembuatan proyek baru (*Quick Create Project*) dengan konfigurasi brand, tema, dan deskripsi.

3. **Penyimpanan Data Server-Side**:
   - Mengembangkan API autentikasi dan manajemen proyek pada Go Backend (`server/`) yang persisten, aman, dan terisolasi.

---

## 2. Struktur Data & Arsitektur

### 2.1 Entitas Data
```json
// User Entity
{
  "id": "usr-superadmin",
  "name": "Super Administrator",
  "email": "superadmin@modula.io",
  "passwordHash": "$2a$10$...",
  "role": "SUPER_ADMIN",
  "status": "ACTIVE",
  "createdAt": "2026-11-07T00:00:00Z",
  "lastLogin": "2026-11-07T12:00:00Z"
}

// Project Entity
{
  "id": "prj-1",
  "name": "Enterprise Portal",
  "slug": "enterprise-portal",
  "description": "CMS portal master data dan order management",
  "theme": "light",
  "primaryColor": "#00487a",
  "logoUrl": null,
  "ownerId": "usr-superadmin",
  "members": [
    { "userId": "usr-bpa", "role": "EDITOR" },
    { "userId": "usr-dev", "role": "VIEWER" }
  ],
  "createdAt": "2026-11-07T10:00:00Z",
  "updatedAt": "2026-11-07T12:00:00Z"
}
```

### 2.2 Akun Internal Awal (Seed Accounts)
Untuk memudahkan kolaborasi dan pengujian antar-fungsi:
- `superadmin@modula.io` — **SUPER_ADMIN** (Akses sistem penuh)
- `admin@modula.io` — **ADMIN** (Kelola user & proyek)
- `presales@modula.io` — **PRESALES** (Buat, edit, presentasi mockup)
- `bpa@modula.io` — **BPA** (Visualisasi kebutuhan bisnis)
- `uiux@modula.io` — **UI_UX** (Standar desain & komponen)
- `developer@modula.io` — **DEVELOPER** (Export source code & contract)
- `qa@modula.io` — **QA** (Pengujian & validasi skenario)
*(Default password lokal: `modula123`)*

---

## 3. Rencana Endpoint API (Go Backend)

### Autentikasi (`/api/v1/auth`)
- `POST /api/v1/auth/login` — Verifikasi kredensial & hasilkan token sesi/bearer.
- `POST /api/v1/auth/logout` — Hapus/invalidasi sesi.
- `GET /api/v1/auth/me` — Ambil data profil & permissions pengguna yang sedang aktif.

### Manajemen Pengguna (`/api/v1/users`) — *Khusus ADMIN & SUPER_ADMIN*
- `GET /api/v1/users` — Daftar akun internal.
- `POST /api/v1/users` — Buat akun internal baru.
- `PUT /api/v1/users/:id` — Ubah profil, peran, atau status (ACTIVE/INACTIVE).
- `DELETE /api/v1/users/:id` — Deaktivasi akun.

### Manajemen Proyek (`/api/v1/projects`)
- `GET /api/v1/projects` — Daftar proyek yang dapat diakses pengguna (Owner atau Member).
- `POST /api/v1/projects` — Buat proyek baru (otomatis set pembuat sebagai `OWNER`).
- `GET /api/v1/projects/:slug` — Detail konfigurasi proyek.
- `PUT /api/v1/projects/:slug` — Perbarui metadata proyek (hanya `OWNER` / `EDITOR`).
- `DELETE /api/v1/projects/:slug` — Hapus proyek (hanya `OWNER`).
- `POST /api/v1/projects/:slug/share` — Tambah anggota kolaborator (`EDITOR` / `VIEWER`).

---

## 4. Rencana Tampilan & Antarmuka (Frontend)

1. **Halaman Login Internal (`/login`)**:
   - Layout login WDS terstandarisasi.
   - Form email & kata sandi dengan validasi ketat.
   - Panel jalan pintas *"1-Click Switch Account"* untuk memudahkan demonstrasi dan testing antar-role.

2. **App Shell & Navigasi Utama (`ProtectedAppShell`)**:
   - Top Header WDS dengan info pengguna aktif, badge role, switch bahasa, dan tombol logout.
   - Side Navbar dinamis:
     - **Workspace / Proyek** (`/`)
     - **Visual Builder** (`/generator` atau `/projects/:slug/builder`)
     - **Manajemen Pengguna** (`/users` — hanya tampil untuk Admin)
     - **Design System Showcase** (`/showcase`)

3. **Dashboard Project Workspace (`/`)**:
   - **Header Ringkasan**: Statistik jumlah proyek, pencarian cepat, tombol **"+ Buat Proyek Baru"**.
   - **Filter Tab**:
     - *Semua Proyek*
     - *Proyek Saya (Owner)*
     - *Dibagikan ke Saya*
   - **Grid Card Proyek**:
     - Nama proyek, slug, deskripsi.
     - Brand color preview swatch.
     - Badge role akses pengguna (`OWNER`, `EDITOR`, `VIEWER`).
     - Menu aksi: *Buka Builder*, *Edit Informasi*, *Bagikan*, *Hapus*.
   - **Dialog "Buat Proyek Baru"**:
     - Nama proyek (otomatis generate slug kebab-case).
     - Deskripsi singkat.
     - Pilihan warna primary (preset WDS atau kustom hex).
     - Upload logo brand (opsional).

4. **Halaman Manajemen Pengguna (`/users`)**:
   - Tabel WDS lengkap: Nama, Email, Peran (*Badge* berwarna semantik), Status (*Aktif / Nonaktif*), Terakhir Masuk.
   - Pencarian dan filter berdasarkan role.
   - Dialog tambah pengguna baru & ubah peran.

---

## 5. Tahapan Eksekusi Step-by-Step

- [ ] **Step 1: Go Backend Foundation**
  - Implementasi modul `auth`, `user`, dan `project` di Go server (`server/internal/auth/`, `server/internal/project/`).
  - Hashing password dengan bcrypt dan penyimpanan persisten di `server/data/`.
  - Middleware otentikasi token untuk melindungi endpoint.

- [ ] **Step 2: Frontend Auth State & Guard**
  - Perbarui `src/app/providers/AuthProvider.tsx` dan `useAuth.ts` agar terhubung ke API `/api/v1/auth`.
  - Tambahkan fallback storage lokal agar tetap dapat berjalan jika backend belum dinyalakan.
  - Perbarui `src/app/router.tsx` dengan route protection (`RequireAuth`).

- [ ] **Step 3: Halaman Login Internal WDS**
  - Buat halaman `/login` profesional dengan validasi dan quick-account test selector.

- [ ] **Step 4: Dashboard Project Workspace**
  - Buat modul `src/modules/workspace/` dengan halaman `WorkspaceDashboardPage.tsx`.
  - Implementasikan filter tab, grid kartu proyek, dan dialog pembuatan proyek.

- [ ] **Step 5: Halaman User Management (Admin Only)**
  - Buat halaman manajemen pengguna di `src/modules/users/pages/UserManagementPage.tsx` lengkap dengan tabel WDS dan modal aksi.

- [ ] **Step 6: Verifikasi, Lint, Build & Deployment**
  - Uji alur login semua role, buat project, share project, dan kelola user.
  - Jalankan `npm run lint` dan `npm run build`.
  - Push ke repo dan deploy ke server VPS (`43.173.20.248`).
