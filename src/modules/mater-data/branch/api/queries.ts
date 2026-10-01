import { useQuery } from '@tanstack/react-query';
import { getBranches, getBranchById } from './resolver';
import type { GetBranchesParams, BranchListItem, Branch } from '../types';
import type { ApiList } from '../../../../shared/types';

export function useBranchListQuery(params: GetBranchesParams) {
  return useQuery<ApiList<BranchListItem>>({
    queryKey: ['branches', params],
    queryFn: () => getBranches({ ...params, page: (params.page ?? 1) - 1 }),
    placeholderData: (prev) => prev,
  });
}

export function useBranchDetailQuery(id?: string) {
  return useQuery<Branch>({
    queryKey: ['branch', id],
    queryFn: () => getBranchById(id!),
    enabled: !!id,
  });
}
