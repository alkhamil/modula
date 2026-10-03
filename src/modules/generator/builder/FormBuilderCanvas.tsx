/** Canvas 1 — Form Builder: palet komponen + kanvas grid drag-drop + drawer properti + preview. */
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  closestCenter,
  pointerWithin,
  rectIntersection,
  useDroppable,
  useDraggable,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import CanvasPointerSensor from './sensors';
import {
  SortableContext,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Alert,
  Button,
  Card,
  Dialog,
  Drawer,
  FormGroup,
  TextField,
} from '../../../shared/components/ui';
import { GripIcon, TrashIcon } from '../../../shared/components/icons';
import type { GeneratorFieldConfig } from '../types';
import { deriveFieldNaming, isReservedFieldName, uniqueFieldName } from '../parser';
import type { FormLayoutItem, ModuleDefinition, ModuleLayout } from '../definitions';
import { defaultLayoutForFields, normalizeLayout } from '../definitions';
import { colSpanClass } from '../runtime/grid';
import {
  addFormItem,
  moveFormItem,
  removeFormItem,
  renameFieldInLayout,
  setFormItemLabel,
  setFormSpan,
} from '../runtime/layoutOps';
import { renderDynamicField } from '../runtime/fieldRenderer';
import { makeOptionsLoader, makeRelationOptionsLoader } from '../runtime/recordsApi';
import type { DynamicListItem } from '../runtime/types';
import FieldForm, {
  buildFieldConfig,
  initialFormValue,
  type FieldFormPreset,
  type FieldFormValue,
} from '../components/FieldForm';

interface FormBuilderCanvasProps {
  fields: GeneratorFieldConfig[];
  onFieldsChange: (fields: GeneratorFieldConfig[]) => void;
  layout: ModuleLayout | null;
  onChange: (layout: ModuleLayout) => void;
  previewTitle: string;
  definitions: ModuleDefinition[];
  sampleRows: DynamicListItem[];
  onSampleRowsChange: (rows: DynamicListItem[]) => void;
}

type PaletteKind =
  | 'text'
  | 'number'
  | 'currency'
  | 'textarea'
  | 'password'
  | 'select'
  | 'multiselect'
  | 'radio'
  | 'checkbox'
  | 'checkboxgroup'
  | 'date'
  | 'daterange'
  | 'switch'
  | 'upload'
  | 'color'
  | 'editor'
  | 'array'
  | 'relation'
  | 'section'
  | 'divider';

const PALETTE_SECTIONS: { title: string; items: { kind: PaletteKind; label: string; hint: string }[] }[] = [
  {
    title: 'Fields',
    items: [
      { kind: 'text', label: 'Text', hint: 'Input teks' },
      { kind: 'number', label: 'Number', hint: 'Input angka' },
      { kind: 'currency', label: 'Currency', hint: 'Input mata uang' },
      { kind: 'textarea', label: 'Textarea', hint: 'Teks multi baris' },
      { kind: 'password', label: 'Password', hint: 'Input sandi' },
      { kind: 'select', label: 'Select', hint: 'Dropdown options' },
      { kind: 'multiselect', label: 'Multi Select', hint: 'Pilih banyak' },
      { kind: 'radio', label: 'Radio', hint: 'Pilihan tunggal' },
      { kind: 'checkbox', label: 'Checkbox', hint: 'Centang tunggal' },
      { kind: 'checkboxgroup', label: 'Checkbox Group', hint: 'Centang banyak' },
      { kind: 'date', label: 'Date', hint: 'Pemilih tanggal' },
      { kind: 'daterange', label: 'Date Range', hint: 'Rentang tanggal' },
      { kind: 'switch', label: 'Switch', hint: 'Toggle ya/tidak' },
      { kind: 'upload', label: 'Upload', hint: 'Upload file' },
      { kind: 'color', label: 'Color', hint: 'Pemilih warna' },
      { kind: 'editor', label: 'Editor', hint: 'Rich text' },
      { kind: 'array', label: 'Array', hint: 'Tabel baris' },
      { kind: 'relation', label: 'Relation', hint: 'Options modul lain' },
    ],
  },
  {
    title: 'Layout',
    items: [
      { kind: 'section', label: 'Section', hint: 'Judul seksi' },
      { kind: 'divider', label: 'Divider', hint: 'Garis pemisah' },
    ],
  },
];

