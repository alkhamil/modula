import DocSection from './DocSection';

const SCALE: { name: string; classes: string; sample: string }[] = [
  { name: 'Halaman (h1)', classes: 'text-lg font-semibold', sample: 'Daftar Pengguna' },
  { name: 'Judul kartu (h2)', classes: 'text-base font-semibold', sample: 'Informasi Akun' },
  { name: 'Subjudul (h3)', classes: 'text-sm font-semibold', sample: 'Data Pribadi' },
  {
    name: 'Body',
    classes: 'text-sm font-normal',
    sample: 'Teks isi standar untuk paragraf, label nilai, dan konten umum.',
  },
  {
    name: 'Kecil / sekunder',
    classes: 'text-xs',
    sample: 'Teks bantu: helper field, keterangan tabel, timestamp.',
  },
  { name: 'Mono', classes: 'font-mono text-xs', sample: 'user.view, src/modules/user/' },
];

const TEXT_TOKENS: { name: string; classes: string }[] = [
  { name: 'text-foreground', classes: 'text-foreground' },
  { name: 'text-muted-foreground', classes: 'text-muted-foreground' },
  { name: 'text-primary', classes: 'text-primary' },
  { name: 'text-danger', classes: 'text-danger' },
  { name: 'text-success', classes: 'text-success' },
  { name: 'text-warning', classes: 'text-warning' },
  { name: 'text-info', classes: 'text-info' },
];

function TypographyPage() {
  return (
    <div className="flex flex-col section-gap">
      <DocSection
        title="Skala tipe"
        description="Skala yang dipakai di seluruh aplikasi. Judul halaman memakai text-lg, judul kartu text-base, teks isi text-sm."
      >
        <div className="flex flex-col stack-gap">
          {SCALE.map((item) => (
            <div key={item.name} className="grid grid-cols-[160px_1fr] items-baseline gap-4">
              <span className="font-mono text-xs text-muted-foreground">{item.name}</span>
              <p className={`${item.classes} text-foreground`}>{item.sample}</p>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection
        title="Warna teks"
        description="Selalu pakai token warna teks thema — jangan hardcode hex atau gray-500."
      >
        <div className="flex flex-col stack-gap">
          {TEXT_TOKENS.map((item) => (
            <div key={item.name} className="grid grid-cols-[160px_1fr] items-baseline gap-4">
              <span className="font-mono text-xs text-muted-foreground">{item.name}</span>
              <p className={`text-sm font-medium ${item.classes}`}>Contoh teks {item.name}</p>
            </div>
          ))}
        </div>
      </DocSection>
    </div>
  );
}

export default TypographyPage;
