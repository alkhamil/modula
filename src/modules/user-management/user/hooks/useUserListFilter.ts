import { useState } from 'react';
import { useSearchParams } from 'react-router';
import type { FilterField } from '../../../../shared/components/ui';
import type { GetUsersParams } from '../types';
import { getRoleOptions } from '../api';
import { useDebounce, useUrlPagination } from '../../../../shared/hooks';

export function useUserListFilter() {
  const [searchParams] = useSearchParams();
  const { page, setPage, pageSize, setPageSize, handlePageSizeChange } = useUrlPagination();
  const [sortKey, setSortKey] = useState('id');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') ?? '');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [filterValues, setFilterValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    const status = searchParams.get('status');
    const role = searchParams.get('role');
    if (status) initial.status = status;
    if (role) initial.role = role;
    return initial;
  });

  const filterFields: FilterField[] = [
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      placeholder: 'Select status',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ],
    },
    {
      name: 'role',
      label: 'Role',
      type: 'select',
      placeholder: 'Select role',
      loadOptions: getRoleOptions,
    },
  ];

  const queryParams: GetUsersParams = {
    search: debouncedSearchQuery || undefined,
    status: filterValues.status || undefined,
    role: filterValues.role || undefined,
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
