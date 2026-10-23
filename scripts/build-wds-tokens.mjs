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
      // Token Figma tonal/elevated destructive+disabled memakai `text.danger-subtle` (= warna latar tonal,
      // hampir sama dengan latar elevated) sehingga teks tak terbaca; pakai `text.danger-disabled` seperti hierarchy lain.
      const fg = destructive && state === 'disabled' ? get('text').replace('text-danger-subtle', 'text-danger-disabled') : get('text');
      btn.push(
        `${selector} {`,
        `  --btn-bg: ${get('background')};`,
        `  --btn-fg: ${fg};`,
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
  { kind: 'radio', coll: 'Radio btn states', states: ['default', 'selected', 'disabled-off', 'disabled-on', 'error'] },
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

// ---------- field.generated.css (Input field, Textarea) ----------
// State DOM: default, selected (fokus + kosong), typing (fokus + isi), filled, disabled,
// error-empty, error-filled, read-only. Cincin fokus (state `focused`) ada di CSS statis.
const FIELD_STATES = ['default', 'selected', 'typing', 'filled', 'disabled', 'error-empty', 'error-filled', 'read-only'];
const fld = [HEADER, '@layer components {', ''];
const FIELD_COLORS = [
  ['--f-bg', 'color.background'],
  ['--f-fg', 'color.text'],
  ['--f-icon', 'color.icons'],
  ['--f-icon-error', 'color.icons-error'],
  ['--f-stroke', 'color.stroke'],
  ['--f-hint', 'color.hint'],
  ['--f-dd-bg', 'color.dropdown'],
  ['--f-dd-fg', 'color.dropdown-text'],
  ['--f-dd-icon', 'color.dropdown-icons'],
  ['--f-dd-stroke', 'color.dropdown-stroke'],
];
const sides = (get, prefix) => ['top', 'right', 'bottom', 'left'].map((side) => get(`${prefix}${side}`)).join(' ');

// Input field: style (box/underline) x state
for (const style of store.get('Input styles').keys()) {
  const sty = entries('Input styles', style);
  const sel = { 'Input styles': style, Size: 'md' };
  const g = (key) => toCss(key, sty.get(key), { coll: 'Input styles', sel });
  fld.push(
    `.wds-field[data-kind="input"][data-appearance="${style}"] {`,
    `  --f-radius: ${g('radius')};`,
    `  --f-focus-radius: ${g('focus.radius')};`,
    `  --f-bw: ${['top', 'right', 'bottom', 'left'].map((side) => g(`stroke.${side}`)).join(' ')};`,
    `  --f-dd-lead-pad: ${sides(g, 'padding.leading-dropdown.')};`,
    `  --f-dd-trail-pad: ${sides(g, 'padding.trailing-dropdown.')};`,
    '}',
    '',
  );
  for (const state of FIELD_STATES) {
    const e = entries('Input states', state);
    const sc = { ...sel, 'Input states': state };
    const items = FIELD_COLORS.filter(([, key]) => e.has(key)).map(
      ([name, key]) => `  ${name}: ${toCss(key, e.get(key), { coll: 'Input states', sel: sc })};`,
    );
    fld.push(`.wds-field[data-kind="input"][data-appearance="${style}"][data-state="${state}"] {`, ...items, '}', '');
  }
}

// Textarea: satu style (box); mode `focus` Figma = state `selected`
{
  const sty = entries('Textarea styles', 'box');
  const sel = { 'Textarea styles': 'box', Size: 'md' };
  const g = (key) => toCss(key, sty.get(key), { coll: 'Textarea styles', sel });
  fld.push(
    `.wds-field[data-kind="textarea"] {`,
    `  --f-radius: ${g('radius')};`,
    `  --f-focus-radius: ${g('focus.radius')};`,
    `  --f-bw: ${['top', 'right', 'bottom', 'left'].map((side) => g(`stroke.${side}`)).join(' ')};`,
    `  --f-pad: ${g('padding.top')} ${g('padding.right')} ${g('padding.bottom')} ${g('padding.left')};`,
    `  --f-resize: ${g('color.resize-line')};`,
    '}',
    '',
  );
  const TEXTAREA_MODE = { selected: 'focus' };
  for (const state of FIELD_STATES) {
    const mode = TEXTAREA_MODE[state] ?? state;
    const e = entries('Textarea states', mode);
    const sc = { ...sel, 'Textarea states': mode };
    const pairs = [['--f-bg', 'color.background'], ['--f-fg', 'color.text'], ['--f-stroke', 'color.stroke'], ['--f-hint', 'color.hint']];
    const items = pairs.map(([name, key]) => `  ${name}: ${toCss(key, e.get(key), { coll: 'Textarea states', sel: sc })};`);
    fld.push(`.wds-field[data-kind="textarea"][data-state="${state}"] {`, ...items, '}', '');
  }
}
// Select & Date Picker: kotak seperti Input (tanpa state typing), + warna tag (Select) per style.
const COMBO_STATES = ['default', 'selected', 'filled', 'disabled', 'error-empty', 'error-filled', 'read-only'];
const COMBO_COLORS = [
  ['--f-bg', 'color.background'],
  ['--f-fg', 'color.text'],
  ['--f-icon', 'color.icons'],
  ['--f-stroke', 'color.stroke'],
  ['--f-hint', 'color.hint'],
];
const COMBOS = [
  { kind: 'select', styles: 'Select styles', states: 'Select states', radius: 'radius', bw: (side) => `stroke.${side}`, extra: ['tag-background', 'tag-text', 'tag-icon'] },
  { kind: 'date', styles: 'Date Picker styles', states: 'Date Picker states', radius: 'radius.input', bw: (side) => `stroke-weight.${side}`, extra: [] },
];
for (const combo of COMBOS) {
  for (const style of store.get(combo.styles).keys()) {
    const sty = entries(combo.styles, style);
    const sel = { [combo.styles]: style, Size: 'md' };
    const g = (key) => toCss(key, sty.get(key), { coll: combo.styles, sel });
    const items = [
      `  --f-radius: ${g(combo.radius)};`,
      `  --f-focus-radius: ${g('focus.radius')};`,
      `  --f-bw: ${['top', 'right', 'bottom', 'left'].map((side) => g(combo.bw(side))).join(' ')};`,
    ];
    if (combo.kind === 'select') {
      items.push(`  --f-pad: ${['top', 'right', 'bottom', 'left'].map((side) => g(`padding.${side}`)).join(' ')};`);
      items.push(`  --f-tag-bg: ${g('color.tag-background')};`, `  --f-tag-fg: ${g('color.tag-text')};`, `  --f-tag-icon: ${g('color.tag-icon')};`);
    }
    fld.push(`.wds-field[data-kind="${combo.kind}"][data-appearance="${style}"] {`, ...items, '}', '');
    for (const state of COMBO_STATES) {
      const e = entries(combo.states, state);
      const sc = { ...sel, [combo.states]: state };
      const lines = COMBO_COLORS.filter(([, key]) => e.has(key)).map(
        ([name, key]) => `  ${name}: ${toCss(key, e.get(key), { coll: combo.states, sel: sc })};`,
      );
      fld.push(`.wds-field[data-kind="${combo.kind}"][data-appearance="${style}"][data-state="${state}"] {`, ...lines, '}', '');
    }
  }
}
fld.push('}', '');
writeFileSync(join(OUT, 'wds/field.generated.css'), fld.join('\n'));

// ---------- menu.generated.css (Dropdown, Menu item, kalender) ----------
const mnu = [HEADER, '@layer components {', ''];
{
  const dd = entries('Dropdown styles', 'default');
  const sel = { 'Dropdown styles': 'default', Size: 'md' };
  const g = (key) => toCss(key, dd.get(key), { coll: 'Dropdown styles', sel });
  const sz = (key) => toCss(key, entries('Size', 'md').get(key), { coll: 'Size', sel: { Size: 'md' } });
  mnu.push(
    '.wds-menu {',
    `  --m-bg: ${g('color.background')};`,
    `  --m-stroke: ${g('color.stroke')};`,
    `  --m-radius: ${sz('dropdown.radius')};`,
    `  --m-stroke-w: ${sz('dropdown.stroke')};`,
    `  --m-pad: ${['top', 'right', 'bottom', 'left'].map((side) => sz(`dropdown.padding.${side}`)).join(' ')};`,
    `  --m-gap: ${sz('dropdown.gap')};`,
    '}',
    '',
  );
  for (const state of store.get('Menu item states').keys()) {
    const e = entries('Menu item states', state);
    const sc = { 'Menu item states': state, Size: 'md' };
    const items = [
      ['--mi-bg', 'color.background'],
      ['--mi-fg', 'color.text'],
      ['--mi-support', 'color.supporting-text'],
      ['--mi-icon', 'color.icons'],
    ].map(([name, key]) => `  ${name}: ${toCss(key, e.get(key), { coll: 'Menu item states', sel: sc })};`);
    mnu.push(`.wds-menu__item[data-state="${state}"] {`, ...items, '}', '');
  }
  // Kalender (Date Picker): warna per style + day cell per state.
  for (const style of store.get('Date Picker styles').keys()) {
    const e = entries('Date Picker styles', style);
    const sc = { 'Date Picker styles': style, Size: 'md' };
    const c = (key) => toCss(key, e.get(key), { coll: 'Date Picker styles', sel: sc });
    mnu.push(
      `.wds-cal[data-appearance="${style}"] {`,
      `  --c-bg: ${c('color.background-calendar')};`,
      `  --c-radius: ${c('radius.calendar')};`,
      `  --c-header: ${c('color.header-text')};`,
      `  --c-weekday: ${c('color.weekday-text')};`,
      `  --c-nav: ${c('color.nav-icons')};`,
      `  --c-divider: ${toCss('color.divider', entries('Calendar styles', 'default').get('color.divider'), { coll: 'Calendar styles', sel: sc })};`,
      '}',
      '',
    );
  }
}
mnu.push('}', '');
writeFileSync(join(OUT, 'wds/menu.generated.css'), mnu.join('\n'));

// ---------- feedback.generated.css (Badge, Alert, Tooltip) ----------
const fb = [HEADER, '@layer components {', ''];
{
  const sz = (key) => toCss(key, entries('Size', 'md').get(key), { coll: 'Size', sel: { Size: 'md' } });
  // Badge: warna per style (neutral, primary, info, success, warning, danger)
  for (const style of store.get('Badge styles').keys()) {
    const e = entries('Badge styles', style);
    const sel = { 'Badge styles': style, Size: 'md' };
    const c = (key) => toCss(key, e.get(key), { coll: 'Badge styles', sel });
    fb.push(
      `.wds-badge[data-style="${style}"] {`,
      `  --b-bg: ${c('background')};`,
      `  --b-fg: ${c('text')};`,
      `  --b-icon: ${c('icons')};`,
      `  --b-counter-fg: ${c('text-counter')};`,
      '}',
      '',
    );
  }
  // Alert: style (info, success, warning, danger) x varian (basic, solid, light, left-stroke)
  for (const style of store.get('Alert styles').keys()) {
    for (const variant of store.get('Alert variant').keys()) {
      const e = entries('Alert variant', variant);
      const sel = { 'Alert styles': style, 'Alert variant': variant, Size: 'md' };
      const c = (key) => toCss(key, e.get(key), { coll: 'Alert variant', sel });
      fb.push(
        `.wds-alert[data-style="${style}"][data-appearance="${variant}"] {`,
        `  --a-bg: ${c('color.background')};`,
        `  --a-title: ${c('color.title')};`,
        `  --a-support: ${c('color.supporting-text')};`,
        `  --a-icon: ${c('color.icons')};`,
        `  --a-close: ${c('color.close')};`,
        `  --a-action: ${c('color.action')};`,
        `  --a-stroke: ${c('color.stroke')};`,
        `  --a-bw: ${['top', 'right', 'bottom', 'left'].map((side) => c(`stroke.${side}`)).join(' ')};`,
        '}',
        '',
      );
    }
  }
  fb.push('.wds-alert {', `  --a-radius: ${sz('alert.root-radius')};`, `  --a-text-gap: ${sz('alert.text-gap')};`, '}', '');
  // Tooltip
  const tt = entries('Tooltip styles', 'default');
  const tsel = { 'Tooltip styles': 'default', Size: 'md' };
  fb.push(
    '.wds-tooltip {',
    `  --t-bg: ${toCss('color.background', tt.get('color.background'), { coll: 'Tooltip styles', sel: tsel })};`,
    `  --t-fg: ${toCss('color.text', tt.get('color.text'), { coll: 'Tooltip styles', sel: tsel })};`,
    '}',
    '',
  );
}
fb.push('}', '');
writeFileSync(join(OUT, 'wds/feedback.generated.css'), fb.join('\n'));

const count = [...store.values()].reduce((n, modes) => n + modes.size, 0);
console.log(`WDS tokens: ${store.size} koleksi, ${count} mode; Button ${HIERARCHIES.length} hierarchy x ${STATES.length} state.`);
