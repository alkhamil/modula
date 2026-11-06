# Draft Ide Awal — AIT Hackathon 2026

> Isi form pendaftaran (tutup **10 November 2026, 23.45**). Bagian bertanda `[ISI]` harus dilengkapi sebelum dikirim.
> Tema: **"Better AIT, Better Business"** · Area eksplorasi: **Internal Productivity & Automation**.

## 1. Identitas

| Item | Isi |
|---|---|
| Nama project | **Modula** |
| Tagline | Dari ide ke project React siap jalan dalam hitungan menit |
| Tim | `[ISI: maks. 3 orang, minimal 2 divisi]` |
| Area eksplorasi | Internal Productivity & Automation (sekunder: Business & Revenue Enablement) |

## 2. Versi singkat (untuk kolom dengan batas karakter)

Modula adalah scaffolder project React dengan wizard bergaya installer. Pengguna memilih nama, logo, gaya tampilan, tema, serta modul dan fitur (login, user dan role, contoh CRUD, generator modul), lalu mengunduh project yang langsung bisa dijalankan atau menjalankannya di localhost. Hasilnya seragam di semua project karena memakai satu design system (WDS). Tujuannya memangkas setup awal project dari hari menjadi menit, sehingga presales dan developer bisa langsung fokus ke kebutuhan klien.

## 3. Masalah nyata

Setiap project aplikasi baru di AIT dimulai dengan pekerjaan berulang yang tidak membawa nilai bagi klien:

- menyiapkan struktur project, routing, dan konfigurasi build;
- membuat login, manajemen user dan hak akses (RBAC);
- menerapkan tema, logo, dan komponen UI yang konsisten dengan design system;
- membuat modul CRUD (daftar, form, detail, hapus, upload massal, ekspor) satu per satu.

Dampaknya: waktu developer terpakai untuk hal berulang, tampilan dan struktur kode berbeda-beda antar tim, dan presales harus menunggu mockup atau prototipe sebelum bisa mempresentasikan solusi ke klien.

> `[ISI: data pendukung — berapa hari rata-rata setup awal satu project, berapa project baru per tahun, contoh kasus nyata. Juri menilai masalah yang tervalidasi data, bukan asumsi.]`

## 4. Solusi

Modula adalah aplikasi web dengan wizard pemasangan enam langkah:

1. **Identitas** — nama project, logo brand, dan tampilan sidebar saat collapsed.
2. **Gaya dan tema** — pilihan gaya tampilan (Klasik sesuai WDS, Terang; gaya lain menyusul), mode terang atau gelap, dan warna primary.
3. **Modul dan fitur** — kartu bergambar yang mengikuti gaya terpilih: login, lupa password, registrasi, verifikasi dua langkah, pengguna, peran dan hak akses, contoh modul tunggal dan parent-child, serta module generator.
4. **Ringkasan** — periksa pilihan sebelum memasang.
5. **Pemasangan** — proses dengan progres dan log tahapan.
6. **Selesai** — unduh `.zip` (Node 24) atau **jalankan di localhost** pada alamat sendiri, lalu langsung dites.

Project hasil membawa **module generator** sendiri, sehingga developer dapat menambah modul CRUD baru lewat builder visual, tanpa menulis kode berulang.

## 5. Dua pengguna utama

- **Presales dan BPA** — merancang dan mencoba aplikasi sendiri untuk presentasi tanpa menunggu mockup dari tim lain. *(sebagian sudah ada: builder dan pratinjau; mode sederhana untuk non-developer adalah roadmap)*
- **Developer frontend** — mengunduh project yang sudah lengkap dan langsung melanjutkan pengembangan.

## 6. Dampak

**Better AIT (efisiensi internal)**

- Setup awal project turun dari hari menjadi menit. `[ISI: angka hasil ukur — waktu "dari nol sampai project jalan dengan modul CRUD" memakai Modula vs. cara manual]`
- Struktur kode, tampilan, dan pola mock/API seragam di seluruh project, sehingga lebih mudah di-review dan diserahterimakan.
- Mengurangi kesalahan akibat salin-tempel antar project.

