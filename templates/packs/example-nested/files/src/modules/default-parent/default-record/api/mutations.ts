import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteDefaultRecord, restoreDefaultRecord, createDefaultRecord, updateDefaultRecord, bulkUploadDefaultRecords } from './resolver';
import type { CreateDefaultRecordPayload } from '../types';

export function useDeleteDefaultRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteDefaultRecord(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['default-records'] }),
  });
}

export function useRestoreDefaultRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => restoreDefaultRecord(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['default-records'] }),
  });
}

export function useUpsertDefaultRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id?: string; data: CreateDefaultRecordPayload }) =>
      id ? updateDefaultRecord(id, data) : createDefaultRecord(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['default-records'] });
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: ['default-record', variables.id] });
      }
    },
  });
}

export function useBulkUploadDefaultRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => bulkUploadDefaultRecords(file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['default-records'] }),
  });
}
