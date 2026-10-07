import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteMasterDivisi, restoreMasterDivisi, createMasterDivisi, updateMasterDivisi, bulkUploadMasterDivisis } from './resolver';
import type { CreateMasterDivisiPayload } from '../types';

export function useDeleteMasterDivisi() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteMasterDivisi(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['master-divisis'] }),
  });
}

export function useRestoreMasterDivisi() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => restoreMasterDivisi(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['master-divisis'] }),
  });
}

export function useUpsertMasterDivisi() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id?: string; data: CreateMasterDivisiPayload }) =>
      id ? updateMasterDivisi(id, data) : createMasterDivisi(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['master-divisis'] });
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: ['master-divisi', variables.id] });
      }
    },
  });
}

export function useBulkUploadMasterDivisi() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => bulkUploadMasterDivisis(file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['master-divisis'] }),
  });
}
