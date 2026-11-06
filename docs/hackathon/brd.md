# Business Requirements Document (BRD) — Modula

| Item | Isi |
|---|---|
| Produk | Modula — project scaffolder dan module generator berbasis design system WDS |
| Event | AIT Hackathon 2026 — tema "Better AIT, Better Business" |
| Versi / tanggal | 0.1 · November 2026 |
| Penyusun | `[ISI: nama tim]` |
| Status dokumen | Draft untuk reviu mentor |

> Catatan baca: setiap kebutuhan diberi **status implementasi** (Selesai / Sebagian / Roadmap) agar dokumen ini tidak menjanjikan hal yang belum ada. Angka bertanda `[ISI]` harus diisi dari pengukuran.

---

## 1. Ringkasan eksekutif

Modula memangkas pekerjaan berulang di awal setiap project aplikasi: struktur project, autentikasi, manajemen user dan hak akses, tema dan identitas visual, serta modul CRUD. Pengguna memilih konfigurasi lewat wizard bergaya installer, lalu menerima project React yang konsisten dengan design system WDS dan siap dijalankan, baik diunduh maupun dijalankan langsung di localhost. Tujuannya mempercepat developer dan presales AIT, menyeragamkan kualitas hasil, dan membuka peluang bisnis berupa prototipe yang cepat dan reusable.

## 2. Latar belakang dan masalah

### 2.1 Kondisi saat ini (as-is)

1. Setiap project baru memulai setup dari awal atau menyalin project lama, sehingga struktur dan kualitas berbeda-beda.
2. Login, RBAC, dan modul CRUD dibuat berulang dengan pola yang hampir sama.
3. Penerapan identitas visual (logo, warna, mode terang/gelap) dilakukan manual.
4. Presales menunggu mockup atau prototipe dari tim lain sebelum dapat mempresentasikan solusi.
5. Serah-terima antar developer sulit karena tidak ada standar struktur dan pola.

`[ISI: bukti pendukung — waktu rata-rata setup awal per project, jumlah project per tahun, contoh keterlambatan demo]`

### 2.2 Kondisi yang diharapkan (to-be)

1. Satu wizard menghasilkan project lengkap dalam hitungan menit.
2. Struktur, tampilan, dan pola mock/API seragam di semua project.
3. Developer langsung mengerjakan kebutuhan klien; modul baru dibuat lewat generator.
4. Presales dapat merancang dan mencoba aplikasi sendiri untuk presentasi (sebagian: roadmap).
5. Aturan bisnis dan alur status dapat dimodelkan sebagai data, bukan kode berulang (roadmap).

## 3. Tujuan bisnis dan indikator keberhasilan

| ID | Tujuan | Indikator (KPI) | Target | Baseline |
|---|---|---|---|---|
| T1 | Mempercepat awal project | Waktu dari nol sampai project berjalan dengan modul CRUD | `[ISI]` menit | `[ISI]` hari/jam (manual) |
| T2 | Menyeragamkan kualitas | Persentase project baru yang memakai struktur dan design system standar | 100% project yang dibuat lewat Modula | — |
| T3 | Mendukung presales | Waktu menyiapkan prototipe untuk demo klien | `[ISI]` | `[ISI]` |
| T4 | Mengurangi kesalahan | Jumlah isu setup berulang (konfigurasi, tema, auth) per project | `[ISI]` | `[ISI]` |
| T5 | Peluang bisnis | Jumlah tim/project AIT yang berminat memakai Modula | `[ISI]` | 0 |

## 4. Ruang lingkup

### 4.1 Dalam lingkup (periode hackathon)

- Wizard pemasangan project (identitas, gaya dan tema, modul dan fitur, ringkasan, pemasangan, selesai).
- Pembuatan project `.zip` yang langsung dapat dijalankan (Node 24) dan opsi menjalankannya di localhost.
- Gaya tampilan Klasik (resmi WDS) dan Terang; mode terang/gelap; warna primary.
- Modul bawaan: autentikasi (login, logout, lupa password, registrasi, verifikasi dua langkah), pengguna, peran dan hak akses, contoh modul CRUD tunggal dan parent-child, module generator.
- Halaman daftar data (table list) sesuai desain Figma.
- Dokumentasi design system dan galeri ikon.

### 4.2 Di luar lingkup

- Backend nyata dan basis data (aplikasi memakai mock di browser).
- Hosting URL yang dapat dibagikan ke pihak lain (layanan preview internal) — roadmap.
- Alur persetujuan multi-langkah dan editor alur visual — roadmap.
- Integrasi dengan sistem AIT yang sudah ada.

## 5. Pemangku kepentingan dan persona

