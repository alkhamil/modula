/**
 * Operasi layout murni untuk canvas editor (drag reorder, span, visibilitas).
 * Murni & Node-safe.
 */
import type { ModuleLayout } from '../definitions';

/** Pindahkan item form (drag active ke posisi over) + rapikan order. */
export function moveFormItem(layout: ModuleLayout, activeField: string, overField: string): ModuleLayout {
  const ordered = [...layout.form].sort((a, b) => a.order - b.order);
  const from = ordered.findIndex((item) => item.field === activeField);
  const to = ordered.findIndex((item) => item.field === overField);
  if (from === -1 || to === -1 || from === to) return layout;
  const [moved] = ordered.splice(from, 1);
  if (!moved) return layout;
  ordered.splice(to, 0, moved);
  return {
    ...layout,
    form: ordered.map((item, index) => ({ ...item, order: index })),
  };
}

/** Atur lebar kolom satu field (clamp 1..12). */
export function setFormSpan(layout: ModuleLayout, field: string, span: number): ModuleLayout {
  return {
    ...layout,
    form: layout.form.map((item) =>
      item.field === field ? { ...item, colSpan: Math.min(12, Math.max(1, Math.floor(span) || 1)) } : item,
    ),
  };
}

/** Pindahkan kolom tabel (drag active ke posisi over). */
export function moveTableColumn(layout: ModuleLayout, activeField: string, overField: string): ModuleLayout {
  const order = [...layout.table.order];
  const from = order.indexOf(activeField);
  const to = order.indexOf(overField);
  if (from === -1 || to === -1 || from === to) return layout;
  const [moved] = order.splice(from, 1);
  if (moved === undefined) return layout;
  order.splice(to, 0, moved);
  return { ...layout, table: { ...layout.table, order } };
}

/** Toggle visibilitas kolom tabel. */
export function toggleTableColumn(layout: ModuleLayout, field: string): ModuleLayout {
  const hidden = layout.table.hidden.includes(field)
    ? layout.table.hidden.filter((name) => name !== field)
    : [...layout.table.hidden, field];
  return { ...layout, table: { ...layout.table, hidden } };
}
