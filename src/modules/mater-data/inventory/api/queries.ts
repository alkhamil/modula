import { useQuery } from '@tanstack/react-query';
import { getInventories, getInventoryById } from './resolver';
import type { GetInventoriesParams, InventoryListItem, Inventory } from '../types';
import type { ApiList } from '../../../../shared/types';

export function useInventoryListQuery(params: GetInventoriesParams) {
  return useQuery<ApiList<InventoryListItem>>({
    queryKey: ['inventories', params],
    queryFn: () => getInventories({ ...params, page: (params.page ?? 1) - 1 }),
    placeholderData: (prev) => prev,
  });
}

export function useInventoryDetailQuery(id?: string) {
  return useQuery<Inventory>({
    queryKey: ['inventory', id],
    queryFn: () => getInventoryById(id!),
    enabled: !!id,
  });
}
