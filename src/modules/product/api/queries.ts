import { useQuery } from '@tanstack/react-query';
import { getProducts, getProductById } from './resolver';
import type { GetProductsParams, ProductListItem, Product } from '../types';
import type { ApiList } from '../../../shared/types';

export function useProductListQuery(params: GetProductsParams) {
  return useQuery<ApiList<ProductListItem>>({
    queryKey: ['products', params],
    queryFn: () => getProducts({ ...params, page: (params.page ?? 1) - 1 }),
    placeholderData: (prev) => prev,
  });
}

export function useProductDetailQuery(id?: string) {
  return useQuery<Product>({
    queryKey: ['product', id],
    queryFn: () => getProductById(id!),
    enabled: !!id,
  });
}
