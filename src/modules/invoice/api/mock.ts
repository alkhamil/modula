import { t } from 'i18next';
import '../../../shared/i18n';
import type {
  Invoice,
  InvoiceMutationResult,
  BulkRowError,
  BulkUploadResult,
  InvoiceListItem,
  CreateInvoicePayload,
  GetInvoicesParams,
  SellerOption,
  BuyerOption,
  DetailProductProductOption,
  DetailProductRow,
} from '../types';
import type { ApiList } from '../../../shared/types';
import { XLSX_MIME, buildWorkbook, readWorkbookRows } from '../../../shared/utils';
import {
  BULK_INVOICE_EXAMPLE,
  BULK_INVOICE_HEADERS,
  validateBulkInvoiceRow,
} from '../validation/invoiceBulkValidation';

export const USE_MOCK = {
  list: true,
  detail: true,
  create: true,
  update: true,
  delete: true,
  restore: true,
  sellerLoadOptions: true,
  buyerLoadOptions: true,
  productLoadOptions: true,
  sellerLabel: true,
  buyerLabel: true,
  productLabel: true,
  export: true,
  bulkUpload: true,
  bulkTemplate: true,
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const mockSellerOptionsBase: SellerOption[] = [
  { label: 'Seller 1', value: 'SELLER_1' },
  { label: 'Seller 2', value: 'SELLER_2' },
  { label: 'Seller 3', value: 'SELLER_3' },
  { label: 'Seller 4', value: 'SELLER_4' },
  { label: 'Seller 5', value: 'SELLER_5' },
  { label: 'Seller 6', value: 'SELLER_6' },
  { label: 'Seller 7', value: 'SELLER_7' },
  { label: 'Seller 8', value: 'SELLER_8' },
  { label: 'Seller 9', value: 'SELLER_9' },
  { label: 'Seller 10', value: 'SELLER_10' },
  { label: 'Seller 11', value: 'SELLER_11' },
  { label: 'Seller 12', value: 'SELLER_12' },
  { label: 'Seller 13', value: 'SELLER_13' },
  { label: 'Seller 14', value: 'SELLER_14' },
  { label: 'Seller 15', value: 'SELLER_15' },
  { label: 'Seller 16', value: 'SELLER_16' },
  { label: 'Seller 17', value: 'SELLER_17' },
  { label: 'Seller 18', value: 'SELLER_18' },
  { label: 'Seller 19', value: 'SELLER_19' },
  { label: 'Seller 20', value: 'SELLER_20' },
  { label: 'Seller 21', value: 'SELLER_21' },
  { label: 'Seller 22', value: 'SELLER_22' },
  { label: 'Seller 23', value: 'SELLER_23' },
  { label: 'Seller 24', value: 'SELLER_24' },
  { label: 'Seller 25', value: 'SELLER_25' },
  { label: 'Seller 26', value: 'SELLER_26' },
  { label: 'Seller 27', value: 'SELLER_27' },
  { label: 'Seller 28', value: 'SELLER_28' },
  { label: 'Seller 29', value: 'SELLER_29' },
  { label: 'Seller 30', value: 'SELLER_30' },
  { label: 'Seller 31', value: 'SELLER_31' },
  { label: 'Seller 32', value: 'SELLER_32' },
  { label: 'Seller 33', value: 'SELLER_33' },
  { label: 'Seller 34', value: 'SELLER_34' },
  { label: 'Seller 35', value: 'SELLER_35' },
  { label: 'Seller 36', value: 'SELLER_36' },
  { label: 'Seller 37', value: 'SELLER_37' },
  { label: 'Seller 38', value: 'SELLER_38' },
  { label: 'Seller 39', value: 'SELLER_39' },
  { label: 'Seller 40', value: 'SELLER_40' },
  { label: 'Seller 41', value: 'SELLER_41' },
  { label: 'Seller 42', value: 'SELLER_42' },
  { label: 'Seller 43', value: 'SELLER_43' },
  { label: 'Seller 44', value: 'SELLER_44' },
  { label: 'Seller 45', value: 'SELLER_45' },
  { label: 'Seller 46', value: 'SELLER_46' },
  { label: 'Seller 47', value: 'SELLER_47' },
  { label: 'Seller 48', value: 'SELLER_48' },
  { label: 'Seller 49', value: 'SELLER_49' },
  { label: 'Seller 50', value: 'SELLER_50' },
  { label: 'Seller 51', value: 'SELLER_51' },
  { label: 'Seller 52', value: 'SELLER_52' },
  { label: 'Seller 53', value: 'SELLER_53' },
  { label: 'Seller 54', value: 'SELLER_54' },
  { label: 'Seller 55', value: 'SELLER_55' },
  { label: 'Seller 56', value: 'SELLER_56' },
  { label: 'Seller 57', value: 'SELLER_57' },
  { label: 'Seller 58', value: 'SELLER_58' },
  { label: 'Seller 59', value: 'SELLER_59' },
  { label: 'Seller 60', value: 'SELLER_60' },
];

export async function loadSellerOptions(
  search = '',
  page = 1,
  size = 20,
): Promise<SellerOption[]> {
  await delay(300);
  const q = search.toLowerCase();
  const filtered = q
    ? mockSellerOptionsBase.filter((o) => o.label.toLowerCase().includes(q))
    : mockSellerOptionsBase;
  return filtered.slice((page - 1) * size, page * size);
}

/** Label sinkron dari value untuk kolom tabel/detail; tak ketemu → value as-is. */
export function getSellerOptionLabel(value: string): string {
  return mockSellerOptionsBase.find((o) => o.value === value)?.label ?? value;
}

const mockBuyerOptionsBase: BuyerOption[] = [
  { label: 'Buyer 1', value: 'BUYER_1' },
  { label: 'Buyer 2', value: 'BUYER_2' },
  { label: 'Buyer 3', value: 'BUYER_3' },
  { label: 'Buyer 4', value: 'BUYER_4' },
  { label: 'Buyer 5', value: 'BUYER_5' },
  { label: 'Buyer 6', value: 'BUYER_6' },
  { label: 'Buyer 7', value: 'BUYER_7' },
  { label: 'Buyer 8', value: 'BUYER_8' },
  { label: 'Buyer 9', value: 'BUYER_9' },
  { label: 'Buyer 10', value: 'BUYER_10' },
  { label: 'Buyer 11', value: 'BUYER_11' },
  { label: 'Buyer 12', value: 'BUYER_12' },
  { label: 'Buyer 13', value: 'BUYER_13' },
  { label: 'Buyer 14', value: 'BUYER_14' },
  { label: 'Buyer 15', value: 'BUYER_15' },
  { label: 'Buyer 16', value: 'BUYER_16' },
  { label: 'Buyer 17', value: 'BUYER_17' },
  { label: 'Buyer 18', value: 'BUYER_18' },
  { label: 'Buyer 19', value: 'BUYER_19' },
  { label: 'Buyer 20', value: 'BUYER_20' },
  { label: 'Buyer 21', value: 'BUYER_21' },
  { label: 'Buyer 22', value: 'BUYER_22' },
  { label: 'Buyer 23', value: 'BUYER_23' },
  { label: 'Buyer 24', value: 'BUYER_24' },
  { label: 'Buyer 25', value: 'BUYER_25' },
  { label: 'Buyer 26', value: 'BUYER_26' },
  { label: 'Buyer 27', value: 'BUYER_27' },
  { label: 'Buyer 28', value: 'BUYER_28' },
  { label: 'Buyer 29', value: 'BUYER_29' },
  { label: 'Buyer 30', value: 'BUYER_30' },
  { label: 'Buyer 31', value: 'BUYER_31' },
  { label: 'Buyer 32', value: 'BUYER_32' },
  { label: 'Buyer 33', value: 'BUYER_33' },
  { label: 'Buyer 34', value: 'BUYER_34' },
  { label: 'Buyer 35', value: 'BUYER_35' },
  { label: 'Buyer 36', value: 'BUYER_36' },
  { label: 'Buyer 37', value: 'BUYER_37' },
  { label: 'Buyer 38', value: 'BUYER_38' },
  { label: 'Buyer 39', value: 'BUYER_39' },
  { label: 'Buyer 40', value: 'BUYER_40' },
  { label: 'Buyer 41', value: 'BUYER_41' },
  { label: 'Buyer 42', value: 'BUYER_42' },
  { label: 'Buyer 43', value: 'BUYER_43' },
  { label: 'Buyer 44', value: 'BUYER_44' },
  { label: 'Buyer 45', value: 'BUYER_45' },
  { label: 'Buyer 46', value: 'BUYER_46' },
  { label: 'Buyer 47', value: 'BUYER_47' },
  { label: 'Buyer 48', value: 'BUYER_48' },
  { label: 'Buyer 49', value: 'BUYER_49' },
  { label: 'Buyer 50', value: 'BUYER_50' },
  { label: 'Buyer 51', value: 'BUYER_51' },
  { label: 'Buyer 52', value: 'BUYER_52' },
  { label: 'Buyer 53', value: 'BUYER_53' },
  { label: 'Buyer 54', value: 'BUYER_54' },
  { label: 'Buyer 55', value: 'BUYER_55' },
  { label: 'Buyer 56', value: 'BUYER_56' },
  { label: 'Buyer 57', value: 'BUYER_57' },
  { label: 'Buyer 58', value: 'BUYER_58' },
  { label: 'Buyer 59', value: 'BUYER_59' },
  { label: 'Buyer 60', value: 'BUYER_60' },
];

export async function loadBuyerOptions(
  search = '',
  page = 1,
  size = 20,
): Promise<BuyerOption[]> {
  await delay(300);
  const q = search.toLowerCase();
  const filtered = q
    ? mockBuyerOptionsBase.filter((o) => o.label.toLowerCase().includes(q))
    : mockBuyerOptionsBase;
  return filtered.slice((page - 1) * size, page * size);
}

/** Label sinkron dari value untuk kolom tabel/detail; tak ketemu → value as-is. */
export function getBuyerOptionLabel(value: string): string {
  return mockBuyerOptionsBase.find((o) => o.value === value)?.label ?? value;
}

const mockDetailProductProductOptionsBase: DetailProductProductOption[] = [
  { label: 'Product 1', value: 'PRODUCT_1' },
  { label: 'Product 2', value: 'PRODUCT_2' },
  { label: 'Product 3', value: 'PRODUCT_3' },
  { label: 'Product 4', value: 'PRODUCT_4' },
  { label: 'Product 5', value: 'PRODUCT_5' },
  { label: 'Product 6', value: 'PRODUCT_6' },
  { label: 'Product 7', value: 'PRODUCT_7' },
  { label: 'Product 8', value: 'PRODUCT_8' },
  { label: 'Product 9', value: 'PRODUCT_9' },
  { label: 'Product 10', value: 'PRODUCT_10' },
  { label: 'Product 11', value: 'PRODUCT_11' },
  { label: 'Product 12', value: 'PRODUCT_12' },
  { label: 'Product 13', value: 'PRODUCT_13' },
  { label: 'Product 14', value: 'PRODUCT_14' },
  { label: 'Product 15', value: 'PRODUCT_15' },
  { label: 'Product 16', value: 'PRODUCT_16' },
  { label: 'Product 17', value: 'PRODUCT_17' },
  { label: 'Product 18', value: 'PRODUCT_18' },
  { label: 'Product 19', value: 'PRODUCT_19' },
  { label: 'Product 20', value: 'PRODUCT_20' },
  { label: 'Product 21', value: 'PRODUCT_21' },
  { label: 'Product 22', value: 'PRODUCT_22' },
  { label: 'Product 23', value: 'PRODUCT_23' },
  { label: 'Product 24', value: 'PRODUCT_24' },
  { label: 'Product 25', value: 'PRODUCT_25' },
  { label: 'Product 26', value: 'PRODUCT_26' },
  { label: 'Product 27', value: 'PRODUCT_27' },
  { label: 'Product 28', value: 'PRODUCT_28' },
  { label: 'Product 29', value: 'PRODUCT_29' },
  { label: 'Product 30', value: 'PRODUCT_30' },
  { label: 'Product 31', value: 'PRODUCT_31' },
  { label: 'Product 32', value: 'PRODUCT_32' },
  { label: 'Product 33', value: 'PRODUCT_33' },
  { label: 'Product 34', value: 'PRODUCT_34' },
  { label: 'Product 35', value: 'PRODUCT_35' },
  { label: 'Product 36', value: 'PRODUCT_36' },
  { label: 'Product 37', value: 'PRODUCT_37' },
  { label: 'Product 38', value: 'PRODUCT_38' },
  { label: 'Product 39', value: 'PRODUCT_39' },
  { label: 'Product 40', value: 'PRODUCT_40' },
  { label: 'Product 41', value: 'PRODUCT_41' },
  { label: 'Product 42', value: 'PRODUCT_42' },
  { label: 'Product 43', value: 'PRODUCT_43' },
  { label: 'Product 44', value: 'PRODUCT_44' },
  { label: 'Product 45', value: 'PRODUCT_45' },
  { label: 'Product 46', value: 'PRODUCT_46' },
  { label: 'Product 47', value: 'PRODUCT_47' },
  { label: 'Product 48', value: 'PRODUCT_48' },
  { label: 'Product 49', value: 'PRODUCT_49' },
  { label: 'Product 50', value: 'PRODUCT_50' },
  { label: 'Product 51', value: 'PRODUCT_51' },
  { label: 'Product 52', value: 'PRODUCT_52' },
  { label: 'Product 53', value: 'PRODUCT_53' },
  { label: 'Product 54', value: 'PRODUCT_54' },
  { label: 'Product 55', value: 'PRODUCT_55' },
  { label: 'Product 56', value: 'PRODUCT_56' },
  { label: 'Product 57', value: 'PRODUCT_57' },
  { label: 'Product 58', value: 'PRODUCT_58' },
  { label: 'Product 59', value: 'PRODUCT_59' },
  { label: 'Product 60', value: 'PRODUCT_60' },
];

export async function loadDetailProductProductOptions(
  search = '',
  page = 1,
  size = 20,
): Promise<DetailProductProductOption[]> {
  await delay(300);
  const q = search.toLowerCase();
  const filtered = q
    ? mockDetailProductProductOptionsBase.filter((o) => o.label.toLowerCase().includes(q))
    : mockDetailProductProductOptionsBase;
  return filtered.slice((page - 1) * size, page * size);
}

/** Label sinkron dari value untuk kolom tabel/detail; tak ketemu → value as-is. */
export function getDetailProductProductOptionLabel(value: string): string {
  return mockDetailProductProductOptionsBase.find((o) => o.value === value)?.label ?? value;
}

interface MockInvoiceRecord {
  id: number;
  invoiceNumber: string;
  dateOfIssue: string;
  dueDate: string;
  seller: string;
  buyer: string;
  detailProduct: DetailProductRow[];
  status: 'active' | 'inactive';
  created_by: string | null;
  created_date: string;
}

const mockInvoiceRecords: MockInvoiceRecord[] = Array.from({ length: 14 }, (_, i) => ({
  id: i + 1,
  invoiceNumber: `Invoice Number ${i + 1}`,
  dateOfIssue: `2024-0${(i % 9) + 1}-${10 + (i % 9)}`,
  dueDate: `2024-0${(i % 9) + 1}-${10 + (i % 9)}`,
  seller: `SELLER_${i + 1}`,
  buyer: `BUYER_${i + 1}`,
  detailProduct: [{ product: `PRODUCT_${(i + 0) + 1}`, quantity: 100000 * ((i + 0) + 1) }, { product: `PRODUCT_${(i + 1) + 1}`, quantity: 100000 * ((i + 1) + 1) }],
  status: i % 4 === 3 ? 'inactive' : 'active',
  created_by: 'System',
  created_date: `2024-0${(i % 9) + 1}-${10 + (i % 9)} 09:00`,
}));

function toListItem(record: MockInvoiceRecord): InvoiceListItem {
  return {
    id: record.id,
    invoiceNumber: record.invoiceNumber,
    dateOfIssue: record.dateOfIssue,
    dueDate: record.dueDate,
    seller: record.seller,
    buyer: record.buyer,
    detailProduct: record.detailProduct,
    created_date: record.created_date,
    created_by: record.created_by,
    status: record.status,
  };
}

function toDetail(record: MockInvoiceRecord): Invoice {
  return {
    id: String(record.id),
    invoiceNumber: record.invoiceNumber,
    dateOfIssue: record.dateOfIssue,
    dueDate: record.dueDate,
    seller: record.seller,
    buyer: record.buyer,
    detailProduct: record.detailProduct,
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

function sortInvoices(items: InvoiceListItem[], key: string | undefined, dir: string | undefined) {
  const sortKey = key || 'invoiceNumber';
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
function filterInvoicesRecords(params?: GetInvoicesParams): InvoiceListItem[] {
  let items = mockInvoiceRecords.map(toListItem);
  if (params?.search) {
    const q = params.search.toLowerCase();
    items = items.filter(
      (r) =>
        r.invoiceNumber.toLowerCase().includes(q) ||
        r.dateOfIssue.toLowerCase().includes(q) ||
        r.dueDate.toLowerCase().includes(q) ||
        r.seller.toLowerCase().includes(q) ||
        r.buyer.toLowerCase().includes(q) ||
        String(r.id).includes(q),
    );
  }
  if (params?.status) items = items.filter((r) => r.status === params.status);
  if (params?.dateOfIssue) {
    const [startDateOfIssue, endDateOfIssue] = params.dateOfIssue.split(',');
    if (startDateOfIssue && endDateOfIssue) items = items.filter((r) => r.dateOfIssue >= startDateOfIssue && r.dateOfIssue <= endDateOfIssue);
  }
  if (params?.dueDate) {
    const [startDueDate, endDueDate] = params.dueDate.split(',');
    if (startDueDate && endDueDate) items = items.filter((r) => r.dueDate >= startDueDate && r.dueDate <= endDueDate);
  }
  if (params?.seller) items = items.filter((r) => r.seller === params.seller);
  if (params?.buyer) items = items.filter((r) => r.buyer === params.buyer);
  return sortInvoices(items, params?.order, params?.sort);
}

export async function mockGetInvoices(params?: GetInvoicesParams): Promise<ApiList<InvoiceListItem>> {
  await delay(300);
  const items = filterInvoicesRecords(params);
  const result = paginate(items, (params?.page ?? 0) + 1, params?.size ?? 10);
  return { list: result };
}

export async function mockExportInvoices(params?: GetInvoicesParams): Promise<Blob> {
  await delay(300);
  const items = filterInvoicesRecords({ ...params, page: undefined, size: undefined });
  const data = await buildWorkbook(
    ["Invoice Number","Date Of Issue","Due Date","Seller","Buyer","Detail Product","Status","Created Date"],
    items.map((r) => [r.invoiceNumber, r.dateOfIssue, r.dueDate, r.seller, r.buyer, (((r.detailProduct ?? []).length > 0 ? (r.detailProduct ?? []).length + ' baris' : '')), r.status, r.created_date]),
  );
  return new Blob([data], { type: XLSX_MIME });
}

export async function mockDownloadInvoiceTemplate(): Promise<Blob> {
  const data = await buildWorkbook(BULK_INVOICE_HEADERS, [BULK_INVOICE_EXAMPLE]);
  return new Blob([data], { type: XLSX_MIME });
}

export async function mockBulkUploadInvoices(file: File | ArrayBuffer): Promise<BulkUploadResult> {
  await delay(500);
  const buffer = file instanceof ArrayBuffer ? file : await file.arrayBuffer();
  const { headers, rows } = await readWorkbookRows(buffer);
  const headerIndex = new Map(headers.map((h, i) => [h.trim().toLowerCase(), i]));
  const expected = BULK_INVOICE_HEADERS;
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
  const seenInvoiceNumber = new Set(mockInvoiceRecords.map((r) => String(r.invoiceNumber).toLowerCase()));
  const errors: BulkRowError[] = [];
  let successCount = 0;
  rows.forEach((row, index) => {
    const mapped: Record<string, unknown> = {};
    for (const header of expected) {
      const source = headers[headerIndex.get(header.trim().toLowerCase()) ?? -1] ?? '';
      mapped[header] = row[source] ?? '';
    }
    const { payload, errors: rowErrors } = validateBulkInvoiceRow(mapped, (field, value) => {
      if (field === 'invoiceNumber') return seenInvoiceNumber.has(value.toLowerCase());
      return false;
    });
    if (!payload) {
      for (const rowError of rowErrors) {
        errors.push({ row: index + 2, field: rowError.field, message: rowError.message });
      }
      return;
    }
    seenInvoiceNumber.add(String(payload.invoiceNumber).toLowerCase());
    mockInvoiceRecords.push({
      id: Math.max(...mockInvoiceRecords.map((r) => r.id)) + 1,
      invoiceNumber: payload.invoiceNumber,
      dateOfIssue: payload.dateOfIssue,
      dueDate: payload.dueDate,
      seller: payload.seller,
      buyer: payload.buyer,
      detailProduct: payload.detailProduct,
      status: 'active',
      created_by: 'Bulk Upload',
      created_date: new Date().toISOString().slice(0, 16).replace('T', ' '),
    });
    successCount += 1;
  });
  return { totalRows: rows.length, successCount, failedCount: rows.length - successCount, errors };
}


export async function mockGetInvoiceById(id: string): Promise<Invoice> {
  await delay(300);
  const record = mockInvoiceRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error(t('invoice.toast.notFound'));
  return toDetail(record);
}

function mockConflictError(field: string, message: string) {
  return {
    response: {
      data: {
        response_schema: {
          response_code: 'MOCK-INVOICE-400',
          response_message: 'Invalid parameters',
        },
        response_output: {
          errors: [{ field, message }],
        },
      },
    },
  };
}

export async function mockCreateInvoice(data: CreateInvoicePayload): Promise<InvoiceMutationResult> {
  await delay(300);
  if (mockInvoiceRecords.some((r) => r.invoiceNumber === data.invoiceNumber)) {
    throw mockConflictError(
      'invoiceNumber',
      t('validation.unique', { label: t('invoice.fields.invoiceNumber.label') }),
    );
  }
  const record: MockInvoiceRecord = {
    id: Math.max(...mockInvoiceRecords.map((r) => r.id)) + 1,
    invoiceNumber: data.invoiceNumber,
    dateOfIssue: data.dateOfIssue,
    dueDate: data.dueDate,
    seller: data.seller,
    buyer: data.buyer,
    detailProduct: data.detailProduct,
    status: 'active',
    created_by: 'System',
    created_date: new Date().toISOString().slice(0, 16).replace('T', ' '),
  };
  mockInvoiceRecords.push(record);
  return { message: t('invoice.toast.created'), data: toDetail(record) };
}

export async function mockUpdateInvoice(
  id: string,
  data: CreateInvoicePayload,
): Promise<InvoiceMutationResult> {
  await delay(300);
  const record = mockInvoiceRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error(t('invoice.toast.notFound'));
  if (mockInvoiceRecords.some((r) => String(r.id) !== id && r.invoiceNumber === data.invoiceNumber)) {
    throw mockConflictError(
      'invoiceNumber',
      t('validation.unique', { label: t('invoice.fields.invoiceNumber.label') }),
    );
  }
  record.invoiceNumber = data.invoiceNumber;
  record.dateOfIssue = data.dateOfIssue;
  record.dueDate = data.dueDate;
  record.seller = data.seller;
  record.buyer = data.buyer;
  record.detailProduct = data.detailProduct;
  return { message: t('invoice.toast.updated'), data: toDetail(record) };
}

export async function mockDeleteInvoice(id: string): Promise<{ message: string }> {
  await delay(300);
  const record = mockInvoiceRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error(t('invoice.toast.notFound'));
  record.status = 'inactive';
  return { message: t('invoice.toast.deleted') };
}

export async function mockRestoreInvoice(id: string): Promise<InvoiceMutationResult> {
  await delay(300);
  const record = mockInvoiceRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error(t('invoice.toast.notFound'));
  record.status = 'active';
  return { message: t('invoice.toast.restored'), data: toDetail(record) };
}
