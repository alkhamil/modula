import { t } from 'i18next';
import '../../../../shared/i18n';
import type {
  Price,
  PriceMutationResult,
  BulkRowError,
  BulkUploadResult,
  PriceListItem,
  CreatePricePayload,
  GetPricesParams,
  ProductOption,
} from '../types';
import type { ApiList } from '../../../../shared/types';
import { XLSX_MIME, buildWorkbook, readWorkbookRows } from '../../../../shared/utils';
import {
  BULK_PRICE_EXAMPLE,
  BULK_PRICE_HEADERS,
  validateBulkPriceRow,
} from '../validation/priceBulkValidation';
import { mockGetProducts } from '../../product/api/mock';

export const USE_MOCK = {
  list: true,
  detail: true,
  create: true,
  update: true,
  delete: true,
  restore: true,
  productLoadOptions: true,
  export: true,
  bulkUpload: true,
  bulkTemplate: true,
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function loadProductOptions(
  search = '',
  page = 1,
  size = 20,
): Promise<ProductOption[]> {
  const res = await mockGetProducts({ search: search || undefined, page: page - 1, size });
  return res.list.content.map((r) => {
    const record = r as unknown as Record<string, unknown>;
    return {
      label: String(record['name'] ?? ''),
      value: String(record['id'] ?? ''),
    };
  });
}

interface MockPriceRecord {
  id: number;
  product: string;
  price: number;
  status: 'active' | 'inactive';
  created_by: string | null;
  created_date: string;
}

// Mock data sengaja kosong: isi lewat Create / Bulk Upload.
const mockPriceRecords: MockPriceRecord[] = [];

function toListItem(record: MockPriceRecord): PriceListItem {
  return {
    id: record.id,
    product: record.product,
    price: record.price,
    created_date: record.created_date,
    created_by: record.created_by,
    status: record.status,
  };
}

function toDetail(record: MockPriceRecord): Price {
  return {
    id: String(record.id),
    product: record.product,
    price: record.price,
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

function sortPrices(items: PriceListItem[], key: string | undefined, dir: string | undefined) {
  const sortKey = key || 'product';
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
function filterPricesRecords(params?: GetPricesParams): PriceListItem[] {
  let items = mockPriceRecords.map(toListItem);
  if (params?.search) {
    const q = params.search.toLowerCase();
    items = items.filter(
      (r) =>
        r.product.toLowerCase().includes(q) ||
        String(r.id).includes(q),
    );
  }
  if (params?.status) items = items.filter((r) => r.status === params.status);
  if (params?.product) items = items.filter((r) => r.product === params.product);
  if (params?.price !== undefined && params.price !== '') items = items.filter((r) => Number(r.price) === Number(params.price));
  return sortPrices(items, params?.order, params?.sort);
}

export async function mockGetPrices(params?: GetPricesParams): Promise<ApiList<PriceListItem>> {
  await delay(300);
  const items = filterPricesRecords(params);
  const result = paginate(items, (params?.page ?? 0) + 1, params?.size ?? 10);
  return { list: result };
}

export async function mockExportPrices(params?: GetPricesParams): Promise<Blob> {
  await delay(300);
  const items = filterPricesRecords({ ...params, page: undefined, size: undefined });
  const data = await buildWorkbook(
    ["Product","Price","Status","Created Date"],
    items.map((r) => [r.product, r.price, r.status, r.created_date]),
  );
  return new Blob([data], { type: XLSX_MIME });
}

export async function mockDownloadPriceTemplate(): Promise<Blob> {
  const data = await buildWorkbook(BULK_PRICE_HEADERS, [BULK_PRICE_EXAMPLE]);
  return new Blob([data], { type: XLSX_MIME });
}

export async function mockBulkUploadPrices(file: File | ArrayBuffer): Promise<BulkUploadResult> {
  await delay(500);
  const buffer = file instanceof ArrayBuffer ? file : await file.arrayBuffer();
  const { headers, rows } = await readWorkbookRows(buffer);
  const headerIndex = new Map(headers.map((h, i) => [h.trim().toLowerCase(), i]));
  const expected = BULK_PRICE_HEADERS;
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
    const { payload, errors: rowErrors } = validateBulkPriceRow(mapped, () => {

      return false;
    });
    if (!payload) {
      for (const rowError of rowErrors) {
        errors.push({ row: index + 2, field: rowError.field, message: rowError.message });
      }
      return;
    }

    mockPriceRecords.push({
      id: Math.max(...mockPriceRecords.map((r) => r.id)) + 1,
      product: payload.product,
      price: payload.price,
      status: 'active',
      created_by: 'Bulk Upload',
      created_date: new Date().toISOString().slice(0, 16).replace('T', ' '),
    });
    successCount += 1;
  });
  return { totalRows: rows.length, successCount, failedCount: rows.length - successCount, errors };
}


export async function mockGetPriceById(id: string): Promise<Price> {
  await delay(300);
  const record = mockPriceRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error(t('price.toast.notFound'));
  return toDetail(record);
}

export async function mockCreatePrice(data: CreatePricePayload): Promise<PriceMutationResult> {
  await delay(300);
  const record: MockPriceRecord = {
    id: Math.max(...mockPriceRecords.map((r) => r.id)) + 1,
    product: data.product,
    price: data.price,
    status: 'active',
    created_by: 'System',
    created_date: new Date().toISOString().slice(0, 16).replace('T', ' '),
  };
  mockPriceRecords.push(record);
  return { message: t('price.toast.created'), data: toDetail(record) };
}

export async function mockUpdatePrice(
  id: string,
  data: CreatePricePayload,
): Promise<PriceMutationResult> {
  await delay(300);
  const record = mockPriceRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error(t('price.toast.notFound'));
  record.product = data.product;
  record.price = data.price;
  return { message: t('price.toast.updated'), data: toDetail(record) };
}

export async function mockDeletePrice(id: string): Promise<{ message: string }> {
  await delay(300);
  const record = mockPriceRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error(t('price.toast.notFound'));
  record.status = 'inactive';
  return { message: t('price.toast.deleted') };
}

export async function mockRestorePrice(id: string): Promise<PriceMutationResult> {
  await delay(300);
  const record = mockPriceRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error(t('price.toast.notFound'));
  record.status = 'active';
  return { message: t('price.toast.restored'), data: toDetail(record) };
}
