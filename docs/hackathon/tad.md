# Technical Architecture Document (TAD) — Modula

| Item | Isi |
|---|---|
| Produk | Modula — project scaffolder dan module generator berbasis design system WDS |
| Versi / tanggal | 0.1 · November 2026 |
| Penyusun | `[ISI: nama tim]` |
| Referensi | `docs/hackathon/brd.md`, `docs/STYLE_SYSTEM.md`, `docs/ARSITEKTUR_FOLDER.md` |

> Dokumen ini menggambarkan **arsitektur yang sudah ada** (bagian 1–9) dan **rancangan yang direncanakan** (bagian 10). Bagian roadmap ditandai jelas.

---

## 1. Tujuan dan konteks

Modula menghasilkan project React yang seragam dan siap jalan dari pilihan wizard. Arsitekturnya memisahkan tiga hal: **situs Modula** (wizard, dokumentasi), **sumber project** (template, pack, design system), dan **mesin penyusun** yang murni (tanpa dependensi browser), sehingga logika yang sama dapat dipakai oleh browser, skrip verifikasi, dan server dev.

```
┌─────────────────────────── Browser (situs Modula) ───────────────────────────┐
│  Landing · Wizard /create · Dokumentasi /components · Galeri ikon            │
│        │ pilihan wizard                                                      │
│        ▼                                                                     │
│  createProjectZip ──► mesin penyusun (compose) ──► .zip (fflate) ──► unduh   │
│        │                    ▲                                                │
│        │ (opsi, dev saja)   │ membaca                                        │
└────────┼────────────────────┼────────────────────────────────────────────────┘
         ▼                    │
┌─── Server dev Vite (Modula) ┴──────────────────────────────────────────────┐
│  scripts/dev/projectRunner.ts  (hanya `npm run dev`)                       │
│   validasi opsi → compose dari template repo → .local-projects/<slug>/     │
│   → server Vite anak di localhost:<port>/<slug>/                           │
└────────────────────────────────────────────────────────────────────────────┘
Sumber: templates/base-project · templates/packs/* · src/shared (design system) · src/modules/generator
```

## 2. Teknologi

| Lapisan | Pilihan |
|---|---|
| UI | React 19, TypeScript ~6.0, Tailwind CSS 4 |
| Build | Vite 8 |
| State dan data | TanStack Query 5, React Hook Form 7 |
| Routing | react-router 7 |
| Bahasa | i18next / react-i18next (Indonesia dan Inggris) |
| Zip dan Excel | fflate (zip di browser), xlsx (ekspor dan upload massal) |
| Kualitas | oxlint, `tsc -b`, skrip verifikasi kustom |
| Runtime project hasil | Node 24 (`.nvmrc`, `engines.node >=24.0.0`) |
| Backend | Tidak ada (mock di browser); lapisan API siap diganti |

## 3. Struktur repositori (ringkas)

| Lokasi | Peran |
|---|---|
| `src/modules/creator/` | Landing, wizard installer, mesin penyusun (`engine/compose.ts`), pembuat zip, pratinjau gaya |
| `src/modules/generator/` | Module generator: definisi modul, mesin pembangkit kode, builder, runtime dinamis, seed |
| `src/modules/showcase/` | Dokumentasi design system (komponen, tipografi, warna, UI, ikon) |
| `src/shared/` | Design system WDS: komponen UI, ikon, tema, i18n, hook, util |
| `templates/base-project/` | Kerangka project hasil (shell, router, konfigurasi) |
| `templates/packs/*` | Pack fitur: `login`, `logout`, `forgot-password`, `register`, `two-factor`, `user`, `role`, `example-flat`, `example-nested`, `generator` |
| `scripts/project/` | Pembangkit pack contoh dan pemuat sumber (Node) |
| `scripts/verify-project/` | Verifikasi kombinasi project (tipe + build) |
| `scripts/dev/projectRunner.ts` | Plugin Vite dev-only untuk menjalankan project hasil di localhost |
| `vite-plugin/` | Plugin penulis modul ke repo (dev-only), ikut disalin ke project hasil |

## 4. Komponen utama

### 4.1 Wizard installer (`src/modules/creator`)

Enam langkah: **Identitas → Gaya dan tema → Modul dan fitur → Ringkasan → Pemasangan → Selesai.**

