import api from '../../../../shared/lib/api';
import type {
  Price,
  PriceMutationResult,
  BulkUploadResult,
  CreatePricePayload,
  GetPricesParams,
  PriceListItem,
  ProductOption,
} from '../types';
import type { ApiDetail, ApiList, ApiResponse } from '../../../../shared/types';

export async function getPrices(params?: GetPricesParams): Promise<ApiList<PriceListItem>> {
  const res = await api.get<ApiResponse<ApiList<PriceListItem>>>('/api/v1/prices', { params });
  return res.data.response_output ?? { list: { pagination: null, content: [] } };
}

export async function getPriceById(id: string): Promise<Price> {
  const res = await api.get<ApiResponse<ApiDetail<Price>>>(`/api/v1/prices/${id}`);
  return res.data.response_output!.detail;
}

export async function createPrice(data: CreatePricePayload): Promise<PriceMutationResult> {
  const res = await api.post<ApiResponse<ApiDetail<Price>>>('/api/v1/prices', data);
  return {
    message: res.data.response_schema.response_message,
    data: res.data.response_output!.detail,
  };
}

export async function updatePrice(
  id: string,
  data: CreatePricePayload,
): Promise<PriceMutationResult> {
  const res = await api.put<ApiResponse<ApiDetail<Price>>>(`/api/v1/prices/${id}`, data);
  return {
    message: res.data.response_schema.response_message,
    data: res.data.response_output!.detail,
  };
}

export async function deletePrice(id: string): Promise<{ message: string }> {
  const res = await api.delete<ApiResponse<null>>(`/api/v1/prices/${id}`);
  return { message: res.data.response_schema.response_message };
}

export async function restorePrice(id: string): Promise<PriceMutationResult> {
  const res = await api.patch<ApiResponse<ApiDetail<Price>>>(`/api/v1/prices/${id}/restore`);
  return {
    message: res.data.response_schema.response_message,
    data: res.data.response_output!.detail,
  };
}

export async function loadProductOptions(
  search = '',
  page = 1,
  size = 20,
): Promise<ProductOption[]> {
  const res = await api.get<ApiResponse<ApiList<Record<string, unknown>>>>('/api/v1/products', {
    params: { search, page, size },
  });
  const content = res.data.response_output?.list.content ?? [];
  return content.map((r) => ({
    label: String(r['name'] ?? ''),
    value: String(r['id'] ?? ''),
  }));
}

export async function exportPrices(params?: GetPricesParams): Promise<Blob> {
  const res = await api.get('/api/v1/prices/export', { params, responseType: 'blob' });
  return res.data as Blob;
}

export async function bulkUploadPrices(file: File): Promise<BulkUploadResult> {
  const form = new FormData();
  form.append('file', file);
  const res = await api.post<ApiResponse<BulkUploadResult>>('/api/v1/prices/bulk-upload', form);
  return res.data.response_output!;
}

export async function downloadPriceTemplate(): Promise<Blob> {
  const res = await api.get('/api/v1/prices/bulk-template', { responseType: 'blob' });
  return res.data as Blob;
}
