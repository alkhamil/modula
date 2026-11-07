# Plan Eksekusi Phase 2: Component-Based Page Builder Enhancement

Dokumen ini merinci rencana teknis dan tahapan eksekusi untuk **Phase 2** sesuai dengan spesifikasi [`docs/development-revamp-spec.md`](./development-revamp-spec.md) (Bagian 7 & 18).

---

## 1. Tujuan Phase 2

1. **Konsolidasi Builder Menjadi Antarmuka Terpadu 3-Panel**:
   - Menggantikan wizard terpisah bertahap menjadi **Visual IDE / Page Builder Terpadu** yang memuat:
     - **Panel Kiri**: *Page Manager* (multi-halaman proyek) & *Component Library WDS* (Layout, Form, Table, Action).
     - **Panel Tengah**: *Visual Canvas* interaktif dengan seleksi komponen, responsive switcher (Desktop/Tablet/Mobile), dan undo/redo.
     - **Panel Kanan**: *Properties Inspector* untuk kustomisasi label, layout span, validasi rules, data binding, dan target interaksi.

2. **Dukungan Multi-Halaman per Proyek**:
   - Setiap proyek dapat memiliki banyak halaman yang saling terhubung:
     - `LIST`: Halaman daftar tabel data, search, filter, tombol aksi.
     - `FORM`: Halaman formulir pembuatan atau pengubahan data.
     - `DETAIL`: Halaman rincian record dengan summary card & tabs.
     - `DASHBOARD`: Halaman metrik KPI, kartu ringkasan, dan status.
     - `CUSTOM`: Halaman layout bebas berbasis grid komponen.

3. **Konteks Proyek Terisolasi (`/projects/:slug/builder`)**:
   - Builder dibuka langsung dari Workspace Dashboard dengan konteks proyek aktif (`slug`, `name`, `theme`, `primaryColor`).
   - Perubahan halaman otomatis tersimpan (*auto-save*) ke penyimpanan proyek.

---

## 2. Struktur Data Halaman & Komponen (Schema v2)

```typescript
export type PageType = 'LIST' | 'FORM' | 'DETAIL' | 'DASHBOARD' | 'CUSTOM';

export type ComponentCategory =
  | 'layout'
  | 'form'
  | 'data'
  | 'action'
  | 'feedback';

export interface CanvasComponentNode {
  id: string;
  type: string; // 'card' | 'input-field' | 'table' | 'button' | 'metric' dll.
  category: ComponentCategory;
  name: string;
  props: Record<string, any>;
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    errorMessage?: string;
  };
  actions?: {
    onClick?: 'none' | 'navigate' | 'open-dialog' | 'submit-form' | 'toast';
    targetPageKey?: string;
    targetDialogId?: string;
    toastMessage?: string;
  };
  children?: CanvasComponentNode[];
}

export interface ProjectPageDefinition {
  id: string;
  key: string; // misal: 'customer-list', 'customer-create'
  title: string;
  type: PageType;
  path: string; // misal: '/customers', '/customers/new'
  components: CanvasComponentNode[];
  createdAt: string;
  updatedAt: string;
}
```

---

## 3. Komponen WDS yang Disediakan di Library (Panel Kiri)

1. **Layout**:
   - `Container`: Pembungkus section dengan padding semantik.
   - `Card`: Panel berbingkai dengan judul dan konten.
   - `Grid Row (2-Kolom / 3-Kolom)`: Penataan kolom responsif.
   - `Tabs`: Pengelompokan tab konten.
   - `Divider`: Garis pemisah horizontal.

2. **Form Elements**:
   - `Input Field`: Field teks, email, password, nomor.
   - `Textarea`: Field input multi-baris.
   - `Select Dropdown`: Pilihan tunggal dengan daftar opsi.
   - `Date Picker`: Pemilih tanggal format lokal.
   - `Checkbox & Radio`: Opsi checklist atau radio pilihan.
   - `Toggle Switch`: Saklar aktif/nonaktif.
   - `File Upload`: Area unggah berkas dengan drag & drop.

