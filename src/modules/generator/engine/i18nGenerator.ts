import type { GeneratorConfig } from '../types';
import { normalizeConfig } from '../parser';
import { humanizePascal, normalizeParentPath, prettifyParent } from '../naming';
import { buildContext } from './context';

export interface ModuleLocales {
  base: string;
  en: Record<string, unknown>;
}

/** Ratakan locale nested → `{'a.b.c': 'teks'}` (leaf string saja). */
export function flattenLocale(obj: Record<string, unknown>, prefix = ''): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && typeof value === 'object') {
      Object.assign(out, flattenLocale(value as Record<string, unknown>, `${prefix}${key}.`));
    } else if (typeof value === 'string') {
      out[`${prefix}${key}`] = value;
    }
  }
  return out;
}

/** Kebalikan `flattenLocale` (key dot → nested). */
export function unflattenLocale(flat: Record<string, string>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(flat)) {
    const parts = key.split('.');
    let cursor = out;
    for (let i = 0; i < parts.length - 1; i += 1) {
      const part = parts[i] as string;
      const next = cursor[part];
      if (next === null || typeof next !== 'object') cursor[part] = {};
      cursor = cursor[part] as Record<string, unknown>;
    }
    cursor[parts[parts.length - 1] as string] = value;
  }
  return out;
}

/** Gabung dalam: `override` (nested) menimpa `base` per leaf. */
export function mergeLocales(
  base: Record<string, unknown>,
  override: Record<string, unknown>,
): Record<string, unknown> {
  const out: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const current = out[key];
    if (
      value !== null &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      current !== null &&
      typeof current === 'object' &&
      !Array.isArray(current)
    ) {
      out[key] = mergeLocales(
        current as Record<string, unknown>,
        value as Record<string, unknown>,
      );
    } else {
      out[key] = value;
    }
  }
  return out;
}

function isSelectLike(type: string): boolean {
  return (
    type === 'selectField' ||
    type === 'radioGroupField' ||
    type === 'selectMultipleField' ||
    type === 'checkboxGroupField' ||
    type === 'relationField'
  );
}

function autoPlaceholder(type: string, label: string, custom?: string): string {
  const trimmed = custom?.trim();
  if (trimmed) return trimmed;
  const verb = isSelectLike(type) ? 'Select' : 'Enter';
  return `${verb} ${label.toLowerCase()}`;
}

/**
 * Susun wording Inggris modul dari konfigurasi (sumber `i18n/en.json`
 * hasil generate). Murni & Node-safe: config → object.
 *
 * Cakupan: label modul (+ label grup parent bila ber-parent), breadcrumbs,
 * label/placeholder tiap field, toast sukses + not found. String generik
 * (tombol, judul runtime,
 * validasi, bulk, tabel sistem) memakai key general yang sudah ada
 * dan TIDAK diduplikasi di sini.
 */
export function buildModuleLocales(raw: GeneratorConfig): ModuleLocales {
  const config = normalizeConfig(raw);
  const ctx = buildContext(config);
  const { names, fields } = ctx;
  const base = config.permissionKey;
  const singular = humanizePascal(names.entity);
  const plural = humanizePascal(names.entityPlural);

  const fieldEntries = Object.fromEntries(
    fields.map((f) => {
      const entry: Record<string, unknown> = {
        label: f.label,
        placeholder: autoPlaceholder(f.config.type, f.label, f.config.placeholder),
      };
      return [f.name, entry];
    }),
  );

  const parentPath = normalizeParentPath(config.parentName);
  const en = {
    [base]: {
      label: singular,
      labelPlural: plural,
      ...(parentPath ? { parentLabel: prettifyParent(parentPath) } : {}),
      breadcrumbs: {
        list: plural,
        create: 'Create',
        detail: 'Detail',
        edit: 'Edit',
      },
      fields: fieldEntries,
      toast: {
        created: `${singular} created successfully.`,
        updated: `${singular} updated successfully.`,
        deleted: `${singular} deleted successfully`,
        restored: `${singular} restored successfully`,
        notFound: `${singular} not found`,
      },
    },
  };

  return { base, en };
}
