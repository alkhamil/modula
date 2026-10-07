import { useQuery } from '@tanstack/react-query';
import { getVendors, getVendorById } from './resolver';
import type { GetVendorsParams, VendorListItem, Vendor } from '../types';
import type { ApiList } from '../../../../shared/types';

export function useVendorListQuery(params: GetVendorsParams) {
  return useQuery<ApiList<VendorListItem>>({
    queryKey: ['vendors', params],
    queryFn: () => getVendors({ ...params, page: (params.page ?? 1) - 1 }),
    placeholderData: (prev) => prev,
  });
}

export function useVendorDetailQuery(id?: string) {
  return useQuery<Vendor>({
    queryKey: ['vendor', id],
    queryFn: () => getVendorById(id!),
    enabled: !!id,
  });
}
