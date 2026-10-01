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

const mockCategoryOptionsBase: CategoryOption[] = [
  { label: 'Category 1', value: 'CATEGORY_1' },
  { label: 'Category 2', value: 'CATEGORY_2' },
  { label: 'Category 3', value: 'CATEGORY_3' },
  { label: 'Category 4', value: 'CATEGORY_4' },
  { label: 'Category 5', value: 'CATEGORY_5' },
  { label: 'Category 6', value: 'CATEGORY_6' },
  { label: 'Category 7', value: 'CATEGORY_7' },
  { label: 'Category 8', value: 'CATEGORY_8' },
  { label: 'Category 9', value: 'CATEGORY_9' },
  { label: 'Category 10', value: 'CATEGORY_10' },
  { label: 'Category 11', value: 'CATEGORY_11' },
  { label: 'Category 12', value: 'CATEGORY_12' },
  { label: 'Category 13', value: 'CATEGORY_13' },
  { label: 'Category 14', value: 'CATEGORY_14' },
  { label: 'Category 15', value: 'CATEGORY_15' },
  { label: 'Category 16', value: 'CATEGORY_16' },
  { label: 'Category 17', value: 'CATEGORY_17' },
  { label: 'Category 18', value: 'CATEGORY_18' },
  { label: 'Category 19', value: 'CATEGORY_19' },
  { label: 'Category 20', value: 'CATEGORY_20' },
  { label: 'Category 21', value: 'CATEGORY_21' },
  { label: 'Category 22', value: 'CATEGORY_22' },
  { label: 'Category 23', value: 'CATEGORY_23' },
  { label: 'Category 24', value: 'CATEGORY_24' },
  { label: 'Category 25', value: 'CATEGORY_25' },
  { label: 'Category 26', value: 'CATEGORY_26' },
  { label: 'Category 27', value: 'CATEGORY_27' },
  { label: 'Category 28', value: 'CATEGORY_28' },
  { label: 'Category 29', value: 'CATEGORY_29' },
  { label: 'Category 30', value: 'CATEGORY_30' },
  { label: 'Category 31', value: 'CATEGORY_31' },
  { label: 'Category 32', value: 'CATEGORY_32' },
  { label: 'Category 33', value: 'CATEGORY_33' },
  { label: 'Category 34', value: 'CATEGORY_34' },
  { label: 'Category 35', value: 'CATEGORY_35' },
  { label: 'Category 36', value: 'CATEGORY_36' },
  { label: 'Category 37', value: 'CATEGORY_37' },
  { label: 'Category 38', value: 'CATEGORY_38' },
  { label: 'Category 39', value: 'CATEGORY_39' },
  { label: 'Category 40', value: 'CATEGORY_40' },
  { label: 'Category 41', value: 'CATEGORY_41' },
  { label: 'Category 42', value: 'CATEGORY_42' },
  { label: 'Category 43', value: 'CATEGORY_43' },
  { label: 'Category 44', value: 'CATEGORY_44' },
  { label: 'Category 45', value: 'CATEGORY_45' },
  { label: 'Category 46', value: 'CATEGORY_46' },
  { label: 'Category 47', value: 'CATEGORY_47' },
  { label: 'Category 48', value: 'CATEGORY_48' },
  { label: 'Category 49', value: 'CATEGORY_49' },
  { label: 'Category 50', value: 'CATEGORY_50' },
  { label: 'Category 51', value: 'CATEGORY_51' },
  { label: 'Category 52', value: 'CATEGORY_52' },
  { label: 'Category 53', value: 'CATEGORY_53' },
  { label: 'Category 54', value: 'CATEGORY_54' },
  { label: 'Category 55', value: 'CATEGORY_55' },
  { label: 'Category 56', value: 'CATEGORY_56' },
  { label: 'Category 57', value: 'CATEGORY_57' },
  { label: 'Category 58', value: 'CATEGORY_58' },
  { label: 'Category 59', value: 'CATEGORY_59' },
  { label: 'Category 60', value: 'CATEGORY_60' },
];

export async function loadCategoryOptions(
  search = '',
  page = 1,
  size = 20,
): Promise<CategoryOption[]> {
  await delay(300);
  const q = search.toLowerCase();
  const filtered = q
    ? mockCategoryOptionsBase.filter((o) => o.label.toLowerCase().includes(q))
    : mockCategoryOptionsBase;
  return filtered.slice((page - 1) * size, page * size);
}

