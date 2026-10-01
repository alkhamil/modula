import { useQuery } from '@tanstack/react-query';
import { getProductVariants, getProductVariantById } from './resolver';
import type { GetProductVariantsParams, ProductVariantListItem, ProductVariant } from '../types';
import type { ApiList } from '../../../../shared/types';

export function useProductVariantListQuery(params: GetProductVariantsParams) {
  return useQuery<ApiList<ProductVariantListItem>>({
    queryKey: ['product-variants', params],
    queryFn: () => getProductVariants({ ...params, page: (params.page ?? 1) - 1 }),
    placeholderData: (prev) => prev,
  });
}

export function useProductVariantDetailQuery(id?: string) {
  return useQuery<ProductVariant>({
    queryKey: ['product-variant', id],
    queryFn: () => getProductVariantById(id!),
    enabled: !!id,
  });
}
