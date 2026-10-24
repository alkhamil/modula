import { t } from 'i18next';
import '../../shared/i18n';
import type { FieldType, GeneratorConfig, GeneratorFieldConfig } from './types';
import { isWdsIcon } from '../../shared/components/icons/names';
import { pruneComponentProps } from './componentProps';
import { toCamelCase, toPascalCase } from './naming';
import {
  criteriaForFieldType,
  dataSourceRegistry,
  defaultCriteria,
  defaultFilterable,
  defaultSortable,
  validationRegistry,
} from './registry';

/**
 * Nama field yang dipakai kolom sistem record (`id` numerik otomatis +
 * `status`/`created_by`/`created_date`) — tidak boleh dipakai field bisnis.
 */
export const RESERVED_FIELD_NAMES: readonly string[] = [
  'id',
  'status',
  'created_by',
  'created_date',
];

export function isReservedFieldName(name: string): boolean {
  return RESERVED_FIELD_NAMES.includes(name.toLowerCase());
}

/** Rule berargumen numerik (`min`/`max`/`minLength`/`maxLength`). */
const NUMERIC_RULES: readonly string[] = ['min', 'max', 'minLength', 'maxLength'];

/**
 * Validasi argumen rules satu field/sub (`min:` kosong, angka tak valid,
 * pola regex rusak). Dipakai field parent maupun sub-field array.
 */
function checkFieldRules(
  rules: string[],
  basePath: string,
  ownerName: string,
  issues: ConfigIssue[],
): void {
  for (const rawRule of rules) {
    const { name: ruleName, arg: ruleArg } = splitRule(rawRule.trim());
    const ruleDef = validationRegistry[ruleName as keyof typeof validationRegistry];
    if (!ruleDef?.needsArg) continue;
    const rulePath = `${basePath}.rules`;
    const value = (ruleArg ?? '').trim();
    if (value === '') {
      issues.push({
        path: rulePath,
        message: t('configValidate.fieldRuleArg', { name: ownerName, rule: ruleName }),
      });
    } else if (NUMERIC_RULES.includes(ruleName) && !Number.isFinite(Number(value))) {
      issues.push({
        path: rulePath,
        message: t('configValidate.fieldRuleNumeric', { name: ownerName, rule: ruleName }),
      });
    } else if (ruleName === 'regex') {
      try {
        new RegExp(value);
      } catch {
        issues.push({
          path: rulePath,
          message: t('configValidate.fieldRuleRegex', { name: ownerName }),
        });
      }
    }
  }
}

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

/**
 * Nama field unik dari basis (hindari duplikat + reserved kolom sistem).
 * `text` (dipakai) → `text2`; `id` (reserved) → `id2`.
 */
export function uniqueFieldName(base: string, existingNames: string[]): string {
  const clean = base.trim() || 'field';
  if (!isReservedFieldName(clean) && !existingNames.includes(clean)) return clean;
  let counter = 2;
  while (isReservedFieldName(`${clean}${counter}`) || existingNames.includes(`${clean}${counter}`)) {
    counter += 1;
  }
  return `${clean}${counter}`;
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
    issues.push({ path: 'moduleName', message: t('configValidate.moduleNameRequired') });
  }
  if (config.parentName && config.parentName.length > 50) {
    issues.push({ path: 'parentName', message: t('configValidate.parentMax') });
  }
  if (config.parentName && !/^[a-zA-Z0-9 /_-]*$/.test(config.parentName)) {
    issues.push({ path: 'parentName', message: t('configValidate.parentInvalid') });
  }
  if (!config.permissionKey || config.permissionKey.trim() === '') {
    issues.push({ path: 'permissionKey', message: t('configValidate.permissionRequired') });
  } else if (config.permissionKey.length > 100) {
    issues.push({ path: 'permissionKey', message: t('configValidate.permissionMax') });
  } else if (!/^[a-z][a-z0-9_]*$/.test(config.permissionKey)) {
    issues.push({
      path: 'permissionKey',
      message: t('configValidate.permissionPattern'),
    });
  }
  if (!Object.values(config.features).some(Boolean)) {
    issues.push({ path: 'features', message: t('configValidate.featureRequired') });
  }
  if ((config.features.bulkUpload || config.features.export) && !config.features.list) {
    issues.push({
      path: 'features',
      message: t('configValidate.bulkNeedsList'),
    });
  }
  if (config.fields.length === 0) {
    issues.push({ path: 'fields', message: t('configValidate.fieldRequired') });
  }
  if (
    config.features.bulkUpload &&
    !config.fields.some((field) => field.type !== 'fileUploadField')
  ) {
    issues.push({
      path: 'features',
      message: t('configValidate.bulkNeedsField'),
    });
  }

  const seen = new Set<string>();
  config.fields.forEach((field, index) => {
    const path = `fields[${index}]`;
    if (!field.name) {
      issues.push({ path: `${path}.name`, message: t('configValidate.fieldNameRequired') });
    } else if (seen.has(field.name)) {
      issues.push({ path: `${path}.name`, message: t('configValidate.fieldNameDup', { name: field.name }) });
    } else if (isReservedFieldName(field.name)) {
      issues.push({
        path: `${path}.name`,
        message: t('configValidate.fieldNameReserved', { name: field.name }),
      });
    } else {
      seen.add(field.name);
    }
    if (!field.label) {
      issues.push({ path: `${path}.label`, message: t('configValidate.fieldLabelRequired') });
    }
    checkFieldRules(field.rules, path, field.name, issues);
    const allowedSources = (
      Object.keys(dataSourceRegistry) as (keyof typeof dataSourceRegistry)[]
    ).filter((source) => dataSourceRegistry[source].appliesTo.includes(field.type));
    if (!allowedSources.includes(field.source)) {
      issues.push({
        path: `${path}.source`,
        message: t('configValidate.fieldSource', { name: field.name, type: field.type, sources: allowedSources.join(', ') }),
      });
    }
    if (field.source === 'mockStatic') {
      if (!field.options || field.options.length === 0) {
        issues.push({
          path: `${path}.options`,
          message: t('configValidate.fieldOptions', { name: field.name }),
        });
      }
    }
    if (field.source === 'api') {
      if (!field.api?.endpoint) {
        issues.push({
          path: `${path}.api.endpoint`,
          message: t('configValidate.fieldApi', { name: field.name }),
        });
      }
    }
    if (field.source === 'relation') {
      if (!field.relation?.definitionKey) {
        issues.push({
          path: `${path}.relation.definitionKey`,
          message: t('configValidate.fieldRelationTarget', { name: field.name }),
        });
      }
      if (!field.relation?.labelField) {
        issues.push({
          path: `${path}.relation.labelField`,
          message: t('configValidate.fieldRelationLabel', { name: field.name }),
        });
      }
    }
    const criteria = field.filterCriteria ?? defaultCriteria(field.type);
    const filterable = field.filterable ?? defaultFilterable(field.type);
    if (filterable && !criteriaForFieldType(field.type).includes(criteria)) {
      issues.push({
        path: `${path}.filterCriteria`,
        message: t('configValidate.fieldCriteria', { name: field.name, type: field.type, criteria }),
      });
    }
  });

  // Ikon menu: nama ikon WDS (PascalCase, mis. `Database`).
  if (config.menuIcon) {
    if (!isWdsIcon(config.menuIcon.name.trim())) {
      issues.push({ path: 'menuIcon.name', message: t('configValidate.iconNameRequired') });
    }
  }

  return issues;
}