function presetForKind(kind: PaletteKind): FieldFormPreset {
  switch (kind) {
    case 'number':
      return { type: 'numberField', label: 'Number' };
    case 'currency':
      return { type: 'currencyField', label: 'Currency' };
    case 'textarea':
      return { type: 'textareaField', label: 'Textarea' };
    case 'password':
      return { type: 'passwordField', label: 'Password' };
    case 'select':
      return { type: 'selectField', source: 'mockStatic', label: 'Select' };
    case 'multiselect':
      return { type: 'selectMultipleField', source: 'mockStatic', label: 'Multi Select' };
    case 'radio':
      return { type: 'radioGroupField', source: 'mockStatic', label: 'Radio' };
    case 'checkbox':
      return { type: 'checkboxField', label: 'Checkbox' };
    case 'checkboxgroup':
      return { type: 'checkboxGroupField', source: 'mockStatic', label: 'Checkbox Group' };
    case 'date':
      return { type: 'dateField', label: 'Date' };
    case 'daterange':
      return { type: 'dateRangeField', label: 'Date Range' };
    case 'switch':
      return { type: 'switchField', label: 'Switch' };
    case 'upload':
      return { type: 'fileUploadField', label: 'Upload' };
    case 'color':
      return { type: 'colorField', label: 'Color' };
    case 'editor':
      return { type: 'editorField', label: 'Editor' };
    case 'array':
      return { type: 'formArrayField', label: 'Array' };
    case 'relation':
      return { type: 'selectField', source: 'relation', label: 'Relation' };
    default:
      return { type: 'textField', label: 'Text' };
  }
}

function PaletteItem({ kind, label, hint }: { kind: PaletteKind; label: string; hint: string }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: `palette:${kind}` });
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`cursor-grab rounded-lg border border-border bg-surface px-2 py-1.5 hover:border-primary ${isDragging ? 'opacity-50' : ''}`}
      title={hint}
    >
      <p className="text-xs font-medium text-foreground">+ {label}</p>
      <p className="truncate text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

/** Label palet untuk ghost overlay saat drag. */
function paletteLabelOf(kind: PaletteKind): string {
  for (const section of PALETTE_SECTIONS) {
    const found = section.items.find((item) => item.kind === kind);
    if (found) return found.label;
  }
  return kind;
}

/**
 * Deteksi tabrakan kustom: seretan dari palet memakai posisi pointer
 * (akurat untuk drop ke area kosong kanvas), seretan antar kartu kanvas
 * tetap `closestCenter` seperti sebelumnya.
 */
const formCanvasCollision: CollisionDetection = (args) => {
  if (String(args.active.id).startsWith('palette:')) {
    const pointerHits = pointerWithin(args);
    return pointerHits.length > 0 ? pointerHits : rectIntersection(args);
  }
  return closestCenter(args);
};

/**
 * Drop-zone kanvas. WAJIB di dalam <DndContext> — hook useDroppable hanya
 * terdaftar bila dipanggil sebagai descendant provider. Sebelumnya hook
 * dipanggil di root FormBuilderCanvas (di luar DndContext) sehingga
 * droppable 'form-canvas' tidak pernah terdaftar: saat kanvas kosong
 * (tanpa kartu sortable) `over` selalu null dan drop palet gagal.
 */
function CanvasDropGrid({
  activePalette,
  children,
}: {
  activePalette: PaletteKind | null;
  children: ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: 'form-canvas' });
  return (
    <div
      ref={setNodeRef}
      id="form-canvas-drop"
      className={`grid min-h-40 grid-cols-12 field-gap rounded-xl border border-dashed bg-muted/30 p-4 transition-colors ${
        isOver && activePalette ? 'border-primary ring-1 ring-primary' : 'border-border'
      }`}
    >
      {children}
    </div>
  );
}

/**
 * Kartu kanvas WYSIWYG: gagang di strip kiri + FormItem asli (tanpa aksi),
 * klik memilih, drag hanya via gagang.
 */
