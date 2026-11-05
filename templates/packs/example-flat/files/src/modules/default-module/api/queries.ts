import { useQuery } from '@tanstack/react-query';
import { getDefaultModules, getDefaultModuleById } from './resolver';
import type { GetDefaultModulesParams, DefaultModuleListItem, DefaultModule } from '../types';
import type { ApiList } from '../../../shared/types';

export function useDefaultModuleListQuery(params: GetDefaultModulesParams) {
  return useQuery<ApiList<DefaultModuleListItem>>({
    queryKey: ['default-modules', params],
    queryFn: () => getDefaultModules({ ...params, page: (params.page ?? 1) - 1 }),
    placeholderData: (prev) => prev,
  });
}

export function useDefaultModuleDetailQuery(id?: string) {
  return useQuery<DefaultModule>({
    queryKey: ['default-module', id],
    queryFn: () => getDefaultModuleById(id!),
    enabled: !!id,
  });
}
