/** Canvas 2 — List Builder: susun kolom + aksi/fitur + pratinjau dari data contoh. */
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
import { Badge, Button, CheckboxField, SelectField, TextField, useToast } from '../../../shared/components/ui';
import { ChevronUpDownIcon } from '../../../shared/components/icons';
import type { DeleteMode, ModuleDefinition, ModuleLayout } from '../definitions';
import type { FeatureKey, GeneratorFieldConfig } from '../types';
import { moveTableColumn, setTableWidth, toggleTableColumn } from '../runtime/layoutOps';
import DynamicTable from '../runtime/DynamicTable';
import type { DynamicListItem } from '../runtime/types';

interface ListBuilderCanvasProps {
  def: ModuleDefinition;
  fields: GeneratorFieldConfig[];
  onFieldsChange: (fields: GeneratorFieldConfig[]) => void;
  layout: ModuleLayout;
  onChange: (layout: ModuleLayout) => void;
  features: Record<FeatureKey, boolean>;
  onFeaturesChange: (features: Record<FeatureKey, boolean>) => void;
  deleteMode: DeleteMode;
  onDeleteModeChange: (mode: DeleteMode) => void;
  sampleRows: DynamicListItem[];
}

const PAGE_SIZE = 10;

function WidthInput({ value, onCommit }: { value: number | undefined; onCommit: (px: number) => void }) {
  const [draft, setDraft] = useState(value === undefined ? '' : String(value));
  return (
    <div className="w-24" title="Lebar kolom px (kosong = otomatis)">
      <TextField
        value={draft}
        onChange={(e) => setDraft(e.target.value.replace(/[^0-9]/g, ''))}
        onBlur={() => onCommit(draft === '' ? 0 : Number(draft))}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onCommit(draft === '' ? 0 : Number(draft));
        }}
        placeholder="Auto"
      />
    </div>
  );
}

function SortableColumnRow({
  field,
  hidden,
  width,
  onToggle,
  onWidth,
  onSortable,
  onFilterable,
}: {
  field: GeneratorFieldConfig;
  hidden: boolean;
  width: number | undefined;
  onToggle: () => void;
  onWidth: (px: number) => void;
  onSortable: (value: boolean) => void;
  onFilterable: (value: boolean) => void;
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
        className={`flex flex-wrap items-center gap-2 rounded-lg border border-border bg-surface p-3 ${hidden ? 'opacity-50' : ''}`}
      >
        <span
          {...attributes}
          {...listeners}
          className="flex h-7 w-7 shrink-0 cursor-grab items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
          title="Geser untuk memindahkan"
        >
          <ChevronUpDownIcon />
        </span>
        <div className="min-w-32 flex-1">
          <p className="truncate text-sm font-medium text-foreground">{field.label}</p>
          <p className="truncate font-mono text-xs text-muted-foreground">{field.name}</p>
        </div>
        {hidden && <Badge variant="secondary">Hidden</Badge>}
        <CheckboxField
          value={field.sortable !== false}
          onChange={onSortable}
          checkboxLabel="Sort"
        />
        <CheckboxField
          value={field.filterable !== false}
          onChange={onFilterable}
          checkboxLabel="Filter"
        />
        <WidthInput key={`${field.name}-${width ?? 'auto'}`} value={width} onCommit={onWidth} />
        <Button size="sm" variant="secondary" onClick={onToggle}>
          {hidden ? 'Tampilkan' : 'Sembunyikan'}
        </Button>
      </div>
    </div>
  );
}

type ListTab = 'columns' | 'actions' | 'preview';

