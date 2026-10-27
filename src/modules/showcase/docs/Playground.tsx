import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Icons from '../../../shared/components/icons';
import CodeBlock from './CodeBlock';
import { docCode, resolveProps } from './render';
import { icon, isRawRef, type ComponentDoc, type DocControl } from './types';
import Dropdown from './ui/Dropdown';
import Segmented from './ui/Segmented';
import Toggle from './ui/Toggle';

const NONE = 'none';
const iconMap = Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>;
const BACKGROUNDS = ['white', 'gray', 'dots'] as const;
type Background = (typeof BACKGROUNDS)[number];

const BG_CLASS: Record<Background, string> = {
  white: 'bg-background',
  gray: 'bg-surface',
  dots: 'bg-background [background-image:radial-gradient(var(--theme-border)_1px,transparent_1px)] [background-size:16px_16px]',
};

const inputClass =
  'w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground hover:border-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary';

/** Bandingkan nilai kontrol; string kosong dianggap sama dengan tidak diset, RawRef dibandingkan lewat kodenya. */
function sameValue(a: unknown, b: unknown): boolean {
  const norm = (v: unknown) => (v === '' || v === null ? undefined : isRawRef(v) ? `raw:${v.$raw}` : v);
  return norm(a) === norm(b);
}

function ControlRow({
  control,
  value,
  onChange,
}: {
  control: DocControl;
  value: unknown;
  onChange: (next: unknown) => void;
}) {
  const name = <span className="font-mono text-[11px] text-foreground">{control.label ?? control.prop}</span>;
  if (control.kind === 'toggle') {
    const off = sameValue(value, control.offValue);
    return (
      <div className="flex items-center justify-between gap-3 py-1">
        {name}
        <Toggle
          checked={!off}
          onChange={(on) => onChange(on ? control.onValue : control.offValue)}
          label={control.label ?? control.prop}
        />
      </div>
    );
  }
  if (control.kind === 'boolean') {
    return (
      <div className="flex items-center justify-between gap-3 py-1">
        {name}
        <Toggle checked={Boolean(value)} onChange={onChange} label={control.label ?? control.prop} />
      </div>
    );
  }
  if (control.kind === 'text') {
    return (
      <div className="flex flex-col gap-1.5">
        {name}
        <input
          aria-label={control.prop}
          className={inputClass}
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    );
  }
  if (control.kind === 'icon') {
    const current = (value as { $icon?: string } | undefined)?.$icon ?? NONE;
    return (
      <div className="flex flex-col gap-1.5">
        {name}
        <Dropdown
          label={control.prop}
          value={current}
          options={[NONE, ...(control.options ?? [])]}
          onChange={(next) => onChange(next === NONE ? undefined : icon(next))}
          renderOption={(option) => {
            const Icon = iconMap[option];
            return Icon ? <Icon className="h-4 w-4 text-muted-foreground" /> : null;
          }}
        />
      </div>
    );
  }
  const options = control.options ?? [];
  const current = String(value ?? options[0] ?? '');
  return (
    <div className="flex flex-col gap-1.5">
      {name}
      {options.length <= 6 ? (
        <Segmented label={control.prop} value={current} options={options} onChange={onChange} />
      ) : (
        <Dropdown label={control.prop} value={current} options={options} onChange={onChange} />
      )}
    </div>
  );
}

/** Playground: preview lebar di atas, panel kontrol (grid) di bawahnya, lalu kode JSX. */
function Playground({ doc }: { doc: ComponentDoc }) {
  const [props, setProps] = useState<Record<string, unknown>>(doc.baseProps);
  const [children, setChildren] = useState(doc.baseChildren ?? '');
  const { t } = useTranslation();
  const [background, setBackground] = useState<Background>('white');
  const Component = doc.component;
  const resolved = useMemo(() => resolveProps(props), [props]);
  const iconOnly = Boolean(props.iconOnly);
  // Tombol ikon saja: children diabaikan dan aria-label wajib — kode contoh mencerminkannya.
  const code = docCode(
    doc,
    iconOnly ? { ...props, 'aria-label': doc.name } : props,
    doc.baseChildren !== undefined && !iconOnly ? children : undefined,
  );
  const dirty = props !== doc.baseProps || children !== (doc.baseChildren ?? '');

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-background">
      <div className="flex items-center justify-between gap-2 border-b border-border bg-surface px-4 py-2">
        <span className="text-[11px] font-medium text-muted-foreground">{t('docs.playground.preview')}</span>
        <Segmented
          label={t('docs.playground.background')}
          value={background}
          options={[...BACKGROUNDS]}
          labels={{
            white: t('docs.playground.backgrounds.white'),
            gray: t('docs.playground.backgrounds.gray'),
            dots: t('docs.playground.backgrounds.dots'),
          }}
          onChange={(b) => setBackground(b as Background)}
        />
      </div>
      <div className={`flex h-[24rem] min-h-0 w-full items-center justify-center overflow-auto p-10 xl:h-[30rem] ${BG_CLASS[background]}`}>
        <Component {...resolved} aria-label={iconOnly ? doc.name : undefined}>
          {doc.baseChildren !== undefined && !iconOnly ? children : undefined}
        </Component>
      </div>
      <section className="flex flex-col gap-4 border-t border-border p-4" aria-label={t('docs.playground.controlsLabel')}>
        <div className="flex items-center justify-between">
          <h3 className="text-[13px] font-semibold text-foreground">{t('docs.playground.controls')}</h3>
          <button
            type="button"
            disabled={!dirty}
            onClick={() => {
              setProps(doc.baseProps);
              setChildren(doc.baseChildren ?? '');
            }}
            className="cursor-pointer text-[11px] text-primary hover:underline disabled:cursor-default disabled:text-muted-foreground disabled:no-underline"
          >
            {t('docs.playground.reset')}
          </button>
        </div>
        <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 xl:grid-cols-3">
          {doc.baseChildren !== undefined && (
            <div className="flex flex-col gap-1.5">
              <span className="font-mono text-[11px] text-foreground">children</span>
              <input aria-label="children" className={inputClass} value={children} onChange={(e) => setChildren(e.target.value)} />
            </div>
          )}
          {doc.controls.map((control) => (
            <ControlRow
              key={control.label ?? control.prop}
              control={control}
              value={props[control.prop]}
              onChange={(next) => setProps((prev) => ({ ...prev, [control.prop]: next }))}
            />
          ))}
        </div>
      </section>
      <CodeBlock code={code} flush height="9rem" />
    </div>
  );
}

export default Playground;
