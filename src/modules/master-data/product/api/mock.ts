import { t } from 'i18next';
import '../../../../shared/i18n';
import type {
  Product,
  ProductMutationResult,
  BulkRowError,
  BulkUploadResult,
  ProductListItem,
  CreateProductPayload,
  GetProductsParams,
  CategoryOption,
} from '../types';
import type { ApiList } from '../../../../shared/types';
import { XLSX_MIME, buildWorkbook, readWorkbookRows } from '../../../../shared/utils';
import {
  BULK_PRODUCT_EXAMPLE,
  BULK_PRODUCT_HEADERS,
  validateBulkProductRow,
} from '../validation/productBulkValidation';
import { mockGetCategories } from '../../category/api/mock';

export const USE_MOCK = {
  list: true,
  detail: true,
  create: true,
  update: true,
  delete: true,
  restore: true,
  categoryLoadOptions: true,
  export: true,
  bulkUpload: true,
  bulkTemplate: true,
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function loadCategoryOptions(
  search = '',
  page = 1,
  size = 20,
): Promise<CategoryOption[]> {
  const res = await mockGetCategories({ search: search || undefined, page: page - 1, size });
  return res.list.content.map((r) => {
    const record = r as unknown as Record<string, unknown>;
    return {
      label: String(record['name'] ?? ''),
      value: String(record['id'] ?? ''),
    };
  });
}


interface MockProductRecord {
  id: number;
  name: string;
  category: string;
  status: 'active' | 'inactive';
  created_by: string | null;
  created_date: string;
}

// Mock data sengaja kosong: isi lewat Create / Bulk Upload.
const mockProductRecords: MockProductRecord[] = [];

function toListItem(record: MockProductRecord): ProductListItem {
  return {
    id: record.id,
    name: record.name,
    category: record.category,
    created_date: record.created_date,
    created_by: record.created_by,
    status: record.status,
  };
}

function toDetail(record: MockProductRecord): Product {
  return {
    id: String(record.id),
    name: record.name,
    category: record.category,
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

function sortProducts(items: ProductListItem[], key: string | undefined, dir: string | undefined) {
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
function filterProductsRecords(params?: GetProductsParams): ProductListItem[] {
  let items = mockProductRecords.map(toListItem);
  if (params?.search) {
    const q = params.search.toLowerCase();
    items = items.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        String(r.id).includes(q),
    );
  }
  if (params?.status) items = items.filter((r) => r.status === params.status);
  if (params?.name) {
    const qName = params.name.toLowerCase();
    items = items.filter((r) => String(r.name ?? '').toLowerCase().includes(qName));
  }
  if (params?.category) items = items.filter((r) => r.category === params.category);
  return sortProducts(items, params?.order, params?.sort);
}

export async function mockGetProducts(params?: GetProductsParams): Promise<ApiList<ProductListItem>> {
  await delay(300);
  const items = filterProductsRecords(params);
  const result = paginate(items, (params?.page ?? 0) + 1, params?.size ?? 10);
  return { list: result };
}

export async function mockExportProducts(params?: GetProductsParams): Promise<Blob> {
  await delay(300);
  const items = filterProductsRecords({ ...params, page: undefined, size: undefined });
  const data = await buildWorkbook(
    ["Name","Category","Status","Created Date"],
    items.map((r) => [r.name, r.category, r.status, r.created_date]),
  );
  return new Blob([data], { type: XLSX_MIME });
}

export async function mockDownloadProductTemplate(): Promise<Blob> {
  const data = await buildWorkbook(BULK_PRODUCT_HEADERS, [BULK_PRODUCT_EXAMPLE]);
  return new Blob([data], { type: XLSX_MIME });
}

export async function mockBulkUploadProducts(file: File | ArrayBuffer): Promise<BulkUploadResult> {
  await delay(500);
  const buffer = file instanceof ArrayBuffer ? file : await file.arrayBuffer();
  const { headers, rows } = await readWorkbookRows(buffer);
  const headerIndex = new Map(headers.map((h, i) => [h.trim().toLowerCase(), i]));
  const expected = BULK_PRODUCT_HEADERS;
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
  const seenName = new Set(mockProductRecords.map((r) => String(r.name).toLowerCase()));
  const errors: BulkRowError[] = [];
  let successCount = 0;
  rows.forEach((row, index) => {
    const mapped: Record<string, unknown> = {};
    for (const header of expected) {
      const source = headers[headerIndex.get(header.trim().toLowerCase()) ?? -1] ?? '';
      mapped[header] = row[source] ?? '';
    }
    const { payload, errors: rowErrors } = validateBulkProductRow(mapped, (field, value) => {
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
    mockProductRecords.push({
      id: Math.max(...mockProductRecords.map((r) => r.id)) + 1,
      name: payload.name,
      category: payload.category,
      status: 'active',
      created_by: 'Bulk Upload',
      created_date: new Date().toISOString().slice(0, 16).replace('T', ' '),
    });
    successCount += 1;
  });
  return { totalRows: rows.length, successCount, failedCount: rows.length - successCount, errors };
}


export async function mockGetProductById(id: string): Promise<Product> {
  await delay(300);
  const record = mockProductRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error(t('product.toast.notFound'));
  return toDetail(record);
}

function mockConflictError(field: string, message: string) {
  return {
    response: {
      data: {
        response_schema: {
          response_code: 'MOCK-PRODUCT-400',
          response_message: 'Invalid parameters',
        },
        response_output: {
          errors: [{ field, message }],
        },
      },
    },
  };
}

export async function mockCreateProduct(data: CreateProductPayload): Promise<ProductMutationResult> {
  await delay(300);
  if (mockProductRecords.some((r) => r.name === data.name)) {
    throw mockConflictError(
      'name',
      t('validation.unique', { label: t('product.fields.name.label') }),
    );
  }
  const record: MockProductRecord = {
    id: Math.max(...mockProductRecords.map((r) => r.id)) + 1,
    name: data.name,
    category: data.category,
    status: 'active',
    created_by: 'System',
    created_date: new Date().toISOString().slice(0, 16).replace('T', ' '),
  };
  mockProductRecords.push(record);
  return { message: t('product.toast.created'), data: toDetail(record) };
}

export async function mockUpdateProduct(
  id: string,
  data: CreateProductPayload,
): Promise<ProductMutationResult> {
  await delay(300);
  const record = mockProductRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error(t('product.toast.notFound'));
  if (mockProductRecords.some((r) => String(r.id) !== id && r.name === data.name)) {
    throw mockConflictError(
      'name',
      t('validation.unique', { label: t('product.fields.name.label') }),
    );
  }
  record.name = data.name;
  record.category = data.category;
  return { message: t('product.toast.updated'), data: toDetail(record) };
}

export async function mockDeleteProduct(id: string): Promise<{ message: string }> {
  await delay(300);
  const record = mockProductRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error(t('product.toast.notFound'));
  record.status = 'inactive';
  return { message: t('product.toast.deleted') };
}

export async function mockRestoreProduct(id: string): Promise<ProductMutationResult> {
  await delay(300);
  const record = mockProductRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error(t('product.toast.notFound'));
  record.status = 'active';
  return { message: t('product.toast.restored'), data: toDetail(record) };
}