- Kartu modul didefinisikan data-driven di `modules.ts` (id, kelompok, pack yang dipasang, gambar contoh, wajib/default, status siap). Kartu yang belum siap ditandai `ready: false` ("segera hadir").
- Gaya didefinisikan di `uiStyles.ts`; sketsa contoh digambar oleh `StylePreview` dari token tema + warna primary terpilih, sehingga berubah mengikuti pilihan.
- Pemasangan menampilkan log tahapan sambil membuat zip secara paralel.

### 4.2 Mesin penyusun (`engine/compose.ts`)

Fungsi murni dan Node-safe: `ComposeInput` → peta path-ke-isi file.

1. Gabungkan `designSystem` + `base`.
2. `resolvePacks`: pack wajib + pilihan + penutup `requires`, urut sesuai `templates/packs/order.json`.
3. Salin file pack (konflik file non-JSON dilarang).
4. Terapkan **inserts**: sisipan teks di atas baris anchor (mis. `// __GENERATOR_ROUTES__`) untuk route, navigasi, dan permission.
5. Gabungkan dependensi, tetapkan `engines.node`, tulis `.nvmrc`.
6. Ganti token `__PROJECT_*__` (nama, slug, tema, gaya, warna, logo, favicon, Node).
7. Aset biner (logo) ditempatkan terpisah di `public/brand/`.

### 4.3 Pack fitur

Tiap pack: `pack.json` (id, `locked`, `default`, `requires`, dependensi, inserts) + folder `files/`. Pack `generator` mengambil langsung dari `src/modules/generator/**` dan `vite-plugin/**` (satu sumber kebenaran). Pack contoh dibangkitkan oleh module generator itu sendiri (`npm run packs:examples`).

### 4.4 Design system (`src/shared`)

- Komponen WDS mengikuti Figma; token digenerate dari `tokens/tokens.json` menjadi CSS di `src/shared/theme/wds/`.
- Ikon WDS: 6.305 ikon (5 gaya × 1.261), dimuat malas per gaya dan kategori lewat `WdsIcon`.
- Tema: `ThemeProvider` menerima `defaultTheme`, `defaultOverrides`, `uiStyle`, dan `storageKey`; pilihan pengguna hanya disimpan setelah pengguna mengubah tema, dan kuncinya diberi prefix slug project agar tidak bertabrakan.
- Gaya tampilan: atribut `data-ui-style` di `<html>` + aturan di `styles.css` (lihat `docs/STYLE_SYSTEM.md`).

### 4.5 Module generator (`src/modules/generator`)

- **Definisi modul** (`ModuleDefinition v1`): data murni dan Node-safe (tipe, normalisasi, validasi, kontrak API).
- **Jalur Publish:** definisi disimpan di mock store (`localStorage`) dan dirender generik saat runtime (`Dynamic*`).
- **Jalur Generate ke repo:** mesin pembangkit menulis kode statis ke `src/modules/` lewat endpoint dev `/__api/write-module`.
- **Kontrak API:** `definitions/contract.ts` menghasilkan spesifikasi model dan endpoint untuk tim backend.

### 4.6 Halaman daftar data

Komponen bersama `Card` (header judul + teks pendukung + aksi, body `flush`), `TableToolbar` (pencarian, Filter, aksi, state `loading`), `Table` (header abu-abu, kolom No., spinner "Please wait" saat memuat), `Pagination` (ringkasan "Showing x-y of z results"), dan `RowActionButton` (ikon netral). Template generator dan pack tulisan tangan (User, Role) memakai komponen yang sama.

## 5. Alur data utama

### 5.1 Membuat project (unduh)

1. Wizard mengumpulkan opsi (nama, logo, gaya, mode, warna, id pack).
2. `createProjectZip` memuat sumber (template, pack, design system) lewat `import.meta.glob` (malas, hanya saat pemasangan), memanggil `composeProject`, lalu `zipProjectFiles` (fflate).
3. Pengguna mengunduh `.zip` pada langkah Selesai.

### 5.2 Menjalankan project di localhost (dev-only)

1. Klien mengirim **hanya opsi** (JSON, logo base64) ke `POST /__api/run-project`.
2. Server memvalidasi (daftar id pack dari manifest, tema, gaya, warna hex, ekstensi dan ukuran logo, SVG berskrip ditolak) lalu **menyusun project sendiri dari template repo**.
3. Menulis ke `.local-projects/<slug>/` dan menjalankan server Vite anak (`base: /<slug>/`, port mulai 5300, maksimal 5 bersamaan). Dependensi dipakai dari `node_modules` Modula, tanpa `npm install`.
4. Template mendukung sub-path: `basename` router dari `import.meta.env.BASE_URL` dan `assetUrl()` untuk aset publik.

