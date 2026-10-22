import { useEffect, useState, type ReactNode } from 'react';
import { CheckCircle, CloseCircle, InfoCircle } from '../../../shared/components/icons';
import CodeBlock from './CodeBlock';
import Playground from './Playground';
import { docCode, resolveProps } from './render';
import type { ComponentDoc, DocExample, DocMatrix, GroupDoc, TokenDoc } from './types';
import { useDocT } from './useDocT';
import Tabs from './ui/Tabs';

const TOC = ['playground', 'figma', 'examples', 'states', 'props', 'group', 'tokens', 'behavior', 'accessibility'] as const;

const th = 'whitespace-nowrap px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground';
const td = 'px-3 py-2.5 align-top text-xs text-foreground';
const chip = 'inline-block rounded-md border border-border bg-surface px-1.5 py-0.5 font-mono text-[11px] text-foreground';

function Section({ id, title, hint, children }: { id: string; title: string; hint?: ReactNode; children: ReactNode }) {
  return (
    <section id={id} className="flex scroll-mt-6 flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        {hint && <p className="max-w-3xl text-xs text-muted-foreground">{hint}</p>}
      </div>
      {children}
    </section>
  );
}

function Table({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-background">
      <table className="w-full border-collapse">
        <thead className="border-b border-border bg-surface">
          <tr>
            {head.map((h) => (
              <th key={h} className={th}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((cells, i) => (
            <tr key={i} className="hover:bg-surface/60">
              {cells.map((cell, j) => (
                <td key={j} className={td}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface ExampleView {
  name: string;
  codeName?: string;
  codeExtra?: string[];
  codeOmit?: string[];
  defaults?: Record<string, unknown>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.ComponentType<any>;
  baseProps: Record<string, unknown>;
  baseChildren?: string;
}

function ExampleBlock({ slug, view, example, keyPrefix = 'examples' }: { slug: string; view: ExampleView; example: DocExample; keyPrefix?: string }) {
  const { t, c } = useDocT(slug);
  const Component = view.component;
  const description = c(`${keyPrefix}.${example.id}.description`, { defaultValue: '' });
  const code = example.variants
    .map((v) => docCode(view, { ...view.baseProps, ...v.props }, v.props.iconOnly || view.baseChildren === undefined ? undefined : (v.children ?? v.label)))
    .join('\n');
  return (
    <div className="flex flex-col gap-2">
      <div>
        <h3 className="text-[13px] font-semibold text-foreground">{c(`${keyPrefix}.${example.id}.title`)}</h3>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      <Tabs
        tabs={[
          {
            id: 'preview',
            label: t('tabs.preview'),
            content: (
              <div className="flex flex-wrap items-center gap-3 p-5">
                {example.variants.map((variant) => (
                  <Component key={variant.label} {...resolveProps({ ...view.baseProps, ...variant.props })}>
                    {variant.props.iconOnly || view.baseChildren === undefined ? undefined : (variant.children ?? variant.label)}
                  </Component>
                ))}
              </div>
            ),
          },
          { id: 'code', label: t('tabs.code'), content: <CodeBlock code={code} flush /> },
        ]}
      />
    </div>
  );
}

function GroupSection({ doc, group }: { doc: ComponentDoc; group: GroupDoc }) {
  const { t, c } = useDocT(doc.slug);
  const view: ExampleView = { ...group, codeName: group.name };
  return (
    <Section id="group" title={t('sections.group.title')} hint={c('group.summary')}>
      <CodeBlock code={group.importStatement} />
      <div className="flex flex-col gap-7">
        {group.examples.map((example) => (
          <ExampleBlock key={example.id} slug={doc.slug} view={view} example={example} keyPrefix="group.examples" />
        ))}
      </div>
      <Table
        head={[t('table.props.prop'), t('table.props.type'), t('table.props.default'), t('table.props.description')]}
        rows={group.props.map((p) => [
          <code key="n" className={`${chip} font-semibold`}>
            {p.name}
          </code>,
          <code key="t" className="font-mono text-[11px] text-primary">
            {p.type}
          </code>,
          <span key="d" className="font-mono text-[11px] text-muted-foreground">
            {p.default ?? '—'}
          </span>,
          <span key="x" className="text-muted-foreground">
            {c(`group.props.${p.id}`)}
          </span>,
        ])}
      />
    </Section>
  );
}

function MatrixBlock({ doc, matrix }: { doc: ComponentDoc; matrix: DocMatrix }) {
  const { c } = useDocT(doc.slug);
  const Component = doc.component;
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-[13px] font-semibold text-foreground">{c(`matrices.${matrix.id}`)}</h3>
      <div className="overflow-x-auto rounded-xl border border-border bg-background">
        <table className="w-full border-collapse">
          <thead className="border-b border-border bg-surface">
            <tr>
              <th className={th} />
              {matrix.columns.map((col) => (
                <th key={col.label} className={th}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {matrix.rows.map((row) => (
              <tr key={row.label}>
                <td className={`${td} bg-surface/50 font-mono text-[11px]`}>{row.label}</td>
                {matrix.columns.map((col) => (
                  <td key={col.label} className="px-3 py-3">
                    <Component {...resolveProps({ ...doc.baseProps, ...row.props, ...col.props })} tabIndex={-1}>
                      {matrix.children ?? doc.baseChildren}
                    </Component>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** Nilai CSS variable yang sedang berlaku (ikut tema aktif). */
function useTokenValues(tokens: TokenDoc[]): Record<string, string> {
  const [values, setValues] = useState<Record<string, string>>({});
  useEffect(() => {
    const read = () => {
      const style = getComputedStyle(document.documentElement);
      setValues(Object.fromEntries(tokens.map((tk) => [tk.name, style.getPropertyValue(tk.name).trim()])));
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'style'] });
    return () => observer.disconnect();
  }, [tokens]);
  return values;
}

/** Bagian yang sedang terlihat (untuk menandai item daftar isi). */
function useActiveSection(ids: readonly string[]): string {
  const [active, setActive] = useState<string>(ids[0] ?? '');
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-10% 0px -70% 0px' },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);
  return active;
}

const COLOR_RE = /^(#|rgb|hsl|color-mix)/i;

function BulletCard({ icon: Icon, tone, items }: { icon: typeof InfoCircle; tone: string; items: string[] }) {
  return (
    <ul className="flex flex-col gap-2 rounded-xl border border-border bg-background p-4">
      {items.map((line) => (
        <li key={line} className="flex gap-2.5 text-[13px] leading-relaxed text-foreground">
          <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${tone}`} />
          <span>{line}</span>
        </li>
      ))}
    </ul>
  );
}

/** Halaman dokumentasi satu komponen (dirender dari data `ComponentDoc` + terjemahan `docs.<slug>`). */
function DocPage({ doc }: { doc: ComponentDoc }) {
  const { t, c, list } = useDocT(doc.slug);
  const tokenValues = useTokenValues(doc.tokens);
  const sections = TOC.filter((id) => (id !== 'states' || doc.matrices) && (id !== 'group' || doc.group));
  const active = useActiveSection(sections);
  const doList = list('guidelines.do');
  const dontList = list('guidelines.dont');

  return (
    <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_152px]" data-testid={`doc-${doc.slug}`}>
      <article className="flex min-w-0 flex-col gap-10">
        <header className="flex flex-col gap-3">
          <span className="w-fit rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
            {t(`categories.${doc.category}`)}
          </span>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{doc.name}</h1>
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">{c('summary')}</p>
          <div className="flex flex-wrap items-center gap-3">
            <div className="min-w-0 flex-1 basis-80">
              <CodeBlock code={doc.importStatement} />
            </div>
            {doc.figmaUrl && (
              <a
                href={doc.figmaUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground hover:border-primary hover:text-primary"
              >
                {t('header.openFigma')}
              </a>
            )}
          </div>
        </header>

        <Section id="playground" title={t('sections.playground.title')} hint={t('sections.playground.hint')}>
          <Playground doc={doc} />
        </Section>

        <Section id="figma" title={t('sections.figma.title')} hint={t('sections.figma.hint')}>
          <Table
            head={[t('table.figma.figma'), t('table.figma.values'), t('table.figma.props'), t('table.figma.notes')]}
            rows={doc.figmaMapping.map((m) => [
              <span key="f" className="font-medium">
                {m.figma}
              </span>,
              <span key="v" className="text-muted-foreground">
                {c(`figma.${m.id}.values`, { defaultValue: m.values })}
              </span>,
              <code key="p" className={chip}>
                {m.prop}
              </code>,
              <span key="n" className="text-muted-foreground">
                {c(`figma.${m.id}.note`, { defaultValue: '' })}
              </span>,
            ])}
          />
        </Section>

        {doc.examples.length > 0 && (
          <Section id="examples" title={t('sections.examples.title')}>
            <div className="flex flex-col gap-7">
              {doc.examples.map((example) => (
                <ExampleBlock key={example.id} slug={doc.slug} view={doc} example={example} />
              ))}
            </div>
          </Section>
        )}

        {doc.matrices && (
          <Section
            id="states"
            title={t('sections.states.title')}
            hint={t('sections.states.hint', { attr: 'data-wds-state' })}
          >
            <div className="flex flex-col gap-5">
              {doc.matrices.map((matrix) => (
                <MatrixBlock key={matrix.id} doc={doc} matrix={matrix} />
              ))}
            </div>
          </Section>
        )}

        <Section id="props" title={t('sections.props.title')}>
          <Table
            head={[t('table.props.prop'), t('table.props.type'), t('table.props.default'), t('table.props.description')]}
            rows={doc.props.map((p) => [
              <code key="n" className={`${chip} font-semibold`}>
                {p.name}
              </code>,
              <code key="t" className="font-mono text-[11px] text-primary">
                {p.type}
              </code>,
              <span key="d" className="font-mono text-[11px] text-muted-foreground">
                {p.default ?? '—'}
              </span>,
              <span key="x" className="text-muted-foreground">
                {c(`props.${p.id}`)}
              </span>,
            ])}
          />
        </Section>

        {doc.group && <GroupSection doc={doc} group={doc.group} />}

        <Section id="tokens" title={t('sections.tokens.title')} hint={t('sections.tokens.hint', { file: 'tokens/tokens.json' })}>
          <Table
            head={[t('table.tokens.variable'), t('table.tokens.value'), t('table.tokens.usage')]}
            rows={doc.tokens.map((tk) => {
              const value = tokenValues[tk.name] ?? '';
              return [
                <code key="n" className={chip}>
                  {tk.name}
                </code>,
                <span key="v" className="flex items-center gap-2 font-mono text-[11px]">
                  {COLOR_RE.test(value) && (
                    <span className="inline-block h-4 w-4 shrink-0 rounded-md border border-border" style={{ background: value }} />
                  )}
                  {value || '—'}
                </span>,
                <span key="u" className="text-muted-foreground">
                  {c(`tokens.${tk.name}`)}
                </span>,
              ];
            })}
          />
        </Section>

        <Section id="behavior" title={t('sections.behavior.title')}>
          <BulletCard icon={CheckCircle} tone="text-success" items={list('behavior')} />
          {(doList.length > 0 || dontList.length > 0) && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold text-success">{t('sections.do')}</p>
                <BulletCard icon={CheckCircle} tone="text-success" items={doList} />
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold text-danger">{t('sections.dont')}</p>
                <BulletCard icon={CloseCircle} tone="text-danger" items={dontList} />
              </div>
            </div>
          )}
        </Section>

        <Section id="accessibility" title={t('sections.accessibility.title')}>
          <BulletCard icon={InfoCircle} tone="text-primary" items={list('accessibility')} />
        </Section>
      </article>

      <nav className="hidden xl:block" aria-label={t('nav.onThisPage')}>
        <div className="sticky top-4 flex flex-col gap-1 border-l border-border pl-4">
          <p className="pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{t('nav.onThisPage')}</p>
          {sections.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className={[
                '-ml-px border-l-2 py-1 pl-3 text-xs transition-colors',
                active === id ? 'border-primary font-medium text-primary' : 'border-transparent text-muted-foreground hover:text-foreground',
              ].join(' ')}
            >
              {t(`sections.${id}.title`)}
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
}

export default DocPage;
