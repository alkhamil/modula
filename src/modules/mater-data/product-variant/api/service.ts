import api from '../../../../shared/lib/api';
import type {
  ProductVariant,
  ProductVariantMutationResult,
  BulkUploadResult,
  CreateProductVariantPayload,
  GetProductVariantsParams,
  ProductVariantListItem,
} from '../types';
import type { ApiDetail, ApiList, ApiResponse } from '../../../../shared/types';

export async function getProductVariants(params?: GetProductVariantsParams): Promise<ApiList<ProductVariantListItem>> {
  const res = await api.get<ApiResponse<ApiList<ProductVariantListItem>>>('/api/v1/product-variants', { params });
  return res.data.response_output ?? { list: { pagination: null, content: [] } };
}

export async function getProductVariantById(id: string): Promise<ProductVariant> {
  const res = await api.get<ApiResponse<ApiDetail<ProductVariant>>>(`/api/v1/product-variants/${id}`);
  return res.data.response_output!.detail;
}

export async function createProductVariant(data: CreateProductVariantPayload): Promise<ProductVariantMutationResult> {
  const res = await api.post<ApiResponse<ApiDetail<ProductVariant>>>('/api/v1/product-variants', data);
  return {
    message: res.data.response_schema.response_message,
    data: res.data.response_output!.detail,
  };
}

export async function updateProductVariant(id: string, data: CreateProductVariantPayload): Promise<ProductVariantMutationResult> {
  const res = await api.put<ApiResponse<ApiDetail<ProductVariant>>>(`/api/v1/product-variants/${id}`, data);
  return {
    message: res.data.response_schema.response_message,
    data: res.data.response_output!.detail,
  };
}

export async function deleteProductVariant(id: string): Promise<{ message: string }> {
  const res = await api.delete<ApiResponse<null>>(`/api/v1/product-variants/${id}`);
  return { message: res.data.response_schema.response_message };
}

export async function restoreProductVariant(id: string): Promise<ProductVariantMutationResult> {
  const res = await api.patch<ApiResponse<ApiDetail<ProductVariant>>>(`/api/v1/product-variants/${id}/restore`);
  return {
    message: res.data.response_schema.response_message,
    data: res.data.response_output!.detail,
  };
}

export async function exportProductVariants(params?: GetProductVariantsParams): Promise<Blob> {
  const res = await api.get('/api/v1/product-variants/export', { params, responseType: 'blob' });
  return res.data as Blob;
}

export async function bulkUploadProductVariants(file: File): Promise<BulkUploadResult> {
  const form = new FormData();
  form.append('file', file);
  const res = await api.post<ApiResponse<BulkUploadResult>>('/api/v1/product-variants/bulk-upload', form);
  return res.data.response_output!;
}

export async function downloadProductVariantTemplate(): Promise<Blob> {
  const res = await api.get('/api/v1/product-variants/bulk-template', { responseType: 'blob' });
  return res.data as Blob;
}
