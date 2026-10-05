import type {
  Company,
  CompanyMutationResult,
  BulkRowError,
  BulkUploadResult,
  CompanyListItem,
  CreateCompanyPayload,
  GetCompaniesParams,
} from '../types';
import type { ApiList } from '../../../../shared/types';
import { XLSX_MIME, buildWorkbook, readWorkbookRows } from '../../../../shared/utils';
import {
  BULK_COMPANY_EXAMPLE,
  BULK_COMPANY_HEADERS,
  validateBulkCompanyRow,
} from '../validation/companyBulkValidation';

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


interface MockCompanyRecord {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  created_by: string | null;
  created_date: string;
}

const mockCompanyRecords: MockCompanyRecord[] = Array.from({ length: 14 }, (_, i) => ({
  id: i + 1,
  name: `Name ${i + 1}`,
  description: `Description ${i + 1} text`,
  status: i % 4 === 3 ? 'inactive' : 'active',
  created_by: 'System',
  created_date: `2024-0${(i % 9) + 1}-${10 + (i % 9)} 09:00`,
}));

function toListItem(record: MockCompanyRecord): CompanyListItem {
  return {
    id: record.id,
    name: record.name,
    description: record.description,
    created_date: record.created_date,
    created_by: record.created_by,
    status: record.status,
  };
}

function toDetail(record: MockCompanyRecord): Company {
  return {
    id: String(record.id),
    name: record.name,
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

function sortCompanies(items: CompanyListItem[], key: string | undefined, dir: string | undefined) {
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
function filterCompaniesRecords(params?: GetCompaniesParams): CompanyListItem[] {
  let items = mockCompanyRecords.map(toListItem);
  if (params?.search) {
    const q = params.search.toLowerCase();
    items = items.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        String(r.id).includes(q),
    );
  }
  if (params?.status) items = items.filter((r) => r.status === params.status);

  return sortCompanies(items, params?.order, params?.sort);
}

export async function mockGetCompanies(params?: GetCompaniesParams): Promise<ApiList<CompanyListItem>> {
  await delay(300);
  const items = filterCompaniesRecords(params);
  const result = paginate(items, (params?.page ?? 0) + 1, params?.size ?? 10);
  return { list: result };
}

export async function mockExportCompanies(params?: GetCompaniesParams): Promise<Blob> {
  await delay(300);
  const items = filterCompaniesRecords({ ...params, page: undefined, size: undefined });
  const data = await buildWorkbook(
    ["Name","Description","Status","Created Date"],
    items.map((r) => [r.name, r.description, r.status, r.created_date]),
  );
  return new Blob([data], { type: XLSX_MIME });
}

export async function mockDownloadCompanyTemplate(): Promise<Blob> {
  const data = await buildWorkbook(BULK_COMPANY_HEADERS, [BULK_COMPANY_EXAMPLE]);
  return new Blob([data], { type: XLSX_MIME });
}

export async function mockBulkUploadCompanies(file: File | ArrayBuffer): Promise<BulkUploadResult> {
  await delay(500);
  const buffer = file instanceof ArrayBuffer ? file : await file.arrayBuffer();
  const { headers, rows } = await readWorkbookRows(buffer);
  const headerIndex = new Map(headers.map((h, i) => [h.trim().toLowerCase(), i]));
  const expected = BULK_COMPANY_HEADERS;
  const missing = expected.filter((h) => !headerIndex.has(h.trim().toLowerCase()));
  if (missing.length > 0) {
    return {
      totalRows: rows.length,
      successCount: 0,
      failedCount: rows.length,
      errors: missing.map((field) => ({
        row: 1,
        field,
        message: `Column "${field}" was not found in the file.`,
      })),
    };
  }
  if (rows.length === 0) {
    return {
      totalRows: 0,
      successCount: 0,
      failedCount: 0,
      errors: [{ row: 1, message: 'The file contains no data.' }],
    };
  }
  const seenName = new Set(mockCompanyRecords.map((r) => String(r.name).toLowerCase()));
  const errors: BulkRowError[] = [];
  let successCount = 0;
  rows.forEach((row, index) => {
    const mapped: Record<string, unknown> = {};
    for (const header of expected) {
      const source = headers[headerIndex.get(header.trim().toLowerCase()) ?? -1] ?? '';
      mapped[header] = row[source] ?? '';
    }
    const { payload, errors: rowErrors } = validateBulkCompanyRow(mapped, (field, value) => {
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
    mockCompanyRecords.push({
      id: Math.max(...mockCompanyRecords.map((r) => r.id)) + 1,
      name: payload.name,
      description: payload.description,
      status: 'active',
      created_by: 'Bulk Upload',
      created_date: new Date().toISOString().slice(0, 16).replace('T', ' '),
    });
    successCount += 1;
  });
  return { totalRows: rows.length, successCount, failedCount: rows.length - successCount, errors };
}


export async function mockGetCompanyById(id: string): Promise<Company> {
  await delay(300);
  const record = mockCompanyRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error('Company not found');
  return toDetail(record);
}

function mockConflictError(field: string, message: string) {
  return {
    response: {
      data: {
        response_schema: {
          response_code: 'MOCK-COMPANY-400',
          response_message: 'Invalid parameters',
        },
        response_output: {
          errors: [{ field, message }],
        },
      },
    },
  };
}

export async function mockCreateCompany(data: CreateCompanyPayload): Promise<CompanyMutationResult> {
  await delay(300);
  if (mockCompanyRecords.some((r) => r.name === data.name)) {
    throw mockConflictError('name', 'Name already exists, please use another');
  }
  const record: MockCompanyRecord = {
    id: Math.max(...mockCompanyRecords.map((r) => r.id)) + 1,
    name: data.name,
    description: data.description,
    status: 'active',
    created_by: 'System',
    created_date: new Date().toISOString().slice(0, 16).replace('T', ' '),
  };
  mockCompanyRecords.push(record);
  return { message: 'Company created successfully.', data: toDetail(record) };
}

export async function mockUpdateCompany(
  id: string,
  data: CreateCompanyPayload,
): Promise<CompanyMutationResult> {
  await delay(300);
  const record = mockCompanyRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error('Company not found');
  if (mockCompanyRecords.some((r) => String(r.id) !== id && r.name === data.name)) {
    throw mockConflictError('name', 'Name already exists, please use another');
  }
  record.name = data.name;
  record.description = data.description;
  return { message: 'Company updated successfully.', data: toDetail(record) };
}

export async function mockDeleteCompany(id: string): Promise<{ message: string }> {
  await delay(300);
  const record = mockCompanyRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error('Company not found');
  record.status = 'inactive';
  return { message: 'Company deleted successfully' };
}

export async function mockRestoreCompany(id: string): Promise<CompanyMutationResult> {
  await delay(300);
  const record = mockCompanyRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error('Company not found');
  record.status = 'active';
  return { message: 'Company restored successfully', data: toDetail(record) };
}
