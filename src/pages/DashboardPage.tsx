import { useNavigate } from 'react-router';
import { Alert, Badge, Button, Card } from '../shared/components/ui';
import {
  ChevronRightIcon,
  ConfirmSuccessIcon,
  NavMasterDataIcon,
  NavSettingsIcon,
  PencilIcon,
} from '../shared/components/icons';
import { useDynamicDefinitions } from '../modules/generator/runtime/hooks';

const STACK = [
  'React 19',
  'TypeScript',
  'Vite',
  'Tailwind CSS 4',
  'TanStack Query',
  'React Hook Form',
  'React Router 7',
];

const FLOW = [
  { title: 'Config', desc: 'Nama modul, parent, permission, dan fitur.' },
  { title: 'Form Canvas', desc: 'Susun field via palet + drawer properti.' },
  { title: 'Live Preview', desc: 'Isi form contoh tersimpan sebagai data contoh.' },
  { title: 'List Canvas', desc: 'Atur kolom tabel via drag-drop + drawer.' },
  { title: 'Detail Canvas', desc: 'Susun kartu detail + drawer.' },
  { title: 'Review & Generate', desc: 'Publish langsung live atau generate ke repo.' },
];

function StatCard({
  icon,
  iconClass,
  value,
  label,
  testId,
}: {
  icon: React.ReactNode;
  iconClass: string;
  value: number;
  label: string;
  testId?: string;
}) {
  return (
    <Card testId={testId}>
      <div className="flex items-center gap-3">
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClass}`}>
          {icon}
        </span>
        <div className="min-w-0">
          <p className="text-2xl font-semibold leading-none text-foreground">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{label}</p>
        </div>
      </div>
    </Card>
  );
}

function DashboardPage() {
  const navigate = useNavigate();
  const { data: definitions = [], isLoading } = useDynamicDefinitions('');
  const published = definitions.filter((def) => def.status === 'published');
  const drafts = definitions.filter((def) => def.status !== 'published');

  return (
    <div className="flex flex-col section-gap">
      <div
        data-testid="dashboard-hero"
        className="relative overflow-hidden rounded-xl bg-primary text-primary-foreground"
      >
        <NavSettingsIcon className="pointer-events-none absolute -right-8 -top-8 h-48 w-48 rotate-12 opacity-15" />
        <div className="relative flex flex-col gap-4 p-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider opacity-80">
              Platform Modul Dinamis • Mock-Only
            </p>
            <h1 className="mt-1 text-xl font-semibold">Generator Module App</h1>
            <p className="mt-1 max-w-2xl text-sm opacity-90">
              Modul bisnis didefinisikan sebagai data{' '}
              <code className="rounded-sm bg-primary-foreground/15 px-1">ModuleDefinition</code>{' '}
              lewat wizard <code className="rounded-sm bg-primary-foreground/15 px-1">/generator</code>,
              lalu di-render generik saat runtime. Publish membuat modul langsung live di navigasi
              + routes tanpa tulis file dan tanpa restart.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="custom"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              icon={<NavSettingsIcon className="h-4 w-4" />}
              onClick={() => navigate('/generator')}
            >
              Buka Generator
            </Button>
          </div>
          <div className="flex flex-wrap gap-1">
            {STACK.map((item) => (
              <span
                key={item}
                className="rounded-full border border-primary-foreground/30 px-2 py-0.5 text-xs"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          testId="dashboard-stat-total"
          icon={<NavMasterDataIcon className="h-5 w-5" />}
          iconClass="bg-primary/10 text-primary"
          value={definitions.length}
          label="Total modul"
        />
        <StatCard
          testId="dashboard-stat-published"
          icon={<ConfirmSuccessIcon className="h-5 w-5" />}
          iconClass="bg-success/10 text-success"
          value={published.length}
          label="Published (live)"
        />
        <StatCard
          testId="dashboard-stat-draft"
          icon={<PencilIcon className="h-4 w-4" />}
          iconClass="bg-warning/10 text-warning"
          value={drafts.length}
          label="Draft"
        />
      </div>

      <Card testId="dashboard-flow-card" title="Alur Wizard">
        <ol className="flex flex-col">
          {FLOW.map((step, index) => (
            <li key={step.title} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {index + 1}
                </span>
                {index < FLOW.length - 1 && <span className="w-px flex-1 bg-border" />}
              </div>
              <div className="pb-5">
                <p className="text-sm font-medium text-foreground">{step.title}</p>
                <p className="text-xs text-muted-foreground">{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </Card>

      <Card
        testId="dashboard-modules-card"
        title="Modul Published"
        actions={
          <Button size="sm" variant="secondary" onClick={() => navigate('/generator')}>
            Buka Generator
          </Button>
        }
      >
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Memuat…</p>
        ) : published.length === 0 ? (
          <Alert
            variant="info"
            message="Belum ada modul yang live — buat modul pertama lewat Builder di halaman Generator."
          />
        ) : (
          <ul className="divide-y divide-border rounded-lg border border-border">
            {published.map((def) => (
              <li key={def.key}>
                <button
                  type="button"
                  onClick={() => navigate(`/${def.routeBase}`)}
                  title={`Buka /${def.routeBase}`}
                  className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-muted"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-foreground">
                      {def.label}
                    </span>
                    <code className="block truncate font-mono text-xs text-muted-foreground">
                      /{def.routeBase} • {def.fields.length} field
                    </code>
                  </span>
                  <Badge variant="success">Live</Badge>
                  <ChevronRightIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

export default DashboardPage;
