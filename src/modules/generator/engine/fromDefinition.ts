import type { ModuleDefinition } from '../definitions';
import type { GeneratorConfig } from '../types';

/**
 * Definisi → config generator file. Round-trip aman: `routeBase`/`apiPlural`
 * diturunkan ulang deterministik dari fungsi naming yang sama.
 * Batasan: layout kanvas (section/divider, lebar kolom, susunan detail),
 * source `relation`, dan `menuIcon` tidak dikenal template file —
 * field relation di-generate sebagai select biasa (source `none`), termasuk
 * sub-field kolom array.
 * Murni & Node-safe.
 */
export function definitionToConfig(def: ModuleDefinition): GeneratorConfig {
  return {
    parentName: def.parent,
    moduleName: def.singularLabel,
    type: def.moduleType,
    permissionKey: def.permissionKey,
    features: { ...def.features },
    tableProps: def.layout.table.props ? { ...def.layout.table.props } : undefined,
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
