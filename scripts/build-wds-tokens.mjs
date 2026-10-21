/* Generate token WDS dari `tokens/tokens.json` (ekspor variable Figma, 105 koleksi).
 *
 * Output (jangan edit manual, jalankan ulang `npm run tokens:build`):
 *   src/shared/theme/wds/tokens.generated.css  primitif + semantic (light/dark) + Size (xs..xl)
 *   src/shared/theme/wds/button.generated.css  matriks warna Button (hierarchy x destructive x state)
 *   src/shared/theme/wds/selection.generated.css  warna Checkbox/RadioButton/Toggle (style x state)
 *   src/shared/theme/wds.generated.ts          nilai hex semantic (light/dark) untuk theme.ts
 *
 * Alias `{path}` antar koleksi diresolusi di sini (JSON tanpa ID variable, jadi
 * dicocokkan lewat path): koleksi global (Semantic, Typography, Primitives) dulu,
 * lalu koleksi lain yang terpilih. Primitif/semantic dipertahankan sebagai
 * `var(--wds-...)` supaya mode light/dark tetap berjalan lewat CSS.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'src/shared/theme');
const HEADER = '/* GENERATED oleh scripts/build-wds-tokens.mjs — jangan edit manual (npm run tokens:build). */\n';

// ---------- baca & indeks ----------
const raw = JSON.parse(readFileSync(join(ROOT, 'tokens/tokens.json'), 'utf8'));
/** koleksi → mode → Map(path → { type, value }) */
const store = new Map();
function flat(obj, prefix, out) {
  for (const [key, val] of Object.entries(obj)) {
    if (val && typeof val === 'object' && '$value' in val) out.set(prefix + key, { type: val.$type, value: val.$value });
    else if (val && typeof val === 'object') flat(val, `${prefix}${key}.`, out);
  }
}
for (const item of raw) {
  const [[name, coll]] = Object.entries(item);
  const modes = new Map();
  for (const [mode, tree] of Object.entries(coll.modes ?? {})) {
    const map = new Map();
    flat(tree, '', map);
    modes.set(mode, map);
  }
  store.set(name, modes);
}
const entries = (coll, mode) => {
  const map = store.get(coll)?.get(mode);
  if (!map) throw new Error(`Koleksi/mode tak ada: ${coll}/${mode}`);
  return map;
};

const GLOBAL_ORDER = ['Semantic', 'Typography', 'Primitives', 'Size icons'];
const GLOBAL_MODE = { Semantic: 'Light', Typography: 'Mode 1', Primitives: 'Base', 'Size icons': 'Base' };

// Angka negatif (mis. `spacing.-8`) diberi `neg-` agar tidak bentrok dengan versi positifnya.
const cssName = (path) =>
  path
    .toLowerCase()
    .replace(/(^|\.)-(\d)/g, '$1neg-$2')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
const WEIGHTS = { regular: 400, medium: 500, 'semi bold': 600, bold: 700 };

/** Nama CSS variable untuk token global / Size. */
function varName(coll, path) {
  if (coll === 'Size') return `--wds-sz-${cssName(path)}`;
  if (coll === 'Size icons') return `--wds-icon-${cssName(path)}`; // path berupa angka polos (mis. `8`)
  return `--wds-${cssName(path)}`;
}

// ---------- resolver ----------
/** Cari `ref` di koleksi global, lalu koleksi terpilih (sel) selain `from`, terakhir `from` sendiri. */
function lookup(ref, sel, from) {
  const order = [...GLOBAL_ORDER, ...Object.keys(sel).filter((c) => c !== from && !GLOBAL_ORDER.includes(c)), from];
  for (const coll of order) {
    const mode = GLOBAL_MODE[coll] ?? sel[coll];
    if (!mode || !store.get(coll)?.has(mode)) continue;
    const entry = entries(coll, mode).get(ref);
    if (entry) return { coll, mode, path: ref, entry };
  }
  throw new Error(`Alias tak teresolusi: {${ref}} (dari ${from}, pilihan ${JSON.stringify(sel)})`);
}

function format(path, entry) {
  const { type, value } = entry;
  if (type === 'color') {
    if (typeof value !== 'string' || /NaN|undefined/.test(value)) return 'transparent'; // ekspor Figma: warna kosong
    return value;
  }
  if (type === 'float') {
    if (path.startsWith('opacity')) return String(Number(value) / 100);
    return `${value}px`;
  }
  if (type === 'string') {
    if (path.includes('font.weight')) return String(WEIGHTS[String(value).toLowerCase()] ?? value);
    if (path.includes('font.family')) return `'${value}', ui-sans-serif, system-ui, sans-serif`;
    return String(value);
  }
  return null; // boolean: tidak dipancarkan sebagai CSS variable
}

/**
 * Resolusi token ke ekspresi CSS. `literal` = nilai akhir tanpa var() (untuk TS);
 * selain itu primitif/semantic/Size tetap `var(--wds-...)`.
 */
