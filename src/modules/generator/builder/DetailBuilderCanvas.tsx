/** Canvas 3 — Detail Builder: kartu detail langsung (drag-drop baris + drawer properti). */
import { useMemo, useRef, useState } from 'react';
import {
  DndContext,
  KeyboardSensor,
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
import CanvasPointerSensor from './sensors';
import {
  Alert,
  Badge,
  Button,
  Card,
  Drawer,
  SwitchField,
  TextField,
} from '../../../shared/components/ui';
import { NavSettingsIcon } from '../../../shared/components/icons';
import { capitalize } from '../../../shared/utils';
import type { ModuleDefinition, ModuleLayout } from '../definitions';
import type {
  DetailCardDisplayProps,
  DetailRowDisplayProps,
  GeneratorFieldConfig,
} from '../types';
import {
  detailValue,
} from '../runtime/hooks';
import {
  moveDetailItem,
  setDetailCardProps,
  setDetailRowProps,
  toggleDetailItem,
} from '../runtime/layoutOps';
import { sampleToDetail } from './draft';
import type { DynamicDetail, DynamicListItem } from '../runtime/types';

interface DetailBuilderCanvasProps {
  def: ModuleDefinition;
  fields: GeneratorFieldConfig[];
  layout: ModuleLayout;
  onChange: (layout: ModuleLayout) => void;
  sampleRows: DynamicListItem[];
}

function SwitchRow({
  label,
  desc,
  value,
  onChange,
}: {
  label: string;
  desc: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-2">
      <div className="min-w-0">
        <p className="text-xs font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <SwitchField value={value} onChange={onChange} size="sm" />
    </div>
  );
}

/**
 * Baris detail kanvas: seret dari area mana pun (tanpa gagang) + klik
 * memilih. Markup meniru DetailCard (grid label/nilai, divider).
 */
function SortableDetailRow({
  name,
  label,
  value,
  rowProps,
  showBorder,
  hidden,
  selected,
  onSelect,
}: {
  name: string;
  label: string;
  value: React.ReactNode;
  rowProps: DetailRowDisplayProps | undefined;
  showBorder: boolean;
  hidden: boolean;
  selected: boolean;
  onSelect: () => void;
}) {
  const { listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: name,
  });
  // Posisi tekan untuk bedakan klik (pilih) vs seret (pindah).
  const downAt = useRef<{ x: number; y: number } | null>(null);
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={isDragging ? 'opacity-60' : ''}
    >
      <div
        role="button"
        tabIndex={0}
        data-testid={`detail-row-${name}`}
        {...listeners}
        onPointerDown={(e) => {
          downAt.current = { x: e.clientX, y: e.clientY };
          listeners?.onPointerDown?.(e);
        }}
        onClick={(e) => {
          const down = downAt.current;
          downAt.current = null;
          if (down && Math.hypot(e.clientX - down.x, e.clientY - down.y) > 4) {
            return;
          }
          onSelect();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onSelect();
        }}
        title="Geser dari area mana pun untuk memindahkan • klik untuk atur properti"
        className={`cursor-grab active:cursor-grabbing ${
          selected ? 'bg-primary/5 ring-1 ring-inset ring-primary' : 'hover:bg-primary/5'
        } ${hidden ? 'opacity-50' : ''}`}
      >
        {rowProps?.heading ? (
          <div
            className={`flex items-center justify-between gap-2 ${showBorder ? 'border-t border-border' : ''}`}
          >
            <span className="text-base font-semibold text-foreground">{label}</span>
          </div>
        ) : rowProps?.fullWidth ? (
          <div className={`py-4 ${showBorder ? 'border-t border-border' : ''}`}>{value}</div>
        ) : (
          <div
            className={`grid grid-cols-[300px_1fr] gap-4 py-4 px-0 ${showBorder ? 'border-t border-border' : ''}`}
          >
            <span className="text-sm text-muted-foreground">{label}</span>
            <div className="text-sm break-all text-foreground">{value}</div>
          </div>
        )}
      </div>
    </div>
  );
}

