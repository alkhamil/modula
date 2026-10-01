import api from '../../../../shared/lib/api';
import type {
  Company,
  CompanyMutationResult,
  CreateCompanyPayload,
  GetCompaniesParams,
  CompanyListItem,
  CompanyGroupOption,
} from '../types';
import type { ApiDetail, ApiList, ApiResponse } from '../../../../shared/types';

export async function getCompanies(params?: GetCompaniesParams): Promise<ApiList<CompanyListItem>> {
  const res = await api.get<ApiResponse<ApiList<CompanyListItem>>>('/api/v1/companies', { params });
  return res.data.response_output ?? { list: { pagination: null, content: [] } };
}

export async function getCompanyById(id: string): Promise<Company> {
  const res = await api.get<ApiResponse<ApiDetail<Company>>>(`/api/v1/companies/${id}`);
  return res.data.response_output!.detail;
}

export async function createCompany(data: CreateCompanyPayload): Promise<CompanyMutationResult> {
  const res = await api.post<ApiResponse<ApiDetail<Company>>>('/api/v1/companies', data);
  return {
    message: res.data.response_schema.response_message,
    data: res.data.response_output!.detail,
  };
}

export async function updateCompany(id: string, data: CreateCompanyPayload): Promise<CompanyMutationResult> {
  const res = await api.put<ApiResponse<ApiDetail<Company>>>(`/api/v1/companies/${id}`, data);
  return {
    message: res.data.response_schema.response_message,
    data: res.data.response_output!.detail,
  };
}

export async function deleteCompany(id: string): Promise<{ message: string }> {
  const res = await api.delete<ApiResponse<null>>(`/api/v1/companies/${id}`);
  return { message: res.data.response_schema.response_message };
}

export async function restoreCompany(id: string): Promise<CompanyMutationResult> {
  const res = await api.patch<ApiResponse<ApiDetail<Company>>>(`/api/v1/companies/${id}/restore`);
  return {
    message: res.data.response_schema.response_message,
    data: res.data.response_output!.detail,
  };
}

export async function loadCompanyGroupOptions(
  search = '',
  page = 1,
  size = 20,
): Promise<CompanyGroupOption[]> {
  const res = await api.get<ApiResponse<ApiList<CompanyGroupOption>>>('/api/v1/companies/company-groups', {
    params: { search, page, size },
  });
  return res.data.response_output?.list.content ?? [];
}