| Pemangku kepentingan | Kepentingan |
|---|---|
| **Presales / BPA** (persona utama 1) | Menunjukkan prototipe aplikasi ke klien tanpa menunggu tim lain; merancang modul dan alur dengan bahasa bisnis |
| **Developer frontend** (persona utama 2) | Mendapat project lengkap dan seragam, lalu fokus ke kebutuhan klien |
| **Tim UI/UX** | Konsistensi dengan design system WDS; keputusan atas gaya di luar Figma |
| **Tech lead / Engineering** | Kualitas dan keamanan basecode, kemudahan perawatan |
| **Manajemen** | Efisiensi, aset reusable, peluang bisnis |

## 6. Proses bisnis (to-be)

```
Presales/BPA atau Developer
   │  membuka Modula → wizard
   ▼
[1 Identitas] → [2 Gaya & tema] → [3 Modul & fitur] → [4 Ringkasan] → [5 Pemasangan] → [6 Selesai]
                                                                                        │
                              ┌─────────────────────────────────────────────────────────┤
                              ▼                                                         ▼
                   Unduh .zip (Node 24)                              Jalankan di localhost (dev)
                              │                                                         │
                              ▼                                                         ▼
           Developer: npm install → npm run dev                        Tes langsung di localhost:<port>/<nama>/
                              │
                              ▼
        Tambah modul lewat module generator → kembangkan sesuai kebutuhan klien
```

## 7. Kebutuhan bisnis

Prioritas: **M** = Must, **S** = Should, **C** = Could. Status: **Selesai**, **Sebagian**, **Roadmap**.

| ID | Kebutuhan | Prioritas | Status |
|---|---|---|---|
| BR-01 | Pengguna dapat membuat project baru lewat wizard bertahap yang jelas dan tidak memerlukan pengetahuan teknis mendalam | M | Selesai |
| BR-02 | Pengguna dapat memberi nama project dan mengunggah logo brand, termasuk pilihan tampilan saat sidebar collapsed | M | Selesai |
| BR-03 | Pengguna dapat memilih gaya tampilan, mode terang/gelap, dan warna primary, dengan contoh gambar yang berubah mengikuti pilihan | M | Selesai (gaya: Klasik, Terang) |
| BR-04 | Pengguna dapat memilih modul dan fitur yang dipasang lewat kartu bergambar yang mengikuti gaya terpilih | M | Selesai |
| BR-05 | Hasil wizard dapat diunduh sebagai project yang siap dijalankan dengan Node 24 | M | Selesai |
| BR-06 | Hasil wizard dapat langsung dijalankan di localhost pada alamat sendiri untuk dites | S | Selesai (dev) |
| BR-07 | Setiap project hasil konsisten dengan design system WDS dan struktur standar AIT | M | Selesai |
| BR-08 | Developer dapat menambah modul CRUD baru lewat builder visual di dalam project hasil | M | Selesai |
| BR-09 | Daftar data (table list) seragam dan sesuai desain Figma: pencarian, filter, ekspor, pagination, state loading | M | Selesai |
| BR-10 | Antarmuka tersedia dalam bahasa Indonesia dan Inggris | S | Selesai |
| BR-11 | Presales dapat merancang modul dengan mode sederhana (bahasa bisnis), template, dan pratinjau tanpa bantuan developer | S | Roadmap |
| BR-12 | Modul tambahan: Riwayat aktivitas, Dashboard, Profil dan pengaturan akun, Notifikasi/Persetujuan | S | Roadmap |
| BR-13 | Gaya tampilan tambahan: Menu atas, Ringkas, Melayang | C | Roadmap |
| BR-14 | Workflow dan Aturan: status dan alur, aturan bersyarat, validasi, rumus (contoh: addendum hanya dapat diajukan setelah kontrak selesai) | S | Roadmap |
| BR-15 | Hasil rancangan dapat dibagikan ke orang lain lewat URL | C | Roadmap |

## 8. Kebutuhan fungsional tingkat tinggi (user story)

| ID | Sebagai | Saya ingin | Sehingga | Kebutuhan |
|---|---|---|---|---|
| US-01 | Developer | membuat project dengan memilih modul dan gaya | tidak menyiapkan struktur dari nol | BR-01, 03, 04, 05 |
| US-02 | Developer | menjalankan project hasil wizard langsung di localhost | segera mengetes tanpa langkah manual | BR-06 |
| US-03 | Developer | menambah modul CRUD dari builder | tidak menulis kode berulang | BR-08 |
| US-04 | Presales | mencoba tampilan aplikasi dengan logo dan warna klien | demo terasa milik klien | BR-02, 03 |
| US-05 | Presales | merancang modul dengan bahasa bisnis dan pratinjau | tidak menunggu mockup | BR-11 |
| US-06 | BPA | menentukan status dan aturan (mis. addendum hanya setelah kontrak selesai) | alur bisnis terlihat nyata saat demo | BR-14 |
| US-07 | Tim UI/UX | memastikan komponen dan tabel sesuai Figma | konsistensi tampilan | BR-07, 09 |

