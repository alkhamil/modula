/** Canvas 3 — Detail Builder: susun field read-only + pratinjau kartu detail. */
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
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Badge, Button, Card, DetailCard } from '../../../shared/components/ui';
import { ChevronUpDownIcon } from '../../../shared/components/icons';
import type { ModuleDefinition, ModuleLayout } from '../definitions';
import type { GeneratorFieldConfig } from '../types';
import { moveDetailItem, toggleDetailItem } from '../runtime/layoutOps';
import { buildDetailRows } from '../runtime/hooks';
import type { DynamicListItem } from '../runtime/types';
import { sampleToDetail } from './draft';

interface DetailBuilderCanvasProps {
  def: ModuleDefinition;
  fields: GeneratorFieldConfig[];
  layout: ModuleLayout;
  onChange: (layout: ModuleLayout) => void;
  sampleRows: DynamicListItem[];
}

function SortableDetailRow({
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

type DetailTab = 'order' | 'preview';

function DetailBuilderCanvas({
  def,
  fields,
  layout,
  onChange,
  sampleRows,
}: DetailBuilderCanvasProps) {
  const [tab, setTab] = useState<DetailTab>('order');
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const byName = useMemo(() => new Map(fields.map((field) => [field.name, field])), [fields]);
  const detail = layout.detail ?? { order: fields.map((f) => f.name), hidden: [] };
  const previewDef = useMemo(() => ({ ...def, layout }), [def, layout]);
  const previewRows = useMemo(
    () =>
      buildDetailRows(previewDef, sampleRows.length > 0 ? sampleToDetail(sampleRows[0]) : null),
    [previewDef, sampleRows],
  );

  function handleDragEnd(event: DragEndEvent): void {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    onChange(moveDetailItem(layout, String(active.id), String(over.id)));
  }

  if (fields.length === 0) {
    return <p className="text-sm text-muted-foreground">Tambahkan field di kanvas form dulu.</p>;
  }

  return (
    <div className="flex flex-col stack-gap">
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={tab === 'order' ? 'primary' : 'secondary'}
          onClick={() => setTab('order')}
        >
          Susunan
        </Button>
        <Button
          size="sm"
          variant={tab === 'order' ? 'secondary' : 'primary'}
          onClick={() => setTab('preview')}
        >
          Pratinjau
        </Button>
      </div>

      {tab === 'order' && (
        <div>
          <p className="mb-3 text-sm text-muted-foreground">
            Geser untuk urutan field di halaman detail. Status, Created By, dan Created Date selalu
            tampil.
          </p>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={detail.order} strategy={verticalListSortingStrategy}>
              <div className="flex max-w-xl flex-col field-gap">
                {detail.order.map((name) => {
                  const field = byName.get(name);
                  if (!field) return null;
                  return (
                    <SortableDetailRow
                      key={name}
                      field={field}
                      hidden={detail.hidden.includes(name)}
                      onToggle={() => onChange(toggleDetailItem(layout, name))}
                    />
                  );
                })}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}

      {tab === 'preview' && (
        <div className="flex max-w-2xl flex-col stack-gap">
          <DetailCard
            title={`${previewDef.singularLabel} Details`}
            state={{ status: 'success', rows: previewRows }}
          />
          {sampleRows.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Nilai kosong — isi data contoh di langkah Test Data untuk pratinjau berisi.
            </p>
          )}
          <Card title="History / Timeline">
            <p className="text-sm text-muted-foreground">
              Follow-up: butuh audit trail (siapa mengubah apa, kapan). Belum tersedia di
              mock-only — slot ini dicadangkan untuk itu.
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}

export default DetailBuilderCanvas;