/** Isi drawer properti satu baris: tampil + props tampilan. */
function RowDrawerContent({
  field,
  hidden,
  rowProps,
  onToggleHidden,
  onPatchProps,
}: {
  field: GeneratorFieldConfig;
  hidden: boolean;
  rowProps: DetailRowDisplayProps | undefined;
  onToggleHidden: () => void;
  onPatchProps: (patch: Partial<DetailRowDisplayProps>) => void;
}) {
  const props = rowProps ?? {};
  return (
    <div className="flex flex-col stack-gap">
      <Card size="sm" title="Baris">
        <div className="flex flex-col field-gap">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground">Label</span>
            <span className="text-xs font-medium text-foreground">{field.label}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground">Name</span>
            <span className="font-mono text-xs text-muted-foreground">{field.name}</span>
          </div>
        </div>
      </Card>
      <Card size="sm" title="Tampil & Gaya" collapsible>
        <div className="flex flex-col field-gap">
          <SwitchRow
            label="Tampilkan"
            desc="Sembunyikan tanpa menghapus field."
            value={!hidden}
            onChange={() => onToggleHidden()}
          />
          <SwitchRow
            label="Mode judul"
            desc="Render sebagai judul seksi."
            value={props.heading === true}
            onChange={(heading) => onPatchProps({ heading })}
          />
          <SwitchRow
            label="Lebar penuh"
            desc="Nilai di bawah label."
            value={props.fullWidth === true}
            onChange={(fullWidth) => onPatchProps({ fullWidth })}
          />
          <SwitchRow
            label="Tanpa divider"
            desc="Hilangkan garis atas baris."
            value={props.noDivider === true}
            onChange={(noDivider) => onPatchProps({ noDivider })}
          />
        </div>
      </Card>
    </div>
  );
}

/** Isi drawer pengaturan kartu detail. */
function DetailCardDrawerContent({
  singularLabel,
  card,
  onPatchCard,
}: {
  singularLabel: string;
  card: DetailCardDisplayProps | undefined;
  onPatchCard: (patch: Partial<DetailCardDisplayProps>) => void;
}) {
  return (
    <div className="flex flex-col stack-gap">
      <Card size="sm" title="Kartu detail">
        <div className="flex flex-col field-gap">
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">Judul</label>
            <TextField
              size="sm"
              value={card?.title ?? ''}
              onChange={(e) => onPatchCard({ title: e.target.value })}
              placeholder={`${singularLabel} Details`}
              maxLength={100}
            />
          </div>
          <SwitchRow
            label="Bisa di-collapse"
            desc="Kartu dapat dilipat pengguna."
            value={card?.collapsible === true}
            onChange={(collapsible) => onPatchCard({ collapsible })}
          />
        </div>
      </Card>
    </div>
  );
}

