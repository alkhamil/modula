# Sistem gaya tampilan (UI style)

Gaya tampilan dipilih saat project dibuat (wizard `/create` → langkah **Gaya & Tema**) dan menentukan tata letak
shell, halaman auth, dan preset token. Komponen WDS di dalamnya **tidak diubah**.

## Prinsip

- `classic` = WDS resmi (mengikuti Figma). Gaya lain adalah **ekstensi di luar Figma** dan dilabeli begitu di wizard.
- Satu gaya hanya boleh mengubah tiga hal: (1) tata letak/warna shell, (2) tata letak halaman auth, (3) preset token
  (radius, kerapatan, latar). Dilarang mengubah internal komponen WDS.
- Gaya yang belum jadi tampil "Segera hadir" di wizard dan tidak bisa dipilih.

## Mekanisme

| Bagian | Lokasi |
|---|---|
| Tipe `UiStyle` (`classic｜light｜top｜rail｜floating`) | `src/shared/theme/theme.ts` |
| Diterapkan sebagai `data-ui-style` di `<html>` | `ThemeProvider` (prop `uiStyle`) |
| Aturan visual per gaya | `src/shared/theme/wds/styles.css` (selector `:root[data-ui-style='…']`) |
| Pilihan di project hasil | `projectConfig.uiStyle` (`src/app/project.config.ts`, token `__PROJECT_STYLE__`) |
| Halaman auth | `AuthLayout` (pack login): panel brand selalu ada di DOM, tampil lewat CSS hanya di gaya yang memintanya |
| Wizard | `src/modules/creator/uiStyles.ts` (status `ready`), `components/StylePreview.tsx` (sketsa contoh dari token) |
| Verifikasi | skenario `branded` di `scripts/verify-project/build.mjs` (gaya `light`) |

## Status gaya

| Gaya | Status | Yang berubah |
|---|---|---|
| `classic` | Jadi (resmi) | — |
| `light` | Jadi | Sidebar putih bergaris tipis, item aktif tint brand, auth dua kolom |
| `top` | Belum | Perlu shell navigasi horizontal baru |
| `rail` | Belum | Perlu sidebar ikon sempit + preset kerapatan |
| `floating` | Belum | Perlu shell kartu membulat + preset radius |

## Menambah gaya baru

1. Tambah aturan `:root[data-ui-style='<id>']` di `styles.css` (dan komponen shell baru bila struktur berbeda).
2. Ubah `ready: true` di `uiStyles.ts` dan lengkapi `StylePreview` bila perlu.
3. Tambah nama/deskripsi di i18n `creator.wizard.themeStep.styles.<id>` (en dan id).
4. Tambah skenario di `verify:project` dan jalankan.
