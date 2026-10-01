import type {
  Category,
  CategoryMutationResult,
  BulkRowError,
  BulkUploadResult,
  CategoryListItem,
  CreateCategoryPayload,
  GetCategoriesParams,
  SourceOption,
} from '../types';
import type { ApiList } from '../../../../shared/types';
import { XLSX_MIME, buildWorkbook, readWorkbookRows } from '../../../../shared/utils';
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
  sourceLoadOptions: true,
  export: true,
  bulkUpload: true,
  bulkTemplate: true,
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const mockSourceOptionsBase: SourceOption[] = [
  { label: 'Source 1', value: 'SOURCE_1' },
  { label: 'Source 2', value: 'SOURCE_2' },
  { label: 'Source 3', value: 'SOURCE_3' },
  { label: 'Source 4', value: 'SOURCE_4' },
  { label: 'Source 5', value: 'SOURCE_5' },
  { label: 'Source 6', value: 'SOURCE_6' },
  { label: 'Source 7', value: 'SOURCE_7' },
  { label: 'Source 8', value: 'SOURCE_8' },
  { label: 'Source 9', value: 'SOURCE_9' },
  { label: 'Source 10', value: 'SOURCE_10' },
  { label: 'Source 11', value: 'SOURCE_11' },
  { label: 'Source 12', value: 'SOURCE_12' },
  { label: 'Source 13', value: 'SOURCE_13' },
  { label: 'Source 14', value: 'SOURCE_14' },
  { label: 'Source 15', value: 'SOURCE_15' },
  { label: 'Source 16', value: 'SOURCE_16' },
  { label: 'Source 17', value: 'SOURCE_17' },
  { label: 'Source 18', value: 'SOURCE_18' },
  { label: 'Source 19', value: 'SOURCE_19' },
  { label: 'Source 20', value: 'SOURCE_20' },
  { label: 'Source 21', value: 'SOURCE_21' },
  { label: 'Source 22', value: 'SOURCE_22' },
  { label: 'Source 23', value: 'SOURCE_23' },
  { label: 'Source 24', value: 'SOURCE_24' },
  { label: 'Source 25', value: 'SOURCE_25' },
  { label: 'Source 26', value: 'SOURCE_26' },
  { label: 'Source 27', value: 'SOURCE_27' },
  { label: 'Source 28', value: 'SOURCE_28' },
  { label: 'Source 29', value: 'SOURCE_29' },
  { label: 'Source 30', value: 'SOURCE_30' },
  { label: 'Source 31', value: 'SOURCE_31' },
  { label: 'Source 32', value: 'SOURCE_32' },
  { label: 'Source 33', value: 'SOURCE_33' },
  { label: 'Source 34', value: 'SOURCE_34' },
  { label: 'Source 35', value: 'SOURCE_35' },
  { label: 'Source 36', value: 'SOURCE_36' },
  { label: 'Source 37', value: 'SOURCE_37' },
  { label: 'Source 38', value: 'SOURCE_38' },
  { label: 'Source 39', value: 'SOURCE_39' },
  { label: 'Source 40', value: 'SOURCE_40' },
  { label: 'Source 41', value: 'SOURCE_41' },
  { label: 'Source 42', value: 'SOURCE_42' },
  { label: 'Source 43', value: 'SOURCE_43' },
  { label: 'Source 44', value: 'SOURCE_44' },
  { label: 'Source 45', value: 'SOURCE_45' },
  { label: 'Source 46', value: 'SOURCE_46' },
  { label: 'Source 47', value: 'SOURCE_47' },
  { label: 'Source 48', value: 'SOURCE_48' },
  { label: 'Source 49', value: 'SOURCE_49' },
  { label: 'Source 50', value: 'SOURCE_50' },
  { label: 'Source 51', value: 'SOURCE_51' },
  { label: 'Source 52', value: 'SOURCE_52' },
  { label: 'Source 53', value: 'SOURCE_53' },
  { label: 'Source 54', value: 'SOURCE_54' },
  { label: 'Source 55', value: 'SOURCE_55' },
  { label: 'Source 56', value: 'SOURCE_56' },
  { label: 'Source 57', value: 'SOURCE_57' },
  { label: 'Source 58', value: 'SOURCE_58' },
  { label: 'Source 59', value: 'SOURCE_59' },
  { label: 'Source 60', value: 'SOURCE_60' },
];