function FieldCanvasCard({
  item,
  field,
  selected,
  onSelect,
  previewDef,
}: {
  item: FormLayoutItem;
  field: GeneratorFieldConfig;
  selected: boolean;
  onSelect: () => void;
  previewDef: ModuleDefinition;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.field,
  });
  // Kartu array: konten pratinjau dibiarkan interaktif agar tombol
  // Tambah/ubah/hapus membuka modal editor baris. Klik lain menggelembung
  // ke kartu dan tetap memilih (drawer properti).
  const interactivePreview = field.type === 'formArrayField';
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={`${colSpanClass(item.colSpan)} ${isDragging ? 'opacity-60' : ''}`}
    >
      <div
        role="button"
        tabIndex={0}
        data-testid={`canvas-card-${item.field}`}
        onClick={onSelect}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onSelect();
        }}
        className={`flex cursor-pointer items-stretch rounded-lg border bg-surface ${
          selected ? 'border-primary ring-1 ring-primary' : 'border-border'
        }`}
      >
        <span
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          data-testid={`canvas-drag-${item.field}`}
          className="flex w-8 shrink-0 cursor-grab items-center justify-center rounded-l-lg border-r border-border text-muted-foreground hover:bg-muted hover:text-foreground"
          title="Geser untuk memindahkan"
        >
          <GripIcon className="h-4 w-4" />
        </span>
        <div className="relative min-w-0 flex-1 p-3">
          <div className={interactivePreview ? '' : 'pointer-events-none'}>
            {renderDynamicField(field, {
              testPrefix: 'canvas-preview',
              optionsOf: (f) => (f.options ?? []).map((option) => ({ ...option })),
              loaderOf: (f) =>
                f.source === 'mockPagingInfinityScroll'
                  ? makeOptionsLoader(previewDef, f)
                  : f.source === 'relation'
                    ? makeRelationOptionsLoader(f)
                    : undefined,
            })}
          </div>
          {/* Konten pratinjau non-interaktif: lapisan ini menangkap klik (termasuk
            tombol mati seperti Tambah) agar tetap memilih kartu. Kartu array
            dikecualikan — tombol Tambah/ubah/hapus membuka modal editor baris
            (demo pratinjau; data asli diisi di langkah Live Preview / runtime).
            Drag via gagang. */}
          {!interactivePreview && (
            <button
              type="button"
              tabIndex={-1}
              aria-label={`Pilih field ${field.label}`}
              title="Klik untuk atur properti"
              onClick={onSelect}
              className="absolute inset-0 h-full w-full cursor-pointer rounded-r-lg"
            />
          )}
        </div>
      </div>
    </div>
  );
}