3. **Data Display**:
   - `Data Table`: Tabel data dengan header kolom, pagination, dan action slot.
   - `Metric Card`: Statistik angka dengan label tren dan persentase.
   - `Badge / Tag`: Label status (Primary, Success, Warning, Error, Neutral).
   - `Empty State`: Ilustrasi dan pesan saat data kosong.

4. **Action & Feedback**:
   - `Button`: Tombol aksi (Primary, Secondary, Destructive) dengan ikon.
   - `Alert`: Notifikasi pesan banner (Info, Success, Warning, Error).
   - `Modal Dialog`: Jendela konfirmasi atau formulir popup.

---

## 4. Rincian Antarmuka & UX Builder

### Panel Kiri (Tabs: Pages & Components)
- Tab **Halaman**: Menampilkan hierarki halaman aktif, tipe halaman, dan tombol `+ Tambah Halaman`.
- Tab **Komponen**: Daftar komponen per kategori dengan ikon visual. Mengklik atau drag komponen akan menambahkannya ke kanvas.
- Tab **Outline**: Pohon komponen halaman aktif untuk memudahkan navigasi elemen yang bersarang (*nested*).

### Panel Tengah (Visual Canvas)
- Toolbar Atas:
  - Tombol Kembali ke Workspace (`← Workspace`).
  - Indikator Halaman Aktif (*Breadcrumb* & Judul).
  - Mode Tampilan: **Editor** vs **Live Preview Halaman**.
  - Switcher Perangkat: **Desktop** (100%), **Tablet** (768px), **Mobile** (375px).
  - Kontrol **Undo** & **Redo**.
- Area Kanvas:
  - Render komponen nyata Design System WDS.
  - Komponen terpilih diberi highlight garis biru (*focus ring*).
  - Tombol cepat pada komponen aktif: *Hapus*, *Duplikat*, *Pindah Atas/Bawah*.
  - Placeholder & Dropzone visual.

### Panel Kanan (Properties Inspector)
- Tab **Pengaturan (Props)**:
  - Label teks, placeholder, nilai default, hint/bantuan.
  - Lebar komponen (*Col Span*: Penuh 12-kolom, 1/2, 1/3, 1/4).
  - State: Wajib diisi (*Required*), Dinonaktifkan (*Disabled*), Hanya-baca (*Readonly*).
- Tab **Validasi & Data**:
  - Validasi teks & angka (panjang min/maks, format email/regex).
  - Kolom tabel / Opsi dropdown.
- Tab **Aksi (Interaction)**:
  - Konfigurasi saat diklik: Pindah Halaman (*Navigate to Page*), Buka Modal Popup, atau Tampilkan Notifikasi Toast.

---

## 5. Tahapan Eksekusi Step-by-Step

- [ ] **Langkah 1: Schema & Store Builder Multi-Halaman**
  - Buat `src/modules/builder/types.ts` dan `src/modules/builder/builderStore.ts` untuk mengelola state halaman, riwayat undo/redo, dan komponen aktif.

- [ ] **Langkah 2: Katalog Komponen & Panel Kiri (`ComponentLibraryPanel` & `PageManagerPanel`)**
  - Implementasi panel kiri dengan switcher tab: Pages, Components, dan Tree Outline.
  - Dialog pembuatan halaman baru (*New Page Dialog*).

- [ ] **Langkah 3: Properties Inspector Panel Kanan (`PropertiesInspectorPanel`)**
  - Form editor dinamis sesuai komponen yang sedang dipilih di kanvas.
  - Konfigurasi props, validasi, dan event aksi.

- [ ] **Langkah 4: Visual Canvas Panel Tengah (`BuilderCanvas`)**
  - Render visual komponen WDS dengan seleksi aktif dan drag/reorder/nesting.
  - Top toolbar: viewport switcher (desktop, tablet, mobile), undo/redo, tombol preview interaktif.

- [ ] **Langkah 5: Halaman Utama Builder (`ProjectBuilderPage.tsx`) & Integrasi Routing**
  - Daftarkan rute `/projects/:slug/builder` di `router.tsx`.
  - Hubungkan tombol "Buka Builder" di Workspace Dashboard langsung ke proyek tersebut.

- [ ] **Langkah 6: Verifikasi, Lint, & Build**
  - Pastikan `npm run lint` dan `npm run build` lulus 0 error.
