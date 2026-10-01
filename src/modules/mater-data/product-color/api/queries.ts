import { useQuery } from '@tanstack/react-query';
import { getProductColors, getProductColorById } from './resolver';
import type { GetProductColorsParams, ProductColorListItem, ProductColor } from '../types';
import type { ApiList } from '../../../../shared/types';

export function useProductColorListQuery(params: GetProductColorsParams) {
  return useQuery<ApiList<ProductColorListItem>>({
    queryKey: ['product-colors', params],
    queryFn: () => getProductColors({ ...params, page: (params.page ?? 1) - 1 }),
    placeholderData: (prev) => prev,
  });
}

export function useProductColorDetailQuery(id?: string) {
  return useQuery<ProductColor>({
    queryKey: ['product-color', id],
    queryFn: () => getProductColorById(id!),
    enabled: !!id,
  });
}