export async function loadSourceOptions(
  search = '',
  page = 1,
  size = 20,
): Promise<SourceOption[]> {
  await delay(300);
  const q = search.toLowerCase();
  const filtered = q
    ? mockSourceOptionsBase.filter((o) => o.label.toLowerCase().includes(q))
    : mockSourceOptionsBase;
  return filtered.slice((page - 1) * size, page * size);
}

interface MockCategoryRecord {
  id: number;
  categoryName: string;
  description: string;
  source: string[];
  status: 'active' | 'inactive';
  created_by: string | null;
  created_date: string;
}

const mockCategoryRecords: MockCategoryRecord[] = Array.from({ length: 14 }, (_, i) => ({
  id: i + 1,
  categoryName: `Category Name ${i + 1}`,
  description: `Description ${i + 1} text`,
  source: [`SOURCE_${(i % 5) + 1}`, `SOURCE_${((i + 1) % 5) + 1}`],
  status: i % 4 === 3 ? 'inactive' : 'active',
  created_by: 'System',
  created_date: `2024-0${(i % 9) + 1}-${10 + (i % 9)} 09:00`,
}));

function toListItem(record: MockCategoryRecord): CategoryListItem {
  return {
    id: record.id,
    categoryName: record.categoryName,
    description: record.description,
    source: record.source,
    created_date: record.created_date,
    created_by: record.created_by,
    status: record.status,
  };
}

function toDetail(record: MockCategoryRecord): Category {
  return {
    id: String(record.id),
    categoryName: record.categoryName,
    description: record.description,
    source: record.source,
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
  const sortKey = key || 'categoryName';
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
        r.categoryName.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        (r.source ?? []).join(' ').toLowerCase().includes(q) ||
        String(r.id).includes(q),
    );
  }
  if (params?.status) items = items.filter((r) => r.status === params.status);
  if (params?.source) {
    const selectedSource = new Set(params.source.split(','));
    items = items.filter((r) => (r.source as string[]).some((v) => selectedSource.has(v)));
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
    ["Category Name","Description","Source","Status","Created Date"],
    items.map((r) => [r.categoryName, r.description, (r.source ?? []).join(', '), r.status, r.created_date]),
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
    const { payload, errors: rowErrors } = validateBulkCategoryRow(mapped, (_field, _value) => {

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
      categoryName: payload.categoryName,
      description: payload.description,
      source: payload.source,
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
  if (!record) throw new Error('Category not found');
  return toDetail(record);
}

export async function mockCreateCategory(data: CreateCategoryPayload): Promise<CategoryMutationResult> {
  await delay(300);
  const record: MockCategoryRecord = {
    id: Math.max(...mockCategoryRecords.map((r) => r.id)) + 1,
    categoryName: data.categoryName,
    description: data.description,
    source: data.source,
    status: 'active',
    created_by: 'System',
    created_date: new Date().toISOString().slice(0, 16).replace('T', ' '),
  };
  mockCategoryRecords.push(record);
  return { message: 'Category created successfully.', data: toDetail(record) };
}

export async function mockUpdateCategory(
  id: string,
  data: CreateCategoryPayload,
): Promise<CategoryMutationResult> {
  await delay(300);
  const record = mockCategoryRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error('Category not found');
  record.categoryName = data.categoryName;
  record.description = data.description;
  record.source = data.source;
  return { message: 'Category updated successfully.', data: toDetail(record) };
}

export async function mockDeleteCategory(id: string): Promise<{ message: string }> {
  await delay(300);
  const record = mockCategoryRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error('Category not found');
  record.status = 'inactive';
  return { message: 'Category deleted successfully' };
}

export async function mockRestoreCategory(id: string): Promise<CategoryMutationResult> {
  await delay(300);
  const record = mockCategoryRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error('Category not found');
  record.status = 'active';
  return { message: 'Category restored successfully', data: toDetail(record) };
}
