import { t } from 'i18next';
import '../../../../shared/i18n';
import type {
  Vendor,
  VendorMutationResult,
  BulkRowError,
  BulkUploadResult,
  VendorListItem,
  CreateVendorPayload,
  GetVendorsParams,
  RegionOption,
} from '../types';
import type { ApiList } from '../../../../shared/types';
import { XLSX_MIME, buildWorkbook, readWorkbookRows } from '../../../../shared/utils';
import {
  BULK_VENDOR_EXAMPLE,
  BULK_VENDOR_HEADERS,
  validateBulkVendorRow,
} from '../validation/vendorBulkValidation';
import { mockGetRegions } from '../../region/api/mock';

export const USE_MOCK = {
  list: true,
  detail: true,
  create: true,
  update: true,
  delete: true,
  restore: true,
  regionLoadOptions: true,
  export: true,
  bulkUpload: true,
  bulkTemplate: true,
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function loadRegionOptions(
  search = '',
  page = 1,
  size = 20,
): Promise<RegionOption[]> {
  const res = await mockGetRegions({ search: search || undefined, page: page - 1, size });
  return res.list.content.map((r) => {
    const record = r as unknown as Record<string, unknown>;
    return {
      label: String(record['name'] ?? ''),
      value: String(record['id'] ?? ''),
    };
  });
}


interface MockVendorRecord {
  id: number;
  region: string;
  name: string;
  status: 'active' | 'inactive';
  created_by: string | null;
  created_date: string;
}

// Mock data sengaja kosong: isi lewat Create / Bulk Upload.
const mockVendorRecords: MockVendorRecord[] = [];

function toListItem(record: MockVendorRecord): VendorListItem {
  return {
    id: record.id,
    region: record.region,
    name: record.name,
    created_date: record.created_date,
    created_by: record.created_by,
    status: record.status,
  };
}

function toDetail(record: MockVendorRecord): Vendor {
  return {
    id: String(record.id),
    region: record.region,
    name: record.name,
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

function sortVendors(items: VendorListItem[], key: string | undefined, dir: string | undefined) {
  const sortKey = key || 'region';
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
function filterVendorsRecords(params?: GetVendorsParams): VendorListItem[] {
  let items = mockVendorRecords.map(toListItem);
  if (params?.search) {
    const q = params.search.toLowerCase();
    items = items.filter(
      (r) =>
        r.region.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q) ||
        String(r.id).includes(q),
    );
  }
  if (params?.status) items = items.filter((r) => r.status === params.status);
  if (params?.region) items = items.filter((r) => r.region === params.region);
  if (params?.name) {
    const qName = params.name.toLowerCase();
    items = items.filter((r) => String(r.name ?? '').toLowerCase().includes(qName));
  }
  return sortVendors(items, params?.order, params?.sort);
}

export async function mockGetVendors(params?: GetVendorsParams): Promise<ApiList<VendorListItem>> {
  await delay(300);
  const items = filterVendorsRecords(params);
  const result = paginate(items, (params?.page ?? 0) + 1, params?.size ?? 10);
  return { list: result };
}

export async function mockExportVendors(params?: GetVendorsParams): Promise<Blob> {
  await delay(300);
  const items = filterVendorsRecords({ ...params, page: undefined, size: undefined });
  const data = await buildWorkbook(
    ["Region","Name","Status","Created Date"],
    items.map((r) => [r.region, r.name, r.status, r.created_date]),
  );
  return new Blob([data], { type: XLSX_MIME });
}

export async function mockDownloadVendorTemplate(): Promise<Blob> {
  const data = await buildWorkbook(BULK_VENDOR_HEADERS, [BULK_VENDOR_EXAMPLE]);
  return new Blob([data], { type: XLSX_MIME });
}

export async function mockBulkUploadVendors(file: File | ArrayBuffer): Promise<BulkUploadResult> {
  await delay(500);
  const buffer = file instanceof ArrayBuffer ? file : await file.arrayBuffer();
  const { headers, rows } = await readWorkbookRows(buffer);
  const headerIndex = new Map(headers.map((h, i) => [h.trim().toLowerCase(), i]));
  const expected = BULK_VENDOR_HEADERS;
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
  const seenName = new Set(mockVendorRecords.map((r) => String(r.name).toLowerCase()));
  const errors: BulkRowError[] = [];
  let successCount = 0;
  rows.forEach((row, index) => {
    const mapped: Record<string, unknown> = {};
    for (const header of expected) {
      const source = headers[headerIndex.get(header.trim().toLowerCase()) ?? -1] ?? '';
      mapped[header] = row[source] ?? '';
    }
    const { payload, errors: rowErrors } = validateBulkVendorRow(mapped, (field, value) => {
      if (field === 'name') return seenName.has(value.toLowerCase());
      return false;
    });
    if (!payload) {
      for (const rowError of rowErrors) {
        errors.push({ row: index + 2, field: rowError.field, message: rowError.message });
      }
      return;
    }
    seenName.add(String(payload.name).toLowerCase());
    mockVendorRecords.push({
      id: Math.max(...mockVendorRecords.map((r) => r.id)) + 1,
      region: payload.region,
      name: payload.name,
      status: 'active',
      created_by: 'Bulk Upload',
      created_date: new Date().toISOString().slice(0, 16).replace('T', ' '),
    });
    successCount += 1;
  });
  return { totalRows: rows.length, successCount, failedCount: rows.length - successCount, errors };
}


export async function mockGetVendorById(id: string): Promise<Vendor> {
  await delay(300);
  const record = mockVendorRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error(t('vendor.toast.notFound'));
  return toDetail(record);
}

function mockConflictError(field: string, message: string) {
  return {
    response: {
      data: {
        response_schema: {
          response_code: 'MOCK-VENDOR-400',
          response_message: 'Invalid parameters',
        },
        response_output: {
          errors: [{ field, message }],
        },
      },
    },
  };
}

export async function mockCreateVendor(data: CreateVendorPayload): Promise<VendorMutationResult> {
  await delay(300);
  if (mockVendorRecords.some((r) => r.name === data.name)) {
    throw mockConflictError(
      'name',
      t('validation.unique', { label: t('vendor.fields.name.label') }),
    );
  }
  const record: MockVendorRecord = {
    id: Math.max(...mockVendorRecords.map((r) => r.id)) + 1,
    region: data.region,
    name: data.name,
    status: 'active',
    created_by: 'System',
    created_date: new Date().toISOString().slice(0, 16).replace('T', ' '),
  };
  mockVendorRecords.push(record);
  return { message: t('vendor.toast.created'), data: toDetail(record) };
}

export async function mockUpdateVendor(
  id: string,
  data: CreateVendorPayload,
): Promise<VendorMutationResult> {
  await delay(300);
  const record = mockVendorRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error(t('vendor.toast.notFound'));
  if (mockVendorRecords.some((r) => String(r.id) !== id && r.name === data.name)) {
    throw mockConflictError(
      'name',
      t('validation.unique', { label: t('vendor.fields.name.label') }),
    );
  }
  record.region = data.region;
  record.name = data.name;
  return { message: t('vendor.toast.updated'), data: toDetail(record) };
}

export async function mockDeleteVendor(id: string): Promise<{ message: string }> {
  await delay(300);
  const record = mockVendorRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error(t('vendor.toast.notFound'));
  record.status = 'inactive';
  return { message: t('vendor.toast.deleted') };
}

export async function mockRestoreVendor(id: string): Promise<VendorMutationResult> {
  await delay(300);
  const record = mockVendorRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error(t('vendor.toast.notFound'));
  record.status = 'active';
  return { message: t('vendor.toast.restored'), data: toDetail(record) };
}