## 9. Kebutuhan non-fungsional

| Aspek | Kebutuhan |
|---|---|
| Kinerja | Pembuatan zip dan pemasangan selesai dalam hitungan detik di browser; project hasil dapat dijalankan segera setelah `npm install` |
| Keamanan | Fitur menjalankan project di localhost hanya ada pada mode dev, tidak menerima file dari klien, memvalidasi seluruh input dengan daftar yang diizinkan, memeriksa origin, memakai token sesi, dan hanya bind ke localhost |
| Keandalan | Setiap kombinasi pilihan wizard harus lolos pengecekan tipe dan build otomatis sebelum dianggap valid |
| Aksesibilitas | Mengikuti WCAG 2.2 AA sedapat mungkin (fokus, label, area klik); beberapa token warna WDS masih di bawah kontras 4,5:1 dan menunggu keputusan tim desain |
| Konsistensi | Seluruh komponen bersumber dari design system WDS; gaya di luar Figma dilabeli sebagai ekstensi |
| Kompatibilitas | Project hasil memerlukan Node 24; wizard berjalan di browser modern |
| Pemeliharaan | Aturan kualitas terotomasi (tipe, lint, kelengkapan bahasa, build) |
| Bahasa | Indonesia dan Inggris |

## 10. Asumsi dan batasan

**Asumsi**
- Tim tetap memakai design system WDS sebagai standar tampilan.
- Developer menggunakan Node 24 dan npm.
- Tahap hackathon cukup memakai data mock; backend dibahas setelah hackathon.

**Batasan**
- Pengerjaan dilakukan di luar jam kerja dan tidak boleh mengganggu pekerjaan proyek dan klien.
- Maksimal 3 orang per tim, minimal 2 divisi.
- Seluruh hak kekayaan intelektual atas ide dan solusi yang disubmit menjadi milik perusahaan.
- Gaya di luar Figma memerlukan keputusan desain.

## 11. Risiko bisnis

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Lingkup terlalu besar untuk waktu yang tersedia | Fitur setengah jadi | Gelombang pengerjaan; fitur belum jadi tampil "segera hadir" |
| Adopsi rendah oleh tim | Dampak bisnis kecil | Demo ke tim presales dan developer; kumpulkan umpan balik |
| Standar tampilan berbeda dari harapan klien | Revisi tampilan | Pilihan gaya, warna, dan logo di wizard |
| Status IP pekerjaan sebelumnya belum jelas | Hambatan administratif | `[ISI: konfirmasi ke panitia/HR]` |
| Backend belum tersedia | Demo hanya dengan data mock | Lapisan API siap diganti; kontrak JSON untuk tim backend (roadmap) |

## 12. Dependensi

- Design system WDS (file Figma) dan token desain.
- Mentor UI/UX untuk keputusan gaya baru dan masukan visual.
- Mentor Engineer/Infra untuk reviu keamanan dan rencana hosting preview internal.

## 13. Kriteria penerimaan (demo)

1. Membuka wizard, mengisi identitas, memilih gaya, tema, dan modul, lalu memasang project tanpa galat.
2. Mengunduh `.zip` dan menjalankannya dengan Node 24 (`npm install && npm run dev`), login berhasil.
3. Menjalankan project dari wizard di localhost dan membuka alamatnya.
4. Tampilan project mengikuti pilihan: gaya, mode, warna primary, dan logo.
5. Halaman daftar data (User, Roles, modul contoh) sesuai desain Figma, termasuk state loading pencarian.
6. Seluruh kombinasi pilihan lolos pengecekan otomatis (tipe dan build).
7. `[ISI: demo Workflow — kontrak berstatus Selesai dapat mengajukan addendum, selain itu tombol dijelaskan nonaktif]` (jika selesai pada periode hackathon).

## 14. Pemetaan terhadap parameter penilaian juri

| Parameter | Bobot | Dukungan di dokumen ini |
|---|---|---|
| Relevansi masalah | 15% | Bagian 2 (masalah) — perlu data `[ISI]` |
| Dampak dan nilai bisnis | 25% | Bagian 3 (KPI) — perlu angka hasil ukur |
| Inovasi | 15% | Wizard installer + gaya + generator + jalankan di localhost dalam satu paket |
| Kualitas eksekusi | 20% | Prototipe berjalan; verifikasi otomatis; BRD ini dan TAD |
| Kelayakan implementasi | 15% | Teknologi umum, tanpa biaya lisensi; roadmap bertahap |
| Presentasi dan dokumen | 10% | BRD, TAD, deck, skrip demo |

## 15. Lampiran

- Draft ide: `docs/hackathon/draft.md`
- Dokumen arsitektur teknis: `docs/hackathon/tad.md`
- Sistem gaya tampilan: `docs/STYLE_SYSTEM.md`
- Audit komponen terhadap Figma: `docs/AUDIT_KOMPONEN.md`
