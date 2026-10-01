import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteUser, restoreUser, createUser, updateUser, bulkUploadUsers } from './resolver';
import type { CreateUserPayload } from '../types';

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
}

export function useRestoreUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => restoreUser(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
}

export function useUpsertUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id?: string; data: CreateUserPayload }) =>
      id ? updateUser(id, data) : createUser(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: ['user', variables.id] });
      }
    },
  });
}

export function useBulkUploadUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => bulkUploadUsers(file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
}
