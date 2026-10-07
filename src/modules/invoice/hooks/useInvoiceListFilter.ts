import { t } from 'i18next';
import '../../../shared/i18n';
import { useState } from 'react';
import { useSearchParams } from 'react-router';
import type { FilterField } from '../../../shared/components/ui';
import type { GetInvoicesParams } from '../types';
import { useDebounce, useUrlPagination } from '../../../shared/hooks';
import { loadSellerOptions, loadBuyerOptions } from '../api';

export function useInvoiceListFilter() {
  const [searchParams] = useSearchParams();
  // filterFields di dalam hook agar t() dievaluasi setelah locale modul terdaftar.
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
        label: t('invoice.fields.dateOfIssue.label'),
        type: 'date',
        range: true,
        rangeErrorMessage: t('validation.rangeRequired', { label: t('invoice.fields.dateOfIssue.label') }),
      },
    {
        name: 'dueDate',
        label: t('invoice.fields.dueDate.label'),
        type: 'date',
        range: true,
        rangeErrorMessage: t('validation.rangeRequired', { label: t('invoice.fields.dueDate.label') }),
      },
    {
        name: 'seller',
        label: t('invoice.fields.seller.label'),
        type: 'select',
        loadOptions: loadSellerOptions,
      },
    {
        name: 'buyer',
        label: t('invoice.fields.buyer.label'),
        type: 'select',
        loadOptions: loadBuyerOptions,
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
