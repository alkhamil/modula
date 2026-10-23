/* Generate komponen React ikon WDS (Outline + Bold Duotone) dari SVG hasil
 * `scripts/download-wds-icons.py` (`src/assets/icons/wds/manifest.json`).
 *
 * Output (jangan edit manual, jalankan ulang `npm run icons:build`):
 *   src/shared/components/icons/wds/<style>/<kategori>.tsx  1 file per style+kategori (lazy)
 *   src/shared/components/icons/wds/index.json      { NamaIkon: kategori }
 *   src/shared/components/icons/core.tsx           ikon yang dipakai langsung di app (CURATED)
 *   src/shared/components/icons/index.ts            barrel: core + WdsIcon (lookup dinamis)
 *
 * Warna SVG diganti `currentColor` agar ikut `text-*`. Modul kategori hanya
 * dimuat lazy (`WdsIcon`); ikon yang dipakai statis disalin ke `core.tsx` supaya
 * kategori utuh tidak ikut bundel utama.
 */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'src/shared/components/icons');
/** Style → folder output. Outline = default (statis di core.tsx + lazy); Bold Duotone = lazy (`variant`). */
const STYLES = [
  { name: 'Outline', dir: 'outline' },
  { name: 'Bold Duotone', dir: 'bold-duotone' },
];

/** Ikon yang diekspor lewat barrel `shared/components/icons` (dipakai langsung di app). */
const CURATED = [
  'AddCircle', 'AltArrowDown', 'AltArrowLeft', 'AltArrowRight', 'AltArrowUp', 'Bolt', 'Box', 'Calendar',
  'CalendarDate', 'Camera', 'Check', 'CheckCircle', 'Cross', 'CheckSquare', 'Checklist', 'ChecklistMinimalistic',
  'ClockCircle', 'CloseCircle', 'Command', 'DangerCircle', 'DangerTriangle', 'Database', 'Dollar',
  'DoubleAltArrowLeft', 'DoubleAltArrowRight', 'Download', 'Eye', 'File', 'FileText', 'Filter', 'Global',
  'HamburgerMenu', 'Hashtag', 'InfoCircle', 'Layers', 'LinkMinimalistic', 'Lock', 'Logout2', 'Magnifer',
  'MenuDotsVertical', 'Minus', 'Palette', 'Pen', 'Pen2', 'Planet', 'Power', 'QuestionCircle', 'Record', 'Restart', 'Settings',
  'Text', 'TextBold', 'TextField', 'TrashBinTrash', 'Tuning2', 'Upload', 'UsersGroupRounded', 'Widget',
  'Widget2', 'Plus', 'Star', 'Paperclip', 'Gallery', 'SendSquare', 'Bell', 'ChatRoundDots', 'Clipboard', 'Microphone', 'SmileCircle', 'Sun', 'Moon',
];

/** Ikon yang juga diekspor versi Bold Duotone ("filled") dengan akhiran `Bold` (mis. `InfoCircleBold`). */
const BOLD_CURATED = ['InfoCircle', 'CheckCircle', 'DangerTriangle', 'DangerCircle', 'CloseCircle'];

/** Nama yang menimpa global JS (dilarang lint) — diberi prefix `Icon`. */
const GLOBAL_NAMES = new Set(['Infinity', 'NaN', 'undefined']);

const pascal = (text) =>
  text
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join('');

const manifest = JSON.parse(readFileSync(join(ROOT, 'src/assets/icons/wds/manifest.json'), 'utf8'));