function toCss(path, entry, ctx, literal = false) {
  const { value } = entry;
  if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
    const found = lookup(value.slice(1, -1), ctx.sel, ctx.coll);
    const isVarLayer = GLOBAL_ORDER.includes(found.coll) || found.coll === 'Size';
    if (isVarLayer && !literal) return `var(${varName(found.coll, found.path)})`;
    return toCss(found.path, found.entry, { ...ctx, coll: found.coll }, literal);
  }
  return format(path, entry);
}

// ---------- tokens.generated.css ----------
const lines = [HEADER];
const decl = (name, css) => `  ${name}: ${css};`;

/** Pastikan dua path berbeda tidak menghasilkan nama CSS variable yang sama. */
function guardNames(scope, pairs) {
  const seen = new Map();
  for (const [name, path] of pairs) {
    if (seen.has(name) && seen.get(name) !== path) {
      throw new Error(`Nama CSS variable bentrok di ${scope}: ${name} ← "${seen.get(name)}" & "${path}"`);
    }
    seen.set(name, path);
  }
}

function block(selector, items) {
  lines.push(`${selector} {`, ...items, '}', '');
}

// primitif + typography (satu nilai, tak bergantung mode)
const baseItems = [];
for (const coll of ['Primitives', 'Typography', 'Size icons']) {
  for (const [path, entry] of entries(coll, GLOBAL_MODE[coll])) {
    const css = toCss(path, entry, { coll, sel: {} });
    if (css !== null) baseItems.push(decl(varName(coll, path), css));
  }
}
guardNames('base', ['Primitives', 'Typography', 'Size icons'].flatMap((coll) => [...entries(coll, GLOBAL_MODE[coll]).keys()].map((p) => [varName(coll, p), `${coll}:${p}`])));
block(':root', baseItems);

// semantic: Light = default, Dark lewat data-theme="dark"
for (const [mode, selector] of [['Light', ':root,\n:root[data-theme="light"]'], ['Dark', ':root[data-theme="dark"]']]) {
  const items = [];
  for (const [path, entry] of entries('Semantic', mode)) {
    const css = toCss(path, entry, { coll: 'Semantic', sel: { Semantic: mode } });
    if (css !== null) items.push(decl(varName('Semantic', path), css));
  }
  block(selector, items);
}

// Size: md = default, mode lain lewat data-wds-size
for (const mode of store.get('Size').keys()) {
  const items = [];
  for (const [path, entry] of entries('Size', mode)) {
    const css = toCss(path, entry, { coll: 'Size', sel: { Size: mode } });
    if (css !== null) items.push(decl(varName('Size', path), css));
  }
  block(mode === 'md' ? ':root,\n[data-wds-size="md"]' : `[data-wds-size="${mode}"]`, items);
}
mkdirSync(join(OUT, 'wds'), { recursive: true });
writeFileSync(join(OUT, 'wds/tokens.generated.css'), lines.join('\n'));

// ---------- wds.generated.ts (hex semantic) ----------
const semantic = {};
for (const [mode, key] of [['Light', 'light'], ['Dark', 'dark']]) {
  semantic[key] = {};
  for (const [path, entry] of entries('Semantic', mode)) {
    const css = toCss(path, entry, { coll: 'Semantic', sel: { Semantic: mode } }, true);
    if (css !== null) semantic[key][path] = css;
  }
}
const primitives = {};
for (const [path, entry] of entries('Primitives', 'Base')) {
  if (entry.type === 'color') primitives[path] = toCss(path, entry, { coll: 'Primitives', sel: {} }, true);
}
writeFileSync(
  join(OUT, 'wds.generated.ts'),
  `${HEADER}\n/** Token semantic WDS (nilai akhir) per thema — dipakai \`theme.ts\`. */\nexport const wdsSemantic = ${JSON.stringify(semantic, null, 2)} as const;\n\n/** Warna primitif WDS (nilai akhir). */\nexport const wdsPrimitives = ${JSON.stringify(primitives, null, 2)} as const;\n\nexport type WdsSemanticKey = keyof (typeof wdsSemantic)['light'];\n`,
);

