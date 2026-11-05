import { t } from 'i18next';
import '../../../../shared/i18n';
import type {
  DefaultRecord,
  DefaultRecordMutationResult,
  BulkRowError,
  BulkUploadResult,
  DefaultRecordListItem,
  CreateDefaultRecordPayload,
  GetDefaultRecordsParams,
} from '../types';
import type { ApiList } from '../../../../shared/types';
import { XLSX_MIME, buildWorkbook, readWorkbookRows } from '../../../../shared/utils';
import {
  BULK_DEFAULTRECORD_EXAMPLE,
  BULK_DEFAULTRECORD_HEADERS,
  validateBulkDefaultRecordRow,
} from '../validation/defaultRecordBulkValidation';

export const USE_MOCK = {
  list: true,
  detail: true,
  create: true,
  update: true,
  delete: true,
  restore: true,
  export: true,
  bulkUpload: true,
  bulkTemplate: true,
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


interface MockDefaultRecordRecord {
  id: number;
  name: string;
  code: string;
  sortOrder: number;
  description: string;
  status: 'active' | 'inactive';
  created_by: string | null;
  created_date: string;
}

// Mock data sengaja kosong: isi lewat Create / Bulk Upload.
const mockDefaultRecordRecords: MockDefaultRecordRecord[] = [];

function toListItem(record: MockDefaultRecordRecord): DefaultRecordListItem {
  return {
    id: record.id,
    name: record.name,
    code: record.code,
    sortOrder: record.sortOrder,
    description: record.description,
    created_date: record.created_date,
    created_by: record.created_by,
    status: record.status,
  };
}

function toDetail(record: MockDefaultRecordRecord): DefaultRecord {
  return {
    id: String(record.id),
    name: record.name,
    code: record.code,
    sortOrder: record.sortOrder,
    description: record.description,
    status: record.status,
    createdBy: record.created_by ?? '',
    createdDate: record.created_date,
  };
}

function paginate<T>(items: T[], page: number, size: number) {
  const totalElements = items.length;
  const totalPages = Math.max(1, Math.ceil(totalElements / size));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  return {
    pagination: { page: safePage, size, total_pages: totalPages, total_elements: totalElements },
    content: items.slice((safePage - 1) * size, safePage * size),
  };
}

function sortDefaultRecords(items: DefaultRecordListItem[], key: string | undefined, dir: string | undefined) {
  const sortKey = key || 'name';
  const direction = dir === 'desc' ? -1 : 1;
  return [...items].sort((a, b) => {
    const av = (a as unknown as Record<string, unknown>)[sortKey];
    const bv = (b as unknown as Record<string, unknown>)[sortKey];
    if (av == null || bv == null) return 0;
    if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * direction;
    return String(av).localeCompare(String(bv)) * direction;
  });
}

/** Filter + sortir tanpa pagination — dipakai list dan export. */
function filterDefaultRecordsRecords(params?: GetDefaultRecordsParams): DefaultRecordListItem[] {
  let items = mockDefaultRecordRecords.map(toListItem);
  if (params?.search) {
    const q = params.search.toLowerCase();
    items = items.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.code.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        String(r.id).includes(q),
    );
  }
  if (params?.status) items = items.filter((r) => r.status === params.status);
  if (params?.name) {
    const qName = params.name.toLowerCase();
    items = items.filter((r) => String(r.name ?? '').toLowerCase().includes(qName));
  }
  if (params?.code) {
    const qCode = params.code.toLowerCase();
    items = items.filter((r) => String(r.code ?? '').toLowerCase().includes(qCode));
  }
  if (params?.sortOrder !== undefined && params.sortOrder !== '') items = items.filter((r) => Number(r.sortOrder) === Number(params.sortOrder));
  return sortDefaultRecords(items, params?.order, params?.sort);
}

export async function mockGetDefaultRecords(params?: GetDefaultRecordsParams): Promise<ApiList<DefaultRecordListItem>> {
  await delay(300);
  const items = filterDefaultRecordsRecords(params);
  const result = paginate(items, (params?.page ?? 0) + 1, params?.size ?? 10);
  return { list: result };
}

export async function mockExportDefaultRecords(params?: GetDefaultRecordsParams): Promise<Blob> {
  await delay(300);
  const items = filterDefaultRecordsRecords({ ...params, page: undefined, size: undefined });
  const data = await buildWorkbook(
    ["Name","Code","Sort Order","Description","Status","Created Date"],
    items.map((r) => [r.name, r.code, r.sortOrder, r.description, r.status, r.created_date]),
  );
  return new Blob([data], { type: XLSX_MIME });
}

