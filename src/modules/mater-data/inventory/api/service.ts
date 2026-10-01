import api from '../../../../shared/lib/api';
import type {
  Inventory,
  InventoryMutationResult,
  BulkUploadResult,
  CreateInventoryPayload,
  GetInventoriesParams,
  InventoryListItem,
} from '../types';
import type { ApiDetail, ApiList, ApiResponse } from '../../../../shared/types';

export async function getInventories(params?: GetInventoriesParams): Promise<ApiList<InventoryListItem>> {
  const res = await api.get<ApiResponse<ApiList<InventoryListItem>>>('/api/v1/inventories', { params });
  return res.data.response_output ?? { list: { pagination: null, content: [] } };
}

export async function getInventoryById(id: string): Promise<Inventory> {
  const res = await api.get<ApiResponse<ApiDetail<Inventory>>>(`/api/v1/inventories/${id}`);
  return res.data.response_output!.detail;
}

export async function createInventory(data: CreateInventoryPayload): Promise<InventoryMutationResult> {
  const res = await api.post<ApiResponse<ApiDetail<Inventory>>>('/api/v1/inventories', data);
  return {
    message: res.data.response_schema.response_message,
    data: res.data.response_output!.detail,
  };
}

export async function updateInventory(id: string, data: CreateInventoryPayload): Promise<InventoryMutationResult> {
  const res = await api.put<ApiResponse<ApiDetail<Inventory>>>(`/api/v1/inventories/${id}`, data);
  return {
    message: res.data.response_schema.response_message,
    data: res.data.response_output!.detail,
  };
}

export async function deleteInventory(id: string): Promise<{ message: string }> {
  const res = await api.delete<ApiResponse<null>>(`/api/v1/inventories/${id}`);
  return { message: res.data.response_schema.response_message };
}

export async function restoreInventory(id: string): Promise<InventoryMutationResult> {
  const res = await api.patch<ApiResponse<ApiDetail<Inventory>>>(`/api/v1/inventories/${id}/restore`);
  return {
    message: res.data.response_schema.response_message,
    data: res.data.response_output!.detail,
  };
}

export async function exportInventories(params?: GetInventoriesParams): Promise<Blob> {
  const res = await api.get('/api/v1/inventories/export', { params, responseType: 'blob' });
  return res.data as Blob;
}

export async function bulkUploadInventories(file: File): Promise<BulkUploadResult> {
  const form = new FormData();
  form.append('file', file);
  const res = await api.post<ApiResponse<BulkUploadResult>>('/api/v1/inventories/bulk-upload', form);
  return res.data.response_output!;
}

export async function downloadInventoryTemplate(): Promise<Blob> {
  const res = await api.get('/api/v1/inventories/bulk-template', { responseType: 'blob' });
  return res.data as Blob;
}
