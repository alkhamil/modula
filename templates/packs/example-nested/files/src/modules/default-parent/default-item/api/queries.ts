import { useQuery } from '@tanstack/react-query';
import { getDefaultItems, getDefaultItemById } from './resolver';
import type { GetDefaultItemsParams, DefaultItemListItem, DefaultItem } from '../types';
import type { ApiList } from '../../../../shared/types';

export function useDefaultItemListQuery(params: GetDefaultItemsParams) {
  return useQuery<ApiList<DefaultItemListItem>>({
    queryKey: ['default-items', params],
    queryFn: () => getDefaultItems({ ...params, page: (params.page ?? 1) - 1 }),
    placeholderData: (prev) => prev,
  });
}

export function useDefaultItemDetailQuery(id?: string) {
  return useQuery<DefaultItem>({
    queryKey: ['default-item', id],
    queryFn: () => getDefaultItemById(id!),
    enabled: !!id,
  });
}
