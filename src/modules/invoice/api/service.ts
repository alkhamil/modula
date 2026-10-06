import api from '../../../shared/lib/api';
import type {
  Invoice,
  InvoiceMutationResult,
  BulkUploadResult,
  CreateInvoicePayload,
  GetInvoicesParams,
  InvoiceListItem,
  SellerOption,
  BuyerOption,
  DetailProductProductOption,
} from '../types';
import type { ApiDetail, ApiList, ApiResponse } from '../../../shared/types';

export async function getInvoices(params?: GetInvoicesParams): Promise<ApiList<InvoiceListItem>> {
  const res = await api.get<ApiResponse<ApiList<InvoiceListItem>>>('/api/v1/invoices', { params });
  return res.data.response_output ?? { list: { pagination: null, content: [] } };
}

export async function getInvoiceById(id: string): Promise<Invoice> {
  const res = await api.get<ApiResponse<ApiDetail<Invoice>>>(`/api/v1/invoices/${id}`);
  return res.data.response_output!.detail;
}

export async function createInvoice(data: CreateInvoicePayload): Promise<InvoiceMutationResult> {
  const res = await api.post<ApiResponse<ApiDetail<Invoice>>>('/api/v1/invoices', data);
  return {
    message: res.data.response_schema.response_message,
    data: res.data.response_output!.detail,
  };
}

export async function updateInvoice(
  id: string,
  data: CreateInvoicePayload,
): Promise<InvoiceMutationResult> {
  const res = await api.put<ApiResponse<ApiDetail<Invoice>>>(`/api/v1/invoices/${id}`, data);
  return {
    message: res.data.response_schema.response_message,
    data: res.data.response_output!.detail,
  };
}

export async function deleteInvoice(id: string): Promise<{ message: string }> {
  const res = await api.delete<ApiResponse<null>>(`/api/v1/invoices/${id}`);
  return { message: res.data.response_schema.response_message };
}

export async function restoreInvoice(id: string): Promise<InvoiceMutationResult> {
  const res = await api.patch<ApiResponse<ApiDetail<Invoice>>>(`/api/v1/invoices/${id}/restore`);
  return {
    message: res.data.response_schema.response_message,
    data: res.data.response_output!.detail,
  };
}

export async function loadSellerOptions(
  search = '',
  page = 1,
  size = 20,
): Promise<SellerOption[]> {
  const res = await api.get<ApiResponse<ApiList<SellerOption>>>('/api/v1/invoices/sellers', {
    params: { search, page, size },
  });
  return res.data.response_output?.list.content ?? [];
}
/** Label sinkron mock-only; service mengembalikan value (resolve via endpoint bila perlu). */
export function getSellerOptionLabel(value: string): string {
  return value;
}

export async function loadBuyerOptions(
  search = '',
  page = 1,
  size = 20,
): Promise<BuyerOption[]> {
  const res = await api.get<ApiResponse<ApiList<BuyerOption>>>('/api/v1/invoices/buyers', {
    params: { search, page, size },
  });
  return res.data.response_output?.list.content ?? [];
}
/** Label sinkron mock-only; service mengembalikan value (resolve via endpoint bila perlu). */
export function getBuyerOptionLabel(value: string): string {
  return value;
}

export async function loadDetailProductProductOptions(
  search = '',
  page = 1,
  size = 20,
): Promise<DetailProductProductOption[]> {
  const res = await api.get<ApiResponse<ApiList<DetailProductProductOption>>>('/api/v1/invoices/products', {
    params: { search, page, size },
  });
  return res.data.response_output?.list.content ?? [];
}
/** Label sinkron mock-only; service mengembalikan value (resolve via endpoint bila perlu). */
export function getDetailProductProductOptionLabel(value: string): string {
  return value;
}

export async function exportInvoices(params?: GetInvoicesParams): Promise<Blob> {
  const res = await api.get('/api/v1/invoices/export', { params, responseType: 'blob' });
  return res.data as Blob;
}

export async function bulkUploadInvoices(file: File): Promise<BulkUploadResult> {
  const form = new FormData();
  form.append('file', file);
  const res = await api.post<ApiResponse<BulkUploadResult>>('/api/v1/invoices/bulk-upload', form);
  return res.data.response_output!;
}

export async function downloadInvoiceTemplate(): Promise<Blob> {
  const res = await api.get('/api/v1/invoices/bulk-template', { responseType: 'blob' });
  return res.data as Blob;
}
