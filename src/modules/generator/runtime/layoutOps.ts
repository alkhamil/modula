/**
 * Operasi layout murni untuk canvas editor (drag reorder, span, visibilitas).
 * Murni & Node-safe.
 */
import type { FormLayoutItem, ModuleLayout } from '../definitions';

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

/** Atur lebar kolom tabel (px); ≤0 menghapus pengaturan (otomatis). */
export function setTableWidth(layout: ModuleLayout, field: string, width: number): ModuleLayout {
  const widths = { ...layout.table.widths };
  if (!Number.isFinite(width) || width <= 0) {
    delete widths[field];
  } else {
    widths[field] = Math.min(1200, Math.max(40, Math.floor(width)));
  }
  return { ...layout, table: { ...layout.table, widths } };
}

/** Tambah item section/divider ke form (id unik otomatis). */
export function addFormItem(
  layout: ModuleLayout,
  kind: 'section' | 'divider',
  label?: string,
): ModuleLayout {
  const used = new Set(layout.form.map((item) => item.field));
  let counter = layout.form.length + 1;
  let id = `${kind}-${counter}`;
  while (used.has(id)) {
    counter += 1;
    id = `${kind}-${counter}`;
  }
  const ordered = [...layout.form].sort((a, b) => a.order - b.order);
  const created: FormLayoutItem = {
    field: id,
    order: ordered.length,
    colSpan: 12,
    kind,
  };
  if (kind === 'section') created.label = label ?? 'Section';
  const next = [...ordered, created];
  return {
    ...layout,
    form: next.map((item, index) => ({ ...item, order: index })),
  };
}

/** Hapus item form non-field (section/divider) berdasarkan id. */
export function removeFormItem(layout: ModuleLayout, id: string): ModuleLayout {
  const ordered = [...layout.form]
    .sort((a, b) => a.order - b.order)
    .filter((item) => item.field !== id || (item.kind ?? 'field') === 'field');
  return {
    ...layout,
    form: ordered.map((item, index) => ({ ...item, order: index })),
  };
}

/** Ubah label item section. */
export function setFormItemLabel(layout: ModuleLayout, id: string, label: string): ModuleLayout {
  return {
    ...layout,
    form: layout.form.map((item) =>
      item.field === id && item.kind === 'section' ? { ...item, label } : item,
    ),
  };
}

/** Pindahkan item detail (drag active ke posisi over). */
export function moveDetailItem(layout: ModuleLayout, activeField: string, overField: string): ModuleLayout {
  const order = [...(layout.detail?.order ?? [])];
  const from = order.indexOf(activeField);
  const to = order.indexOf(overField);
  if (from === -1 || to === -1 || from === to) return layout;
  const [moved] = order.splice(from, 1);
  if (moved === undefined) return layout;
  order.splice(to, 0, moved);
  return { ...layout, detail: { order, hidden: layout.detail?.hidden ?? [] } };
}

/** Toggle visibilitas field detail. */
export function toggleDetailItem(layout: ModuleLayout, field: string): ModuleLayout {
  const hidden = layout.detail?.hidden ?? [];
  const next = hidden.includes(field)
    ? hidden.filter((name) => name !== field)
    : [...hidden, field];
  return { ...layout, detail: { order: layout.detail?.order ?? [], hidden: next } };
}
