import { useState } from 'react';
import { Badge, Button } from '../../../shared/components/ui';
import {
  ChevronDownIcon,
  ChevronUpDownIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from '../../../shared/components/icons';
import type { GeneratorFieldConfig } from '../types';
import {
  dataSourceRegistry,
  fieldTypeRegistry,
  filterCriteriaRegistry,
} from '../registry';
import { stringifyRules } from '../parser';
import FieldDialog from './FieldDialog';

interface FieldsStepProps {
  fields: GeneratorFieldConfig[];
  onChange: (fields: GeneratorFieldConfig[]) => void;
}

function move<T>(items: T[], from: number, to: number): T[] {
  const next = [...items];
  const [moved] = next.splice(from, 1);
  if (moved === undefined) return items;
  next.splice(to, 0, moved);
  return next;
}

function FieldsStep({ fields, onChange }: FieldsStepProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<{ field: GeneratorFieldConfig; index: number } | null>(
    null,
  );
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);

  function openAdd(): void {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(field: GeneratorFieldConfig): void {
    const index = fields.indexOf(field);
    setEditing({ field, index });
    setDialogOpen(true);
  }

  function handleSave(field: GeneratorFieldConfig, index: number | null): void {
    if (index === null) {
      onChange([...fields, field]);
    } else {
      onChange(fields.map((existing, i) => (i === index ? field : existing)));
    }
  }

  function handleDelete(field: GeneratorFieldConfig): void {
    onChange(fields.filter((existing) => existing !== field));
  }

  function handleDrop(): void {
    if (dragIndex !== null && dropIndex !== null && dragIndex !== dropIndex) {
      onChange(move(fields, dragIndex, dropIndex));
    }
    setDragIndex(null);
    setDropIndex(null);
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          Seret baris untuk mengubah urutan kolom tabel & form.
        </p>
        <Button icon={<PlusIcon />} onClick={openAdd}>
          Add field
        </Button>
      </div>
      {fields.length === 0 ? (
        <div className="flex flex-col items-center gap-1.5 rounded-lg border border-border px-5 py-12 text-center">
          <p className="text-2xl font-semibold text-foreground">No Fields Yet</p>
          <p className="text-base text-muted-foreground">Add at least one field to continue.</p>
        </div>
      ) : (
        <ul className="rounded-lg border border-border">
          {fields.map((field, index) => (
            <li
              key={field.name}
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragOver={(e) => {
                e.preventDefault();
                setDropIndex(index);
              }}
              onDrop={handleDrop}
              onDragEnd={() => {
                setDragIndex(null);
                setDropIndex(null);
              }}
              className={[
                'flex items-center gap-3 border-b border-border px-4 py-3 last:border-b-0',
                dragIndex === index ? 'opacity-40' : '',
                dropIndex === index && dragIndex !== index ? 'border-t-2 border-t-primary' : '',
              ].join(' ')}
            >
              <span
                className="cursor-grab text-muted-foreground active:cursor-grabbing"
                title="Seret untuk pindah"
              >
                <ChevronUpDownIcon className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {field.label}{' '}
                  <span className="font-mono text-xs font-normal text-muted-foreground">
                    {field.name}
                  </span>
                </p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {fieldTypeRegistry[field.type].label} · {dataSourceRegistry[field.source].label} ·{' '}
                  <span className="font-mono">{stringifyRules(field.rules) || 'no rules'}</span>
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {field.sortable !== false && <Badge variant="primary">Sort</Badge>}
                  {field.filterable !== false ? (
                    <Badge variant="info">
                      Filter: {filterCriteriaRegistry[field.filterCriteria ?? 'contains'].label}
                    </Badge>
                  ) : (
                    <Badge variant="secondary">No filter</Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label={`move-up-${field.name}`}
                  disabled={index === 0}
                  className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md hover:bg-muted disabled:cursor-not-allowed disabled:opacity-30"
                  onClick={() => onChange(move(fields, index, index - 1))}
                >
                  <ChevronDownIcon className="h-4 w-4 rotate-180" />
                </button>
                <button
                  type="button"
                  aria-label={`move-down-${field.name}`}
                  disabled={index === fields.length - 1}
                  className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md hover:bg-muted disabled:cursor-not-allowed disabled:opacity-30"
                  onClick={() => onChange(move(fields, index, index + 1))}
                >
                  <ChevronDownIcon className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label={`edit-${field.name}`}
                  className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md hover:bg-muted"
                  onClick={() => openEdit(field)}
                >
                  <PencilIcon />
                </button>
                <button
                  type="button"
                  aria-label={`delete-${field.name}`}
                  className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md hover:bg-muted"
                  onClick={() => handleDelete(field)}
                >
                  <TrashIcon />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {dialogOpen && (
        <FieldDialog
          open={dialogOpen}
          initial={editing}
          existingNames={fields.map((f) => f.name)}
          onClose={() => setDialogOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

export default FieldsStep;
