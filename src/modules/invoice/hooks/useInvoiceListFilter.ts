import { t } from 'i18next';
import '../../../shared/i18n';
import { useState } from 'react';
import { useSearchParams } from 'react-router';
import type { FilterField } from '../../../shared/components/ui';
import type { GetInvoicesParams } from '../types';
import { useDebounce, useUrlPagination } from '../../../shared/hooks';
import { loadSellerOptions, loadBuyerOptions } from '../api';

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
      name: 'dateOfIssue',
      label: 'Date Of Issue',
      type: 'date',
      range: true,
      rangeErrorMessage: t('validation.rangeRequired', { label: 'Date Of Issue' }),
    },
  {
      name: 'dueDate',
      label: 'Due Date',
      type: 'date',
      range: true,
      rangeErrorMessage: t('validation.rangeRequired', { label: 'Due Date' }),
    },
  {
      name: 'seller',
      label: 'Seller',
      type: 'select',
      loadOptions: loadSellerOptions,
    },
  {
      name: 'buyer',
      label: 'Buyer',
      type: 'select',
      loadOptions: loadBuyerOptions,
    },
];

export function useInvoiceListFilter() {
  const [searchParams] = useSearchParams();
  const { page, setPage, pageSize, setPageSize, handlePageSizeChange } = useUrlPagination();
  const [sortKey, setSortKey] = useState<string | undefined>(undefined);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') ?? '');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [filterValues, setFilterValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    const status = searchParams.get('status');
    if (status) initial.status = status;
    const dateOfIssue = searchParams.get('dateOfIssue');
    if (dateOfIssue) initial.dateOfIssue = dateOfIssue;
    const dueDate = searchParams.get('dueDate');
    if (dueDate) initial.dueDate = dueDate;
    const seller = searchParams.get('seller');
    if (seller) initial.seller = seller;
    const buyer = searchParams.get('buyer');
    if (buyer) initial.buyer = buyer;
    return initial;
  });

  const queryParams: GetInvoicesParams = {
    search: debouncedSearchQuery || undefined,
    status: filterValues.status || undefined,
    dateOfIssue: filterValues.dateOfIssue || undefined,
    dueDate: filterValues.dueDate || undefined,
    seller: filterValues.seller || undefined,
    buyer: filterValues.buyer || undefined,
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
