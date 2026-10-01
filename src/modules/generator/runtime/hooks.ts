/** Hooks TanStack Query + filter untuk runtime modul dinamis. */
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import type { FilterField } from '../../../shared/components/ui';
import { useDebounce, useUrlPagination } from '../../../shared/hooks';
import type { ApiList } from '../../../shared/types';
import type { ModuleDefinition } from '../definitions';
import { getDefinition, listDefinitions } from './definitionsApi';
import { getRecord, listRecords, makeOptionsLoader } from './recordsApi';
import { buildFilterFields } from './filtering';
import type { DynamicDetail, DynamicListItem, DynamicListParams } from './types';

export function useDynamicDefinitions(status = 'published') {
  return useQuery<ModuleDefinition[]>({
    queryKey: ['dynamic-definitions', status],
    queryFn: () => listDefinitions(status),
    placeholderData: (prev) => prev,
  });
}

export function useDynamicDefinition(key: string | undefined) {
  return useQuery<ModuleDefinition>({
    queryKey: ['dynamic-definition', key],
    queryFn: () => getDefinition(key as string),
    enabled: !!key,
  });
}

export function useDynamicDetail(def: ModuleDefinition | undefined, id: string | undefined) {
  return useQuery<DynamicDetail>({
    queryKey: ['dynamic-record', def?.key, id],
    queryFn: () => getRecord(def as ModuleDefinition, id as string),
    enabled: !!def && !!id,
  });
}

/** State filter list generik — meniru `useUserListFilter` untuk sembarang definisi. */
export function useDynamicListFilter(def: ModuleDefinition) {
  const [searchParams] = useSearchParams();
  const { page, setPage, pageSize, setPageSize, handlePageSizeChange } = useUrlPagination();
  const [sortKey, setSortKey] = useState<string | undefined>(undefined);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') ?? '');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const filterFields: FilterField[] = useMemo(
    () => buildFilterFields(def.fields, (field) => makeOptionsLoader(def, field)),
    [def],
  );

  const [filterValues, setFilterValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const field of filterFields) {
      const fromUrl = searchParams.get(field.name);
      if (fromUrl) initial[field.name] = fromUrl;
    }
    return initial;
  });

  const queryParams: DynamicListParams = useMemo(() => {
    const params: DynamicListParams = {
      search: debouncedSearchQuery || undefined,
      order: sortKey,
      sort: sortKey ? sortDir : undefined,
      page,
      size: pageSize,
    };
    for (const [key, value] of Object.entries(filterValues)) {
      if (value) params[key] = value;
    }
    return params;
  }, [debouncedSearchQuery, sortKey, sortDir, page, pageSize, filterValues]);

  const isFilterActive = !!debouncedSearchQuery || Object.values(filterValues).some(Boolean);

  function handleSearchChange(value: string): void {
    setSearchQuery(value);
    setPage(1);
  }

  function handleApply(values: Record<string, string>, options?: { resetPage?: boolean }): void {
    setFilterValues(values);
    if (options?.resetPage !== false) setPage(1);
  }

  function handleReset(): void {
    setFilterValues({});
    setPage(1);
  }

  function handleSort(key: string): void {
    if (key === sortKey) {
      setSortDir((dir) => (dir === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  return {
    filterFields,
    page,
    setPage,
    pageSize,
    setPageSize,
    handlePageSizeChange,
    sortKey,
    sortDir,
    searchQuery,
    filterValues,
    queryParams,
    isFilterActive,
    handleSearchChange,
    handleApply,
    handleReset,
    handleSort,
  };
}

export function useDynamicList(def: ModuleDefinition, params: DynamicListParams) {
  const query = useQuery<ApiList<DynamicListItem>>({
    queryKey: ['dynamic-records', def.key, params],
    queryFn: () => listRecords(def, params),
    placeholderData: (prev) => prev,
  });
  return {
    rows: query.data?.list.content ?? [],
    totalRecords: query.data?.list.pagination?.total_elements ?? 0,
    isLoading: query.isLoading,
    error: query.error ? (query.error as Error).message : null,
    refresh: () => query.refetch(),
  };
}
