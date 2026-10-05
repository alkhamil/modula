import { useQuery } from '@tanstack/react-query';
import { getCompanies, getCompanyById } from './resolver';
import type { GetCompaniesParams, CompanyListItem, Company } from '../types';
import type { ApiList } from '../../../../shared/types';

export function useCompanyListQuery(params: GetCompaniesParams) {
  return useQuery<ApiList<CompanyListItem>>({
    queryKey: ['companies', params],
    queryFn: () => getCompanies({ ...params, page: (params.page ?? 1) - 1 }),
    placeholderData: (prev) => prev,
  });
}

export function useCompanyDetailQuery(id?: string) {
  return useQuery<Company>({
    queryKey: ['company', id],
    queryFn: () => getCompanyById(id!),
    enabled: !!id,
  });
}
