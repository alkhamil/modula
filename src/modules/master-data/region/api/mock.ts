import { t } from 'i18next';
import '../../../../shared/i18n';
import type {
  Region,
  RegionMutationResult,
  BulkRowError,
  BulkUploadResult,
  RegionListItem,
  CreateRegionPayload,
  GetRegionsParams,
} from '../types';
import type { ApiList } from '../../../../shared/types';
import { XLSX_MIME, buildWorkbook, readWorkbookRows } from '../../../../shared/utils';
import {
  BULK_REGION_EXAMPLE,
  BULK_REGION_HEADERS,
  validateBulkRegionRow,
} from '../validation/regionBulkValidation';

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


interface MockRegionRecord {
  id: number;
  name: string;
  code: string;
  status: 'active' | 'inactive';
  created_by: string | null;
  created_date: string;
}

// Mock data sengaja kosong: isi lewat Create / Bulk Upload.
const mockRegionRecords: MockRegionRecord[] = [];

function toListItem(record: MockRegionRecord): RegionListItem {
  return {
    id: record.id,
    name: record.name,
    code: record.code,
    created_date: record.created_date,
    created_by: record.created_by,
    status: record.status,
  };
}

function toDetail(record: MockRegionRecord): Region {
  return {
    id: String(record.id),
    name: record.name,
    code: record.code,
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

function sortRegions(items: RegionListItem[], key: string | undefined, dir: string | undefined) {
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
function filterRegionsRecords(params?: GetRegionsParams): RegionListItem[] {
  let items = mockRegionRecords.map(toListItem);
  if (params?.search) {
    const q = params.search.toLowerCase();
    items = items.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.code.toLowerCase().includes(q) ||
        String(r.id).includes(q),
    );
  }
  if (params?.status) items = items.filter((r) => r.status === params.status);

  return sortRegions(items, params?.order, params?.sort);
}

export async function mockGetRegions(params?: GetRegionsParams): Promise<ApiList<RegionListItem>> {
  await delay(300);
  const items = filterRegionsRecords(params);
  const result = paginate(items, (params?.page ?? 0) + 1, params?.size ?? 10);
  return { list: result };
}

export async function mockExportRegions(params?: GetRegionsParams): Promise<Blob> {
  await delay(300);
  const items = filterRegionsRecords({ ...params, page: undefined, size: undefined });
  const data = await buildWorkbook(
    ["Name","Code","Status","Created Date"],
    items.map((r) => [r.name, r.code, r.status, r.created_date]),
  );
  return new Blob([data], { type: XLSX_MIME });
}

export async function mockDownloadRegionTemplate(): Promise<Blob> {
  const data = await buildWorkbook(BULK_REGION_HEADERS, [BULK_REGION_EXAMPLE]);
  return new Blob([data], { type: XLSX_MIME });
}

export async function mockBulkUploadRegions(file: File | ArrayBuffer): Promise<BulkUploadResult> {
  await delay(500);
  const buffer = file instanceof ArrayBuffer ? file : await file.arrayBuffer();
  const { headers, rows } = await readWorkbookRows(buffer);
  const headerIndex = new Map(headers.map((h, i) => [h.trim().toLowerCase(), i]));
  const expected = BULK_REGION_HEADERS;
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
  const seenName = new Set(mockRegionRecords.map((r) => String(r.name).toLowerCase()));
  const seenCode = new Set(mockRegionRecords.map((r) => String(r.code).toLowerCase()));
  const errors: BulkRowError[] = [];
  let successCount = 0;
  rows.forEach((row, index) => {
    const mapped: Record<string, unknown> = {};
    for (const header of expected) {
      const source = headers[headerIndex.get(header.trim().toLowerCase()) ?? -1] ?? '';
      mapped[header] = row[source] ?? '';
    }
    const { payload, errors: rowErrors } = validateBulkRegionRow(mapped, (field, value) => {
      if (field === 'name') return seenName.has(value.toLowerCase());
      if (field === 'code') return seenCode.has(value.toLowerCase());
      return false;
    });
    if (!payload) {
      for (const rowError of rowErrors) {
        errors.push({ row: index + 2, field: rowError.field, message: rowError.message });
      }
      return;
    }
    seenName.add(String(payload.name).toLowerCase());
    seenCode.add(String(payload.code).toLowerCase());
    mockRegionRecords.push({
      id: Math.max(...mockRegionRecords.map((r) => r.id)) + 1,
      name: payload.name,
      code: payload.code,
      status: 'active',
      created_by: 'Bulk Upload',
      created_date: new Date().toISOString().slice(0, 16).replace('T', ' '),
    });
    successCount += 1;
  });
  return { totalRows: rows.length, successCount, failedCount: rows.length - successCount, errors };
}


export async function mockGetRegionById(id: string): Promise<Region> {
  await delay(300);
  const record = mockRegionRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error(t('region.toast.notFound'));
  return toDetail(record);
}

function mockConflictError(field: string, message: string) {
  return {
    response: {
      data: {
        response_schema: {
          response_code: 'MOCK-REGION-400',
          response_message: 'Invalid parameters',
        },
        response_output: {
          errors: [{ field, message }],
        },
      },
    },
  };
}

export async function mockCreateRegion(data: CreateRegionPayload): Promise<RegionMutationResult> {
  await delay(300);
  if (mockRegionRecords.some((r) => r.name === data.name)) {
    throw mockConflictError(
      'name',
      t('validation.unique', { label: t('region.fields.name.label') }),
    );
  }
  const record: MockRegionRecord = {
    id: Math.max(...mockRegionRecords.map((r) => r.id)) + 1,
    name: data.name,
    code: data.code,
    status: 'active',
    created_by: 'System',
    created_date: new Date().toISOString().slice(0, 16).replace('T', ' '),
  };
  mockRegionRecords.push(record);
  return { message: t('region.toast.created'), data: toDetail(record) };
}

export async function mockUpdateRegion(
  id: string,
  data: CreateRegionPayload,
): Promise<RegionMutationResult> {
  await delay(300);
  const record = mockRegionRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error(t('region.toast.notFound'));
  if (mockRegionRecords.some((r) => String(r.id) !== id && r.name === data.name)) {
    throw mockConflictError(
      'name',
      t('validation.unique', { label: t('region.fields.name.label') }),
    );
  }
  record.name = data.name;
  record.code = data.code;
  return { message: t('region.toast.updated'), data: toDetail(record) };
}

export async function mockDeleteRegion(id: string): Promise<{ message: string }> {
  await delay(300);
  const record = mockRegionRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error(t('region.toast.notFound'));
  record.status = 'inactive';
  return { message: t('region.toast.deleted') };
}

export async function mockRestoreRegion(id: string): Promise<RegionMutationResult> {
  await delay(300);
  const record = mockRegionRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error(t('region.toast.notFound'));
  record.status = 'active';
  return { message: t('region.toast.restored'), data: toDetail(record) };
}
