import api from '../../../../shared/lib/api';
import type {
  DefaultRecord,
  DefaultRecordMutationResult,
  BulkUploadResult,
  CreateDefaultRecordPayload,
  GetDefaultRecordsParams,
  DefaultRecordListItem,
} from '../types';
import type { ApiDetail, ApiList, ApiResponse } from '../../../../shared/types';

export async function getDefaultRecords(params?: GetDefaultRecordsParams): Promise<ApiList<DefaultRecordListItem>> {
  const res = await api.get<ApiResponse<ApiList<DefaultRecordListItem>>>('/api/v1/default-records', { params });
  return res.data.response_output ?? { list: { pagination: null, content: [] } };
}

export async function getDefaultRecordById(id: string): Promise<DefaultRecord> {
  const res = await api.get<ApiResponse<ApiDetail<DefaultRecord>>>(`/api/v1/default-records/${id}`);
  return res.data.response_output!.detail;
}

export async function createDefaultRecord(data: CreateDefaultRecordPayload): Promise<DefaultRecordMutationResult> {
  const res = await api.post<ApiResponse<ApiDetail<DefaultRecord>>>('/api/v1/default-records', data);
  return {
    message: res.data.response_schema.response_message,
    data: res.data.response_output!.detail,
  };
}

export async function updateDefaultRecord(
  id: string,
  data: CreateDefaultRecordPayload,
): Promise<DefaultRecordMutationResult> {
  const res = await api.put<ApiResponse<ApiDetail<DefaultRecord>>>(`/api/v1/default-records/${id}`, data);
  return {
    message: res.data.response_schema.response_message,
    data: res.data.response_output!.detail,
  };
}

export async function deleteDefaultRecord(id: string): Promise<{ message: string }> {
  const res = await api.delete<ApiResponse<null>>(`/api/v1/default-records/${id}`);
  return { message: res.data.response_schema.response_message };
}

export async function restoreDefaultRecord(id: string): Promise<DefaultRecordMutationResult> {
  const res = await api.patch<ApiResponse<ApiDetail<DefaultRecord>>>(`/api/v1/default-records/${id}/restore`);
  return {
    message: res.data.response_schema.response_message,
    data: res.data.response_output!.detail,
  };
}

export async function exportDefaultRecords(params?: GetDefaultRecordsParams): Promise<Blob> {
  const res = await api.get('/api/v1/default-records/export', { params, responseType: 'blob' });
  return res.data as Blob;
}

export async function bulkUploadDefaultRecords(file: File): Promise<BulkUploadResult> {
  const form = new FormData();
  form.append('file', file);
  const res = await api.post<ApiResponse<BulkUploadResult>>('/api/v1/default-records/bulk-upload', form);
  return res.data.response_output!;
}

export async function downloadDefaultRecordTemplate(): Promise<Blob> {
  const res = await api.get('/api/v1/default-records/bulk-template', { responseType: 'blob' });
  return res.data as Blob;
}
