import type { GeneratorConfig, GeneratorFieldConfig } from './types';
import { toCamelCase, toPascalCase } from './naming';
import {
  criteriaForFieldType,
  dataSourceRegistry,
  defaultCriteria,
  defaultFilterable,
  defaultSortable,
} from './registry';

/** `required|min:3|max:100` → `["required", "min:3", "max:100"]`. */
export function parseRulesString(rules: string): string[] {
  return rules
    .split('|')
    .map((rule) => rule.trim())
    .filter(Boolean);
}

/** `["required", "min:3"]` → `required|min:3`. */
export function stringifyRules(rules: string[]): string {
  return rules.join('|');
}

/** Pecah satu rule menjadi nama + argumen: `min:3` → `{ name: 'min', arg: '3' }`. */
export function splitRule(rule: string): { name: string; arg?: string } {
  const index = rule.indexOf(':');
  if (index === -1) return { name: rule };
  return { name: rule.slice(0, index), arg: rule.slice(index + 1) };
}

/** Normalisasi nama field dari label: `Region Name` → `{ name: 'regionName', label: 'Region Name' }`. */
export function deriveFieldNaming(label: string): { name: string; label: string } {
  return { name: toCamelCase(label), label: label.trim() };
}

/** Normalisasi nama modul untuk validasi: harus menghasilkan PascalCase valid. */
export function normalizeModuleName(input: string): string {
  return toPascalCase(input);
}

export interface ConfigIssue {
  path: string;
  message: string;
}

/** Validasi konfigurasi sebelum generate. Return daftar masalah (kosong = valid). */
export function validateConfig(config: GeneratorConfig): ConfigIssue[] {
  const issues: ConfigIssue[] = [];

  if (!config.moduleName || !normalizeModuleName(config.moduleName)) {
    issues.push({ path: 'moduleName', message: 'Module name wajib diisi.' });
  }
  if (config.parentName && config.parentName.length > 50) {
    issues.push({ path: 'parentName', message: 'Parent module maksimal 50 karakter.' });
  }
  if (config.parentName && !/^[a-zA-Z0-9 /_-]*$/.test(config.parentName)) {
    issues.push({ path: 'parentName', message: 'Parent module mengandung karakter tidak valid.' });
  }
  if (!config.permissionKey || config.permissionKey.trim() === '') {
    issues.push({ path: 'permissionKey', message: 'Permission key wajib diisi.' });
  } else if (config.permissionKey.length > 100) {
    issues.push({ path: 'permissionKey', message: 'Permission key maksimal 100 karakter.' });
  } else if (!/^[a-z][a-z0-9_]*$/.test(config.permissionKey)) {
    issues.push({
      path: 'permissionKey',
      message:
        'Permission key harus single value: huruf kecil, angka, underscore, diawali huruf ' +
        '(contoh: user, generator, dashboard, audit_trail). Tanpa titik — ' +
        'suffix .view/.create/.update/.delete otomatis.',
    });
  }
  if (!Object.values(config.features).some(Boolean)) {
    issues.push({ path: 'features', message: 'Pilih minimal satu feature.' });
  }
  if ((config.features.bulkUpload || config.features.export) && !config.features.list) {
    issues.push({
      path: 'features',
      message: 'Bulk upload & export butuh feature list (tombolnya di halaman list).',
    });
  }
  if (config.fields.length === 0) {
    issues.push({ path: 'fields', message: 'Tambahkan minimal satu field.' });
  }
  if (
    config.features.bulkUpload &&
    !config.fields.some((field) => field.type !== 'fileUploadField')
  ) {
    issues.push({
      path: 'features',
      message: 'Bulk upload butuh minimal satu field non-file.',
    });
  }

  const seen = new Set<string>();
  config.fields.forEach((field, index) => {
    const path = `fields[${index}]`;
    if (!field.name) {
      issues.push({ path: `${path}.name`, message: 'Field name wajib diisi.' });
    } else if (seen.has(field.name)) {
      issues.push({ path: `${path}.name`, message: `Field name "${field.name}" duplikat.` });
    } else {
      seen.add(field.name);
    }
    if (!field.label) {
      issues.push({ path: `${path}.label`, message: 'Field label wajib diisi.' });
    }
    const allowedSources = (
      Object.keys(dataSourceRegistry) as (keyof typeof dataSourceRegistry)[]
    ).filter((source) => dataSourceRegistry[source].appliesTo.includes(field.type));
    if (!allowedSources.includes(field.source)) {
      issues.push({
        path: `${path}.source`,
        message: `Field "${field.name}" tipe ${field.type} hanya mendukung source: ${allowedSources.join(', ')}.`,
      });
    }
    if (field.source === 'mockStatic') {
      if (!field.options || field.options.length === 0) {
        issues.push({
          path: `${path}.options`,
          message: `Field "${field.name}" source mockStatic butuh minimal satu option.`,
        });
      }
    }
    if (field.source === 'api') {
      if (!field.api?.endpoint) {
        issues.push({
          path: `${path}.api.endpoint`,
          message: `Field "${field.name}" source api butuh endpoint.`,
        });
      }
    }
    const criteria = field.filterCriteria ?? defaultCriteria(field.type);
    const filterable = field.filterable ?? defaultFilterable(field.type);
    if (filterable && !criteriaForFieldType(field.type).includes(criteria)) {
      issues.push({
        path: `${path}.filterCriteria`,
        message: `Field "${field.name}" tipe ${field.type} tidak mendukung kriteria ${criteria}.`,
      });
    }
  });

  return issues;
}

/** Normalisasi ringan sebelum generate (trim label/nama, buang rules kosong, default tabel/filter). */
export function normalizeConfig(config: GeneratorConfig): GeneratorConfig {
  const fields: GeneratorFieldConfig[] = config.fields.map((field) => ({
    ...field,
    name: toCamelCase(field.name),
    label: field.label.trim(),
    rules: field.rules.map((rule) => rule.trim()).filter(Boolean),
    sortable: field.sortable ?? defaultSortable(field.type),
    filterable: field.filterable ?? defaultFilterable(field.type),
    filterCriteria: field.filterable === false ? null : (field.filterCriteria ?? defaultCriteria(field.type)),
  }));
  return {
    ...config,
    parentName:
      config.parentName && config.parentName.trim() !== '' ? config.parentName.trim() : null,
    moduleName: config.moduleName.trim(),
    permissionKey: config.permissionKey.trim().toLowerCase(),
    fields,
  };
}
