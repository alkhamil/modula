import api from '../../../../shared/lib/api';
import type {
  Product,
  ProductMutationResult,
  BulkUploadResult,
  CreateProductPayload,
  GetProductsParams,
  ProductListItem,
  CategoryOption,
} from '../types';
import type { ApiDetail, ApiList, ApiResponse } from '../../../../shared/types';

export async function getProducts(params?: GetProductsParams): Promise<ApiList<ProductListItem>> {
  const res = await api.get<ApiResponse<ApiList<ProductListItem>>>('/api/v1/products', { params });
  return res.data.response_output ?? { list: { pagination: null, content: [] } };
}

export async function getProductById(id: string): Promise<Product> {
  const res = await api.get<ApiResponse<ApiDetail<Product>>>(`/api/v1/products/${id}`);
  return res.data.response_output!.detail;
}

export async function createProduct(data: CreateProductPayload): Promise<ProductMutationResult> {
  const res = await api.post<ApiResponse<ApiDetail<Product>>>('/api/v1/products', data);
  return {
    message: res.data.response_schema.response_message,
    data: res.data.response_output!.detail,
  };
}

export async function updateProduct(
  id: string,
  data: CreateProductPayload,
): Promise<ProductMutationResult> {
  const res = await api.put<ApiResponse<ApiDetail<Product>>>(`/api/v1/products/${id}`, data);
  return {
    message: res.data.response_schema.response_message,
    data: res.data.response_output!.detail,
  };
}

export async function deleteProduct(id: string): Promise<{ message: string }> {
  const res = await api.delete<ApiResponse<null>>(`/api/v1/products/${id}`);
  return { message: res.data.response_schema.response_message };
}

export async function restoreProduct(id: string): Promise<ProductMutationResult> {
  const res = await api.patch<ApiResponse<ApiDetail<Product>>>(`/api/v1/products/${id}/restore`);
  return {
    message: res.data.response_schema.response_message,
    data: res.data.response_output!.detail,
  };
}

export async function loadCategoryOptions(
  search = '',
  page = 1,
  size = 20,
): Promise<CategoryOption[]> {
  const res = await api.get<ApiResponse<ApiList<Record<string, unknown>>>>('/api/v1/categories', {
    params: { search, page, size },
  });
  const content = res.data.response_output?.list.content ?? [];
  return content.map((r) => ({
    label: String(r['name'] ?? ''),
    value: String(r['id'] ?? ''),
  }));
}

export async function exportProducts(params?: GetProductsParams): Promise<Blob> {
  const res = await api.get('/api/v1/products/export', { params, responseType: 'blob' });
  return res.data as Blob;
}

export async function bulkUploadProducts(file: File): Promise<BulkUploadResult> {
  const form = new FormData();
  form.append('file', file);
  const res = await api.post<ApiResponse<BulkUploadResult>>('/api/v1/products/bulk-upload', form);
  return res.data.response_output!;
}

export async function downloadProductTemplate(): Promise<Blob> {
  const res = await api.get('/api/v1/products/bulk-template', { responseType: 'blob' });
  return res.data as Blob;
}
