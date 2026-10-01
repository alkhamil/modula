/** Canvas editor layout: grid form drag-and-drop + urutan kolom tabel + pratinjau live. */
import { useMemo, useState } from 'react';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Badge, Button } from '../../../shared/components/ui';
import { ChevronUpDownIcon } from '../../../shared/components/icons';
import type { GeneratorFieldConfig } from '../types';
import type { FormLayoutItem, ModuleDefinition, ModuleLayout } from '../definitions';
import { defaultLayoutForFields, normalizeLayout } from '../definitions';
import { colSpanClass } from '../runtime/grid';
import { moveFormItem, moveTableColumn, setFormSpan, toggleTableColumn } from '../runtime/layoutOps';
import DynamicForm from '../runtime/DynamicForm';
import { formDefaultValue } from '../runtime/validation';
import { makeOptionsLoader } from '../runtime/recordsApi';
import type { DynamicFormValues } from '../runtime/validation';
import type { SubmitResult } from '../../../shared/types';

interface LayoutStepProps {
  fields: GeneratorFieldConfig[];
  layout: ModuleLayout | null;
  onChange: (layout: ModuleLayout) => void;
  previewTitle: string;
  testId?: string;
}

type LayoutTab = 'form' | 'table' | 'preview';

function SortableFormCard({
  item,
  field,
  index,
  onSpanChange,
}: {
  item: FormLayoutItem;
  field: GeneratorFieldConfig;
  index: number;
  onSpanChange: (span: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.field,
  });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={`${colSpanClass(item.colSpan)} ${isDragging ? 'opacity-60' : ''}`}
    >
      <div className="flex items-center gap-2 rounded-lg border border-border bg-surface p-3">
        <span
          {...attributes}
          {...listeners}
          className="flex h-7 w-7 shrink-0 cursor-grab items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
          title="Geser untuk memindahkan"
        >
          <ChevronUpDownIcon />
        </span>
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
          {index + 1}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">{field.label}</p>
          <p className="truncate font-mono text-xs text-muted-foreground">{field.name}</p>
        </div>
        <Badge variant="secondary">{field.type.replace(/Field$/, '')}</Badge>
        <div className="flex shrink-0 items-center gap-1">
          <Button size="sm" variant="secondary" onClick={() => onSpanChange(item.colSpan - 1)}>
            −
          </Button>
          <span className="w-8 text-center font-mono text-xs text-foreground" title="Lebar kolom (1–12)">
            {item.colSpan}
          </span>
          <Button size="sm" variant="secondary" onClick={() => onSpanChange(item.colSpan + 1)}>
            +
          </Button>
        </div>
      </div>
    </div>
  );
}

function SortableTableRow({
  field,
  hidden,
  onToggle,
}: {
  field: GeneratorFieldConfig;
  hidden: boolean;
  onToggle: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: field.name,
  });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={isDragging ? 'opacity-60' : ''}
    >
      <div
        className={`flex items-center gap-2 rounded-lg border border-border bg-surface p-3 ${hidden ? 'opacity-50' : ''}`}
      >
        <span
          {...attributes}
          {...listeners}
          className="flex h-7 w-7 shrink-0 cursor-grab items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
          title="Geser untuk memindahkan"
        >
          <ChevronUpDownIcon />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">{field.label}</p>
          <p className="truncate font-mono text-xs text-muted-foreground">{field.name}</p>
        </div>
        {hidden && <Badge variant="secondary">Hidden</Badge>}
        <Button size="sm" variant="secondary" onClick={onToggle}>
          {hidden ? 'Tampilkan' : 'Sembunyikan'}
        </Button>
      </div>
    </div>
  );
}

function LayoutStep({ fields, layout, onChange, previewTitle, testId }: LayoutStepProps) {
  const [tab, setTab] = useState<LayoutTab>('form');
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const effective = useMemo(
    () => normalizeLayout(layout ?? defaultLayoutForFields(fields), fields.map((f) => f.name)),
    [layout, fields],
  );
  const byName = useMemo(() => new Map(fields.map((field) => [field.name, field])), [fields]);
  const formItems = useMemo(
    () => [...effective.form].sort((a, b) => a.order - b.order),
    [effective],
  );

  function handleFormDragEnd(event: DragEndEvent): void {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    onChange(moveFormItem(effective, String(active.id), String(over.id)));
  }

  function handleTableDragEnd(event: DragEndEvent): void {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    onChange(moveTableColumn(effective, String(active.id), String(over.id)));
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

  if (fields.length === 0) {
    return <p className="text-sm text-muted-foreground">Tambahkan field terlebih dahulu.</p>;
  }

  const tabs: { id: LayoutTab; label: string }[] = [
    { id: 'form', label: 'Form Grid' },
    { id: 'table', label: 'Table Columns' },
    { id: 'preview', label: 'Live Preview' },
  ];

  return (
    <div data-testid={testId} className="flex flex-col stack-gap">
      <div className="flex flex-wrap gap-2">
        {tabs.map((item) => (
          <Button
            key={item.id}
            size="sm"
            variant={tab === item.id ? 'primary' : 'secondary'}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </Button>
        ))}
      </div>

      {tab === 'form' && (
        <div>
          <p className="mb-3 text-sm text-muted-foreground">
            Geser kartu untuk menyusun urutan field. Atur angka lebar (1–12) untuk kolom grid —
            12 berarti satu baris penuh.
          </p>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleFormDragEnd}>
            <SortableContext
              items={formItems.map((item) => item.field)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-12 field-gap rounded-xl border border-dashed border-border bg-muted/30 p-4">
                {formItems.map((item, index) => {
                  const field = byName.get(item.field);
                  if (!field) return null;
                  return (
                    <SortableFormCard
                      key={item.field}
                      item={item}
                      field={field}
                      index={index}
                      onSpanChange={(span) => onChange(setFormSpan(effective, item.field, span))}
                    />
                  );
                })}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}

      {tab === 'table' && (
        <div>
          <p className="mb-3 text-sm text-muted-foreground">
            Geser untuk menyusun urutan kolom tabel. Kolom sistem (Created By, Created Date,
            Status) selalu di akhir. Kolom tersembunyi tetap ada di definisi.
          </p>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleTableDragEnd}
          >
            <SortableContext items={effective.table.order} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col field-gap">
                {effective.table.order.map((name) => {
                  const field = byName.get(name);
                  if (!field) return null;
                  return (
                    <SortableTableRow
                      key={name}
                      field={field}
                      hidden={effective.table.hidden.includes(name)}
                      onToggle={() => onChange(toggleTableColumn(effective, name))}
                    />
                  );
                })}
              </div>
            </SortableContext>
          </DndContext>
        </div>
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
                : undefined
            }
          />
        </div>
      )}
    </div>
  );
}

export default LayoutStep;
