import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCompany, restoreCompany, createCompany, updateCompany, bulkUploadCompanies } from './resolver';
import type { CreateCompanyPayload } from '../types';

export function useDeleteCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCompany(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['companies'] }),
  });
}

export function useRestoreCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => restoreCompany(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['companies'] }),
  });
}

export function useUpsertCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id?: string; data: CreateCompanyPayload }) =>
      id ? updateCompany(id, data) : createCompany(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: ['company', variables.id] });
      }
    },
  });
}

export function useBulkUploadCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => bulkUploadCompanies(file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['companies'] }),
  });
}
