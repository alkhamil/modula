import { useCallback, useState, type ReactNode } from 'react';
import { useClickOutside } from '../hooks';
import { NavSettingsIcon } from '../components/icons';
import { useTheme } from './ThemeContext';

const PRIMARY_PRESETS = ['#2563eb', '#0f766e', '#15803d', '#b45309', '#dc2626'];

const RADIUS_PRESETS: {
  label: string;
  value: { radiusSm: string; radiusMd: string; radiusLg: string };
}[] = [
  { label: 'Sharp', value: { radiusSm: '0', radiusMd: '0.125rem', radiusLg: '0.25rem' } },
  { label: 'Default', value: { radiusSm: '0.125rem', radiusMd: '0.25rem', radiusLg: '0.5rem' } },
  { label: 'Round', value: { radiusSm: '0.5rem', radiusMd: '0.75rem', radiusLg: '1rem' } },
];

function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="mb-2 text-xs font-semibold text-muted-foreground">{children}</p>;
}

interface ThemeCustomizerProps {
  testId?: string;
}

/**
 * Floating button untuk mengubah thema saat runtime (mode, warna primary,
 * radius). Perubahan langsung diterapkan ke seluruh aplikasi dan tersimpan
 * di localStorage.
 */
function ThemeCustomizer({ testId }: ThemeCustomizerProps) {
  const { theme, tokens, setTheme, updateOverrides, resetOverrides } = useTheme();
  const [open, setOpen] = useState(false);
  const rootRef = useClickOutside<HTMLDivElement>(useCallback(() => setOpen(false), []));

  const activeRadius =
    RADIUS_PRESETS.find(
      (p) =>
        tokens.radiusSm === p.value.radiusSm &&
        tokens.radiusMd === p.value.radiusMd &&
        tokens.radiusLg === p.value.radiusLg,
    )?.label ?? 'Custom';

  return (
    <div data-testid={testId} ref={rootRef} className="fixed right-6 bottom-6 z-[200]">
      {open && (
        <div className="absolute right-0 bottom-14 w-72 rounded-xl border border-border bg-background p-4 shadow-xl">
          <div className="mb-4">
            <SectionLabel>Mode</SectionLabel>
            <div className="flex gap-2">
              {(['light', 'dark'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setTheme(mode)}
                  className={[
                    'flex-1 rounded-md border px-3 py-1.5 text-sm font-medium capitalize transition-colors',
                    theme === mode
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border text-foreground hover:bg-muted',
                  ].join(' ')}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <SectionLabel>Primary color</SectionLabel>
            <div className="flex items-center gap-2">
              {PRIMARY_PRESETS.map((color) => (
                <button
                  key={color}
                  type="button"
                  aria-label={`primary-${color}`}
                  onClick={() => updateOverrides({ primary: color })}
                  style={{ backgroundColor: color }}
                  className={[
                    'h-8 w-8 rounded-full border border-border transition-transform',
                    tokens.primary.toLowerCase() === color.toLowerCase()
                      ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background'
                      : '',
                  ].join(' ')}
                />
              ))}
              <input
                type="color"
                aria-label="custom-primary"
                value={tokens.primary}
                onChange={(e) => updateOverrides({ primary: e.target.value })}
                className="h-8 w-10 cursor-pointer rounded-md border border-border bg-background p-0.5"
              />
            </div>
            <p className="mt-1.5 font-mono text-xs text-muted-foreground">{tokens.primary}</p>
          </div>

          <div className="mb-4">
            <SectionLabel>Radius: {activeRadius}</SectionLabel>
            <div className="flex gap-2">
              {RADIUS_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => updateOverrides(preset.value)}
                  className={[
                    'flex-1 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors',
                    activeRadius === preset.label
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border text-foreground hover:bg-muted',
                  ].join(' ')}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={resetOverrides}
            className="w-full rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Reset ke default
          </button>
        </div>
      )}

      <button
        type="button"
        aria-label="Pengaturan thema"
        onClick={() => setOpen((v) => !v)}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition-colors hover:bg-primary/85"
      >
        <NavSettingsIcon className="h-6 w-6" />
      </button>
    </div>
  );
}

export default ThemeCustomizer;