function DetailBuilderCanvas({
  def,
  fields,
  layout,
  onChange,
  sampleRows,
}: DetailBuilderCanvasProps) {
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [cardOpen, setCardOpen] = useState(false);
  const sensors = useSensors(
    useSensor(CanvasPointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const byName = useMemo(() => new Map(fields.map((field) => [field.name, field])), [fields]);
  const detail = layout.detail ?? { order: fields.map((f) => f.name), hidden: [] };
  const cardProps = layout.detail?.card;
  const selectedField = selectedName ? byName.get(selectedName) : undefined;
  const drawerOpen = selectedField !== undefined || cardOpen;
  const item: DynamicDetail | null = useMemo(
    () => (sampleRows.length > 0 ? sampleToDetail(sampleRows[0]) : null),
    [sampleRows],
  );

  function closeDrawers(): void {
    setSelectedName(null);
    setCardOpen(false);
  }

  function handleDragEnd(event: DragEndEvent): void {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    onChange(moveDetailItem(layout, String(active.id), String(over.id)));
  }

  function rowValue(field: GeneratorFieldConfig): React.ReactNode {
    if (!item) return '';
    return detailValue(field, item) as React.ReactNode;
  }

  if (fields.length === 0) {
    return <p className="text-sm text-muted-foreground">Tambahkan field di kanvas form dulu.</p>;
  }

  let prevWasHeading = false;

  return (
    <div className="flex flex-col stack-gap">
      <div className="flex flex-col field-gap">
        <Alert
          variant="info"
          message="Geser baris dari area mana pun untuk menyusun. Klik baris untuk atur properti."
        />
        <div>
          <Button
            variant="secondary"
            icon={<NavSettingsIcon className="h-4 w-4" />}
            onClick={() => {
              setSelectedName(null);
              setCardOpen(true);
            }}
            testId="detail-card-settings"
          >
            Pengaturan kartu
          </Button>
        </div>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={detail.order.filter((name) => byName.has(name))}
          strategy={verticalListSortingStrategy}
        >
          <Card
            testId="detail-canvas-card"
            title={cardProps?.title?.trim() || `${def.singularLabel} Details`}
            collapsible={cardProps?.collapsible === true}
          >
            <div
              className={`grid grid-cols-[300px_1fr] gap-4 py-4 px-0 ${prevWasHeading ? '' : ''}`}
            >
              <span className="text-sm text-muted-foreground">Status</span>
              <div className="text-sm break-all text-foreground">
                {item ? (
                  <Badge variant={item.status === 'active' ? 'success' : 'secondary'}>
                    {capitalize(item.status)}
                  </Badge>
                ) : (
                  ''
                )}
              </div>
            </div>
            {detail.order.map((name) => {
              const field = byName.get(name);
              if (!field) return null;
              const hidden = detail.hidden.includes(name);
              const rowProps = layout.detail?.props?.[name];
              const showBorder = !rowProps?.noDivider && !prevWasHeading;
              const isHeading = rowProps?.heading === true;
              prevWasHeading = isHeading;
              return (
                <SortableDetailRow
                  key={name}
                  name={name}
                  label={field.label}
                  value={rowValue(field)}
                  rowProps={rowProps}
                  showBorder={showBorder}
                  hidden={hidden}
                  selected={selectedName === name}
                  onSelect={() => {
                    setCardOpen(false);
                    setSelectedName(name);
                  }}
                />
              );
            })}
            {item && (
              <>
                <div
                  className={`grid grid-cols-[300px_1fr] gap-4 py-4 px-0 ${prevWasHeading ? '' : 'border-t border-border'}`}
                >
                  <span className="text-sm text-muted-foreground">Created By</span>
                  <div className="text-sm break-all text-foreground">{item.createdBy}</div>
                </div>
                <div className="grid grid-cols-[300px_1fr] gap-4 py-4 px-0 border-t border-border">
                  <span className="text-sm text-muted-foreground">Created Date</span>
                  <div className="text-sm break-all text-foreground">{item.createdDate}</div>
                </div>
              </>
            )}
          </Card>
        </SortableContext>
      </DndContext>

      <Drawer
        open={drawerOpen}
        onClose={closeDrawers}
        title={selectedField ? `Baris — ${selectedField.label}` : 'Pengaturan kartu'}
        width="md"
        modal={false}
        testId="detail-property-drawer"
      >
        {selectedField ? (
          <RowDrawerContent
            key={selectedField.name}
            field={selectedField}
            hidden={detail.hidden.includes(selectedField.name)}
            rowProps={layout.detail?.props?.[selectedField.name]}
            onToggleHidden={() => onChange(toggleDetailItem(layout, selectedField.name))}
            onPatchProps={(patch) => onChange(setDetailRowProps(layout, selectedField.name, patch))}
          />
        ) : (
          <DetailCardDrawerContent
            singularLabel={def.singularLabel}
            card={cardProps}
            onPatchCard={(patch) => onChange(setDetailCardProps(layout, patch))}
          />
        )}
      </Drawer>
    </div>
  );
}

export default DetailBuilderCanvas;
