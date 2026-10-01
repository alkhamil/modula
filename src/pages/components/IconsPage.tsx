import { useState } from 'react';
import * as IconSet from '../../shared/components/icons';
import { TextField } from '../../shared/components/ui';
import DocSection from './DocSection';

type IconComponent = (props: { className?: string }) => React.JSX.Element;

const ICONS = Object.entries(IconSet).filter(
  (entry): entry is [string, IconComponent] => typeof entry[1] === 'function',
);

function IconsPage() {
  const [query, setQuery] = useState('');
  const filtered = ICONS.filter(([name]) =>
    name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <div className="flex flex-col section-gap">
      <DocSection
        title={`Ikon (${ICONS.length})`}
        description="SVG internal di src/shared/components/icons. Semua menerima className untuk ukuran (h-4 w-4, h-5 w-5) dan mengikuti warna teks thema. Impor bernama dari shared/components/icons."
      >
        <TextField
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari ikon…"
          maxLength={50}
        />
        <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {filtered.map(([name, Icon]) => (
            <li
              key={name}
              title={name}
              className="flex flex-col items-center gap-2 rounded-lg border border-border bg-background px-2 py-4"
            >
              <Icon className="h-6 w-6 text-foreground" />
              <span className="w-full truncate text-center font-mono text-xs text-muted-foreground">
                {name}
              </span>
            </li>
          ))}
        </ul>
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground">Tidak ada ikon yang cocok.</p>
        )}
      </DocSection>
    </div>
  );
}

export default IconsPage;