function DecoCanvasCard({
  item,
  selected,
  onSelect,
}: {
  item: FormLayoutItem;
  selected: boolean;
  onSelect: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.field,
  });
  const kind = item.kind ?? 'field';
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={`${colSpanClass(item.colSpan)} ${isDragging ? 'opacity-60' : ''}`}
    >
      <div
        role="button"
        tabIndex={0}
        data-testid={`canvas-card-${item.field}`}
        onClick={onSelect}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onSelect();
        }}
        className={`flex cursor-pointer items-stretch rounded-lg border bg-surface ${
          selected ? 'border-primary ring-1 ring-primary' : 'border-dashed border-border'
        }`}
      >
        <span
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          data-testid={`canvas-drag-${item.field}`}
          className="flex w-8 shrink-0 cursor-grab items-center justify-center rounded-l-lg border-r border-border text-muted-foreground hover:bg-muted hover:text-foreground"
          title="Geser untuk memindahkan"
        >
          <GripIcon className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1 p-3">
          {kind === 'section' ? (
            <h3 className="text-base font-semibold text-foreground">
              {item.label?.trim() || 'Section'}
            </h3>
          ) : (
            <div className="flex items-center py-2">
              <hr className="w-full border-border" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function WidthRow({ colSpan, onSpanChange }: { colSpan: number; onSpanChange: (span: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      <span className="flex-1 text-sm text-muted-foreground">Lebar (1–12)</span>
      <Button size="sm" variant="secondary" onClick={() => onSpanChange(colSpan - 1)}>
        −
      </Button>
      <span className="w-8 text-center font-mono text-xs">{colSpan}</span>
      <Button size="sm" variant="secondary" onClick={() => onSpanChange(colSpan + 1)}>
        +
      </Button>
    </div>
  );
}

/**
 * Isi drawer properti field: editor penuh + layout. Diremount per field via
 * key. Name di-commit saat blur (validasi duplikat + reserved).
 */
function FieldDrawerContent({
  field,
  colSpan,
  definitions,
  existingNames,
  onApply,
  onRename,
  onSpanChange,
}: {
  field: GeneratorFieldConfig;
  colSpan: number;
  definitions: ModuleDefinition[];
  existingNames: string[];
  onApply: (config: GeneratorFieldConfig) => void;
  onRename: (oldName: string, next: GeneratorFieldConfig) => void;
  onSpanChange: (span: number) => void;
}) {
  const [form, setForm] = useState<FieldFormValue>(() => initialFormValue(field, undefined));
  const [nameError, setNameError] = useState<string | null>(null);

  function handleFormChange(next: FieldFormValue): void {
    setForm(next);
    setNameError(null);
    // Name pending: tahan hingga blur, sisanya live.
    onApply({ ...buildFieldConfig({ ...next, name: field.name }), name: field.name });
  }

  function handleNameBlur(): void {
    const pending = form.name.trim();
    if (pending === field.name) return;
    if (!pending) {
      setNameError('Name wajib diisi.');
      setForm({ ...form, name: field.name });
      return;
    }
    if (isReservedFieldName(pending)) {
      setNameError(`"${pending}" reserved untuk kolom sistem.`);
      setForm({ ...form, name: field.name });
      return;
    }
    if (existingNames.includes(pending)) {
      setNameError(`Field name "${pending}" sudah dipakai.`);
      setForm({ ...form, name: field.name });
      return;
    }
    onRename(field.name, { ...buildFieldConfig(form), name: pending });
  }

  return (
    <div className="flex flex-col stack-gap">
      <Card title="Layout" collapsible size="sm">
        <WidthRow colSpan={colSpan} onSpanChange={onSpanChange} />
      </Card>
      {nameError && <p className="text-sm text-danger">{nameError}</p>}
      <FieldForm
        value={form}
        onChange={handleFormChange}
        definitions={definitions}
        onNameBlur={handleNameBlur}
      />
    </div>
  );
}

function FormBuilderCanvas({
  fields,
  onFieldsChange,
  layout,
  onChange,
  previewTitle,
  definitions,
  sampleRows,
  onSampleRowsChange,
}: FormBuilderCanvasProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  /** Dialog konfirmasi reset seluruh kanvas. */
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  /** Kind palet yang sedang diseret (ghost overlay); null = drag kanvas/batal. */
  const [activePalette, setActivePalette] = useState<PaletteKind | null>(null);
  /** Kata kunci pencarian palet komponen. */
  const [paletteQuery, setPaletteQuery] = useState('');
  const sensors = useSensors(
    useSensor(CanvasPointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const paletteDownAt = useRef<{ x: number; y: number } | null>(null);

  /** Seksi palet tersaring kata kunci (label + hint, case-insensitive). */
  const visiblePaletteSections = useMemo(() => {
    const query = paletteQuery.trim().toLowerCase();
    if (!query) return PALETTE_SECTIONS;
    return PALETTE_SECTIONS.map((section) => ({
      ...section,
      items: section.items.filter(
        (item) =>
          item.label.toLowerCase().includes(query) || item.hint.toLowerCase().includes(query),
      ),
    })).filter((section) => section.items.length > 0);
  }, [paletteQuery]);

  const effective = useMemo(
    () => normalizeLayout(layout ?? defaultLayoutForFields(fields), fields.map((f) => f.name)),
    [layout, fields],
  );
  const byName = useMemo(() => new Map(fields.map((field) => [field.name, field])), [fields]);
  const formItems = useMemo(
    () => [...effective.form].sort((a, b) => a.order - b.order),
    [effective],
  );
  const selectedItem = formItems.find((item) => item.field === selectedId) ?? null;
  const selectedField = selectedItem ? byName.get(selectedItem.field) : undefined;
  const drawerOpen = selectedItem !== null;

  /** Config field baru dari palet: nama otomatis terisi dari label. */
  function configForKind(kind: PaletteKind, existingNames: string[]): GeneratorFieldConfig {
    const preset = presetForKind(kind);
    const base = deriveFieldNaming(preset.label ?? kind).name || kind;
    const name = uniqueFieldName(base, existingNames);
    const config = buildFieldConfig({ ...initialFormValue(null, preset), name });
    // Array butuh minimal satu kolom agar bisa dipratinjau & lolos validasi publish.
    if (config.type === 'formArrayField' && (config.subFields ?? []).length === 0) {
      config.subFields = [
        {
          name: 'item',
          label: 'Item',
          type: 'textField',
          rules: [],
          source: 'none',
          sortable: false,
          filterable: false,
          filterCriteria: null,
        },
      ];
    }
    return config;
  }

  function addFromPalette(kind: PaletteKind, insertBefore: string | null = null): void {
    if (kind === 'section' || kind === 'divider') {
      let next = addFormItem(effective, kind);
      const added = next.form[next.form.length - 1];
      if (added && insertBefore) next = moveFormItem(next, added.field, insertBefore);
      onChange(next);
      if (added) setSelectedId(added.field);
      return;
    }
    const config = configForKind(kind, fields.map((f) => f.name));
    const next = [...fields, config];
    onFieldsChange(next);
    let layoutNext = normalizeLayout(effective, next.map((f) => f.name));
    if (insertBefore) layoutNext = moveFormItem(layoutNext, config.name, insertBefore);
    onChange(layoutNext);
    setSelectedId(config.name);
  }

  function handleDragStart(event: DragStartEvent): void {
    const activeId = String(event.active.id);
    setActivePalette(
      activeId.startsWith('palette:')
        ? (activeId.slice('palette:'.length) as PaletteKind)
        : null,
    );
  }

  function handleDragEnd(event: DragEndEvent): void {
    const { active, over } = event;
    setActivePalette(null);
    const activeId = String(active.id);
    const isPalette = activeId.startsWith('palette:');
    const paletteKind = isPalette
      ? (activeId.slice('palette:'.length) as PaletteKind)
      : null;
    // Fallback: bila `over` null (rect droppable basi / collision luput),
    // cek manual apakah rect drag beririsan dengan area kanvas.
    if (!over) {
      if (!isPalette || !paletteKind) return;
      const translated = event.active.rect.current.translated;
      const canvasEl = document.getElementById('form-canvas-drop');
      if (translated && canvasEl) {
        const cr = canvasEl.getBoundingClientRect();
        const intersects = !(
          translated.right < cr.left ||
          translated.left > cr.right ||
          translated.bottom < cr.top ||
          translated.top > cr.bottom
        );
        if (intersects) addFromPalette(paletteKind);
      }
      return;
    }
    if (isPalette && paletteKind) {
      addFromPalette(
        paletteKind,
        over.id === 'form-canvas' ? null : String(over.id),
      );
      return;
    }
    if (activeId === over.id) return;
    if (over.id === 'form-canvas') return;
    onChange(moveFormItem(effective, activeId, String(over.id)));
  }

  function handleDeleteField(field: GeneratorFieldConfig): void {
    const next = fields.filter((f) => f !== field);
    onFieldsChange(next);
    onChange(
      normalizeLayout(
        { ...effective, form: effective.form.filter((item) => item.field !== field.name) },
        next.map((f) => f.name),
      ),
    );
    if (selectedId === field.name) setSelectedId(null);
  }

  function handlePanelApply(config: GeneratorFieldConfig): void {
    onFieldsChange(fields.map((f) => (f.name === config.name ? config : f)));
  }

  function handleRename(oldName: string, next: GeneratorFieldConfig): void {
    onFieldsChange(fields.map((f) => (f.name === oldName ? next : f)));
    onChange(
      normalizeLayout(
        renameFieldInLayout(effective, oldName, next.name),
        fields.map((f) => (f.name === oldName ? next.name : f.name)),
      ),
    );
    onSampleRowsChange(
      sampleRows.map((row) => {
        if (!(oldName in row)) return row;
        const remapped: DynamicListItem = { ...row, [next.name]: row[oldName] };
        delete remapped[oldName];
        return remapped;
      }),
    );
    setSelectedId(next.name);
  }

  function handleDeleteSelected(): void {
    if (selectedField) {
      handleDeleteField(selectedField);
      return;
    }
    if (selectedItem) {
      onChange(removeFormItem(effective, selectedItem.field));
      setSelectedId(null);
    }
  }

  /** Kosongkan seluruh kanvas: fields + layout form + data contoh terkait. */
  function handleResetAll(): void {
    onFieldsChange([]);
    onChange(normalizeLayout({ form: [], table: { order: [], hidden: [] } }, []));
    onSampleRowsChange([]);
    setSelectedId(null);
    setShowResetConfirm(false);
  }

  // Hapus kartu terseleksi via keyboard Delete/Backspace. Diabaikan saat
  // fokus di input editable (drawer properti, text field, editor, dialog)
  // agar tidak menghapus saat pengguna sedang mengetik.
  useEffect(() => {
    if (selectedItem === null || showResetConfirm) return;
    function isEditableTarget(target: EventTarget | null): boolean {
      if (!(target instanceof Element)) return false;
      const el = target instanceof HTMLElement ? target : target as Element;
      const tag = el.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
      if (el instanceof HTMLElement && el.isContentEditable) return true;
      if (el.closest('input, textarea, select, [contenteditable="true"]')) return true;
      return false;
    }
    function handleKey(e: KeyboardEvent): void {
      if (e.key !== 'Delete' && e.key !== 'Backspace') return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (isEditableTarget(document.activeElement) || isEditableTarget(e.target)) return;
      e.preventDefault();
      handleDeleteSelected();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [selectedItem, showResetConfirm]);

  const previewDef: ModuleDefinition = useMemo(
    () => ({
      version: 1,
      key: 'preview',
      label: 'Preview',
      singularLabel: previewTitle || 'Preview',
      parent: null,
      routeBase: 'preview',
      permissionKey: 'preview',
      apiPlural: 'previews',
      moduleType: 'crud',
      features: {
        list: true,
        detail: true,
        create: true,
        edit: true,
        delete: true,
        bulkUpload: true,
        export: true,
      },
      fields,
      layout: effective,
      deleteMode: 'soft',
      status: 'draft',
    }),
    [fields, effective, previewTitle],
  );
  return (
    <div className="flex flex-col section-gap">
      <Alert
        variant="info"
        message="Klik atau seret komponen dari palet ke kanvas — field langsung jadi dengan nama otomatis, ubah lewat drawer properti. Klik kartu untuk memilih; Delete/Backspace menghapus kartu yang dipilih."
      />

      <div>
        <DndContext
          sensors={sensors}
          collisionDetection={formCanvasCollision}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={() => setActivePalette(null)}
        >
          <DragOverlay dropAnimation={null}>
            {activePalette ? (
              <div className="cursor-grabbing rounded-lg border border-primary bg-surface px-2 py-1.5 opacity-90 shadow-lg">
                <p className="text-xs font-medium text-foreground">+ {paletteLabelOf(activePalette)}</p>
                <p className="text-xs text-muted-foreground">Tarik ke kanvas…</p>
              </div>
            ) : null}
          </DragOverlay>
          <div className="grid gap-4 xl:grid-cols-[220px_minmax(0,1fr)]">
            <div>
              <p className="mb-2 text-sm font-medium text-foreground">Palet</p>
              <div className="mb-2">
                <TextField
                  size="sm"
                  value={paletteQuery}
                  onChange={(e) => setPaletteQuery(e.target.value)}
                  placeholder="Cari komponen…"
                  data-testid="palette-search"
                />
              </div>
              <div className="flex flex-col stack-gap">
                {visiblePaletteSections.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    Tidak ada komponen yang cocok.
                  </p>
                )}
                {visiblePaletteSections.map((section) => (
                  <div key={section.title}>
                    <p className="mb-2 text-sm font-semibold text-foreground">{section.title}</p>
                    <div className="flex flex-col field-gap">
                      {section.items.map((item) => (
                        <div
                          key={item.kind}
                          onPointerDown={(e) =>
                            (paletteDownAt.current = { x: e.clientX, y: e.clientY })
                          }
                          onClick={(e) => {
                            // Abaikan klik yang mengakhiri drag (drop sudah menambah).
                            const down = paletteDownAt.current;
                            paletteDownAt.current = null;
                            if (
                              down &&
                              Math.hypot(e.clientX - down.x, e.clientY - down.y) > 4
                            ) {
                              return;
                            }
                            addFromPalette(item.kind);
                          }}
                        >
                          <PaletteItem kind={item.kind} label={item.label} hint={item.hint} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-foreground">Kanvas form (grid 12)</p>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => setShowResetConfirm(true)}
                  disabled={formItems.length === 0}
                  icon={<TrashIcon className="h-4 w-4" />}
                  testId="canvas-reset"
                  title="Kosongkan seluruh kanvas"
                >
                  Reset
                </Button>
              </div>
              <SortableContext
                items={formItems.map((item) => item.field)}
                strategy={rectSortingStrategy}
              >
                <FormGroup defaultValues={{}} onSubmit={() => {}}>
                  <CanvasDropGrid activePalette={activePalette}>
                    {formItems.length === 0 && (
                      <p className="col-span-12 py-8 text-center text-sm text-muted-foreground">
                        Kanvas kosong — tambah komponen dari palet.
                      </p>
                    )}
                    {formItems.map((item) => {
                      const field = byName.get(item.field);
                      if ((item.kind ?? 'field') !== 'field' || !field) {
                        return (
                          <DecoCanvasCard
                            key={item.field}
                            item={item}
                            selected={selectedId === item.field}
                            onSelect={() => setSelectedId(item.field)}
                          />
                        );
                      }
                      return (
                        <FieldCanvasCard
                          key={item.field}
                          item={item}
                          field={field}
                          selected={selectedId === item.field}
                          onSelect={() => setSelectedId(item.field)}
                          previewDef={previewDef}
                        />
                      );
                    })}
                  </CanvasDropGrid>
                </FormGroup>
              </SortableContext>
            </div>
          </div>
        </DndContext>
      </div>

      <Drawer
        open={drawerOpen}
        onClose={() => setSelectedId(null)}
        title="Properti"
        width="md"
        modal={false}
        testId="property-drawer"
        footer={
          <Button
            size="sm"
            variant="danger"
            onClick={handleDeleteSelected}
            icon={<TrashIcon className="h-4 w-4" />}
          >
            {selectedField ? 'Hapus field' : 'Hapus'}
          </Button>
        }
      >
        {selectedItem && selectedField && (
          <FieldDrawerContent
            key={selectedField.name}
            field={selectedField}
            colSpan={selectedItem.colSpan}
            definitions={definitions}
            existingNames={fields.filter((f) => f !== selectedField).map((f) => f.name)}
            onApply={handlePanelApply}
            onRename={handleRename}
            onSpanChange={(span) => onChange(setFormSpan(effective, selectedItem.field, span))}
          />
        )}
        {selectedItem && !selectedField && (
          <Card title="Layout" collapsible size="sm">
            <div className="flex flex-col field-gap">
              {(selectedItem.kind ?? 'field') === 'section' && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Judul</label>
                  <TextField
                    value={selectedItem.label ?? ''}
                    onChange={(e) =>
                      onChange(setFormItemLabel(effective, selectedItem.field, e.target.value))
                    }
                  />
                </div>
              )}
              <WidthRow
                colSpan={selectedItem.colSpan}
                onSpanChange={(span) =>
                  onChange(setFormSpan(effective, selectedItem.field, span))
                }
              />
            </div>
          </Card>
        )}
      </Drawer>

      <Dialog
        testId="canvas-reset-dialog"
        open={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        title="Reset kanvas"
        maxWidth="md"
        closeOnEscape
        closeOnBackdropClick
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowResetConfirm(false)}>
              Batal
            </Button>
            <Button variant="danger" onClick={handleResetAll} icon={<TrashIcon className="h-4 w-4" />}>Reset kanvas</Button>
          </>
        }
      >
        <p className="text-sm text-foreground">
          Kosongkan seluruh kanvas? Semua field, section/divider, dan data contoh ikut
          terhapus dan tidak bisa dikembalikan.
        </p>
      </Dialog>

    </div>
  );
}

export default FormBuilderCanvas;
