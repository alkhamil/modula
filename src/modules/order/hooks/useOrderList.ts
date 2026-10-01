import type { GetOrdersParams } from '../types';
import { useOrderListQuery } from '../api';

export function useOrderList(params: GetOrdersParams) {

  const query = useOrderListQuery(params);

  return {
    orders: query.data?.list.content ?? [],
    totalRecords: query.data?.list.pagination?.total_elements ?? 0,
    isLoading: query.isLoading,
    error: query.error?.message ?? null,
    refresh: () => query.refetch(),
  };
}