interface MockProductRecord {
  id: number;
  productName: string;
  productCode: string;
  category: string;
  status: 'active' | 'inactive';
  created_by: string | null;
  created_date: string;
}

const mockProductRecords: MockProductRecord[] = Array.from({ length: 14 }, (_, i) => ({
  id: i + 1,
  productName: `Product Name ${i + 1}`,
  productCode: `Product Code ${i + 1}`,
  category: `CATEGORY_${i + 1}`,
  status: i % 4 === 3 ? 'inactive' : 'active',
  created_by: 'System',
  created_date: `2024-0${(i % 9) + 1}-${10 + (i % 9)} 09:00`,
}));

function toListItem(record: MockProductRecord): ProductListItem {
  return {
    id: record.id,
    productName: record.productName,
    productCode: record.productCode,
    category: record.category,
    created_date: record.created_date,
    created_by: record.created_by,
    status: record.status,
  };
}

function toDetail(record: MockProductRecord): Product {
  return {
    id: String(record.id),
    productName: record.productName,
    productCode: record.productCode,
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
  const sortKey = key || 'productName';
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
        r.productName.toLowerCase().includes(q) ||
        r.productCode.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        String(r.id).includes(q),
    );
  }
  if (params?.status) items = items.filter((r) => r.status === params.status);
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
    ["Product Name","Product Code","Category","Status","Created Date"],
    items.map((r) => [r.productName, r.productCode, r.category, r.status, r.created_date]),
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
  const seenProductName = new Set(mockProductRecords.map((r) => String(r.productName).toLowerCase()));
  const seenProductCode = new Set(mockProductRecords.map((r) => String(r.productCode).toLowerCase()));
  const errors: BulkRowError[] = [];
  let successCount = 0;
  rows.forEach((row, index) => {
    const mapped: Record<string, unknown> = {};
    for (const header of expected) {
      const source = headers[headerIndex.get(header.trim().toLowerCase()) ?? -1] ?? '';
      mapped[header] = row[source] ?? '';
    }
    const { payload, errors: rowErrors } = validateBulkProductRow(mapped, (field, value) => {
      if (field === 'productName') return seenProductName.has(value.toLowerCase());
      if (field === 'productCode') return seenProductCode.has(value.toLowerCase());
      return false;
    });
    if (!payload) {
      for (const rowError of rowErrors) {
        errors.push({ row: index + 2, field: rowError.field, message: rowError.message });
      }
      return;
    }
    seenProductName.add(String(payload.productName).toLowerCase());
    seenProductCode.add(String(payload.productCode).toLowerCase());
    mockProductRecords.push({
      id: Math.max(...mockProductRecords.map((r) => r.id)) + 1,
      productName: payload.productName,
      productCode: payload.productCode,
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
  if (!record) throw new Error('Product not found');
  return toDetail(record);
}

function mockConflictError(field: string, message: string) {
  return {
    response: {
      data: {
        response_schema: {
          response_code: 'MOCK-PRODUCT-400',
          response_message: 'Parameter tidak valid',
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
  if (mockProductRecords.some((r) => r.productName === data.productName)) {
    throw mockConflictError('productName', 'Product Name already exists, please use another');
  }
  const record: MockProductRecord = {
    id: Math.max(...mockProductRecords.map((r) => r.id)) + 1,
    productName: data.productName,
    productCode: data.productCode,
    category: data.category,
    status: 'active',
    created_by: 'System',
    created_date: new Date().toISOString().slice(0, 16).replace('T', ' '),
  };
  mockProductRecords.push(record);
  return { message: 'Product created successfully.', data: toDetail(record) };
}

export async function mockUpdateProduct(
  id: string,
  data: CreateProductPayload,
): Promise<ProductMutationResult> {
  await delay(300);
  const record = mockProductRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error('Product not found');
  if (mockProductRecords.some((r) => String(r.id) !== id && r.productName === data.productName)) {
    throw mockConflictError('productName', 'Product Name already exists, please use another');
  }
  record.productName = data.productName;
  record.productCode = data.productCode;
  record.category = data.category;
  return { message: 'Product updated successfully.', data: toDetail(record) };
}

export async function mockDeleteProduct(id: string): Promise<{ message: string }> {
  await delay(300);
  const record = mockProductRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error('Product not found');
  record.status = 'inactive';
  return { message: 'Product deleted successfully' };
}

export async function mockRestoreProduct(id: string): Promise<ProductMutationResult> {
  await delay(300);
  const record = mockProductRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error('Product not found');
  record.status = 'active';
  return { message: 'Product restored successfully', data: toDetail(record) };
}
