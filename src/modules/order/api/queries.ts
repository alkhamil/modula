import { useQuery } from '@tanstack/react-query';
import { getOrders, getOrderById } from './resolver';
import type { GetOrdersParams, OrderListItem, Order } from '../types';
import type { ApiList } from '../../../shared/types';

export function useOrderListQuery(params: GetOrdersParams) {
  return useQuery<ApiList<OrderListItem>>({
    queryKey: ['orders', params],
    queryFn: () => getOrders({ ...params, page: (params.page ?? 1) - 1 }),
    placeholderData: (prev) => prev,
  });
}

export function useOrderDetailQuery(id?: string) {
  return useQuery<Order>({
    queryKey: ['order', id],
    queryFn: () => getOrderById(id!),
    enabled: !!id,
  });
}
