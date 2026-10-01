import type {
  NewClaim,
  NewClaimMutationResult,
  BulkRowError,
  BulkUploadResult,
  NewClaimListItem,
  CreateNewClaimPayload,
  GetNewClaimsParams,
} from '../types';
import type { ApiList } from '../../../shared/types';
import { XLSX_MIME, buildWorkbook, readWorkbookRows } from '../../../shared/utils';
import {
  BULK_NEWCLAIM_EXAMPLE,
  BULK_NEWCLAIM_HEADERS,
  validateBulkNewClaimRow,
} from '../validation/newClaimBulkValidation';

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


interface MockNewClaimRecord {
  id: number;
  policyNumber: string;
  policyDate: string;
  status: 'active' | 'inactive';
  created_by: string | null;
  created_date: string;
}

const mockNewClaimRecords: MockNewClaimRecord[] = Array.from({ length: 14 }, (_, i) => ({
  id: i + 1,
  policyNumber: `Policy Number ${i + 1}`,
  policyDate: `2024-0${(i % 9) + 1}-${10 + (i % 9)}`,
  status: i % 4 === 3 ? 'inactive' : 'active',
  created_by: 'System',
  created_date: `2024-0${(i % 9) + 1}-${10 + (i % 9)} 09:00`,
}));

function toListItem(record: MockNewClaimRecord): NewClaimListItem {
  return {
    id: record.id,
    policyNumber: record.policyNumber,
    policyDate: record.policyDate,
    created_date: record.created_date,
    created_by: record.created_by,
    status: record.status,
  };
}

function toDetail(record: MockNewClaimRecord): NewClaim {
  return {
    id: String(record.id),
    policyNumber: record.policyNumber,
    policyDate: record.policyDate,
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

function sortNewClaims(items: NewClaimListItem[], key: string | undefined, dir: string | undefined) {
  const sortKey = key || 'policyNumber';
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
function filterNewClaimsRecords(params?: GetNewClaimsParams): NewClaimListItem[] {
  let items = mockNewClaimRecords.map(toListItem);
  if (params?.search) {
    const q = params.search.toLowerCase();
    items = items.filter(
      (r) =>
        r.policyNumber.toLowerCase().includes(q) ||
        r.policyDate.toLowerCase().includes(q) ||
        String(r.id).includes(q),
    );
  }
  if (params?.status) items = items.filter((r) => r.status === params.status);
  if (params?.policyDate) {
    const [startPolicyDate, endPolicyDate] = params.policyDate.split(',');
    if (startPolicyDate && endPolicyDate) items = items.filter((r) => r.policyDate >= startPolicyDate && r.policyDate <= endPolicyDate);
  }
  return sortNewClaims(items, params?.order, params?.sort);
}

export async function mockGetNewClaims(params?: GetNewClaimsParams): Promise<ApiList<NewClaimListItem>> {
  await delay(300);
  const items = filterNewClaimsRecords(params);
  const result = paginate(items, (params?.page ?? 0) + 1, params?.size ?? 10);
  return { list: result };
}

export async function mockExportNewClaims(params?: GetNewClaimsParams): Promise<Blob> {
  await delay(300);
  const items = filterNewClaimsRecords({ ...params, page: undefined, size: undefined });
  const data = await buildWorkbook(
    ["Policy Number","Policy Date","Status","Created Date"],
    items.map((r) => [r.policyNumber, r.policyDate, r.status, r.created_date]),
  );
  return new Blob([data], { type: XLSX_MIME });
}

export async function mockDownloadNewClaimTemplate(): Promise<Blob> {
  const data = await buildWorkbook(BULK_NEWCLAIM_HEADERS, [BULK_NEWCLAIM_EXAMPLE]);
  return new Blob([data], { type: XLSX_MIME });
}

export async function mockBulkUploadNewClaims(file: File | ArrayBuffer): Promise<BulkUploadResult> {
  await delay(500);
  const buffer = file instanceof ArrayBuffer ? file : await file.arrayBuffer();
  const { headers, rows } = await readWorkbookRows(buffer);
  const headerIndex = new Map(headers.map((h, i) => [h.trim().toLowerCase(), i]));
  const expected = BULK_NEWCLAIM_HEADERS;
  const missing = expected.filter((h) => !headerIndex.has(h.trim().toLowerCase()));
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

  const errors: BulkRowError[] = [];
  let successCount = 0;
  rows.forEach((row, index) => {
    const mapped: Record<string, unknown> = {};
    for (const header of expected) {
      const source = headers[headerIndex.get(header.trim().toLowerCase()) ?? -1] ?? '';
      mapped[header] = row[source] ?? '';
    }
    const { payload, errors: rowErrors } = validateBulkNewClaimRow(mapped, (field, value) => {

      return false;
    });
    if (!payload) {
      for (const rowError of rowErrors) {
        errors.push({ row: index + 2, field: rowError.field, message: rowError.message });
      }
      return;
    }

    mockNewClaimRecords.push({
      id: Math.max(...mockNewClaimRecords.map((r) => r.id)) + 1,
      policyNumber: payload.policyNumber,
      policyDate: payload.policyDate,
      status: 'active',
      created_by: 'Bulk Upload',
      created_date: new Date().toISOString().slice(0, 16).replace('T', ' '),
    });
    successCount += 1;
  });
  return { totalRows: rows.length, successCount, failedCount: rows.length - successCount, errors };
}


export async function mockGetNewClaimById(id: string): Promise<NewClaim> {
  await delay(300);
  const record = mockNewClaimRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error('NewClaim not found');
  return toDetail(record);
}

export async function mockCreateNewClaim(data: CreateNewClaimPayload): Promise<NewClaimMutationResult> {
  await delay(300);
  const record: MockNewClaimRecord = {
    id: Math.max(...mockNewClaimRecords.map((r) => r.id)) + 1,
    policyNumber: data.policyNumber,
    policyDate: data.policyDate,
    status: 'active',
    created_by: 'System',
    created_date: new Date().toISOString().slice(0, 16).replace('T', ' '),
  };
  mockNewClaimRecords.push(record);
  return { message: 'NewClaim created successfully.', data: toDetail(record) };
}

export async function mockUpdateNewClaim(
  id: string,
  data: CreateNewClaimPayload,
): Promise<NewClaimMutationResult> {
  await delay(300);
  const record = mockNewClaimRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error('NewClaim not found');
  record.policyNumber = data.policyNumber;
  record.policyDate = data.policyDate;
  return { message: 'NewClaim updated successfully.', data: toDetail(record) };
}

export async function mockDeleteNewClaim(id: string): Promise<{ message: string }> {
  await delay(300);
  const record = mockNewClaimRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error('NewClaim not found');
  record.status = 'inactive';
  return { message: 'NewClaim deleted successfully' };
}

export async function mockRestoreNewClaim(id: string): Promise<NewClaimMutationResult> {
  await delay(300);
  const record = mockNewClaimRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error('NewClaim not found');
  record.status = 'active';
  return { message: 'NewClaim restored successfully', data: toDetail(record) };
}
