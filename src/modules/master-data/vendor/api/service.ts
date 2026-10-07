import api from '../../../../shared/lib/api';
import type {
  Vendor,
  VendorMutationResult,
  BulkUploadResult,
  CreateVendorPayload,
  GetVendorsParams,
  RegionOption,
  VendorListItem,
} from '../types';
import type { ApiDetail, ApiList, ApiResponse } from '../../../../shared/types';

export async function getVendors(params?: GetVendorsParams): Promise<ApiList<VendorListItem>> {
  const res = await api.get<ApiResponse<ApiList<VendorListItem>>>('/api/v1/vendors', { params });
  return res.data.response_output ?? { list: { pagination: null, content: [] } };
}

export async function getVendorById(id: string): Promise<Vendor> {
  const res = await api.get<ApiResponse<ApiDetail<Vendor>>>(`/api/v1/vendors/${id}`);
  return res.data.response_output!.detail;
}

export async function createVendor(data: CreateVendorPayload): Promise<VendorMutationResult> {
  const res = await api.post<ApiResponse<ApiDetail<Vendor>>>('/api/v1/vendors', data);
  return {
    message: res.data.response_schema.response_message,
    data: res.data.response_output!.detail,
  };
}

export async function updateVendor(
  id: string,
  data: CreateVendorPayload,
): Promise<VendorMutationResult> {
  const res = await api.put<ApiResponse<ApiDetail<Vendor>>>(`/api/v1/vendors/${id}`, data);
  return {
    message: res.data.response_schema.response_message,
    data: res.data.response_output!.detail,
  };
}

export async function deleteVendor(id: string): Promise<{ message: string }> {
  const res = await api.delete<ApiResponse<null>>(`/api/v1/vendors/${id}`);
  return { message: res.data.response_schema.response_message };
}

export async function restoreVendor(id: string): Promise<VendorMutationResult> {
  const res = await api.patch<ApiResponse<ApiDetail<Vendor>>>(`/api/v1/vendors/${id}/restore`);
  return {
    message: res.data.response_schema.response_message,
    data: res.data.response_output!.detail,
  };
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

export async function exportVendors(params?: GetVendorsParams): Promise<Blob> {
  const res = await api.get('/api/v1/vendors/export', { params, responseType: 'blob' });
  return res.data as Blob;
}

export async function bulkUploadVendors(file: File): Promise<BulkUploadResult> {
  const form = new FormData();
  form.append('file', file);
  const res = await api.post<ApiResponse<BulkUploadResult>>('/api/v1/vendors/bulk-upload', form);
  return res.data.response_output!;
}

export async function downloadVendorTemplate(): Promise<Blob> {
  const res = await api.get('/api/v1/vendors/bulk-template', { responseType: 'blob' });
  return res.data as Blob;
}
