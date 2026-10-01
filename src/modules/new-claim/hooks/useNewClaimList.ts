import type { GetNewClaimsParams } from '../types';
import { useNewClaimListQuery } from '../api';

export function useNewClaimList(params: GetNewClaimsParams) {

  const query = useNewClaimListQuery(params);

  return {
    newClaims: query.data?.list.content ?? [],
    totalRecords: query.data?.list.pagination?.total_elements ?? 0,
    isLoading: query.isLoading,
    error: query.error?.message ?? null,
    refresh: () => query.refetch(),
  };
}
