import api from '../../../shared/lib/api';
import type {
  NewClaim,
  NewClaimMutationResult,
  BulkUploadResult,
  CreateNewClaimPayload,
  GetNewClaimsParams,
  NewClaimListItem,
} from '../types';
import type { ApiDetail, ApiList, ApiResponse } from '../../../shared/types';

export async function getNewClaims(params?: GetNewClaimsParams): Promise<ApiList<NewClaimListItem>> {
  const res = await api.get<ApiResponse<ApiList<NewClaimListItem>>>('/api/v1/new-claims', { params });
  return res.data.response_output ?? { list: { pagination: null, content: [] } };
}

export async function getNewClaimById(id: string): Promise<NewClaim> {
  const res = await api.get<ApiResponse<ApiDetail<NewClaim>>>(`/api/v1/new-claims/${id}`);
  return res.data.response_output!.detail;
}

export async function createNewClaim(data: CreateNewClaimPayload): Promise<NewClaimMutationResult> {
  const res = await api.post<ApiResponse<ApiDetail<NewClaim>>>('/api/v1/new-claims', data);
  return {
    message: res.data.response_schema.response_message,
    data: res.data.response_output!.detail,
  };
}

export async function updateNewClaim(id: string, data: CreateNewClaimPayload): Promise<NewClaimMutationResult> {
  const res = await api.put<ApiResponse<ApiDetail<NewClaim>>>(`/api/v1/new-claims/${id}`, data);
  return {
    message: res.data.response_schema.response_message,
    data: res.data.response_output!.detail,
  };
}

export async function deleteNewClaim(id: string): Promise<{ message: string }> {
  const res = await api.delete<ApiResponse<null>>(`/api/v1/new-claims/${id}`);
  return { message: res.data.response_schema.response_message };
}

export async function restoreNewClaim(id: string): Promise<NewClaimMutationResult> {
  const res = await api.patch<ApiResponse<ApiDetail<NewClaim>>>(`/api/v1/new-claims/${id}/restore`);
  return {
    message: res.data.response_schema.response_message,
    data: res.data.response_output!.detail,
  };
}

export async function exportNewClaims(params?: GetNewClaimsParams): Promise<Blob> {
  const res = await api.get('/api/v1/new-claims/export', { params, responseType: 'blob' });
  return res.data as Blob;
}

export async function bulkUploadNewClaims(file: File): Promise<BulkUploadResult> {
  const form = new FormData();
  form.append('file', file);
  const res = await api.post<ApiResponse<BulkUploadResult>>('/api/v1/new-claims/bulk-upload', form);
  return res.data.response_output!;
}

export async function downloadNewClaimTemplate(): Promise<Blob> {
  const res = await api.get('/api/v1/new-claims/bulk-template', { responseType: 'blob' });
  return res.data as Blob;
}
