# Audit komponen vs Figma WDS

Status pengecekan komponen shared terhadap Figma WDS (file `ThLaTINM5dmzPW4AsB8dnF`, "WDS - Variable")
dan `tokens/tokens.json`. Docs per komponen ada di `/components/<slug>`.

## Cara cek manual (satu per satu)

Satu komponen dianggap **sudah dicek manual** bila semua langkah ini dilakukan:

1. Bandingkan tabel **Properties** dan section Variants / Types / Styles / States / Size Modes di Figma
   (screenshot + `get_design_context`) dengan props komponen dan docs-nya. Tidak ada prop karangan
   yang tidak ada di Figma.
2. Bandingkan koleksi token terkait di `tokens/tokens.json` (Size, Styles, States) dengan CSS komponen;
   nilai harus dari token (`--wds-*`), bukan angka tetap.
3. Pastikan playground docs punya kontrol untuk setiap properti Figma (boolean Figma = toggle).
4. Verifikasi di browser, lalu jalankan `npm run lint`, `npm run build`, `npm run i18n:check`,
   `npm run verify:generator`, dan commit.

## Sudah dicek manual (9)

| Komponen | Slug | Ringkasan hasil |
|---|---|---|
| Accordion | `accordion` | Prop `multiple` (karangan) dihapus; tipografi dan jarak dari token |
| ActivityFeed | `activity-feed` | Konektor putus-putus nyambung antar avatar |
| Alert | `alert` | Ikon solid, ukuran ikon dari token, prop `size` |
| Avatar | `avatar` | Properti dan ukuran Figma; default = kotak membulat, `rounded` = lingkaran |
| Badge | `badge` | Lebar minimum counter dari token; counter kosong tidak dirender |
| Banner | `banner` | Tipografi title/body, tombol md, ikon close 24px, stroke di dalam; semua properti Figma (Show title, Show Icon, Action-1/2, Close) ada di playground |
| Breadcrumbs | `breadcrumbs` | `truncated` menggantikan `maxItems`; mode `showIcons`; token link |
| Button | `button` | Tipografi `text.cta`; teks disabled destructive tonal/elevated terbaca |
| Calendar | `calendar` | `type`, `size`; header Month & Year terpisah; Senin hari pertama; 6 baris tetap; token jarak. Time picker dan Apply button sengaja tidak diimplementasikan |

### Penyimpangan yang disengaja dari Figma / token

- **Button destructive + disabled (tonal, elevated):** token Figma memakai `text.danger-subtle` yang sama dengan
  warna latar sehingga teks tak terlihat; `scripts/build-wds-tokens.mjs` memakai `text.danger-disabled`.
  Hapus penyesuaian itu bila token di Figma sudah dibetulkan.
- **Button hierarchy Text:** background di token bernilai `#NaNNaNNaN` (variabel rusak di Figma) dan
  di Figma tampil merah muda; kita tetap transparan.
- **Calendar:** properti Figma "Time picker" dan "Apply button" tidak diimplementasikan (keputusan produk).
  DatePicker tetap punya `showTime` sendiri. Rentang tahun memakai blok 12 tahun kelipatan 12
  (Figma: 2018–2029); aturan Figma belum diketahui.
- **Banner:** tombol aksi memakai Button ukuran `md` tetap (Figma: tinggi 44 di semua ukuran).

### Yang belum diverifikasi pada komponen di atas

- Mode dark dan ukuran selain `md` hanya diperiksa lewat token/angka, bukan berdampingan dengan Figma.
- Tinggi Banner lg/xl di playground berbeda dari Figma karena deskripsi membungkus di lebar sempit.
- Calendar: tinggi md 378px vs 376px di Figma (border 1px + bayangan di panel kita).

## Belum dicek manual

Komponen berikut sudah pernah dicek **dalam batch** (tampilan dibandingkan dengan Figma, docs en/id
dibuat), tetapi **belum** satu per satu dengan `tokens.json` dan tabel Properties Figma.

### Actions
- (kosong; Button sudah dicek)

### Forms
- Checkbox (`checkbox`), RadioButton (`radio`), Toggle (`toggle`)
- InputField (`input-field`), Textarea (`textarea`), Select (`select`)
- DatePicker (`date-picker`) — memakai panel Calendar yang sudah diubah; perlu dicek ulang
- FileUpload (`file-upload`)
- SearchBar (`search-bar`), SegmentedControl (`segmented-control`), Slider (`slider`), Rating (`rating`)
- OtpInput (`otp-input`), PinInput (`pin-input`), QuantitySelector (`quantity-selector`)
- CompactSelect (`compact-select`)

### Feedback
- Dialog (`dialog`), Drawer (`drawer`), Tooltip (`tooltip`), Popover (`popover`)
- Toast (`toast`), Progress (`progress`)

### Data
- Table (`table`), TableToolbar (`table-toolbar`), Pagination (`pagination`)
- Card (`card`), EmptyState (`empty-state`)
- DropdownMenu (`dropdown-menu`)

### Layout
- PageHeader (`page-header`), Profile (`profile`), SideNavbar (`side-navbar`)
- Divider (`divider`), SectionHeader (`section-header`)

### Navigation
- Link (`link`), NavItem (`nav-item`), Stepper (`stepper`), Tabs (`tabs`)

### Charts
- BarLineChart (`bar-line-chart`), PieChart (`pie-chart`), RadarChart (`radar-chart`),
  ActivityGauge (`activity-gauge`), Legend (`legend`)

## Celah yang sudah diketahui (di luar daftar di atas)

- Alert: tipe di Figma pilihan tunggal (action atau close), kita mengizinkan keduanya.
- Chart masih disederhanakan dibanding Figma.
- Dialog: footer tanpa pemisah (keputusan desain); Pagination dan Drawer baru dibandingkan sebagian.
- Token `accordion.container-gap` belum dipakai.
