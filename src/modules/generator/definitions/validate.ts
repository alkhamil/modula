import type { GeneratorConfig } from '../types';
import { validateConfig, type ConfigIssue } from '../parser';
import type { ModuleDefinition } from './types';
import { MODULE_DEFINITION_VERSION } from './types';

const KEY_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/;
const ROUTE_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/;

/**
 * Validasi definisi modul. Memakai ulang `validateConfig` untuk bagian
 * config (permission key, features, fields) + aturan layout v1.
 * Return daftar masalah (kosong = valid). Murni & Node-safe.
 */
export function validateDefinition(def: ModuleDefinition): ConfigIssue[] {
  const issues: ConfigIssue[] = [];

  if (def.version !== MODULE_DEFINITION_VERSION) {
    issues.push({
      path: 'version',
      message: `Version harus ${MODULE_DEFINITION_VERSION}.`,
    });
  }
  if (!def.key || !KEY_PATTERN.test(def.key)) {
    issues.push({
      path: 'key',
      message: 'Key wajib kebab path unik (contoh: region, mater-data/company).',
    });
  }
  if (!def.label || !def.label.trim()) {
    issues.push({ path: 'label', message: 'Label wajib diisi.' });
  }
  if (!def.singularLabel || !def.singularLabel.trim()) {
    issues.push({ path: 'singularLabel', message: 'Singular label wajib diisi.' });
  }
  if (!def.routeBase || !ROUTE_PATTERN.test(def.routeBase.replace(/^\/+|\/+$/g, ''))) {
    issues.push({ path: 'routeBase', message: 'Route base tidak valid.' });
  }
  if (!def.apiPlural || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(def.apiPlural)) {
    issues.push({ path: 'apiPlural', message: 'API plural wajib kebab-case.' });
  }
  if (def.deleteMode !== 'hard' && def.deleteMode !== 'soft') {
    issues.push({ path: 'deleteMode', message: 'Delete mode harus hard atau soft.' });
  }
  if (def.status !== 'draft' && def.status !== 'published') {
    issues.push({ path: 'status', message: 'Status harus draft atau published.' });
  }

  const asConfig: GeneratorConfig = {
    parentName: def.parent,
    moduleName: def.key,
    type: def.moduleType,
    permissionKey: def.permissionKey,
    features: { ...def.features },
    fields: def.fields,
  };
  issues.push(...validateConfig(asConfig));

  const known = new Set(def.fields.map((field) => field.name));
  const seenForm = new Set<string>();
  def.layout.form.forEach((item, index) => {
    const path = `layout.form[${index}]`;
    const kind = item.kind ?? 'field';
    if (kind !== 'field' && kind !== 'section' && kind !== 'divider') {
      issues.push({ path: `${path}.kind`, message: 'Kind harus field, section, atau divider.' });
    } else if (kind === 'field' && !known.has(item.field)) {
      issues.push({ path: `${path}.field`, message: `Field "${item.field}" tidak dikenal.` });
    } else if (kind !== 'field' && known.has(item.field)) {
      issues.push({
        path: `${path}.field`,
        message: `Id "${item.field}" bentrok dengan nama field.`,
      });
    } else if (seenForm.has(item.field)) {
      issues.push({ path: `${path}.field`, message: `Item "${item.field}" duplikat di layout.` });
    } else {
      seenForm.add(item.field);
    }
    if (!Number.isInteger(item.order) || item.order < 0) {
      issues.push({ path: `${path}.order`, message: 'Order harus bilangan bulat ≥ 0.' });
    }
    if (!Number.isInteger(item.colSpan) || item.colSpan < 1 || item.colSpan > 12) {
      issues.push({ path: `${path}.colSpan`, message: 'colSpan harus 1..12.' });
    }
  });
  for (const name of known) {
    if (!seenForm.has(name)) {
      issues.push({ path: 'layout.form', message: `Field "${name}" belum ada di layout form.` });
    }
  }
  const seenOrder = new Set<string>();
  def.layout.table.order.forEach((name, index) => {
    if (!known.has(name)) {
      issues.push({
        path: `layout.table.order[${index}]`,
        message: `Field "${name}" tidak dikenal.`,
      });
    } else if (seenOrder.has(name)) {
      issues.push({
        path: `layout.table.order[${index}]`,
        message: `Field "${name}" duplikat di urutan tabel.`,
      });
    } else {
      seenOrder.add(name);
    }
  });
  for (const name of known) {
    if (!seenOrder.has(name)) {
      issues.push({ path: 'layout.table.order', message: `Field "${name}" belum ada di urutan tabel.` });
    }
  }
  for (const name of def.layout.table.hidden) {
    if (!seenOrder.has(name)) {
      issues.push({
        path: 'layout.table.hidden',
        message: `Field "${name}" disembunyikan tapi tidak ada di urutan tabel.`,
      });
    }
  }
  for (const [name, width] of Object.entries(def.layout.table.widths ?? {})) {
    if (!seenOrder.has(name)) {
      issues.push({
        path: `layout.table.widths.${name}`,
        message: `Field "${name}" tidak ada di urutan tabel.`,
      });
    } else if (!Number.isInteger(width) || width < 40 || width > 1200) {
      issues.push({
        path: `layout.table.widths.${name}`,
        message: 'Lebar kolom harus 40..1200 px.',
      });
    }
  }
  if (def.layout.detail !== undefined) {
    const seenDetail = new Set<string>();
    def.layout.detail.order.forEach((name, index) => {
      if (!known.has(name)) {
        issues.push({
          path: `layout.detail.order[${index}]`,
          message: `Field "${name}" tidak dikenal.`,
        });
      } else if (seenDetail.has(name)) {
        issues.push({
          path: `layout.detail.order[${index}]`,
          message: `Field "${name}" duplikat di urutan detail.`,
        });
      } else {
        seenDetail.add(name);
      }
    });
    for (const name of known) {
      if (!seenDetail.has(name)) {
        issues.push({
          path: 'layout.detail.order',
          message: `Field "${name}" belum ada di urutan detail.`,
        });
      }
    }
    for (const name of def.layout.detail.hidden) {
      if (!seenDetail.has(name)) {
        issues.push({
          path: 'layout.detail.hidden',
          message: `Field "${name}" disembunyikan tapi tidak ada di urutan detail.`,
        });
      }
    }
  }

  return issues;
}
