import type {
  ProductColor,
  ProductColorMutationResult,
  BulkRowError,
  BulkUploadResult,
  ProductColorListItem,
  CreateProductColorPayload,
  GetProductColorsParams,
} from '../types';
import type { ApiList } from '../../../../shared/types';
import { XLSX_MIME, buildWorkbook, readWorkbookRows } from '../../../../shared/utils';
import {
  BULK_PRODUCTCOLOR_EXAMPLE,
  BULK_PRODUCTCOLOR_HEADERS,
  validateBulkProductColorRow,
} from '../validation/productColorBulkValidation';

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


interface MockProductColorRecord {
  id: number;
  colorName: string;
  hexCode: string;
  status: 'active' | 'inactive';
  created_by: string | null;
  created_date: string;
}

const mockProductColorRecords: MockProductColorRecord[] = Array.from({ length: 14 }, (_, i) => ({
  id: i + 1,
  colorName: `colorName ${i + 1}`,
  hexCode: `hexCode ${i + 1}`,
  status: i % 4 === 3 ? 'inactive' : 'active',
  created_by: 'System',
  created_date: `2024-0${(i % 9) + 1}-${10 + (i % 9)} 09:00`,
}));

function toListItem(record: MockProductColorRecord): ProductColorListItem {
  return {
    id: record.id,
    colorName: record.colorName,
    hexCode: record.hexCode,
    created_date: record.created_date,
    created_by: record.created_by,
    status: record.status,
  };
}

function toDetail(record: MockProductColorRecord): ProductColor {
  return {
    id: String(record.id),
    colorName: record.colorName,
    hexCode: record.hexCode,
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

function sortProductColors(items: ProductColorListItem[], key: string | undefined, dir: string | undefined) {
  const sortKey = key || 'colorName';
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
function filterProductColorsRecords(params?: GetProductColorsParams): ProductColorListItem[] {
  let items = mockProductColorRecords.map(toListItem);
  if (params?.search) {
    const q = params.search.toLowerCase();
    items = items.filter(
      (r) =>
        r.colorName.toLowerCase().includes(q) ||
        r.hexCode.toLowerCase().includes(q) ||
        String(r.id).includes(q),
    );
  }
  if (params?.status) items = items.filter((r) => r.status === params.status);

  return sortProductColors(items, params?.order, params?.sort);
}

export async function mockGetProductColors(params?: GetProductColorsParams): Promise<ApiList<ProductColorListItem>> {
  await delay(300);
  const items = filterProductColorsRecords(params);
  const result = paginate(items, (params?.page ?? 0) + 1, params?.size ?? 10);
  return { list: result };
}

export async function mockExportProductColors(params?: GetProductColorsParams): Promise<Blob> {
  await delay(300);
  const items = filterProductColorsRecords({ ...params, page: undefined, size: undefined });
  const data = await buildWorkbook(
    ["colorName","hexCode","Status","Created Date"],
    items.map((r) => [r.colorName, r.hexCode, r.status, r.created_date]),
  );
  return new Blob([data], { type: XLSX_MIME });
}

export async function mockDownloadProductColorTemplate(): Promise<Blob> {
  const data = await buildWorkbook(BULK_PRODUCTCOLOR_HEADERS, [BULK_PRODUCTCOLOR_EXAMPLE]);
  return new Blob([data], { type: XLSX_MIME });
}

export async function mockBulkUploadProductColors(file: File | ArrayBuffer): Promise<BulkUploadResult> {
  await delay(500);
  const buffer = file instanceof ArrayBuffer ? file : await file.arrayBuffer();
  const { headers, rows } = await readWorkbookRows(buffer);
  const headerIndex = new Map(headers.map((h, i) => [h.trim().toLowerCase(), i]));
  const expected = BULK_PRODUCTCOLOR_HEADERS;
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
  const seenColorName = new Set(mockProductColorRecords.map((r) => String(r.colorName).toLowerCase()));
  const errors: BulkRowError[] = [];
  let successCount = 0;
  rows.forEach((row, index) => {
    const mapped: Record<string, unknown> = {};
    for (const header of expected) {
      const source = headers[headerIndex.get(header.trim().toLowerCase()) ?? -1] ?? '';
      mapped[header] = row[source] ?? '';
    }
    const { payload, errors: rowErrors } = validateBulkProductColorRow(mapped, (field, value) => {
      if (field === 'colorName') return seenColorName.has(value.toLowerCase());
      return false;
    });
    if (!payload) {
      for (const rowError of rowErrors) {
        errors.push({ row: index + 2, field: rowError.field, message: rowError.message });
      }
      return;
    }
    seenColorName.add(String(payload.colorName).toLowerCase());
    mockProductColorRecords.push({
      id: Math.max(...mockProductColorRecords.map((r) => r.id)) + 1,
      colorName: payload.colorName,
      hexCode: payload.hexCode,
      status: 'active',
      created_by: 'Bulk Upload',
      created_date: new Date().toISOString().slice(0, 16).replace('T', ' '),
    });
    successCount += 1;
  });
  return { totalRows: rows.length, successCount, failedCount: rows.length - successCount, errors };
}


export async function mockGetProductColorById(id: string): Promise<ProductColor> {
  await delay(300);
  const record = mockProductColorRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error('ProductColor not found');
  return toDetail(record);
}

function mockConflictError(field: string, message: string) {
  return {
    response: {
      data: {
        response_schema: {
          response_code: 'MOCK-PRODUCTCOLOR-400',
          response_message: 'Parameter tidak valid',
        },
        response_output: {
          errors: [{ field, message }],
        },
      },
    },
  };
}

export async function mockCreateProductColor(data: CreateProductColorPayload): Promise<ProductColorMutationResult> {
  await delay(300);
  if (mockProductColorRecords.some((r) => r.colorName === data.colorName)) {
    throw mockConflictError('colorName', 'colorName already exists, please use another');
  }
  const record: MockProductColorRecord = {
    id: Math.max(...mockProductColorRecords.map((r) => r.id)) + 1,
    colorName: data.colorName,
    hexCode: data.hexCode,
    status: 'active',
    created_by: 'System',
    created_date: new Date().toISOString().slice(0, 16).replace('T', ' '),
  };
  mockProductColorRecords.push(record);
  return { message: 'ProductColor created successfully.', data: toDetail(record) };
}

export async function mockUpdateProductColor(
  id: string,
  data: CreateProductColorPayload,
): Promise<ProductColorMutationResult> {
  await delay(300);
  const record = mockProductColorRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error('ProductColor not found');
  if (mockProductColorRecords.some((r) => String(r.id) !== id && r.colorName === data.colorName)) {
    throw mockConflictError('colorName', 'colorName already exists, please use another');
  }
  record.colorName = data.colorName;
  record.hexCode = data.hexCode;
  return { message: 'ProductColor updated successfully.', data: toDetail(record) };
}

export async function mockDeleteProductColor(id: string): Promise<{ message: string }> {
  await delay(300);
  const record = mockProductColorRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error('ProductColor not found');
  record.status = 'inactive';
  return { message: 'ProductColor deleted successfully' };
}

export async function mockRestoreProductColor(id: string): Promise<ProductColorMutationResult> {
  await delay(300);
  const record = mockProductColorRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error('ProductColor not found');
  record.status = 'active';
  return { message: 'ProductColor restored successfully', data: toDetail(record) };
}
