import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteDefaultModule, restoreDefaultModule, createDefaultModule, updateDefaultModule, bulkUploadDefaultModules } from './resolver';
import type { CreateDefaultModulePayload } from '../types';

export function useDeleteDefaultModule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteDefaultModule(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['default-modules'] }),
  });
}

export function useRestoreDefaultModule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => restoreDefaultModule(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['default-modules'] }),
  });
}

export function useUpsertDefaultModule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id?: string; data: CreateDefaultModulePayload }) =>
      id ? updateDefaultModule(id, data) : createDefaultModule(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['default-modules'] });
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: ['default-module', variables.id] });
      }
    },
  });
}

export function useBulkUploadDefaultModule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => bulkUploadDefaultModules(file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['default-modules'] }),
  });
}
