import { useQuery } from '@tanstack/react-query';
import { getMasterDivisis, getMasterDivisiById } from './resolver';
import type { GetMasterDivisisParams, MasterDivisiListItem, MasterDivisi } from '../types';
import type { ApiList } from '../../../shared/types';

export function useMasterDivisiListQuery(params: GetMasterDivisisParams) {
  return useQuery<ApiList<MasterDivisiListItem>>({
    queryKey: ['master-divisis', params],
    queryFn: () => getMasterDivisis({ ...params, page: (params.page ?? 1) - 1 }),
    placeholderData: (prev) => prev,
  });
}

export function useMasterDivisiDetailQuery(id?: string) {
  return useQuery<MasterDivisi>({
    queryKey: ['master-divisi', id],
    queryFn: () => getMasterDivisiById(id!),
    enabled: !!id,
  });
}
