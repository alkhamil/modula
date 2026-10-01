import api from '../../../../shared/lib/api';
import type {
  Branch,
  BranchMutationResult,
  CreateBranchPayload,
  GetBranchesParams,
  BranchListItem,
} from '../types';
import type { ApiDetail, ApiList, ApiResponse } from '../../../../shared/types';

export async function getBranches(params?: GetBranchesParams): Promise<ApiList<BranchListItem>> {
  const res = await api.get<ApiResponse<ApiList<BranchListItem>>>('/api/v1/branches', { params });
  return res.data.response_output ?? { list: { pagination: null, content: [] } };
}

export async function getBranchById(id: string): Promise<Branch> {
  const res = await api.get<ApiResponse<ApiDetail<Branch>>>(`/api/v1/branches/${id}`);
  return res.data.response_output!.detail;
}

export async function createBranch(data: CreateBranchPayload): Promise<BranchMutationResult> {
  const res = await api.post<ApiResponse<ApiDetail<Branch>>>('/api/v1/branches', data);
  return {
    message: res.data.response_schema.response_message,
    data: res.data.response_output!.detail,
  };
}

export async function updateBranch(id: string, data: CreateBranchPayload): Promise<BranchMutationResult> {
  const res = await api.put<ApiResponse<ApiDetail<Branch>>>(`/api/v1/branches/${id}`, data);
  return {
    message: res.data.response_schema.response_message,
    data: res.data.response_output!.detail,
  };
}

export async function deleteBranch(id: string): Promise<{ message: string }> {
  const res = await api.delete<ApiResponse<null>>(`/api/v1/branches/${id}`);
  return { message: res.data.response_schema.response_message };
}

export async function restoreBranch(id: string): Promise<BranchMutationResult> {
  const res = await api.patch<ApiResponse<ApiDetail<Branch>>>(`/api/v1/branches/${id}/restore`);
  return {
    message: res.data.response_schema.response_message,
    data: res.data.response_output!.detail,
  };
}
