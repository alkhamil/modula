import api from '../../../../shared/lib/api';
import type {
  ProductColor,
  ProductColorMutationResult,
  BulkUploadResult,
  CreateProductColorPayload,
  GetProductColorsParams,
  ProductColorListItem,
} from '../types';
import type { ApiDetail, ApiList, ApiResponse } from '../../../../shared/types';

export async function getProductColors(params?: GetProductColorsParams): Promise<ApiList<ProductColorListItem>> {
  const res = await api.get<ApiResponse<ApiList<ProductColorListItem>>>('/api/v1/product-colors', { params });
  return res.data.response_output ?? { list: { pagination: null, content: [] } };
}

export async function getProductColorById(id: string): Promise<ProductColor> {
  const res = await api.get<ApiResponse<ApiDetail<ProductColor>>>(`/api/v1/product-colors/${id}`);
  return res.data.response_output!.detail;
}

export async function createProductColor(data: CreateProductColorPayload): Promise<ProductColorMutationResult> {
  const res = await api.post<ApiResponse<ApiDetail<ProductColor>>>('/api/v1/product-colors', data);
  return {
    message: res.data.response_schema.response_message,
    data: res.data.response_output!.detail,
  };
}

export async function updateProductColor(id: string, data: CreateProductColorPayload): Promise<ProductColorMutationResult> {
  const res = await api.put<ApiResponse<ApiDetail<ProductColor>>>(`/api/v1/product-colors/${id}`, data);
  return {
    message: res.data.response_schema.response_message,
    data: res.data.response_output!.detail,
  };
}

export async function deleteProductColor(id: string): Promise<{ message: string }> {
  const res = await api.delete<ApiResponse<null>>(`/api/v1/product-colors/${id}`);
  return { message: res.data.response_schema.response_message };
}

export async function restoreProductColor(id: string): Promise<ProductColorMutationResult> {
  const res = await api.patch<ApiResponse<ApiDetail<ProductColor>>>(`/api/v1/product-colors/${id}/restore`);
  return {
    message: res.data.response_schema.response_message,
    data: res.data.response_output!.detail,
  };
}

export async function exportProductColors(params?: GetProductColorsParams): Promise<Blob> {
  const res = await api.get('/api/v1/product-colors/export', { params, responseType: 'blob' });
  return res.data as Blob;
}

export async function bulkUploadProductColors(file: File): Promise<BulkUploadResult> {
  const form = new FormData();
  form.append('file', file);
  const res = await api.post<ApiResponse<BulkUploadResult>>('/api/v1/product-colors/bulk-upload', form);
  return res.data.response_output!;
}

export async function downloadProductColorTemplate(): Promise<Blob> {
  const res = await api.get('/api/v1/product-colors/bulk-template', { responseType: 'blob' });
  return res.data as Blob;
}
