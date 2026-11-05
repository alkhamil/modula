import api from '../../../../shared/lib/api';
import type {
  DefaultItem,
  DefaultItemMutationResult,
  BulkUploadResult,
  CreateDefaultItemPayload,
  GetDefaultItemsParams,
  DefaultItemListItem,
} from '../types';
import type { ApiDetail, ApiList, ApiResponse } from '../../../../shared/types';

export async function getDefaultItems(params?: GetDefaultItemsParams): Promise<ApiList<DefaultItemListItem>> {
  const res = await api.get<ApiResponse<ApiList<DefaultItemListItem>>>('/api/v1/default-items', { params });
  return res.data.response_output ?? { list: { pagination: null, content: [] } };
}

export async function getDefaultItemById(id: string): Promise<DefaultItem> {
  const res = await api.get<ApiResponse<ApiDetail<DefaultItem>>>(`/api/v1/default-items/${id}`);
  return res.data.response_output!.detail;
}

export async function createDefaultItem(data: CreateDefaultItemPayload): Promise<DefaultItemMutationResult> {
  const res = await api.post<ApiResponse<ApiDetail<DefaultItem>>>('/api/v1/default-items', data);
  return {
    message: res.data.response_schema.response_message,
    data: res.data.response_output!.detail,
  };
}

export async function updateDefaultItem(
  id: string,
  data: CreateDefaultItemPayload,
): Promise<DefaultItemMutationResult> {
  const res = await api.put<ApiResponse<ApiDetail<DefaultItem>>>(`/api/v1/default-items/${id}`, data);
  return {
    message: res.data.response_schema.response_message,
    data: res.data.response_output!.detail,
  };
}

export async function deleteDefaultItem(id: string): Promise<{ message: string }> {
  const res = await api.delete<ApiResponse<null>>(`/api/v1/default-items/${id}`);
  return { message: res.data.response_schema.response_message };
}

export async function restoreDefaultItem(id: string): Promise<DefaultItemMutationResult> {
  const res = await api.patch<ApiResponse<ApiDetail<DefaultItem>>>(`/api/v1/default-items/${id}/restore`);
  return {
    message: res.data.response_schema.response_message,
    data: res.data.response_output!.detail,
  };
}

export async function exportDefaultItems(params?: GetDefaultItemsParams): Promise<Blob> {
  const res = await api.get('/api/v1/default-items/export', { params, responseType: 'blob' });
  return res.data as Blob;
}

export async function bulkUploadDefaultItems(file: File): Promise<BulkUploadResult> {
  const form = new FormData();
  form.append('file', file);
  const res = await api.post<ApiResponse<BulkUploadResult>>('/api/v1/default-items/bulk-upload', form);
  return res.data.response_output!;
}

export async function downloadDefaultItemTemplate(): Promise<Blob> {
  const res = await api.get('/api/v1/default-items/bulk-template', { responseType: 'blob' });
  return res.data as Blob;
}
