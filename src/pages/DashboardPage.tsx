import { useTheme } from '../shared/theme';
import type { ThemeTokens } from '../shared/theme';
import { Card, Button } from '../shared/components/ui';

const COLOR_KEYS: { key: keyof ThemeTokens; label: string }[] = [
  { key: 'primary', label: 'primary' },
  { key: 'secondary', label: 'secondary' },
  { key: 'success', label: 'success' },
  { key: 'warning', label: 'warning' },
  { key: 'danger', label: 'danger' },
  { key: 'info', label: 'info' },
  { key: 'background', label: 'background' },
  { key: 'surface', label: 'surface' },
  { key: 'muted', label: 'muted' },
  { key: 'border', label: 'border' },
  { key: 'foreground', label: 'foreground' },
  { key: 'mutedForeground', label: 'muted-foreground' },
];

function DashboardPage() {
  const { theme, tokens, toggleTheme } = useTheme();

  return (
    <div className="flex flex-col section-gap">
      <Card
        title="Theme Config"
        actions={<Button onClick={toggleTheme}>Ganti ke {theme === 'light' ? 'dark' : 'light'}</Button>}
      >
        <p className="text-sm text-muted-foreground">
          Thema aktif: <span className="font-semibold text-foreground">{theme}</span> — token dari{' '}
          <code className="rounded-sm bg-muted px-1">src/shared/theme/theme.ts</code>
        </p>
        <ul className="mt-4 divide-y divide-border rounded-lg border border-border">
          {COLOR_KEYS.map(({ key, label }) => (
            <li key={key} className="flex items-center gap-3 px-4 py-2">
              <span
                className="h-6 w-6 shrink-0 rounded-sm border border-border"
                style={{ backgroundColor: tokens[key] }}
              />
              <code className="text-sm">{label}</code>
              <span className="ml-auto text-sm text-muted-foreground">{tokens[key]}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Contoh komponen berthema">
        <div className="flex flex-wrap gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button
            variant="custom"
            className="border border-border bg-surface text-foreground hover:bg-muted"
          >
            Outline
          </Button>
          <Button variant="custom" className="bg-danger text-white hover:bg-danger/85">
            Danger
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default DashboardPage;
