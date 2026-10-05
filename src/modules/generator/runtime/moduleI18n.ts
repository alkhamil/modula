/**
 * Per-module translations (`module:{key}` namespace, embedded as
 * `ModuleDefinition.i18n`). Lookup falls back to the stored English default,
 * so modules without translations render exactly as before.
 * Murni & Node-safe (reads the global i18next language without touching
 * browser APIs; for live switching call inside render).
 */
import i18n from 'i18next';
import '../../../shared/i18n';
import type { ModuleDefinition } from '../definitions';
import type { GeneratorFieldConfig, ModuleLanguage } from '../types';

export type ModuleTitleKind = 'list' | 'create' | 'edit' | 'detail';

export function fieldLabelKey(name: string): string {
  return `field.${name}.label`;
}

export function fieldPlaceholderKey(name: string): string {
  return `field.${name}.placeholder`;
}

export function moduleTitleKey(kind: ModuleTitleKind): string {
  return `title.${kind}`;
}

export function navLabelKey(): string {
  return 'nav.label';
}

function activeModuleLanguage(): ModuleLanguage {
  try {
    const lng = i18n.language ?? 'en';
    return lng.toLowerCase().startsWith('id') ? 'id' : 'en';
  } catch {
    return 'en';
  }
}

/**
 * Resolve a per-module translation key. Fallback chain: active language dict
 * → English dict → provided English default.
 */
export function moduleText(
  def: Pick<ModuleDefinition, 'i18n'> | undefined,
  key: string,
  fallback: string,
): string {
  const dict = def?.i18n;
  if (!dict) return fallback;
  const lng = activeModuleLanguage();
  return dict[lng]?.[key] ?? dict.en?.[key] ?? fallback;
}

/** Translated field label (`field.{name}.label`), fallback = stored label. */
export function moduleFieldLabel(
  def: Pick<ModuleDefinition, 'i18n'> | undefined,
  field: Pick<GeneratorFieldConfig, 'name' | 'label'>,
): string {
  return moduleText(def, fieldLabelKey(field.name), field.label);
}

/** Translated placeholder (`field.{name}.placeholder`), fallback = stored placeholder. */
export function moduleFieldPlaceholder(
  def: Pick<ModuleDefinition, 'i18n'> | undefined,
  field: Pick<GeneratorFieldConfig, 'name' | 'placeholder'>,
  fallback: string,
): string {
  return moduleText(def, fieldPlaceholderKey(field.name), field.placeholder?.trim() || fallback);
}

/** Translated module title (`title.{kind}`), fallback = composed default. */
export function moduleTitle(
  def: Pick<ModuleDefinition, 'i18n'> | undefined,
  kind: ModuleTitleKind,
  fallback: string,
): string {
  return moduleText(def, moduleTitleKey(kind), fallback);
}

export interface ModuleI18nEntry {
  key: string;
  en: string;
  kind: 'label' | 'placeholder' | 'title';
}

/**
 * Collect translatable keys + English source texts for the wizard
 * translations editor. Placeholders fall back to the auto `verb + label`
 * form when the field has no stored placeholder.
 */
export function collectModuleI18nKeys(def: {
  fields: Pick<GeneratorFieldConfig, 'name' | 'label' | 'placeholder'>[];
  singularLabel: string;
}): ModuleI18nEntry[] {
  const entries: ModuleI18nEntry[] = [
    { key: navLabelKey(), en: def.singularLabel, kind: 'title' },
    { key: moduleTitleKey('list'), en: `${def.singularLabel} List`, kind: 'title' },
    { key: moduleTitleKey('create'), en: `Create ${def.singularLabel}`, kind: 'title' },
    { key: moduleTitleKey('edit'), en: `Edit ${def.singularLabel}`, kind: 'title' },
    { key: moduleTitleKey('detail'), en: `${def.singularLabel} Details`, kind: 'title' },
  ];
  for (const field of def.fields) {
    entries.push({ key: fieldLabelKey(field.name), en: field.label, kind: 'label' });
    entries.push({
      key: fieldPlaceholderKey(field.name),
      en: field.placeholder?.trim() || `Enter ${field.label.toLowerCase()}`,
      kind: 'placeholder',
    });
  }
  return entries;
}
