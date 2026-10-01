/** Client records generik: service BE + mock seed JSON + resolver USE_MOCK. */
import api from '../../../shared/lib/api';
import type { ApiDetail, ApiList, ApiResponse } from '../../../shared/types';
import type { LoadOptionsFn } from '../../../shared/components/ui/fields/SelectField';
import type { GeneratorFieldConfig } from '../types';
import type { ModuleDefinition } from '../definitions';
import { filterDynamicRecords, paginateRecords } from './filtering';
import type { DynamicDetail, DynamicListItem, DynamicListParams, DynamicOption } from './types';

export const USE_MOCK = {
  list: true,
  get: true,
  options: true,
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface SeedFile {
  moduleKey: string;
  rows: {
    id: number;
    data: Record<string, unknown>;
    status: 'active' | 'inactive';
    createdBy: string | null;
    createdAt: string;
  }[];
}

// Lazy per modul agar bundle awal tidak memuat 1000 baris seed companies.
const seedFiles = import.meta.glob<SeedFile>('../../../../backend/seeds/records/*.json', {
  import: 'default',
});

const recordCache = new Map<string, DynamicListItem[]>();

async function seedRows(apiPlural: string): Promise<DynamicListItem[]> {
  const cached = recordCache.get(apiPlural);
  if (cached) return cached;
  const entry = Object.entries(seedFiles).find(([file]) => file.endsWith(`/${apiPlural}.json`));
  if (!entry) throw new Error(`Seed records "${apiPlural}" tidak ditemukan.`);
  const seed = (await entry[1]()) as SeedFile;
  const rows: DynamicListItem[] = seed.rows.map((row) => ({
    id: row.id,
    status: row.status,
    created_by: row.createdBy,
    created_date: row.createdAt.slice(0, 16).replace('T', ' '),
    ...row.data,
  }));
  recordCache.set(apiPlural, rows);
  return rows;
}

async function serviceListRecords(
  def: ModuleDefinition,
  params?: DynamicListParams,
): Promise<ApiList<DynamicListItem>> {
  const res = await api.get<ApiResponse<ApiList<DynamicListItem>>>(`/api/v1/${def.apiPlural}`, {
    params,
  });
  return res.data.response_output ?? { list: { pagination: null, content: [] } };
}

async function mockListRecords(
  def: ModuleDefinition,
  params?: DynamicListParams,
): Promise<ApiList<DynamicListItem>> {
  await delay(200);
  const rows = await seedRows(def.apiPlural);
  const filtered = filterDynamicRecords(def.fields, rows, params ?? {});
  return { list: paginateRecords(filtered, params?.page ?? 1, params?.size ?? 10) };
}

async function serviceGetRecord(def: ModuleDefinition, id: string): Promise<DynamicDetail> {
  const res = await api.get<ApiResponse<ApiDetail<DynamicDetail>>>(
    `/api/v1/${def.apiPlural}/${id}`,
  );
  const detail = res.data.response_output?.detail;
  if (!detail) throw new Error('Data tidak ditemukan.');
  return detail;
}

async function mockGetRecord(def: ModuleDefinition, id: string): Promise<DynamicDetail> {
  await delay(150);
  const rows = await seedRows(def.apiPlural);
  const found = rows.find((row) => String(row.id) === id);
  if (!found) throw new Error('Data tidak ditemukan.');
  const { id: _omitId, status, created_by, created_date, ...data } = found;
  void _omitId;
  return {
    id: String(found.id),
    status,
    createdBy: created_by ?? '',
    createdDate: created_date,
    ...data,
  };
}

async function serviceLoadOptions(
  def: ModuleDefinition,
  field: GeneratorFieldConfig,
  search = '',
  page = 1,
  size = 20,
): Promise<DynamicOption[]> {
  if (field.source === 'api' && field.api?.endpoint) {
    const res = await api.get<ApiResponse<ApiList<DynamicOption>>>(field.api.endpoint, {
      params: { search, page, size },
    });
    return res.data.response_output?.list.content ?? [];
  }
  const segment = `${field.name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}s`;
  const res = await api.get<ApiResponse<ApiList<DynamicOption>>>(
    `/api/v1/${def.apiPlural}/${segment}`,
    { params: { search, page, size } },
  );
  return res.data.response_output?.list.content ?? [];
}

/** Loader mock: opsi config bila ada, else fallback 60 item (meniru template generate). */
function mockLoadOptionsFn(field: GeneratorFieldConfig): LoadOptionsFn {
  const configured = field.options ?? [];
  const base: DynamicOption[] =
    configured.length > 0
      ? configured.map((option) => ({ ...option }))
      : Array.from({ length: 60 }, (_, i) => ({
          label: `${field.label} ${i + 1}`,
          value: `${field.name.toUpperCase()}_${i + 1}`,
        }));
  return async (search = '', page = 1): Promise<DynamicOption[]> => {
    await delay(150);
    const size = 20;
    const q = search.toLowerCase();
    const filtered = q ? base.filter((opt) => opt.label.toLowerCase().includes(q)) : base;
    return filtered.slice((page - 1) * size, page * size);
  };
}

export const listRecords = USE_MOCK.list ? mockListRecords : serviceListRecords;
export const getRecord = USE_MOCK.get ? mockGetRecord : serviceGetRecord;

export function makeOptionsLoader(
  def: ModuleDefinition,
  field: GeneratorFieldConfig,
): LoadOptionsFn {
  if (USE_MOCK.options) return mockLoadOptionsFn(field);
  return (search = '', page = 1) => serviceLoadOptions(def, field, search, page, 20);
}
