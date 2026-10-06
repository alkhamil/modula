import type { ModuleDefinition } from '../definitions';
import type { FormLayoutItem, GeneratorConfig } from '../types';

function sanitizeWidths(widths: Record<string, number> | undefined): Record<string, number> | undefined {
  if (!widths) return undefined;
  const clean: Record<string, number> = {};
  for (const [name, width] of Object.entries(widths)) {
    if (Number.isInteger(width) && width >= 40 && width <= 1200) clean[name] = width;
  }
  return Object.keys(clean).length > 0 ? clean : undefined;
}

/**
 * Definisi → config generator file. Round-trip aman: `routeBase`/`apiPlural`
 * diturunkan ulang deterministik dari fungsi naming yang sama.
 * Batasan: susunan detail + source `relation` tidak dikenal template file —
 * field relation
 * di-generate sebagai select biasa (source `none`), termasuk sub-field
 * kolom array. `menuIcon` (nama ikon lucide) dipakai registrasi nav.
 * Murni & Node-safe.
 */
/** Sanitasi satu item layout form kanvas (span 1..12, kind/label valid). */
function sanitizeFormItem(item: FormLayoutItem): FormLayoutItem {
  const kind = item.kind ?? 'field';
  const clean: FormLayoutItem = {
    field: item.field,
    order: item.order,
    colSpan: Math.min(12, Math.max(1, Math.round(item.colSpan) || 12)),
  };
  if (kind === 'section' || kind === 'divider') clean.kind = kind;
  if (kind === 'section' && item.label) clean.label = item.label;
  return clean;
}

export function definitionToConfig(def: ModuleDefinition): GeneratorConfig {
  return {
    parentName: def.parent,
    moduleName: def.singularLabel,
    type: def.moduleType,
    permissionKey: def.permissionKey,
    features: { ...def.features },
    formLayout: (def.layout?.form ?? [])
      .slice()
      .sort((a, b) => a.order - b.order)
      .map(sanitizeFormItem),
    menuIcon: def.menuIcon ? { ...def.menuIcon } : undefined,
    i18n: def.i18n ? structuredClone(def.i18n) : undefined,
    tableProps: def.layout.table.props ? { ...def.layout.table.props } : undefined,
    tableWidths: sanitizeWidths(def.layout.table.widths),
    fields: def.fields.map((field) => {
      const top = field.source === 'relation' ? { ...field, source: 'none' as const } : field;
      if (top.type !== 'formArrayField' || !top.subFields) return top;
      return {
        ...top,
        subFields: top.subFields.map((sub) =>
          sub.source === 'relation' ? { ...sub, source: 'none' as const } : sub,
        ),
      };
    }),
  };
}
