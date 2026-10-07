import api from '../../../../shared/lib/api';
import type {
  Category,
  CategoryMutationResult,
  BulkUploadResult,
  CreateCategoryPayload,
  GetCategoriesParams,
  RegionOption,
  CategoryListItem,
} from '../types';
import type { ApiDetail, ApiList, ApiResponse } from '../../../../shared/types';

export async function getCategories(params?: GetCategoriesParams): Promise<ApiList<CategoryListItem>> {
  const res = await api.get<ApiResponse<ApiList<CategoryListItem>>>('/api/v1/categories', { params });
  return res.data.response_output ?? { list: { pagination: null, content: [] } };
}

export async function getCategoryById(id: string): Promise<Category> {
  const res = await api.get<ApiResponse<ApiDetail<Category>>>(`/api/v1/categories/${id}`);
  return res.data.response_output!.detail;
}

export async function createCategory(data: CreateCategoryPayload): Promise<CategoryMutationResult> {
  const res = await api.post<ApiResponse<ApiDetail<Category>>>('/api/v1/categories', data);
  return {
    message: res.data.response_schema.response_message,
    data: res.data.response_output!.detail,
  };
}

export async function updateCategory(
  id: string,
  data: CreateCategoryPayload,
): Promise<CategoryMutationResult> {
  const res = await api.put<ApiResponse<ApiDetail<Category>>>(`/api/v1/categories/${id}`, data);
  return {
    message: res.data.response_schema.response_message,
    data: res.data.response_output!.detail,
  };
}

export async function deleteCategory(id: string): Promise<{ message: string }> {
  const res = await api.delete<ApiResponse<null>>(`/api/v1/categories/${id}`);
  return { message: res.data.response_schema.response_message };
}

export async function loadRegionOptions(
  search = '',
  page = 1,
  size = 20,
): Promise<RegionOption[]> {
  const res = await api.get<ApiResponse<ApiList<Record<string, unknown>>>>('/api/v1/regions', {
    params: { search, page, size },
  });
  const content = res.data.response_output?.list.content ?? [];
  return content.map((r) => ({
    label: String(r['name'] ?? ''),
    value: String(r['id'] ?? ''),
  }));
}

export async function restoreCategory(id: string): Promise<CategoryMutationResult> {
  const res = await api.patch<ApiResponse<ApiDetail<Category>>>(`/api/v1/categories/${id}/restore`);
  return {
    message: res.data.response_schema.response_message,
    data: res.data.response_output!.detail,
  };
}

export async function exportCategories(params?: GetCategoriesParams): Promise<Blob> {
  const res = await api.get('/api/v1/categories/export', { params, responseType: 'blob' });
  return res.data as Blob;
}

export async function bulkUploadCategories(file: File): Promise<BulkUploadResult> {
  const form = new FormData();
  form.append('file', file);
  const res = await api.post<ApiResponse<BulkUploadResult>>('/api/v1/categories/bulk-upload', form);
  return res.data.response_output!;
}

export async function downloadCategoryTemplate(): Promise<Blob> {
  const res = await api.get('/api/v1/categories/bulk-template', { responseType: 'blob' });
  return res.data as Blob;
}