/**
 * Tipe field yang sudah dihapus (tidak ada di komponen WDS) → padanan terdekat, agar
 * definisi tersimpan lama tetap terbuka. `null` = field dibuang (tabel baris embedded).
 */
const LEGACY_FIELD_TYPES: Record<string, FieldType | null> = {
  passwordField: 'textField',
  currencyField: 'numberField',
  colorField: 'textField',
  editorField: 'textareaField',
  formArrayField: null,
};

/** Petakan tipe field lama (lihat `LEGACY_FIELD_TYPES`); komponen props dari tipe lama dibuang. */
function migrateLegacyFields(fields: GeneratorFieldConfig[]): GeneratorFieldConfig[] {
  const out: GeneratorFieldConfig[] = [];
  for (const field of fields) {
    const legacy = (field as { type: string }).type;
    if (!(legacy in LEGACY_FIELD_TYPES)) {
      out.push(field);
      continue;
    }
    const mapped = LEGACY_FIELD_TYPES[legacy];
    if (mapped === null || mapped === undefined) continue;
    const { subFields: _subFields, ...rest } = field as GeneratorFieldConfig & { subFields?: unknown };
    out.push({ ...rest, type: mapped, componentProps: undefined });
  }
  return out;
}

/** Normalisasi ringan sebelum generate (trim label/nama, buang rules kosong, default tabel/filter). */
export function normalizeConfig(config: GeneratorConfig): GeneratorConfig {
  const fields: GeneratorFieldConfig[] = migrateLegacyFields(config.fields).map((field) => ({
    ...field,
    name: toCamelCase(field.name),
    label: field.label.trim(),
    rules: field.rules.map((rule) => rule.trim()).filter(Boolean),
    sortable: field.sortable ?? defaultSortable(field.type),
    filterable: field.filterable ?? defaultFilterable(field.type),
    filterCriteria: field.filterable === false ? null : (field.filterCriteria ?? defaultCriteria(field.type)),
    // Buang muatan source yang tak relevan agar draft panel tetap bersih.
    options: field.source === 'mockStatic' || field.source === 'api' ? field.options : undefined,
    api: field.source === 'api' ? field.api : undefined,
    relation: field.source === 'relation' ? field.relation : undefined,
    placeholder: field.placeholder?.trim() ? field.placeholder.trim() : undefined,
    disabled: field.disabled === true ? true : undefined,
    rows:
      field.type === 'textareaField' && field.rows && field.rows > 0
        ? Math.min(20, Math.floor(field.rows))
        : undefined,
    accept:
      field.type === 'fileUploadField' && field.accept?.trim() ? field.accept.trim() : undefined,
    componentProps: pruneComponentProps(field.type, field.componentProps),
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
