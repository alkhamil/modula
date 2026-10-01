import api from '../../../shared/lib/api';
import type {
  User,
  UserMutationResult,
  BulkUploadResult,
  CreateUserPayload,
  GetUsersParams,
  UserListItem,
  RoleOption,
} from '../types';
import type { ApiDetail, ApiList, ApiResponse } from '../../../shared/types';

export async function getUsers(params?: GetUsersParams): Promise<ApiList<UserListItem>> {
  const res = await api.get<ApiResponse<ApiList<UserListItem>>>('/api/v1/users', { params });
  return res.data.response_output ?? { list: { pagination: null, content: [] } };
}

export async function getUserById(id: string): Promise<User> {
  const res = await api.get<ApiResponse<ApiDetail<User>>>(`/api/v1/users/${id}`);
  return res.data.response_output!.detail;
}

export async function createUser(data: CreateUserPayload): Promise<UserMutationResult> {
  const res = await api.post<ApiResponse<ApiDetail<User>>>('/api/v1/users', data);
  return {
    message: res.data.response_schema.response_message,
    data: res.data.response_output!.detail,
  };
}

export async function updateUser(id: string, data: CreateUserPayload): Promise<UserMutationResult> {
  const res = await api.put<ApiResponse<ApiDetail<User>>>(`/api/v1/users/${id}`, data);
  return {
    message: res.data.response_schema.response_message,
    data: res.data.response_output!.detail,
  };
}

export async function deleteUser(id: string): Promise<{ message: string }> {
  const res = await api.delete<ApiResponse<null>>(`/api/v1/users/${id}`);
  return { message: res.data.response_schema.response_message };
}

export async function restoreUser(id: string): Promise<UserMutationResult> {
  const res = await api.patch<ApiResponse<ApiDetail<User>>>(`/api/v1/users/${id}/restore`);
  return {
    message: res.data.response_schema.response_message,
    data: res.data.response_output!.detail,
  };
}

export async function getRoleOptions(): Promise<RoleOption[]> {
  const res = await api.get<ApiResponse<ApiList<RoleOption>>>('/api/v1/users/roles');
  return res.data.response_output?.list.content ?? [];
}

export async function exportUsers(params?: GetUsersParams): Promise<Blob> {
  const res = await api.get('/api/v1/users/export', { params, responseType: 'blob' });
  return res.data as Blob;
}

export async function bulkUploadUsers(file: File): Promise<BulkUploadResult> {
  const form = new FormData();
  form.append('file', file);
  const res = await api.post<ApiResponse<BulkUploadResult>>('/api/v1/users/bulk-upload', form);
  return res.data.response_output!;
}

export async function downloadUserTemplate(): Promise<Blob> {
  const res = await api.get('/api/v1/users/bulk-template', { responseType: 'blob' });
  return res.data as Blob;
}
