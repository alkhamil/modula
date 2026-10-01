import { useQuery } from '@tanstack/react-query';
import { getNewClaims, getNewClaimById } from './resolver';
import type { GetNewClaimsParams, NewClaimListItem, NewClaim } from '../types';
import type { ApiList } from '../../../shared/types';

export function useNewClaimListQuery(params: GetNewClaimsParams) {
  return useQuery<ApiList<NewClaimListItem>>({
    queryKey: ['new-claims', params],
    queryFn: () => getNewClaims({ ...params, page: (params.page ?? 1) - 1 }),
    placeholderData: (prev) => prev,
  });
}

export function useNewClaimDetailQuery(id?: string) {
  return useQuery<NewClaim>({
    queryKey: ['new-claim', id],
    queryFn: () => getNewClaimById(id!),
    enabled: !!id,
  });
}
