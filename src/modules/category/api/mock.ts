import { t } from 'i18next';
import '../../../shared/i18n';
import type {
  Category,
  CategoryMutationResult,
  BulkRowError,
  BulkUploadResult,
  CategoryListItem,
  CreateCategoryPayload,
  GetCategoriesParams,
} from '../types';
import type { ApiList } from '../../../shared/types';
import { XLSX_MIME, buildWorkbook, readWorkbookRows } from '../../../shared/utils';
import {
  BULK_CATEGORY_EXAMPLE,
  BULK_CATEGORY_HEADERS,
  validateBulkCategoryRow,
} from '../validation/categoryBulkValidation';

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


interface MockCategoryRecord {
  id: number;
  name: string;
  status: 'active' | 'inactive';
  created_by: string | null;
  created_date: string;
}

const mockCategoryRecords: MockCategoryRecord[] = Array.from({ length: 14 }, (_, i) => ({
  id: i + 1,
  name: `Name ${i + 1}`,
  status: i % 4 === 3 ? 'inactive' : 'active',
  created_by: 'System',
  created_date: `2024-0${(i % 9) + 1}-${10 + (i % 9)} 09:00`,
}));

function toListItem(record: MockCategoryRecord): CategoryListItem {
  return {
    id: record.id,
    name: record.name,
    created_date: record.created_date,
    created_by: record.created_by,
    status: record.status,
  };
}

function toDetail(record: MockCategoryRecord): Category {
  return {
    id: String(record.id),
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

function sortCategories(items: CategoryListItem[], key: string | undefined, dir: string | undefined) {
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
function filterCategoriesRecords(params?: GetCategoriesParams): CategoryListItem[] {
  let items = mockCategoryRecords.map(toListItem);
  if (params?.search) {
    const q = params.search.toLowerCase();
    items = items.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        String(r.id).includes(q),
    );
  }
  if (params?.status) items = items.filter((r) => r.status === params.status);
  if (params?.name) {
    const qName = params.name.toLowerCase();
    items = items.filter((r) => String(r.name ?? '').toLowerCase().includes(qName));
  }
  return sortCategories(items, params?.order, params?.sort);
}

export async function mockGetCategories(params?: GetCategoriesParams): Promise<ApiList<CategoryListItem>> {
  await delay(300);
  const items = filterCategoriesRecords(params);
  const result = paginate(items, (params?.page ?? 0) + 1, params?.size ?? 10);
  return { list: result };
}

export async function mockExportCategories(params?: GetCategoriesParams): Promise<Blob> {
  await delay(300);
  const items = filterCategoriesRecords({ ...params, page: undefined, size: undefined });
  const data = await buildWorkbook(
    ["Name","Status","Created Date"],
    items.map((r) => [r.name, r.status, r.created_date]),
  );
  return new Blob([data], { type: XLSX_MIME });
}

export async function mockDownloadCategoryTemplate(): Promise<Blob> {
  const data = await buildWorkbook(BULK_CATEGORY_HEADERS, [BULK_CATEGORY_EXAMPLE]);
  return new Blob([data], { type: XLSX_MIME });
}

export async function mockBulkUploadCategories(file: File | ArrayBuffer): Promise<BulkUploadResult> {
  await delay(500);
  const buffer = file instanceof ArrayBuffer ? file : await file.arrayBuffer();
  const { headers, rows } = await readWorkbookRows(buffer);
  const headerIndex = new Map(headers.map((h, i) => [h.trim().toLowerCase(), i]));
  const expected = BULK_CATEGORY_HEADERS;
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
    const { payload, errors: rowErrors } = validateBulkCategoryRow(mapped, () => {

      return false;
    });
    if (!payload) {
      for (const rowError of rowErrors) {
        errors.push({ row: index + 2, field: rowError.field, message: rowError.message });
      }
      return;
    }

    mockCategoryRecords.push({
      id: Math.max(...mockCategoryRecords.map((r) => r.id)) + 1,
      name: payload.name,
      status: 'active',
      created_by: 'Bulk Upload',
      created_date: new Date().toISOString().slice(0, 16).replace('T', ' '),
    });
    successCount += 1;
  });
  return { totalRows: rows.length, successCount, failedCount: rows.length - successCount, errors };
}


export async function mockGetCategoryById(id: string): Promise<Category> {
  await delay(300);
  const record = mockCategoryRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error(t('category.toast.notFound'));
  return toDetail(record);
}

export async function mockCreateCategory(data: CreateCategoryPayload): Promise<CategoryMutationResult> {
  await delay(300);
  const record: MockCategoryRecord = {
    id: Math.max(...mockCategoryRecords.map((r) => r.id)) + 1,
    name: data.name,
    status: 'active',
    created_by: 'System',
    created_date: new Date().toISOString().slice(0, 16).replace('T', ' '),
  };
  mockCategoryRecords.push(record);
  return { message: t('category.toast.created'), data: toDetail(record) };
}

export async function mockUpdateCategory(
  id: string,
  data: CreateCategoryPayload,
): Promise<CategoryMutationResult> {
  await delay(300);
  const record = mockCategoryRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error(t('category.toast.notFound'));
  record.name = data.name;
  return { message: t('category.toast.updated'), data: toDetail(record) };
}

export async function mockDeleteCategory(id: string): Promise<{ message: string }> {
  await delay(300);
  const record = mockCategoryRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error(t('category.toast.notFound'));
  record.status = 'inactive';
  return { message: t('category.toast.deleted') };
}

export async function mockRestoreCategory(id: string): Promise<CategoryMutationResult> {
  await delay(300);
  const record = mockCategoryRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error(t('category.toast.notFound'));
  record.status = 'active';
  return { message: t('category.toast.restored'), data: toDetail(record) };
}