## 6. Model data utama

| Tipe | Isi pokok |
|---|---|
| `ProjectOptions` | `name`, `slug`, `theme`, `uiStyle`, `primaryColor`, `brand{logo, collapsedLogo}` |
| `PackManifest` | `id`, `label`, `locked`, `default`, `requires[]`, `dependencies`, `inserts[]` |
| `ModuleCardDef` | `id`, `group`, `packIds[]`, `thumb`, `locked`, `defaultOn`, `ready` |
| `ModuleDefinition v1` | key, label, parent, route, permission, field, fitur, layout (tabel, form, detail), status draft/published |
| `ApiContract` | modul, menu, model (field), endpoint (+ permission) |

## 7. Keamanan

| Ancaman | Kontrol |
|---|---|
| Halaman web lain memicu eksekusi kode lewat endpoint dev | Server tidak menerima file; hanya opsi yang divalidasi; cek `Host`, `Origin`, `Sec-Fetch-Site`; wajib `Content-Type: application/json`; token acak per sesi dev yang disuntikkan ke `index.html`; `server.cors: false` |
| Path traversal saat menulis project | Slug divalidasi pola ketat; setiap path hasil compose diperiksa agar tetap di dalam folder target |
| Input berbahaya (nama project, pack) | Panjang dibatasi; id pack dicocokkan dengan manifest repo |
| Logo berbahaya | Ekstensi dan ukuran dibatasi; SVG berisi skrip ditolak; hanya ditulis sebagai file statis |
| Penyalahgunaan sumber daya | Maksimal 5 project bersamaan; batas ukuran body; server anak hanya bind ke localhost |
| Endpoint dev bocor ke production | Plugin memakai `apply: 'serve'`; tidak ada di build maupun preview |

Uji yang sudah dijalankan: permintaan tanpa header (403), origin asing (403), metode `GET` (405), tidak ada header CORS, slug dan id pack tidak valid (400).

## 8. Kualitas dan verifikasi otomatis

| Perintah | Fungsi |
|---|---|
| `npx tsc -b` | Pengecekan tipe seluruh repo |
| `npm run lint` | oxlint |
| `npm run i18n:check` | Kelengkapan kunci bahasa Indonesia dan Inggris |
| `npm run build` | Build situs Modula |
| `npm run verify:generator` | Emisi dan kompilasi modul hasil generator |
| `npm run verify:project` | Menyusun 6 kombinasi project (minimal, full dengan modul kustom, modules, role, nested, branded), lalu `tsc -b` dan `vite build` pada masing-masing; juga memeriksa token tersisa, dependensi, `.nvmrc`/`engines`, dan konfigurasi brand/tema/gaya |

## 9. Deployment dan lingkungan

- **Situs Modula:** situs statis (hasil `npm run build`); wizard dan unduh zip berjalan sepenuhnya di browser.
- **Fitur dev-only:** menjalankan project di localhost dan menulis modul ke repo hanya tersedia saat `npm run dev`.
- **Project hasil:** Node 24; `npm install && npm run dev`.
- **Data:** mock di `localStorage` (definisi modul dan data demo); tidak dibagikan antar pengguna.

## 10. Rancangan yang direncanakan (roadmap)

### 10.1 Workflow dan Aturan

Langkah baru di builder, aturan disimpan sebagai **data di `ModuleDefinition`** (naik versi dengan migrasi), tidak sebagai kode.

| Bagian | Isi |
|---|---|
| Status dan alur | Daftar status, transisi yang diizinkan, peran yang boleh memindahkan |
| Aturan bersyarat | Satu bentuk kondisi (`field = nilai`) untuk aksi, kolom wajib, kolom terlihat |
| Aksi dan relasi | Aksi seperti "Ajukan addendum" membuat record anak berisi data induk dan memvalidasi status induk |
| Validasi dan rumus | Validasi lintas-field; rumus dengan **bahasa ekspresi kecil yang di-parse sendiri** (tanpa `eval`) |

Prinsip: validasi di frontend hanya untuk kenyamanan; **backend wajib memeriksa ulang**. Karena belum ada backend, aturan dijalankan di **lapisan API mock** (menolak seperti server nyata), sehingga ketika backend ada, lapisan mock tinggal dicabut.

