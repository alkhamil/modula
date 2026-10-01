/** Client records generik: service BE + mock seed JSON + resolver USE_MOCK. */
import api from '../../../shared/lib/api';
import type { ApiDetail, ApiList, ApiResponse } from '../../../shared/types';
import type { LoadOptionsFn } from '../../../shared/components/ui/fields/SelectField';
import { XLSX_MIME, buildWorkbook, readWorkbookRows } from '../../../shared/utils';
import type { GeneratorFieldConfig } from '../types';
import type { ModuleDefinition } from '../definitions';
import { filterDynamicRecords, paginateRecords } from './filtering';
import {
  bulkExampleRow,
  bulkHeaders,
  exportCellValue,
  exportHeaders,
  validateBulkRow,
  type BulkUploadResult,
} from './bulk';
import type { DynamicDetail, DynamicListItem, DynamicListParams, DynamicOption } from './types';

export type { BulkUploadResult };

export interface MutationResult {
  message: string;
  data: DynamicDetail;
}

export const USE_MOCK = {
  list: true,
  get: true,
  options: true,
  create: true,
  update: true,
  delete: true,
  restore: true,
  export: true,
  bulkTemplate: true,
  bulkUpload: true,
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

export async function serviceOptionsOf(
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

function mockConflictError(field: string, message: string, code: string): unknown {
  return {
    response: {
      data: {
        response_schema: {
          response_code: code,
          response_message: 'Parameter tidak valid',
        },
        response_output: { errors: [{ field, message }] },
      },
    },
  };
}

function uniqueFields(def: ModuleDefinition): GeneratorFieldConfig[] {
  return def.fields.filter((field) => field.rules.includes('unique'));
}

function nowStamp(): string {
  return new Date().toISOString().slice(0, 16).replace('T', ' ');
}

async function serviceCreateRecord(
  def: ModuleDefinition,
  data: Record<string, unknown>,
): Promise<MutationResult> {
  const res = await api.post<ApiResponse<{ detail: DynamicDetail }>>(
    `/api/v1/${def.apiPlural}`,
    data,
  );
  return {
    message: res.data.response_schema.response_message,
    data: res.data.response_output?.detail as DynamicDetail,
  };
}

async function mockCreateRecord(
  def: ModuleDefinition,
  data: Record<string, unknown>,
): Promise<MutationResult> {
  await delay(300);
  const rows = await seedRows(def.apiPlural);
  for (const field of uniqueFields(def)) {
    if (rows.some((row) => row[field.name] === data[field.name])) {
      throw mockConflictError(
        field.name,
        `${field.label} already exists, please use another`,
        `MOCK-${def.apiPlural.toUpperCase()}-400`,
      );
    }
  }
  const record: DynamicListItem = {
    id: Math.max(...rows.map((row) => row.id), 0) + 1,
    status: 'active',
    created_by: 'System',
    created_date: nowStamp(),
    ...pickKnown(def, data),
  };
  rows.push(record);
  return { message: `${def.singularLabel} created successfully.`, data: toDetail(def, record) };
}

function pickKnown(
  def: ModuleDefinition,
  data: Record<string, unknown>,
): Record<string, unknown> {
  const picked: Record<string, unknown> = {};
  for (const field of def.fields) {
    if (data[field.name] !== undefined) picked[field.name] = data[field.name];
  }
  return picked;
}

function toDetail(def: ModuleDefinition, row: DynamicListItem): DynamicDetail {
  const detail: DynamicDetail = {
    id: String(row.id),
    status: row.status,
    createdBy: row.created_by ?? '',
    createdDate: row.created_date,
  };
  for (const field of def.fields) detail[field.name] = row[field.name] ?? null;
  return detail;
}

async function serviceUpdateRecord(
  def: ModuleDefinition,
  id: string,
  data: Record<string, unknown>,
): Promise<MutationResult> {
  const res = await api.put<ApiResponse<{ detail: DynamicDetail }>>(
    `/api/v1/${def.apiPlural}/${id}`,
    data,
  );
  return {
    message: res.data.response_schema.response_message,
    data: res.data.response_output?.detail as DynamicDetail,
  };
}

async function mockUpdateRecord(
  def: ModuleDefinition,
  id: string,
  data: Record<string, unknown>,
): Promise<MutationResult> {
  await delay(300);
  const rows = await seedRows(def.apiPlural);
  const record = rows.find((row) => String(row.id) === id);
  if (!record) throw new Error(`${def.singularLabel} not found`);
  for (const field of uniqueFields(def)) {
    if (
      rows.some((row) => String(row.id) !== id && row[field.name] === data[field.name])
    ) {
      throw mockConflictError(
        field.name,
        `${field.label} already exists, please use another`,
        `MOCK-${def.apiPlural.toUpperCase()}-400`,
      );
    }
  }
  Object.assign(record, pickKnown(def, data));
  return { message: `${def.singularLabel} updated successfully.`, data: toDetail(def, record) };
}

async function serviceDeleteRecord(
  def: ModuleDefinition,
  id: string,
): Promise<{ message: string }> {
  const res = await api.delete<ApiResponse<null>>(`/api/v1/${def.apiPlural}/${id}`);
  return { message: res.data.response_schema.response_message };
}

async function mockDeleteRecord(
  def: ModuleDefinition,
  id: string,
): Promise<{ message: string }> {
  await delay(300);
  const rows = await seedRows(def.apiPlural);
  const record = rows.find((row) => String(row.id) === id);
  if (!record) throw new Error(`${def.singularLabel} not found`);
  if (def.deleteMode === 'hard') {
    recordCache.set(
      def.apiPlural,
      rows.filter((row) => String(row.id) !== id),
    );
    return { message: `${def.singularLabel} deleted permanently` };
  }
  record.status = 'inactive';
  return { message: `${def.singularLabel} deleted successfully` };
}

async function serviceRestoreRecord(
  def: ModuleDefinition,
  id: string,
): Promise<MutationResult> {
  const res = await api.patch<ApiResponse<{ detail: DynamicDetail }>>(
    `/api/v1/${def.apiPlural}/${id}/restore`,
  );
  return {
    message: res.data.response_schema.response_message,
    data: res.data.response_output?.detail as DynamicDetail,
  };
}

async function mockRestoreRecord(
  def: ModuleDefinition,
  id: string,
): Promise<MutationResult> {
  await delay(300);
  if (def.deleteMode !== 'soft') {
    throw new Error(`${def.singularLabel} does not support restore`);
  }
  const rows = await seedRows(def.apiPlural);
  const record = rows.find((row) => String(row.id) === id);
  if (!record) throw new Error(`${def.singularLabel} not found`);
  record.status = 'active';
  return { message: `${def.singularLabel} restored successfully`, data: toDetail(def, record) };
}

async function serviceExportRecords(
  def: ModuleDefinition,
  params?: DynamicListParams,
): Promise<Blob> {
  const res = await api.get(`/api/v1/${def.apiPlural}/export`, {
    params,
    responseType: 'blob',
  });
  return res.data as Blob;
}

async function mockExportRecords(
  def: ModuleDefinition,
  params?: DynamicListParams,
): Promise<Blob> {
  await delay(300);
  const rows = await seedRows(def.apiPlural);
  const items = filterDynamicRecords(def.fields, rows, { ...params, page: undefined, size: undefined });
  const data = await buildWorkbook(
    exportHeaders(def.fields),
    items.map((row) => [
      ...def.fields.map((field) => exportCellValue(field.type, row[field.name])),
      row.status,
      row.created_date,
    ]),
  );
  return new Blob([data], { type: XLSX_MIME });
}

async function serviceDownloadTemplate(def: ModuleDefinition): Promise<Blob> {
  const res = await api.get(`/api/v1/${def.apiPlural}/bulk-template`, { responseType: 'blob' });
  return res.data as Blob;
}

async function mockDownloadTemplate(def: ModuleDefinition): Promise<Blob> {
  const data = await buildWorkbook(bulkHeaders(def.fields), [bulkExampleRow(def.fields)]);
  return new Blob([data], { type: XLSX_MIME });
}

async function serviceBulkUploadRecords(
  def: ModuleDefinition,
  file: File,
): Promise<BulkUploadResult> {
  const form = new FormData();
  form.append('file', file);
  const res = await api.post<ApiResponse<BulkUploadResult>>(
    `/api/v1/${def.apiPlural}/bulk-upload`,
    form,
  );
  const output = res.data.response_output;
  if (!output) throw new Error('Gagal mengunggah file.');
  return output;
}

async function mockBulkUploadRecords(
  def: ModuleDefinition,
  file: File | ArrayBuffer,
): Promise<BulkUploadResult> {
  await delay(500);
  const buffer = file instanceof ArrayBuffer ? file : await file.arrayBuffer();
  const { headers, rows } = await readWorkbookRows(buffer);
  const expected = bulkHeaders(def.fields);
  const headerIndex = new Map(headers.map((header, i) => [header.trim().toLowerCase(), i]));
  const missing = expected.filter((header) => !headerIndex.has(header.trim().toLowerCase()));
  if (missing.length > 0) {
    return {
      totalRows: rows.length,
      successCount: 0,
      failedCount: rows.length,
      errors: missing.map((field) => ({
        row: 1,
        field,
        message: `Kolom "${field}" tidak ditemukan di file.`,
      })),
    };
  }
  if (rows.length === 0) {
    return {
      totalRows: 0,
      successCount: 0,
      failedCount: 0,
      errors: [{ row: 1, message: 'File tidak berisi data.' }],
    };
  }
  const store = await seedRows(def.apiPlural);
  const uniques = uniqueFields(def);
  const taken = new Map<string, Set<string>>();
  for (const field of uniques) {
    taken.set(
      field.name,
      new Set(store.map((row) => String(row[field.name] ?? '')).filter(Boolean)),
    );
  }
  let successCount = 0;
  const errors: BulkUploadResult['errors'] = [];
  const accepted: Record<string, unknown>[] = [];
  rows.forEach((row, index) => {
    const mapped: Record<string, unknown> = {};
    for (const header of expected) {
      const source = headers[headerIndex.get(header.trim().toLowerCase()) ?? -1] ?? '';
      mapped[header] = row[source] ?? '';
    }
    const { payload, errors: rowErrors } = validateBulkRow(def.fields, mapped, (field, value) =>
      taken.get(field)?.has(value) ?? false,
    );
    if (!payload) {
      for (const rowError of rowErrors) {
        errors.push({ row: index + 2, field: rowError.field, message: rowError.message });
      }
      return;
    }
    for (const field of uniques) {
      const value = payload[field.name];
      if (value !== undefined && value !== null && value !== '') {
        taken.get(field.name)?.add(String(value));
      }
    }
    accepted.push(payload);
    successCount += 1;
  });
  let nextId = Math.max(...store.map((row) => row.id), 0) + 1;
  for (const payload of accepted) {
    store.push({
      id: nextId,
      status: 'active',
      created_by: 'Bulk Upload',
      created_date: nowStamp(),
      ...payload,
    });
    nextId += 1;
  }
  return { totalRows: rows.length, successCount, failedCount: rows.length - successCount, errors };
}

export const listRecords = USE_MOCK.list ? mockListRecords : serviceListRecords;
export const getRecord = USE_MOCK.get ? mockGetRecord : serviceGetRecord;
export const createRecord = USE_MOCK.create ? mockCreateRecord : serviceCreateRecord;
export const updateRecord = USE_MOCK.update ? mockUpdateRecord : serviceUpdateRecord;
export const deleteRecord = USE_MOCK.delete ? mockDeleteRecord : serviceDeleteRecord;
export const restoreRecord = USE_MOCK.restore ? mockRestoreRecord : serviceRestoreRecord;
export const exportRecords = USE_MOCK.export ? mockExportRecords : serviceExportRecords;
export const downloadTemplate = USE_MOCK.bulkTemplate ? mockDownloadTemplate : serviceDownloadTemplate;
export const bulkUploadRecords = USE_MOCK.bulkUpload ? mockBulkUploadRecords : serviceBulkUploadRecords;

export function makeOptionsLoader(
  def: ModuleDefinition,
  field: GeneratorFieldConfig,
): LoadOptionsFn {
  if (USE_MOCK.options) return mockLoadOptionsFn(field);
  return (search = '', page = 1) => serviceOptionsOf(def, field, search, page, 20);
}
