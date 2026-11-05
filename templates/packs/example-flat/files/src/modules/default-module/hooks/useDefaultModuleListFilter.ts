import { t } from 'i18next';
import '../../../shared/i18n';
import { useState } from 'react';
import { useSearchParams } from 'react-router';
import type { FilterField } from '../../../shared/components/ui';
import type { GetDefaultModulesParams } from '../types';
import { useDebounce, useUrlPagination } from '../../../shared/hooks';

export function useDefaultModuleListFilter() {
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
        name: 'name',
        label: t('default_module.fields.name.label'),
        type: 'text',
        placeholder: t('filter.containsPh'),
      },
    {
        name: 'code',
        label: t('default_module.fields.code.label'),
        type: 'text',
        placeholder: t('filter.containsPh'),
      },
    {
        name: 'sortOrder',
        label: t('default_module.fields.sortOrder.label'),
        type: 'text',
      },
  ];

  const { page, setPage, pageSize, setPageSize, handlePageSizeChange } = useUrlPagination();
  const [sortKey, setSortKey] = useState<string | undefined>(undefined);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') ?? '');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [filterValues, setFilterValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    const statusValue = searchParams.get('status');
    if (statusValue) initial.status = statusValue;
    const nameValue = searchParams.get('name');
    if (nameValue) initial.name = nameValue;
    const codeValue = searchParams.get('code');
    if (codeValue) initial.code = codeValue;
    const sortOrderValue = searchParams.get('sortOrder');
    if (sortOrderValue) initial.sortOrder = sortOrderValue;
    return initial;
  });

  const queryParams: GetDefaultModulesParams = {
    search: debouncedSearchQuery || undefined,
    status: filterValues.status || undefined,
    name: filterValues.name || undefined,
    code: filterValues.code || undefined,
    sortOrder: filterValues.sortOrder || undefined,
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
