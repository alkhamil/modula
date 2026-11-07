# Rencana Implementasi: Live Preview Nyata Berbasis On-Demand Static Build (Opsi 2)

Dokumen ini merinci arsitektur, alur kerja teknis, dan tahapan eksekusi untuk menghadirkan fitur **Live Preview 100% Asli** pada platform Modula di lingkungan produksi (`https://modula.rrgroup46.my.id/`).

---

## 1. Latar Belakang & Evaluasi Masalah

### 1.1 Mengapa Simulasi / Mock Sebelumnya Ditolak?
Pada implementasi sebelumnya, live preview dibuat menggunakan komponen tiruan (*mock view*) di dalam frontend Modula. Pendekatan ini ditolak karena:
1. **Hasil Tidak Otentik ("Ngarang"):** Tampilan, struktur menu, sistem auth, dan modul tidak mencerminkan kode template sesungguhnya dari `templates/base-project` dan `templates/packs`.
2. **Tidak Sesuai Harapan:** Pengguna membutuhkan preview yang **100% identik** dengan apa yang dihasilkan ketika mereka mendownload `.zip` dan menjalankannya secara lokal (`npm run dev`).

### 1.2 Mengapa Opsi 2 Dipilih?
Dibandingkan dengan menjalankan banyak server dev Vite yang terus aktif di memori (Opsi 1):
1. **Zero RAM Overhead Saat Idle:** Proyek yang di-build menjadi aset statis (`HTML`, `CSS`, `JS`) disajikan langsung oleh Caddy web server. Tidak ada proses Node.js / Vite yang harus tetap hidup di background (sangat aman untuk VPS dengan RAM 2GB).
2. **Performa Akses Instan:** Karena disajikan sebagai static files ber-cache oleh Caddy, live preview dimuat dalam hitungan milidetik.
3. **URL Permanen & Stabil:** Tautan preview (misal `https://modula.rrgroup46.my.id/live/<slug>/`) tetap aktif dan dapat dibagikan kapan saja tanpa risiko server dev mati/terputus.

---

## 2. Diagram Alur Kerja (End-to-End Architecture)

```
[User di Browser: /create]
         │
         │  1. Klik "Create Project" (Kirim: nama, brand, theme, packs)
         ▼
[Modula Backend API]
         │
         │  2. Trigger Server-Side Compose
         ▼
[Composer Script: templates/base-project + templates/packs]
         │
         │  3. Ekstrak source code ke: /var/www/modula/live-projects/<slug>/
         ▼
[Shared Node Modules & Vite Build Worker]
         │
         │  4. Menjalankan vite build (menggunakan node_modules induk Modula)
         │     Output: /var/www/modula/live-projects/<slug>/dist/
         ▼
[Caddy Reverse Proxy & File Server]
         │
         │  5. Serve static bundle via https://modula.rrgroup46.my.id/live/<slug>/
         ▼
[User Membuka Aplikasi Nyata di Browser]
```

---

## 3. Rincian Teknis Implementasi

### 3.1 Server-Side Project Composer
- **Lokasi script:** `scripts/project/buildLiveProject.mjs`
- **Fungsi:**
  1. Menerima input konfigurasi proyek (nama, slug, theme, primaryColor, logo, selectedPacks).
  2. Membaca template asli dari `templates/base-project/`, `src/shared/`, dan `templates/packs/`.
  3. Menyusun seluruh berkas sumber aplikasi ke direktori kerja di server:
     `/var/www/modula/live-projects/<slug>/`
  4. Menyuntikkan konfigurasi `base` pada `vite.config.ts`:
     ```ts
     export default defineConfig({
       base: '/live/<slug>/',
       plugins: [react(), tailwindcss()],
     });
     ```

### 3.2 Optimasi Kecepatan Build (Shared `node_modules`)
Masalah terbesar build di VPS biasanya adalah waktu `npm install` per proyek yang lama (~1–2 menit).
- **Solusi Cerdas:** Proyek hasil compose di `/var/www/modula/live-projects/<slug>/` tidak perlu menjalankan `npm install`.
- Script build akan membuat symlink atau mengarahkan path Vite ke folder `node_modules` induk Modula:
  ```bash
  ln -s /var/www/modula/node_modules /var/www/modula/live-projects/<slug>/node_modules
  ```
