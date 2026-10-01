import type { GeneratorConfig } from '../types';
import { normalizeConfig } from '../parser';
import { resolveNames, toKebabCase } from '../naming';
import type {
  FormLayoutItem,
  ModuleDefinition,
  ModuleDefinitionStatus,
  ModuleLayout,
} from './types';
import { MODULE_DEFINITION_VERSION } from './types';

/** Layout default: form satu kolom penuh (meniru tampilan form hasil generate), tabel semua field tampil. */
export function defaultLayoutForFields(
  fields: { name: string }[],
): ModuleLayout {
  return {
    form: fields.map((field, index) => ({ field: field.name, order: index, colSpan: 12 })),
    table: { order: fields.map((field) => field.name), hidden: [] },
  };
}

/** Normalisasi layout: buang ref tak dikenal, lengkapi field yang hilang, rapikan order/span. */
export function normalizeLayout(
  layout: ModuleLayout,
  fieldNames: string[],
): ModuleLayout {
  const known = new Set(fieldNames);
  const seen = new Set<string>();
  const form: FormLayoutItem[] = [];
  for (const item of [...layout.form].sort((a, b) => a.order - b.order)) {
    if (!known.has(item.field) || seen.has(item.field)) continue;
    seen.add(item.field);
    form.push({
      field: item.field,
      order: form.length,
      colSpan: Math.min(12, Math.max(1, Math.floor(item.colSpan) || 12)),
    });
  }
  for (const name of fieldNames) {
    if (seen.has(name)) continue;
    seen.add(name);
    form.push({ field: name, order: form.length, colSpan: 12 });
  }
  const order = [
    ...layout.table.order.filter((name) => known.has(name)),
    ...fieldNames.filter((name) => !layout.table.order.includes(name)),
  ];
  const orderSet = new Set(order);
  const hidden = layout.table.hidden.filter((name) => orderSet.has(name));
  return { form, table: { order, hidden } };
}

export interface ConfigToDefinitionOptions {
  /** Override key (default: kebab path parent/modul). */
  key?: string;
  /** Default `soft` (pola deactivate/restore modul user). */
  deleteMode?: ModuleDefinition['deleteMode'];
  /** Default `draft`. */
  status?: ModuleDefinitionStatus;
  /** Layout awal (default: turunan fields). */
  layout?: ModuleLayout;
}

/** Konversi GeneratorConfig (wizard) → ModuleDefinition v1. Murni & Node-safe. */
export function configToDefinition(
  raw: GeneratorConfig,
  opts: ConfigToDefinitionOptions = {},
): ModuleDefinition {
  const config = normalizeConfig(raw);
  const names = resolveNames(config.parentName, config.moduleName);
  const parent = config.parentName
    ? config.parentName
        .split('/')
        .map((part) => toKebabCase(part))
        .filter(Boolean)
        .join('/')
    : null;
  const key = opts.key ?? (parent ? `${parent}/${names.kebab}` : names.kebab);
  const fieldNames = config.fields.map((field) => field.name);
  return {
    version: MODULE_DEFINITION_VERSION,
    key,
    label: names.entityPlural,
    singularLabel: names.entity,
    parent: parent || null,
    routeBase: names.routeBase,
    permissionKey: config.permissionKey,
    apiPlural: names.pluralKebab,
    moduleType: 'crud',
    features: { ...config.features },
    fields: config.fields,
    layout: normalizeLayout(
      opts.layout ?? defaultLayoutForFields(config.fields),
      fieldNames,
    ),
    deleteMode: opts.deleteMode ?? 'soft',
    status: opts.status ?? 'draft',
  };
}

/** Normalisasi definisi penuh (dipakai wizard publish & validasi seed). */
export function normalizeDefinition(def: ModuleDefinition): ModuleDefinition {
  const asConfig: GeneratorConfig = {
    parentName: def.parent,
    moduleName: def.key,
    type: def.moduleType,
    permissionKey: def.permissionKey,
    features: { ...def.features },
    fields: def.fields,
  };
  const normalized = normalizeConfig(asConfig);
  return {
    ...def,
    version: MODULE_DEFINITION_VERSION,
    key: def.key.trim(),
    label: def.label.trim(),
    singularLabel: def.singularLabel.trim(),
    parent: normalized.parentName,
    routeBase: def.routeBase.trim().replace(/^\/+|\/+$/g, ''),
    permissionKey: normalized.permissionKey,
    apiPlural: def.apiPlural.trim().toLowerCase(),
    fields: normalized.fields,
    layout: normalizeLayout(def.layout, normalized.fields.map((field) => field.name)),
  };
}
