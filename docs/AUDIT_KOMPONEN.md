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

## Sudah dicek manual (17)

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
| InputField | `input-field` | Properti Figma (Show Hint, Show Help icon, Type) ada; segmen dropdown kini punya chevron dan teks medium (token `text.cta`); teks input memakai token `text.label`; warna 7 state × 2 style cocok token. Prop di luar Figma: `currency`, `clearable`, `sanitize`, `type="password"` |
| Textarea | `textarea` | `autoGrow` (salah tafsir) diganti `dynamic` = handle resize (Figma "Dynamic?"); `showScrollBar` ditambah (Figma "Show Scroll Bar"); default tinggi tetap 128px tanpa handle dan tanpa scrollbar; warna 8 state cocok token |
| Select | `select` | Properti Figma hanya mode Style/State/Size — semuanya ada; warna 7 state × 2 style, tinggi 44, chevron 20px, tag multiple dari token cocok; state `focused` (docs) kini memakai panah atas sesuai token. Banyak prop fungsional di luar Figma (`searchable`, `clearable`, `loadOptions`, dst.) dipertahankan |
| RadioButton | `radio-button` | Properti Figma (Show hint, Style outline/solid, Size, Types default/icon only) ada; ukuran ikon, jarak, tipografi, jarak teks pendukung (2), padding atas saat ada hint (2), stroke 1/1,5, opacity disabled 0,4, dan warna 6 state × 2 style cocok token. Tidak ada perubahan kode; hanya tautan Figma docs diarahkan ke halaman yang benar |
| Checkbox | `checkbox` | Properti Figma (Label, Supporting/error, Style outline/solid, states, type, mode, Horizontal Checkbox) ada; ukuran 16–32, radius per ukuran, stroke, warna 7 state × 2 style, opacity disabled cocok token. Tidak ada perubahan kode; tautan Figma docs diarahkan ke halaman |
| Toggle | `toggle` | Properti **Tick** (Figma "Toggle tick/check mark variant") sebelumnya salah dipetakan ke `value`; kini prop `tick` menampilkan centang di thumb saat aktif. Show hint, Style, Size, states, track 1,8×, opacity disabled cocok token |
| DatePicker | `date-picker` | Properti Figma (Date/placeholder, Helper/error, Show hint, Show label/description, Layout, style, state, Size) ada (label/description/layout lewat `FormItem`); tinggi 44, radius 8, ikon 20, warna 7 state × 2 style cocok token; state `focused` (docs) kini berstroke fokus + cincin. Ikon kalender belum dibandingkan dengan glyph Figma. Panel kalender memakai komponen Calendar (sudah dicek) |
| FileUpload | `file-upload` | Border dashed → solid 1px; ikon 40 → 44px; jarak ikon–teks `content-gap` (sebelumnya `text-gap`); teks pendukung ukuran body dan prop `supportingText` (di dalam area) dipisah dari `hint` (helper di bawah area, diganti `error`); state disabled mewarnai aksi dan teks pendukung `text.disabled`; progress upload kini kartu "uploading" di daftar (bukan di dalam area); `size` xs–xl. Layout horizontal/label lewat `FormItem`. Kartu file (File Upload Cards): ikon 44px, jarak ikon–teks `card/body-gap`, nama memakai token title (16 semibold), ukuran file body 14, persen progress hint 12 warna primer, border 1px (belum diverifikasi visual — kartu hanya muncul setelah memilih file) |
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