- **Keuntungan:** Waktu build `vite build` hanya memerlukan **2 hingga 4 detik saja**, langsung menghasilkan folder `dist/` tanpa mengunduh paket internet tambahan.

### 3.3 Konfigurasi Web Server Caddy
Pada berkas `/etc/caddy/conf.d/modula.caddy`, ditambahkan konfigurasi perutean subpath `/live/*`:

```caddy
modula.rrgroup46.my.id {
    # 1. API Reverse Proxy ke backend
    handle /api/* {
        reverse_proxy 127.0.0.1:8080
    }

    # 2. Health check
    handle /health {
        reverse_proxy 127.0.0.1:8080
    }

    # 3. Live Project Static Hosting (SPA per slug)
    handle_path /live/* {
        root * /var/www/modula/live-projects
        # Menangani routing SPA di dalam folder dist masing-masing project
        try_files {path} {path}/ /index.html
        file_server
    }

    # 4. Modula Portal Utama
    handle {
        root * /var/www/modula/dist
        try_files {path} /index.html
        file_server
    }
}
```

### 3.4 Integrasi Backend API
- **Endpoint:** `POST /api/projects/:slug/build`
  - Input: Metadata proyek dan pack pilihan.
  - Proses: Memanggil `node scripts/project/buildLiveProject.mjs <slug>`.
  - Output:
    ```json
    {
      "success": true,
      "slug": "enterprise-app",
      "liveUrl": "https://modula.rrgroup46.my.id/live/enterprise-app/"
    }
    ```

### 3.5 Antarmuka Pengguna (UI) Modula Portal
- Pada Step 6 (Finish) di `/create`:
  - Menampilkan panel **Live Preview Siap Diakses**:
    - URL resmi: `https://modula.rrgroup46.my.id/live/<slug>/`
    - Tombol primer: **Buka Live Preview ↗** (membuka tab baru).
    - Tombol sekunder: **Salin URL** (dengan notifikasi toast).
    - Tombol download: **Download .zip** (tetap tersedia untuk download kode sumber).

---

## 4. Keamanan & Manajemen Sumber Daya (VPS Hardening)

1. **Sanitasi Slug:**
   - Slug proyek wajib divalidasi dengan regex ketat: `^[a-z0-9][a-z0-9-]{1,60}$` guna mencegah directory traversal (`../`).
2. **Kapasitas Disk:**
   - Folder `dist/` setiap proyek hanya berukuran rata-rata ~1.5 MB s.d. 3 MB.
   - 30 proyek aktif hanya memakan ~90 MB ruang penyimpanan disk.
3. **Pembersihan Otomatis (Cron / Retention Policy):**
   - Proyek yang berusia lebih dari 7 hari atau proyek uji coba dapat dibersihkan secara otomatis via script rotasi berkala.

---

## 5. Rencana Tahapan Eksekusi (Checklist)

- [ ] **Langkah 1:** Buat script penyusun dan pembangun otomatis `scripts/project/buildLiveProject.mjs`.
- [ ] **Langkah 2:** Daftarkan endpoint `POST /api/projects/:slug/build` pada backend Go/Node di VPS.
- [ ] **Langkah 3:** Perbarui konfigurasi Caddy `/etc/caddy/conf.d/modula.caddy` untuk mendukung path `/live/<slug>/`.
- [ ] **Langkah 4:** Hubungkan alur pembuatan di `CreateProjectPage.tsx` agar memanggil API build saat proses selesai dan menampilkan kartu Live Preview resmi.
- [ ] **Langkah 5:** Pengujian end-to-end:
  - Buat project di browser.
  - Verifikasi file `dist/` ter-generate di server.
  - Buka URL live dan pastikan 100% sama dengan hasil run lokal.