function ListBuilderCanvas({
  def,
  fields,
  onFieldsChange,
  layout,
  onChange,
  features,
  onFeaturesChange,
  deleteMode,
  onDeleteModeChange,
  sampleRows,
}: ListBuilderCanvasProps) {
  const [tab, setTab] = useState<ListTab>('columns');
  const [page, setPage] = useState(1);
  const { showToast } = useToast();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const byName = useMemo(() => new Map(fields.map((field) => [field.name, field])), [fields]);
  const widths = layout.table.widths ?? {};

  function patchField(name: string, patch: Partial<GeneratorFieldConfig>): void {
    onFieldsChange(fields.map((f) => (f.name === name ? { ...f, ...patch } : f)));
  }

  function handleDragEnd(event: DragEndEvent): void {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    onChange(moveTableColumn(layout, String(active.id), String(over.id)));
  }

  function toggleFeature(key: FeatureKey): void {
    onFeaturesChange({ ...features, [key]: !features[key] });
  }

  function previewAction(label: string): void {
    showToast({ variant: 'info', message: `Pratinjau: aksi ${label} aktif.` });
  }

  const pageCount = Math.max(1, Math.ceil(sampleRows.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageRows = sampleRows.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const previewDef = useMemo(() => ({ ...def, layout }), [def, layout]);

  if (fields.length === 0) {
    return <p className="text-sm text-muted-foreground">Tambahkan field di kanvas form dulu.</p>;
  }

  return (
    <div className="flex flex-col stack-gap">
      <div className="flex flex-wrap gap-2">
        {(
          [
            { id: 'columns', label: 'Kolom' },
            { id: 'actions', label: 'Aksi & Fitur' },
            { id: 'preview', label: 'Pratinjau' },
          ] as const
        ).map((item) => (
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

      {tab === 'columns' && (
        <div>
          <p className="mb-3 text-sm text-muted-foreground">
            Geser untuk urutan kolom. Kolom sistem selalu di akhir. Lebar kosong = otomatis.
          </p>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={layout.table.order} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col field-gap">
                {layout.table.order.map((name) => {
                  const field = byName.get(name);
                  if (!field) return null;
                  return (
                    <SortableColumnRow
                      key={name}
                      field={field}
                      hidden={layout.table.hidden.includes(name)}
                      width={widths[name]}
                      onToggle={() => onChange(toggleTableColumn(layout, name))}
                      onWidth={(px) => onChange(setTableWidth(layout, name, px))}
                      onSortable={(value) => patchField(name, { sortable: value })}
                      onFilterable={(value) =>
                        patchField(name, {
                          filterable: value,
                          filterCriteria: value ? (field.filterCriteria ?? undefined) : null,
                        })
                      }
                    />
                  );
                })}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}

      {tab === 'actions' && (
        <div className="flex max-w-xl flex-col field-gap">
          <p className="text-sm text-muted-foreground">
            Aksi baris + tombol list. Aksi tampil bila fitur aktif <em>dan</em> user punya
            permission-nya.
          </p>
          <CheckboxField
            value={features.detail}
            onChange={() => toggleFeature('detail')}
            checkboxLabel="Aksi Lihat (butuh view)"
          />
          <CheckboxField
            value={features.edit}
            onChange={() => toggleFeature('edit')}
            checkboxLabel="Aksi Edit (butuh update)"
          />
          <CheckboxField
            value={features.delete}
            onChange={() => toggleFeature('delete')}
            checkboxLabel="Aksi Hapus (butuh delete)"
          />
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Mode hapus</label>
            <SelectField
              value={deleteMode}
              onChange={(value) => onDeleteModeChange(value as DeleteMode)}
              options={[
                { label: 'Soft — nonaktif + Restore', value: 'soft' },
                { label: 'Hard — hapus permanen', value: 'hard' },
              ]}
              clearable={false}
            />
          </div>
          <CheckboxField
            value={features.bulkUpload}
            onChange={() => toggleFeature('bulkUpload')}
            checkboxLabel="Tombol Bulk Upload (butuh bulk_upload)"
          />
          <CheckboxField
            value={features.export}
            onChange={() => toggleFeature('export')}
            checkboxLabel="Tombol Export (butuh export)"
          />
          <p className="text-xs text-muted-foreground">
            Fitur List & Create diatur di langkah Config.
          </p>
        </div>
      )}

      {tab === 'preview' && (
        <div>
          <p className="mb-3 text-sm text-muted-foreground">
            Pratinjau tabel dari data contoh. Klik aksi untuk cek wiring (tidak mengubah data).
          </p>
          {sampleRows.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Belum ada data contoh — isi dulu di langkah Test Data.
            </p>
          ) : (
            <DynamicTable
              def={previewDef}
              data={pageRows}
              totalRecords={sampleRows.length}
              page={safePage}
              pageSize={PAGE_SIZE}
              onPageChange={setPage}
              onPageSizeChange={() => {}}
              onView={features.detail ? () => previewAction('Lihat') : undefined}
              onEdit={features.edit ? () => previewAction('Edit') : undefined}
              onDelete={features.delete ? () => previewAction('Hapus') : undefined}
              onRestore={
                features.delete && deleteMode === 'soft'
                  ? () => previewAction('Restore')
                  : undefined
              }
              isEmptyState={false}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default ListBuilderCanvas;
