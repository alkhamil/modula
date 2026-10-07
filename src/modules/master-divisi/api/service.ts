import api from '../../../shared/lib/api';
import type {
  MasterDivisi,
  MasterDivisiMutationResult,
  BulkUploadResult,
  CreateMasterDivisiPayload,
  GetMasterDivisisParams,
  MasterDivisiListItem,
} from '../types';
import type { ApiDetail, ApiList, ApiResponse } from '../../../shared/types';

export async function getMasterDivisis(params?: GetMasterDivisisParams): Promise<ApiList<MasterDivisiListItem>> {
  const res = await api.get<ApiResponse<ApiList<MasterDivisiListItem>>>('/api/v1/master-divisis', { params });
  return res.data.response_output ?? { list: { pagination: null, content: [] } };
}

export async function getMasterDivisiById(id: string): Promise<MasterDivisi> {
  const res = await api.get<ApiResponse<ApiDetail<MasterDivisi>>>(`/api/v1/master-divisis/${id}`);
  return res.data.response_output!.detail;
}

export async function createMasterDivisi(data: CreateMasterDivisiPayload): Promise<MasterDivisiMutationResult> {
  const res = await api.post<ApiResponse<ApiDetail<MasterDivisi>>>('/api/v1/master-divisis', data);
  return {
    message: res.data.response_schema.response_message,
    data: res.data.response_output!.detail,
  };
}

export async function updateMasterDivisi(
  id: string,
  data: CreateMasterDivisiPayload,
): Promise<MasterDivisiMutationResult> {
  const res = await api.put<ApiResponse<ApiDetail<MasterDivisi>>>(`/api/v1/master-divisis/${id}`, data);
  return {
    message: res.data.response_schema.response_message,
    data: res.data.response_output!.detail,
  };
}

export async function deleteMasterDivisi(id: string): Promise<{ message: string }> {
  const res = await api.delete<ApiResponse<null>>(`/api/v1/master-divisis/${id}`);
  return { message: res.data.response_schema.response_message };
}

export async function restoreMasterDivisi(id: string): Promise<MasterDivisiMutationResult> {
  const res = await api.patch<ApiResponse<ApiDetail<MasterDivisi>>>(`/api/v1/master-divisis/${id}/restore`);
  return {
    message: res.data.response_schema.response_message,
    data: res.data.response_output!.detail,
  };
}

export async function exportMasterDivisis(params?: GetMasterDivisisParams): Promise<Blob> {
  const res = await api.get('/api/v1/master-divisis/export', { params, responseType: 'blob' });
  return res.data as Blob;
}

export async function bulkUploadMasterDivisis(file: File): Promise<BulkUploadResult> {
  const form = new FormData();
  form.append('file', file);
  const res = await api.post<ApiResponse<BulkUploadResult>>('/api/v1/master-divisis/bulk-upload', form);
  return res.data.response_output!;
}

export async function downloadMasterDivisiTemplate(): Promise<Blob> {
  const res = await api.get('/api/v1/master-divisis/bulk-template', { responseType: 'blob' });
  return res.data as Blob;
}
