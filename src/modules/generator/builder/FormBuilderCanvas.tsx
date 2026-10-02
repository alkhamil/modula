/** Canvas 1 — Form Builder: palet komponen + kanvas grid drag-drop + panel properti + preview. */
import { useMemo, useRef, useState } from 'react';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useDroppable,
  useDraggable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Badge, Button, CheckboxField, TextField } from '../../../shared/components/ui';
import { ChevronUpDownIcon, PencilIcon, TrashIcon } from '../../../shared/components/icons';
import type { GeneratorFieldConfig } from '../types';
import type { FormLayoutItem, ModuleDefinition, ModuleLayout } from '../definitions';
import { defaultLayoutForFields, normalizeLayout } from '../definitions';
import { colSpanClass } from '../runtime/grid';
import {
  addFormItem,
  moveFormItem,
  removeFormItem,
  setFormItemLabel,
  setFormSpan,
} from '../runtime/layoutOps';
import DynamicForm from '../runtime/DynamicForm';
import { formDefaultValue } from '../runtime/validation';
import { makeOptionsLoader, makeRelationOptionsLoader } from '../runtime/recordsApi';
import type { DynamicFormValues } from '../runtime/validation';
import type { SubmitResult } from '../../../shared/types';
import FieldDialog, { type FieldDialogPreset } from '../components/FieldDialog';

interface FormBuilderCanvasProps {
  fields: GeneratorFieldConfig[];
  onFieldsChange: (fields: GeneratorFieldConfig[]) => void;
  layout: ModuleLayout | null;
  onChange: (layout: ModuleLayout) => void;
  previewTitle: string;
  definitions: ModuleDefinition[];
}

type PaletteKind =
  | 'text'
  | 'number'
  | 'textarea'
  | 'select'
  | 'date'
  | 'switch'
  | 'upload'
  | 'relation'
  | 'section'
  | 'divider';

const PALETTE: { kind: PaletteKind; label: string; hint: string }[] = [
  { kind: 'text', label: 'Text', hint: 'Input teks' },
  { kind: 'number', label: 'Number', hint: 'Input angka' },
  { kind: 'textarea', label: 'Textarea', hint: 'Teks multi baris' },
  { kind: 'select', label: 'Select', hint: 'Dropdown options' },
  { kind: 'date', label: 'Date', hint: 'Pemilih tanggal' },
  { kind: 'switch', label: 'Switch', hint: 'Toggle ya/tidak' },
  { kind: 'upload', label: 'Upload', hint: 'Upload file' },
  { kind: 'relation', label: 'Relation', hint: 'Options modul lain' },
  { kind: 'section', label: 'Section', hint: 'Judul seksi' },
  { kind: 'divider', label: 'Divider', hint: 'Garis pemisah' },
];

