import api from '../../../shared/lib/api';
import type {
  DefaultModule,
  DefaultModuleMutationResult,
  BulkUploadResult,
  CreateDefaultModulePayload,
  GetDefaultModulesParams,
  DefaultModuleListItem,
} from '../types';
import type { ApiDetail, ApiList, ApiResponse } from '../../../shared/types';

export async function getDefaultModules(params?: GetDefaultModulesParams): Promise<ApiList<DefaultModuleListItem>> {
  const res = await api.get<ApiResponse<ApiList<DefaultModuleListItem>>>('/api/v1/default-modules', { params });
  return res.data.response_output ?? { list: { pagination: null, content: [] } };
}

export async function getDefaultModuleById(id: string): Promise<DefaultModule> {
  const res = await api.get<ApiResponse<ApiDetail<DefaultModule>>>(`/api/v1/default-modules/${id}`);
  return res.data.response_output!.detail;
}

export async function createDefaultModule(data: CreateDefaultModulePayload): Promise<DefaultModuleMutationResult> {
  const res = await api.post<ApiResponse<ApiDetail<DefaultModule>>>('/api/v1/default-modules', data);
  return {
    message: res.data.response_schema.response_message,
    data: res.data.response_output!.detail,
  };
}

export async function updateDefaultModule(
  id: string,
  data: CreateDefaultModulePayload,
): Promise<DefaultModuleMutationResult> {
  const res = await api.put<ApiResponse<ApiDetail<DefaultModule>>>(`/api/v1/default-modules/${id}`, data);
  return {
    message: res.data.response_schema.response_message,
    data: res.data.response_output!.detail,
  };
}

export async function deleteDefaultModule(id: string): Promise<{ message: string }> {
  const res = await api.delete<ApiResponse<null>>(`/api/v1/default-modules/${id}`);
  return { message: res.data.response_schema.response_message };
}

export async function restoreDefaultModule(id: string): Promise<DefaultModuleMutationResult> {
  const res = await api.patch<ApiResponse<ApiDetail<DefaultModule>>>(`/api/v1/default-modules/${id}/restore`);
  return {
    message: res.data.response_schema.response_message,
    data: res.data.response_output!.detail,
  };
}

export async function exportDefaultModules(params?: GetDefaultModulesParams): Promise<Blob> {
  const res = await api.get('/api/v1/default-modules/export', { params, responseType: 'blob' });
  return res.data as Blob;
}

export async function bulkUploadDefaultModules(file: File): Promise<BulkUploadResult> {
  const form = new FormData();
  form.append('file', file);
  const res = await api.post<ApiResponse<BulkUploadResult>>('/api/v1/default-modules/bulk-upload', form);
  return res.data.response_output!;
}

export async function downloadDefaultModuleTemplate(): Promise<Blob> {
  const res = await api.get('/api/v1/default-modules/bulk-template', { responseType: 'blob' });
  return res.data as Blob;
}
