import { useQuery } from '@tanstack/react-query';
import { getPrices, getPriceById } from './resolver';
import type { GetPricesParams, PriceListItem, Price } from '../types';
import type { ApiList } from '../../../../shared/types';

export function usePriceListQuery(params: GetPricesParams) {
  return useQuery<ApiList<PriceListItem>>({
    queryKey: ['prices', params],
    queryFn: () => getPrices({ ...params, page: (params.page ?? 1) - 1 }),
    placeholderData: (prev) => prev,
  });
}

export function usePriceDetailQuery(id?: string) {
  return useQuery<Price>({
    queryKey: ['price', id],
    queryFn: () => getPriceById(id!),
    enabled: !!id,
  });
}
