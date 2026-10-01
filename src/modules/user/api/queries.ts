import { useQuery } from '@tanstack/react-query';
import { getUsers, getUserById, getRoleOptions } from './resolver';
import type { GetUsersParams, User, UserListItem, RoleOption } from '../types';
import type { ApiList } from '../../../shared/types';

export function useUserListQuery(params: GetUsersParams) {
  return useQuery<ApiList<UserListItem>>({
    queryKey: ['users', params],
    queryFn: () => getUsers({ ...params, page: (params.page ?? 1) - 1 }),
    placeholderData: (prev) => prev,
  });
}

export function useUserDetailQuery(id?: string) {
  return useQuery<User>({
    queryKey: ['user', id],
    queryFn: () => getUserById(id!),
    enabled: !!id,
  });
}

export function useRoleOptionsQuery() {
  return useQuery<RoleOption[]>({
    queryKey: ['user-role-options'],
    queryFn: getRoleOptions,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}
