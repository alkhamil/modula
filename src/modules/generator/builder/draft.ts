import type { ModuleInfoValue } from '../components/ModuleInfoStep';
import type { FeatureKey, GeneratorFieldConfig } from '../types';
import type { DeleteMode, ModuleLayout } from '../definitions';
import type { DynamicDetail, DynamicListItem } from '../runtime/types';
import type { DynamicFormValues } from '../runtime/validation';

const DRAFT_KEY = 'builder_draft_v1';

/** State wizard yang dipersist ke localStorage agar tahan refresh. */
export interface BuilderDraft {
  info: ModuleInfoValue;
  features: Record<FeatureKey, boolean>;
  fields: GeneratorFieldConfig[];
  layout: ModuleLayout | null;
  deleteMode: DeleteMode;
  sampleRows: DynamicListItem[];
  step: number;
  updatedAt: string;
}

export function saveDraft(draft: Omit<BuilderDraft, 'updatedAt'>): void {
  try {
    localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({ ...draft, updatedAt: new Date().toISOString() }),
    );
  } catch {
    // Abaikan: mode privat / kuota penuh.
  }
}

export function loadDraft(): BuilderDraft | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<BuilderDraft>;
    if (!parsed || typeof parsed !== 'object') return null;
    if (!parsed.info || !parsed.features || !Array.isArray(parsed.fields)) return null;
    return {
      info: parsed.info,
      features: parsed.features,
      fields: parsed.fields,
      layout: parsed.layout ?? null,
      deleteMode: parsed.deleteMode === 'hard' ? 'hard' : 'soft',
      sampleRows: Array.isArray(parsed.sampleRows) ? parsed.sampleRows : [],
      step: typeof parsed.step === 'number' ? parsed.step : 0,
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : '',
    };
  } catch {
    return null;
  }
}

export function clearDraft(): void {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    // Abaikan.
  }
}

function nowStamp(): string {
  return new Date().toISOString().slice(0, 16).replace('T', ' ');
}

/** Nilai form → baris contoh untuk pratinjau list/detail. */
export function valuesToSampleRow(values: DynamicFormValues, id: number): DynamicListItem {
  return {
    id,
    status: 'active',
    created_by: 'Test Data',
    created_date: nowStamp(),
    ...values,
  };
}

/** Baris contoh → bentuk detail untuk pratinjau DetailCard. */
export function sampleToDetail(row: DynamicListItem): DynamicDetail {
  const { id, status, created_by, created_date, ...data } = row;
  return {
    id: String(id),
    status,
    createdBy: created_by ?? '',
    createdDate: created_date,
    ...data,
  };
}