// ---------- button.generated.css ----------
const HIERARCHIES = [...store.get('Button hierarchy').keys()];
const STATES = ['default', 'hover', 'pressed', 'disabled', 'focused'];
// Pseudo-class asli + atribut `data-wds-state` (memaksa state, dipakai halaman dokumentasi).
const STATE_SELECTORS = {
  default: [''],
  hover: [':hover:not(:disabled)', '[data-wds-state="hover"]'],
  pressed: [':active:not(:disabled)', '[data-wds-state="pressed"]'],
  disabled: [':disabled', '[data-wds-state="disabled"]'],
  focused: [':focus-visible', '[data-wds-state="focused"]'],
};
const btn = [HEADER, '@layer components {', ''];
for (const h of HIERARCHIES) {
  const sel0 = { 'Button hierarchy': h, 'Button states': 'default' };
  const hier = entries('Button hierarchy', h);
  const stroke = ['top', 'right', 'bottom', 'left']
    .map((side) => toCss(`stroke.width-${side}`, hier.get(`stroke.width-${side}`), { coll: 'Button hierarchy', sel: sel0 }))
    .join(' ');
  const elev = ['y', 'blur', 'color'].map((k) => toCss(`elevation.${k}`, hier.get(`elevation.${k}`), { coll: 'Button hierarchy', sel: sel0 }));
  btn.push(
    `.wds-btn[data-hierarchy="${h}"] {`,
    `  --btn-stroke-width: ${stroke};`,
    `  --btn-shadow: 0 ${elev[0]} ${elev[1]} ${elev[2]};`,
    '}',
    '',
  );
  for (const destructive of [false, true]) {
    for (const state of STATES) {
      const sel = { 'Button hierarchy': h, 'Button states': state };
      const states = entries('Button states', state);
      const suffix = destructive ? '-destructive' : '';
      const get = (name) => {
        const key = `color.${name}${suffix}`;
        return toCss(key, states.get(key), { coll: 'Button states', sel });
      };
      const selector = STATE_SELECTORS[state]
        .map((suffix) => `.wds-btn[data-hierarchy="${h}"]` + (destructive ? '[data-destructive="true"]' : '') + suffix)
        .join(',\n');
      btn.push(
        `${selector} {`,
        `  --btn-bg: ${get('background')};`,
        `  --btn-fg: ${get('text')};`,
        `  --btn-icon: ${get('icons')};`,
        `  --btn-stroke: ${get('stroke')};`,
        '}',
        '',
      );
    }
  }
}
btn.push('}', '');
writeFileSync(join(OUT, 'wds/button.generated.css'), btn.join('\n'));

// ---------- selection.generated.css (Checkbox, RadioButton, Toggle) ----------
// State DOM = mode token: default, selected, indeterminate, disabled-off, disabled-on, error.
// Fokus ortogonal (cincin di CSS statis). Nilai kosong (NaN) pada disabled-off mewarisi `default`.
const SC_SOURCES = [
  { kind: 'checkbox', coll: 'Checkbox states', states: ['default', 'selected', 'indeterminate', 'disabled-off', 'disabled-on', 'error'] },
  { kind: 'radio', coll: 'RadioButton btn states', states: ['default', 'selected', 'disabled-off', 'disabled-on', 'error'] },
  { kind: 'toggle', coll: 'Toggle states', states: ['default', 'selected', 'disabled-off', 'disabled-on', 'error'] },
];
const SC_BASE = '_Selection Controls';
const scBase = entries(SC_BASE, 'value');
const scBaseCss = (key) => toCss(key, scBase.get(key), { coll: SC_BASE, sel: { [SC_BASE]: 'value' } });
const isNaNValue = (entry) => typeof entry?.value === 'string' && /NaN/.test(entry.value);
const SELECTED_LIKE = new Set(['selected', 'indeterminate', 'disabled-on']);
const sc = [HEADER, '@layer components {', ''];
for (const { kind, coll, states } of SC_SOURCES) {
  const resolve = (state) => {
    const e = entries(coll, state);
    const sel = { [coll]: state, [SC_BASE]: 'value' };
    const val = (key) => {
      let entry = e.get(key);
      if (state === 'disabled-off' && isNaNValue(entry)) entry = entries(coll, 'default').get(key);
      return entry ? toCss(key, entry, { coll, sel: { ...sel, [coll]: isNaNValue(e.get(key)) && state === 'disabled-off' ? 'default' : state } }) : null;
    };
    return { border: val('icons'), dot: val('dot'), bg: val('bg'), opacity: Number(e.get('appearance').value) / 100 };
  };
  sc.push(
    `.wds-sc[data-kind="${kind}"] {`,
    `  --sc-text: ${scBaseCss('text')};`,
    `  --sc-hint: ${scBaseCss('hint')};`,
    `  --sc-border-error: ${scBaseCss('stroke-destructive')};`,
    '}',
    '',
  );
  for (const state of states) {
    const r = resolve(state);
    const selectedLike = SELECTED_LIKE.has(state);
    const variants = kind === 'toggle' ? [null] : ['outline', 'solid'];
    for (const appearance of variants) {
      let fill = 'transparent';
      let mark = r.dot;
      if (kind === 'toggle') fill = r.bg;
      else if (selectedLike && appearance === 'solid') fill = scBaseCss('background-selected');
      else if (selectedLike) mark = r.border;
      const selector =
        `.wds-sc[data-kind="${kind}"]` + (appearance ? `[data-appearance="${appearance}"]` : '') + `[data-state="${state}"]`;
      sc.push(
        `${selector} {`,
        `  --sc-border: ${r.border};`,
        `  --sc-fill: ${fill};`,
        `  --sc-mark: ${mark};`,
        `  --sc-opacity: ${r.opacity};`,
        '}',
        '',
      );
    }
  }
}
sc.push('}', '');
writeFileSync(join(OUT, 'wds/selection.generated.css'), sc.join('\n'));

const count = [...store.values()].reduce((n, modes) => n + modes.size, 0);
console.log(`WDS tokens: ${store.size} koleksi, ${count} mode; Button ${HIERARCHIES.length} hierarchy x ${STATES.length} state.`);
