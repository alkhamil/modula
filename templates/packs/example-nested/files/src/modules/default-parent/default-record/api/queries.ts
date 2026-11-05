import { useQuery } from '@tanstack/react-query';
import { getDefaultRecords, getDefaultRecordById } from './resolver';
import type { GetDefaultRecordsParams, DefaultRecordListItem, DefaultRecord } from '../types';
import type { ApiList } from '../../../../shared/types';

export function useDefaultRecordListQuery(params: GetDefaultRecordsParams) {
  return useQuery<ApiList<DefaultRecordListItem>>({
    queryKey: ['default-records', params],
    queryFn: () => getDefaultRecords({ ...params, page: (params.page ?? 1) - 1 }),
    placeholderData: (prev) => prev,
  });
}

export function useDefaultRecordDetailQuery(id?: string) {
  return useQuery<DefaultRecord>({
    queryKey: ['default-record', id],
    queryFn: () => getDefaultRecordById(id!),
    enabled: !!id,
  });
}
