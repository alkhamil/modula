import { useQuery } from '@tanstack/react-query';
import { getRegions, getRegionById } from './resolver';
import type { GetRegionsParams, RegionListItem, Region } from '../types';
import type { ApiList } from '../../../shared/types';

export function useRegionListQuery(params: GetRegionsParams) {
  return useQuery<ApiList<RegionListItem>>({
    queryKey: ['regions', params],
    queryFn: () => getRegions({ ...params, page: (params.page ?? 1) - 1 }),
    placeholderData: (prev) => prev,
  });
}

export function useRegionDetailQuery(id?: string) {
  return useQuery<Region>({
    queryKey: ['region', id],
    queryFn: () => getRegionById(id!),
    enabled: !!id,
  });
}