**Better Business (nilai bisnis)**

- Presales dapat menunjukkan prototipe yang berjalan jauh lebih cepat, mendukung proposal dan demo ke klien.
- Berpotensi menjadi aset reusable AIT atau produk internal.

## 7. Pembeda

- Bukan sekadar template: wizard, module generator, dan design system dalam satu paket.
- Menghasilkan project yang **terverifikasi otomatis** (setiap kombinasi pilihan di-build dan dicek tipe-nya).
- Tampilan dan perilaku konsisten karena seluruh komponen bersumber dari WDS (Figma).
- Dapat dijalankan langsung di localhost dari hasil wizard, tanpa instalasi manual lebih dulu.

## 8. Kelayakan

- Teknologi umum: React 19, TypeScript, Vite, Tailwind CSS 4. Tanpa lisensi tambahan.
- Prototipe **sudah berjalan** (lihat tabel status di bawah).
- Tanpa backend pada tahap ini: data memakai mock di browser, dengan lapisan API yang siap diganti ke backend nyata.

| Kemampuan | Status |
|---|---|
| Wizard installer 6 langkah, unduh `.zip`, Node 24 | Berjalan |
| Jalankan project hasil di localhost (`localhost:<port>/<nama-project>/`) | Berjalan (hanya saat `npm run dev`) |
| Gaya tampilan Klasik dan Terang, mode terang/gelap, warna primary | Berjalan |
| Modul: login, lupa password, registrasi, 2FA, user, role, contoh CRUD, generator | Berjalan |
| Table list sesuai desain Figma (header, toolbar, pagination, loading pencarian) | Berjalan |
| Gaya Menu atas, Ringkas, Melayang | Roadmap ("segera hadir") |
| Modul Dashboard, Riwayat aktivitas, Profil, Notifikasi/Persetujuan | Roadmap |
| Workflow dan Aturan (status, aksi bersyarat, validasi, rumus) | Roadmap — rancangan ada |
| URL yang bisa dibagikan (layanan preview internal) | Roadmap |

## 9. Rencana 12–27 November (development)

| Pekan | Fokus |
|---|---|
| 1 | Mode sederhana untuk presales, modul Riwayat aktivitas dan Dashboard, gaya Terang disempurnakan |
| 2 | Workflow dan Aturan (status + aksi bersyarat, contoh Contract → Addendum), BRD/TAD final, deck, skrip demo |

Cadangan yang dapat dipotong bila waktu mepet: gaya tambahan selain Terang, modul selain Riwayat aktivitas.

## 10. Risiko

| Risiko | Mitigasi |
|---|---|
| Lingkup terlalu besar untuk dua minggu di luar jam kerja | Dikerjakan bergelombang; fitur belum jadi tampil "segera hadir", tidak dijanjikan |
| Gaya tampilan baru di luar Figma | Klasik tetap resmi (WDS); gaya lain dilabeli ekstensi dan dirancang bersama tim UI/UX |
| Kontras beberapa warna token WDS di bawah standar aksesibilitas | Dilaporkan ke tim desain untuk keputusan |
| Kepemilikan IP atas pekerjaan yang sudah ada sebelum periode development | `[ISI: konfirmasi ke panitia/HR sebelum menandatangani dokumen HKI]` |

## 11. Kebutuhan dari mentor

- Masukan UI/UX untuk gaya tampilan tambahan di luar Figma (mentor UI/UX).
- Masukan alur bisnis dan aturan untuk modul contoh dan Workflow (mentor BPA/PM).
- Reviu keamanan dasar untuk fitur menjalankan project di localhost (mentor Engineer/Infra).

## 12. Checklist sebelum kirim

- [ ] Tim terdaftar (maks. 3 orang, minimal 2 divisi) — komposisi tidak bisa diubah setelah pendaftaran
- [ ] Dokumen HKI diunggah (PDF) dan hard copy diserahkan ke HR oleh **setiap** anggota
- [ ] Konfirmasi status IP untuk pekerjaan yang sudah ada
- [ ] Angka dampak (bagian 6) diisi dari hasil pengukuran, bukan perkiraan
