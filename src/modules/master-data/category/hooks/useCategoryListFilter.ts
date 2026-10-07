import { t } from 'i18next';
import '../../../../shared/i18n';
import { useState } from 'react';
import { useSearchParams } from 'react-router';
import type { FilterField } from '../../../../shared/components/ui';
import type { GetCategoriesParams } from '../types';
import { useDebounce, useUrlPagination } from '../../../../shared/hooks';
import { loadRegionOptions } from '../api';

export function useCategoryListFilter() {
  const [searchParams] = useSearchParams();
  // filterFields dibangun di dalam hook: t() modul dievaluasi saat render,
  // setelah addModuleLocales terdaftar (konstanta level-modul membeku jadi key mentah).
  const filterFields: FilterField[] = [
    {
        name: 'status',
        label: t('table.status'),
        type: 'select',
        options: [
          { label: t('common.active'), value: 'active' },
          { label: t('common.inactive'), value: 'inactive' },
        ],
      },
    {
        name: 'region',
        label: t('category.fields.region.label'),
        type: 'select',
        loadOptions: loadRegionOptions,
      },
  ];

  const { page, setPage, pageSize, setPageSize, handlePageSizeChange } = useUrlPagination();
  const [sortKey, setSortKey] = useState<string | undefined>(undefined);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') ?? '');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [filterValues, setFilterValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    const status = searchParams.get('status');
    if (status) initial.status = status;
    const region = searchParams.get('region');
    if (region) initial.region = region;
    return initial;
  });

  const queryParams: GetCategoriesParams = {
    search: debouncedSearchQuery || undefined,
    status: filterValues.status || undefined,
    region: filterValues.region || undefined,
    order: sortKey,
    sort: sortKey ? sortDir : undefined,
    page,
    size: pageSize,
  };

  const isFilterActive = !!debouncedSearchQuery || Object.values(filterValues).some(Boolean);

  function handleSearchChange(value: string) {
    setSearchQuery(value);
    setPage(1);
  }

  function handleApply(values: Record<string, string>, options?: { resetPage?: boolean }) {
    setFilterValues(values);
    if (options?.resetPage !== false) setPage(1);
  }

  function handleReset() {
    setFilterValues({});
    setPage(1);
  }

  function handleSort(key: string) {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
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