Aturan diekspos lewat **perluasan kontrak JSON** (`ApiContract`): `workflow`, `rules`, `computed`, sehingga tim backend mengimplementasikan spesifikasi yang sama persis dengan yang dijalankan frontend. Evaluator aturan ditulis murni (Node-safe) di `definitions/` agar dapat dipakai backend Node bila perlu.

### 10.2 Gaya tampilan tambahan

Menu atas, Ringkas, Melayang: shell navigasi dan tata letak auth baru, preset token (radius, kerapatan). Komponen WDS di dalamnya tidak diubah. Gaya di luar Figma dilabeli ekstensi dan dirancang bersama tim UI/UX.

### 10.3 Modul tambahan

Riwayat aktivitas (acuan template Audit Log di Figma), Dashboard, Profil dan pengaturan akun, Notifikasi/Persetujuan: dibuat sebagai pack baru sehingga kartunya aktif di wizard.

### 10.4 URL yang dapat dibagikan

Membutuhkan hosting: **layanan preview internal AIT** (server kecil yang membangun dan menyajikan project per slug di subdomain) dengan autentikasi dan pembersihan otomatis. Alternatif tanpa backend: keluaran siap-host (`dist.zip`). Menjalankan kode dari browser ke server memerlukan kontrol keamanan yang setara dengan bagian 7.

### 10.5 Serah-terima presales ke developer

Modul rancangan presales (definisi) muncul sebagai kartu di langkah Modul dan fitur, lalu dibawa ke zip sebagai seed definisi (dijalankan runtime) dan/atau kode statis (jalur generate).

## 11. Keputusan arsitektur (ringkas)

| # | Keputusan | Alasan |
|---|---|---|
| A1 | Mesin penyusun murni dan Node-safe | Dipakai sama oleh browser, skrip verifikasi, dan server dev; mudah diuji |
| A2 | Fitur sebagai **pack** + inserts pada anchor | Menambah fitur tanpa mengubah kerangka; dependensi dan route terkelola otomatis |
| A3 | Satu sumber design system (`src/shared`) disalin ke project hasil | Konsistensi; tidak ada ketergantungan pustaka UI eksternal |
| A4 | Gaya sebagai atribut `data-ui-style` + CSS, bukan komponen terpisah | Biaya rendah; komponen WDS tidak berubah |
| A5 | Aturan bisnis sebagai data di definisi modul | Dapat dibaca frontend, mock, dan backend; tidak tersebar di kode |
| A6 | Menjalankan project lokal dengan menyusun dari template repo, bukan menerima file | Menghindari eksekusi kode sembarang lewat endpoint dev |
| A7 | Node dikunci ke 24 | Menyederhanakan dukungan dan pengujian |

## 12. Keterbatasan dan utang teknis

- Tanpa backend: data hanya di browser dan tidak dibagikan antar pengguna.
- Gaya di luar Klasik dan Terang belum ada; hanya Klasik yang sesuai Figma.
- Audit kesesuaian komponen terhadap Figma dan audit keyboard/aksesibilitas belum selesai seluruhnya (lihat `docs/AUDIT_KOMPONEN.md`).
- Beberapa token warna WDS di bawah kontras 4,5:1 (peringatan, placeholder, sukses, tautan) — menunggu keputusan tim desain.
- Gambar contoh di wizard berupa sketsa, bukan tangkapan layar asli.
- Fitur menjalankan project di localhost belum diuji untuk banyak project bersamaan dan unggah logo.

## 13. Risiko teknis

| Risiko | Mitigasi |
|---|---|
| Perubahan template merusak kombinasi tertentu | `verify:project` menjalankan 6 kombinasi pada setiap perubahan |
| Pertumbuhan jumlah pack/gaya melipatgandakan kombinasi | Skenario verifikasi ditambah per fitur; kartu "segera hadir" tidak diverifikasi |
| Aturan bisnis di frontend dan backend berbeda | Satu sumber (definisi → kontrak JSON) |
| Penyalahgunaan endpoint dev | Kontrol pada bagian 7; hanya mode dev |

## 14. Lampiran

- Draft ide: `docs/hackathon/draft.md` · BRD: `docs/hackathon/brd.md`
- Sistem gaya: `docs/STYLE_SYSTEM.md` · Struktur folder: `docs/ARSITEKTUR_FOLDER.md`
- Spesifikasi builder: `docs/BUILDER_SPEC.md`