function presetForKind(kind: PaletteKind): FieldDialogPreset {
  switch (kind) {
    case 'number':
      return { type: 'numberField', label: 'Number' };
    case 'textarea':
      return { type: 'textareaField', label: 'Textarea' };
    case 'select':
      return { type: 'selectField', source: 'mockStatic', label: 'Select' };
    case 'date':
      return { type: 'dateField', label: 'Date' };
    case 'switch':
      return { type: 'switchField', label: 'Switch' };
    case 'upload':
      return { type: 'fileUploadField', label: 'Upload' };
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
      className={`cursor-grab rounded-lg border border-border bg-surface px-3 py-2 hover:border-primary ${isDragging ? 'opacity-50' : ''}`}
      title={hint}
    >
      <p className="text-sm font-medium text-foreground">+ {label}</p>
      <p className="truncate text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

function CanvasCard({
  item,
  field,
  index,
  selected,
  onSelect,
  onSpanChange,
  onDelete,
  onEdit,
}: {
  item: FormLayoutItem;
  field: GeneratorFieldConfig | undefined;
  index: number;
  selected: boolean;
  onSelect: () => void;
  onSpanChange: (span: number) => void;
  onDelete: (() => void) | null;
  onEdit: (() => void) | null;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.field,
  });
  const kind = item.kind ?? 'field';
  const title = kind === 'section' ? (item.label ?? 'Section') : (field?.label ?? item.field);
  const subtitle = kind === 'field' ? (field?.name ?? item.field) : kind;
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={`${colSpanClass(item.colSpan)} ${isDragging ? 'opacity-60' : ''}`}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={onSelect}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onSelect();
        }}
        className={`flex cursor-pointer items-center gap-2 rounded-lg border bg-surface p-3 ${
          selected ? 'border-primary ring-1 ring-primary' : 'border-border'
        }`}
      >
        <span
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          className="flex h-7 w-7 shrink-0 cursor-grab items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
          title="Geser untuk memindahkan"
        >
          <ChevronUpDownIcon />
        </span>
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
          {index + 1}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">{title}</p>
          <p className="truncate font-mono text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <Badge variant="secondary">
          {kind === 'field' ? (field?.type.replace(/Field$/, '') ?? '?') : kind}
        </Badge>
        <div className="flex shrink-0 items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <Button size="sm" variant="secondary" onClick={() => onSpanChange(item.colSpan - 1)}>
            −
          </Button>
          <span className="w-8 text-center font-mono text-xs text-foreground" title="Lebar (1–12)">
            {item.colSpan}
          </span>
          <Button size="sm" variant="secondary" onClick={() => onSpanChange(item.colSpan + 1)}>
            +
          </Button>
          {onEdit && (
            <Button size="sm" variant="secondary" onClick={onEdit} title="Edit field">
              <PencilIcon className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button size="sm" variant="secondary" onClick={onDelete} title="Hapus">
              <TrashIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

type CanvasTab = 'builder' | 'preview';

function FormBuilderCanvas({
  fields,
  onFieldsChange,
  layout,
  onChange,
  previewTitle,
  definitions,
}: FormBuilderCanvasProps) {
  const [tab, setTab] = useState<CanvasTab>('builder');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogPreset, setDialogPreset] = useState<FieldDialogPreset | undefined>(undefined);
  const [editing, setEditing] = useState<{ field: GeneratorFieldConfig; index: number } | null>(
    null,
  );
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const { setNodeRef: setCanvasRef } = useDroppable({ id: 'form-canvas' });
  const paletteDownAt = useRef<{ x: number; y: number } | null>(null);

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

  function addFromPalette(kind: PaletteKind): void {
    if (kind === 'section' || kind === 'divider') {
      onChange(addFormItem(effective, kind));
      return;
    }
    setEditing(null);
    setDialogPreset(presetForKind(kind));
    setDialogOpen(true);
  }

  function handleDragEnd(event: DragEndEvent): void {
    const { active, over } = event;
    if (!over) return;
    const activeId = String(active.id);
    if (activeId.startsWith('palette:')) {
      addFromPalette(activeId.slice('palette:'.length) as PaletteKind);
      return;
    }
    if (activeId === over.id) return;
    if (over.id === 'form-canvas') return;
    onChange(moveFormItem(effective, activeId, String(over.id)));
  }

  function handleDialogSave(field: GeneratorFieldConfig, index: number | null): void {
    if (index === null) {
      const next = [...fields, field];
      onFieldsChange(next);
      onChange(normalizeLayout(effective, next.map((f) => f.name)));
      setSelectedId(field.name);
    } else {
      const oldName = fields[index]?.name;
      const next = fields.map((existing, i) => (i === index ? field : existing));
      onFieldsChange(next);
      if (oldName && oldName !== field.name) {
        onChange(
          normalizeLayout(
            {
              ...effective,
              form: effective.form.map((item) =>
                item.field === oldName ? { ...item, field: field.name } : item,
              ),
            },
            next.map((f) => f.name),
          ),
        );
        setSelectedId(field.name);
      }
    }
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

  function toggleRequired(field: GeneratorFieldConfig, required: boolean): void {
    const rules = required
      ? [...field.rules.filter((r) => r !== 'required'), 'required']
      : field.rules.filter((r) => r !== 'required');
    onFieldsChange(fields.map((f) => (f === field ? { ...f, rules } : f)));
  }

  function updateFieldLabel(field: GeneratorFieldConfig, label: string): void {
    onFieldsChange(fields.map((f) => (f === field ? { ...f, label } : f)));
  }

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
  const previewDefaults: DynamicFormValues = useMemo(() => {
    const values: DynamicFormValues = {};
    for (const field of fields) values[field.name] = formDefaultValue(field);
    return values;
  }, [fields]);

  async function handlePreviewSubmit(): Promise<SubmitResult> {
    return { success: true };
  }

  return (
    <div className="flex flex-col stack-gap">
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={tab === 'builder' ? 'primary' : 'secondary'}
          onClick={() => setTab('builder')}
        >
          Builder
        </Button>
        <Button
          size="sm"
          variant={tab === 'builder' ? 'secondary' : 'primary'}
          onClick={() => setTab('preview')}
        >
          Live Preview
        </Button>
      </div>

      {tab === 'builder' && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="grid gap-4 xl:grid-cols-[220px_minmax(0,1fr)_260px]">
            <div>
              <p className="mb-2 text-sm font-medium text-foreground">Palet</p>
              <div className="flex flex-col field-gap">
                {PALETTE.map((item) => (
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
              <p className="mt-2 text-xs text-muted-foreground">
                Klik atau seret ke kanvas. Field baru membuka dialog pengaturan.
              </p>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-foreground">Kanvas form (grid 12)</p>
              <div ref={setCanvasRef}>
                <SortableContext
                  items={formItems.map((item) => item.field)}
                  strategy={rectSortingStrategy}
                >
                  <div className="grid min-h-40 grid-cols-12 field-gap rounded-xl border border-dashed border-border bg-muted/30 p-4">
                    {formItems.length === 0 && (
                      <p className="col-span-12 py-8 text-center text-sm text-muted-foreground">
                        Kanvas kosong — tambah komponen dari palet.
                      </p>
                    )}
                    {formItems.map((item, index) => (
                      <CanvasCard
                        key={item.field}
                        item={item}
                        field={byName.get(item.field)}
                        index={index}
                        selected={selectedId === item.field}
                        onSelect={() => setSelectedId(item.field)}
                        onSpanChange={(span) => onChange(setFormSpan(effective, item.field, span))}
                        onDelete={
                          (item.kind ?? 'field') !== 'field'
                            ? () => {
                                onChange(removeFormItem(effective, item.field));
                                if (selectedId === item.field) setSelectedId(null);
                              }
                            : byName.get(item.field)
                              ? () => handleDeleteField(byName.get(item.field) as GeneratorFieldConfig)
                              : null
                        }
                        onEdit={
                          byName.get(item.field)
                            ? () => {
                                const target = byName.get(item.field) as GeneratorFieldConfig;
                                setEditing({ field: target, index: fields.indexOf(target) });
                                setDialogPreset(undefined);
                                setDialogOpen(true);
                              }
                            : null
                        }
                      />
                    ))}
                  </div>
                </SortableContext>
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-foreground">Properti</p>
              {!selectedItem && (
                <p className="text-sm text-muted-foreground">
                  Klik kartu di kanvas untuk mengatur properti.
                </p>
              )}
              {selectedItem && selectedField && (
                <div className="flex flex-col field-gap rounded-xl border border-border bg-surface p-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">Label</label>
                    <TextField
                      value={selectedField.label}
                      onChange={(e) => updateFieldLabel(selectedField, e.target.value)}
                    />
                  </div>
                  <p className="font-mono text-xs text-muted-foreground">
                    {selectedField.name} · {selectedField.type.replace(/Field$/, '')}
                  </p>
                  <CheckboxField
                    value={selectedField.rules.includes('required')}
                    onChange={(checked) => toggleRequired(selectedField, checked)}
                    checkboxLabel="Required"
                  />
                  <div className="flex items-center gap-1">
                    <span className="flex-1 text-sm text-muted-foreground">Lebar</span>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() =>
                        onChange(setFormSpan(effective, selectedItem.field, selectedItem.colSpan - 1))
                      }
                    >
                      −
                    </Button>
                    <span className="w-8 text-center font-mono text-xs">{selectedItem.colSpan}</span>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() =>
                        onChange(setFormSpan(effective, selectedItem.field, selectedItem.colSpan + 1))
                      }
                    >
                      +
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setEditing({ field: selectedField, index: fields.indexOf(selectedField) });
                      setDialogPreset(undefined);
                      setDialogOpen(true);
                    }}
                    icon={<PencilIcon className="h-4 w-4" />}
                  >
                    Edit lengkap
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleDeleteField(selectedField)}
                    icon={<TrashIcon className="h-4 w-4" />}
                  >
                    Hapus field
                  </Button>
                </div>
              )}
              {selectedItem && !selectedField && (
                <div className="flex flex-col field-gap rounded-xl border border-border bg-surface p-3">
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
                  <div className="flex items-center gap-1">
                    <span className="flex-1 text-sm text-muted-foreground">Lebar</span>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() =>
                        onChange(setFormSpan(effective, selectedItem.field, selectedItem.colSpan - 1))
                      }
                    >
                      −
                    </Button>
                    <span className="w-8 text-center font-mono text-xs">{selectedItem.colSpan}</span>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() =>
                        onChange(setFormSpan(effective, selectedItem.field, selectedItem.colSpan + 1))
                      }
                    >
                      +
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      onChange(removeFormItem(effective, selectedItem.field));
                      setSelectedId(null);
                    }}
                    icon={<TrashIcon className="h-4 w-4" />}
                  >
                    Hapus
                  </Button>
                </div>
              )}
            </div>
          </div>
        </DndContext>
      )}

      {tab === 'preview' && (
        <div>
          <p className="mb-3 text-sm text-muted-foreground">
            Pratinjau live form dengan layout saat ini — perubahan langsung terlihat.
          </p>
          <DynamicForm
            def={previewDef}
            defaultValues={previewDefaults}
            onSubmit={handlePreviewSubmit}
            onCancel={() => {}}
            optionsOf={(field) => (field.options ?? []).map((option) => ({ ...option }))}
            loaderOf={(field) =>
              field.source === 'mockPagingInfinityScroll'
                ? makeOptionsLoader(previewDef, field)
                : field.source === 'relation'
                  ? makeRelationOptionsLoader(field)
                  : undefined
            }
          />
        </div>
      )}

      {dialogOpen && (
        <FieldDialog
          open={dialogOpen}
          initial={editing}
          existingNames={fields.map((f) => f.name)}
          definitions={definitions}
          preset={dialogPreset}
          onClose={() => {
            setDialogOpen(false);
            setEditing(null);
            setDialogPreset(undefined);
          }}
          onSave={handleDialogSave}
        />
      )}
    </div>
  );
}

export default FormBuilderCanvas;