export async function mockDownloadDefaultRecordTemplate(): Promise<Blob> {
  const data = await buildWorkbook(BULK_DEFAULTRECORD_HEADERS, [BULK_DEFAULTRECORD_EXAMPLE]);
  return new Blob([data], { type: XLSX_MIME });
}

export async function mockBulkUploadDefaultRecords(file: File | ArrayBuffer): Promise<BulkUploadResult> {
  await delay(500);
  const buffer = file instanceof ArrayBuffer ? file : await file.arrayBuffer();
  const { headers, rows } = await readWorkbookRows(buffer);
  const headerIndex = new Map(headers.map((h, i) => [h.trim().toLowerCase(), i]));
  const expected = BULK_DEFAULTRECORD_HEADERS;
  const missing = expected.filter((h) => !headerIndex.has(h.trim().toLowerCase()));
  if (missing.length > 0) {
    return {
      totalRows: rows.length,
      successCount: 0,
      failedCount: rows.length,
      errors: missing.map((field) => ({
        row: 1,
        field,
        message: t('bulk.missingColumn', { field }),
      })),
    };
  }
  if (rows.length === 0) {
    return {
      totalRows: 0,
      successCount: 0,
      failedCount: 0,
      errors: [{ row: 1, message: t('bulk.emptyFile') }],
    };
  }

  const errors: BulkRowError[] = [];
  let successCount = 0;
  rows.forEach((row, index) => {
    const mapped: Record<string, unknown> = {};
    for (const header of expected) {
      const source = headers[headerIndex.get(header.trim().toLowerCase()) ?? -1] ?? '';
      mapped[header] = row[source] ?? '';
    }
    const { payload, errors: rowErrors } = validateBulkDefaultRecordRow(mapped, () => {

      return false;
    });
    if (!payload) {
      for (const rowError of rowErrors) {
        errors.push({ row: index + 2, field: rowError.field, message: rowError.message });
      }
      return;
    }

    mockDefaultRecordRecords.push({
      id: Math.max(...mockDefaultRecordRecords.map((r) => r.id)) + 1,
      name: payload.name,
      code: payload.code,
      sortOrder: payload.sortOrder,
      description: payload.description,
      status: 'active',
      created_by: 'Bulk Upload',
      created_date: new Date().toISOString().slice(0, 16).replace('T', ' '),
    });
    successCount += 1;
  });
  return { totalRows: rows.length, successCount, failedCount: rows.length - successCount, errors };
}


export async function mockGetDefaultRecordById(id: string): Promise<DefaultRecord> {
  await delay(300);
  const record = mockDefaultRecordRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error(t('default_record.toast.notFound'));
  return toDetail(record);
}

export async function mockCreateDefaultRecord(data: CreateDefaultRecordPayload): Promise<DefaultRecordMutationResult> {
  await delay(300);
  const record: MockDefaultRecordRecord = {
    id: Math.max(...mockDefaultRecordRecords.map((r) => r.id)) + 1,
    name: data.name,
    code: data.code,
    sortOrder: data.sortOrder,
    description: data.description,
    status: 'active',
    created_by: 'System',
    created_date: new Date().toISOString().slice(0, 16).replace('T', ' '),
  };
  mockDefaultRecordRecords.push(record);
  return { message: t('default_record.toast.created'), data: toDetail(record) };
}

export async function mockUpdateDefaultRecord(
  id: string,
  data: CreateDefaultRecordPayload,
): Promise<DefaultRecordMutationResult> {
  await delay(300);
  const record = mockDefaultRecordRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error(t('default_record.toast.notFound'));
  record.name = data.name;
  record.code = data.code;
  record.sortOrder = data.sortOrder;
  record.description = data.description;
  return { message: t('default_record.toast.updated'), data: toDetail(record) };
}

export async function mockDeleteDefaultRecord(id: string): Promise<{ message: string }> {
  await delay(300);
  const record = mockDefaultRecordRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error(t('default_record.toast.notFound'));
  record.status = 'inactive';
  return { message: t('default_record.toast.deleted') };
}

export async function mockRestoreDefaultRecord(id: string): Promise<DefaultRecordMutationResult> {
  await delay(300);
  const record = mockDefaultRecordRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error(t('default_record.toast.notFound'));
  record.status = 'active';
  return { message: t('default_record.toast.restored'), data: toDetail(record) };
}