/** Kumpulkan ikon satu style: kategori → [{ name, markup }] + index nama → kategori. */
function collect(styleName) {
  const icons = manifest.icons
    .filter((i) => i.style === styleName)
    .map((i) => ({ ...i, slug: i.file.split('/').slice(-2, -1)[0] }))
    .sort((a, b) => a.slug.localeCompare(b.slug) || a.icon.localeCompare(b.icon));
  const used = new Set();
  const byCategory = new Map();
  const index = {};
  for (const icon of icons) {
    let name = pascal(icon.icon);
    if (/^[0-9]/.test(name) || GLOBAL_NAMES.has(name)) name = `Icon${name}`;
    // Nama kembar antar-kategori: yang pertama (urut kategori) memakai nama polos.
    if (used.has(name)) name = `${name}${pascal(icon.slug)}`;
    used.add(name);
    const raw = readFileSync(join(ROOT, icon.file), 'utf8').trim();
    const match = /^<svg\b([^>]*)>([\s\S]*)<\/svg>$/.exec(raw);
    if (!match) throw new Error(`SVG tak dikenal: ${icon.file}`);
    // Satu ikon (essential-ui/cross) berviewBox 24x25: isinya tetap muat di 24x24.
    if (!/viewBox="0 0 24 2[45]"/.test(match[1])) throw new Error(`viewBox tak dikenal: ${icon.file}`);
    const markup = match[2]
      .replace(/#(?:1C274C|8E93A6)/gi, 'currentColor')
      .replace(/\s*\n\s*/g, '')
      .trim();
    if (!byCategory.has(icon.slug)) byCategory.set(icon.slug, []);
    byCategory.get(icon.slug).push({ name, markup });
    index[name] = icon.slug;
  }
  return { byCategory, index, count: icons.length };
}

const wdsDir = join(OUT, 'wds');
rmSync(wdsDir, { recursive: true, force: true });
const HEADER = '// GENERATED oleh scripts/build-wds-icons.mjs — jangan edit manual (npm run icons:build).\n';

const collected = STYLES.map((style) => ({ ...style, ...collect(style.name) }));
const [outline] = collected;
for (const other of collected.slice(1)) {
  const sortedEntries = (index) => JSON.stringify(Object.entries(index).sort(([a], [b]) => a.localeCompare(b)));
  if (sortedEntries(other.index) !== sortedEntries(outline.index)) {
    throw new Error(`Nama/kategori ikon ${other.name} tak sama dengan ${outline.name}.`);
  }
}

const missing = CURATED.filter((n) => !(n in outline.index));
if (missing.length > 0) throw new Error(`CURATED tak ada di WDS: ${missing.join(', ')}`);

for (const { dir, byCategory } of collected) {
  mkdirSync(join(wdsDir, dir), { recursive: true });
  for (const [slug, items] of byCategory) {
    const body = items
      .map(({ name, markup }) => `export const ${name} = /*#__PURE__*/ createIcon(${JSON.stringify(name)}, ${JSON.stringify(markup)});`)
      .join('\n');
    writeFileSync(join(wdsDir, dir, `${slug}.tsx`), `${HEADER}import { createIcon } from '../../createIcon';\n\n${body}\n`);
  }
}
const sortedIndex = Object.fromEntries(Object.entries(outline.index).sort(([a], [b]) => a.localeCompare(b)));
writeFileSync(join(wdsDir, 'index.json'), `${JSON.stringify(sortedIndex, null, 2)}\n`);

const markupOf = new Map();
for (const items of outline.byCategory.values()) for (const { name, markup } of items) markupOf.set(name, markup);
const coreBody = [...CURATED]
  .sort()
  .map((name) => `export const ${name} = /*#__PURE__*/ createIcon(${JSON.stringify(name)}, ${JSON.stringify(markupOf.get(name))});`)
  .join('\n');
const boldMarkupOf = new Map();
for (const items of collected[1].byCategory.values()) for (const { name, markup } of items) boldMarkupOf.set(name, markup);
const boldBody = BOLD_CURATED.map(
  (name) => `export const ${name}Bold = /*#__PURE__*/ createIcon(${JSON.stringify(`${name}Bold`)}, ${JSON.stringify(boldMarkupOf.get(name))});`,
).join('\n');
writeFileSync(join(OUT, 'core.tsx'), `${HEADER}import { createIcon } from './createIcon';\n\n${coreBody}\n${boldBody}\n`);
writeFileSync(
  join(OUT, 'index.ts'),
  `${HEADER}export { createIcon } from './createIcon';\nexport type { IconComponent, IconProps } from './createIcon';\nexport { default as WdsIcon } from './WdsIcon';\nexport type { WdsIconVariant } from './WdsIcon';\nexport * from './core';\n`,
);
console.log(
  `WDS ${collected.map((c) => `${c.name} ${c.count}`).join(' + ')} ikon, ${outline.byCategory.size} kategori, ${CURATED.length} di core (Outline).`,
);
