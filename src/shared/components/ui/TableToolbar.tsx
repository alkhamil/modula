import { useState, useEffect, useRef, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { createPortal } from 'react-dom';
import { useSearchParams } from 'react-router';
import { useDebounce } from '../../hooks';
import InputField from './fields/InputField';
import Textarea from './fields/Textarea';
import Select from './fields/Select';
import DatePicker from './fields/date-picker/DatePicker';
import Checkbox from './fields/Checkbox';
import CheckboxGroup from './fields/CheckboxGroup';
import Toggle from './fields/Toggle';
import RadioButtonGroup from './fields/RadioButtonGroup';
import type { LoadOptionsFn } from './fields/Select';
import Button from './Button';
import { Cross, Filter, Magnifer } from '../icons';

export interface FilterField {
  name: string;
  label: string;
  type:
    | 'text'
    | 'select'
    | 'multi-select'
    | 'date'
    | 'textarea'
    | 'checkbox'
    | 'checkbox-group'
    | 'switch'
    | 'radio';
  options?: { label: string; value: string }[];
  loadOptions?: LoadOptionsFn;
  placeholder?: string;
  range?: boolean;
  /** Pesan error saat date range hanya terisi salah satu (start/end). */
  rangeErrorMessage?: string;
  maxDate?: Date;
  maxRangeDays?: number;
  checkboxLabel?: string;
  checkedLabel?: string;
  uncheckedLabel?: string;
  clearable?: boolean;
}

interface TableToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filterFields: FilterField[];
  filterValues?: Record<string, string>;
  /** Nilai default field (ditampilkan saat panel dibuka) — tidak dihitung sebagai filter aktif. */
  defaultValues?: Record<string, string>;
  onApply: (values: Record<string, string>, options?: { resetPage?: boolean }) => void;
  onReset: () => void;
  className?: string;
  searchParamName?: string;
  debounceMs?: number;
  filterTitle?: string;
  testId?: string;
  withFilterButton?: boolean;
  /** Tombol aksi tambahan di kanan, mis. Export (Figma Table Toolbar "Button"). */
  actions?: ReactNode;
  /** Konten di kiri sebelum pencarian, mis. Tabs / SegmentedControl (Figma "Calendar" type). */
  leading?: ReactNode;
}

function validateRangeErrors(
  values: Record<string, string>,
  fields: FilterField[],
): Record<string, string> {
  const errors: Record<string, string> = {};
  fields.forEach((field) => {
    if (field.type !== 'date' || !field.range || !field.rangeErrorMessage) return;
    const [start, end] = (values[field.name] ?? '').split(',');
    if (!!start !== !!end) errors[field.name] = field.rangeErrorMessage;
  });
  return errors;
}

function TableToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder,
  filterFields,
  filterValues = {},
  defaultValues = {},
  onApply,
  onReset,
  className = '',
  searchParamName,
  debounceMs = 300,
  filterTitle,
  testId,
  withFilterButton = true,
  actions,
  leading,
}: TableToolbarProps) {
  const { t } = useTranslation();
  const resolvedSearchPlaceholder = searchPlaceholder ?? t('filter.search');
  const resolvedFilterTitle = filterTitle ?? t('filter.title');
  const [isOpen, setIsOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [localValues, setLocalValues] = useState<Record<string, string>>({
    ...defaultValues,
    ...filterValues,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const hasActive = Object.entries(filterValues).some(
    ([key, value]) => value !== '' && value !== (defaultValues[key] ?? ''),
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const initialised = useRef(false);
  const debouncedSearch = useDebounce(searchValue, debounceMs);

  useEffect(() => {
    if (!isOpen) return;
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => {
      cancelAnimationFrame(frame);
      setVisible(false);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (initialised.current || !searchParamName) return;
    initialised.current = true;

    const urlSearch = searchParams.get(searchParamName) ?? '';
    if (urlSearch && urlSearch !== searchValue) {
      onSearchChange(urlSearch);
    }

    const urlFilters: Record<string, string> = {};
    filterFields.forEach((f) => {
      const v = searchParams.get(f.name);
      if (v) urlFilters[f.name] = v;
    });
    if (Object.keys(urlFilters).length > 0) {
      // Inisialisasi dari URL: jangan reset page agar posisi halaman terakhir
      // tetap bertahan saat refresh.
      onApply(urlFilters, { resetPage: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sinkronkan search + filter ke URL dalam SATU setSearchParams. react-router
  // menghitung target dari searchParams render saat itu (tidak compose antar
  // panggilan), jadi dua setSearchParams di tick yang sama saling menimpa
  // (mis. filter hilang saat Apply karena tabrakan dengan reset page).
  // Effect ini juga menghapus `page` agar Apply/Reset/Search selalu kembali
  // ke halaman 1 dalam SATU tulis atomik — mengandalkan setPage(1) terpisah
  // saja tidak cukup karena prev-nya stale (page=x ikut terbawa lagi).
  // Init dari URL dilewat sekali (syncedOnce) agar refresh/back tetap di page
  // terakhir; hook filter wajib init filterValues dari URL supaya init tidak
  // memicu run kedua yang ikut me-reset page.
  const syncedOnce = useRef(false);
  const filterValuesKey = JSON.stringify(filterValues);
  useEffect(() => {
    if (!searchParamName) return;
    if (!syncedOnce.current) {
      syncedOnce.current = true;
      return;
    }
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (debouncedSearch) {
          next.set(searchParamName, debouncedSearch);
        } else {
          next.delete(searchParamName);
        }
        filterFields.forEach((f) => {
          if (filterValues[f.name]) {
            next.set(f.name, filterValues[f.name]);
          } else {
            next.delete(f.name);
          }
        });
        next.delete('page');
        return next;
      },
      { replace: true },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, filterValuesKey, searchParamName, setSearchParams]);

  function open() {
    setLocalValues({ ...defaultValues, ...filterValues });
    setErrors({});
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  function handleApply() {
    const nextErrors = validateRangeErrors(localValues, filterFields);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    onApply(localValues);
    setIsOpen(false);
  }

  function handleReset() {
    setLocalValues(defaultValues);
    setErrors({});
    onReset();
    setIsOpen(false);
  }

  return (
    <div
      data-testid={testId}
      data-filtered={hasActive || undefined}
      className={`wds-toolbar ${className}`}
    >
      <div className="wds-toolbar__group">
        {leading}
      <div className="w-80">
        <InputField
          size="md"
          placeholder={resolvedSearchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          prepend={<Magnifer className="text-muted-foreground" />}
          clearable
          maxLength={100}
          sanitize={(value) => value.replace(/[^A-Za-z0-9 ._@-]/g, '').trimStart()}
        />
      </div>
      </div>
      <div className="wds-toolbar__group">
        {hasActive && (
          <Button hierarchy="text" size="md" onClick={handleReset}>
            {t('filter.resetFilter', { defaultValue: 'Reset Filter' })}
          </Button>
        )}
      <div className={withFilterButton ? 'visible' : 'hidden'}>
        <Button
          hierarchy={hasActive ? 'tonal' : 'secondary'}
          size="md"
          leadingIcon={<Filter />}
          onClick={open}
        >
          {resolvedFilterTitle}
        </Button>

        {isOpen &&
          createPortal(
            <div className="fixed inset-0 z-50">
              <div
                data-testid={testId ? `${testId}-backdrop` : undefined}
                className={[
                  'wds-overlay__backdrop transition-opacity duration-200',
                  visible ? 'opacity-100' : 'opacity-0',
                ].join(' ')}
                onClick={close}
              />
              <aside
                role="dialog"
                aria-label={resolvedFilterTitle}
                data-testid={testId ? `${testId}-drawer` : undefined}
                className={[
                  'wds-drawer absolute inset-y-0 right-0 w-96',
                  visible ? 'translate-x-0' : 'translate-x-full',
                ].join(' ')}
              >
                <div className="wds-drawer__header">
                  <h3 className="wds-drawer__title">{resolvedFilterTitle}</h3>
                  <button
                    data-testid={testId ? `${testId}-close` : undefined}
                    type="button"
                    onClick={close}
                    aria-label={t('common.close')}
                    className="wds-dialog__close"
                  >
                    <Cross />
                  </button>
                </div>

                <div className="wds-drawer__body">
                  <div className="flex flex-col stack-gap">
                    {filterFields.map((field) => (
                      <div key={field.name}>
                        <label className="mb-1 block text-sm font-medium text-foreground">
                          {field.label}
                        </label>
                        {field.type === 'multi-select' ? (
                          <Select
                            multiple
                            size="md"
                            placeholder={field.placeholder ?? t('filter.all')}
                            searchable
                            value={
                              localValues[field.name]
                                ? localValues[field.name].split(',').filter(Boolean)
                                : []
                            }
                            onChange={(vals) =>
                              setLocalValues((prev) => ({ ...prev, [field.name]: vals.join(',') }))
                            }
                            options={field.options}
                            loadOptions={field.loadOptions}
                          />
                        ) : field.type === 'select' ? (
                          <Select
                            size="md"
                            placeholder={field.placeholder ?? t('filter.all')}
                            searchable
                            clearable={field.clearable}
                            value={localValues[field.name] ?? ''}
                            onChange={(val) =>
                              setLocalValues((prev) => ({ ...prev, [field.name]: val }))
                            }
                            options={field.options}
                            loadOptions={field.loadOptions}
                          />
                        ) : field.type === 'date' ? (
                          field.range ? (
                            <DatePicker
                              range
                              size="md"
                              panelWidthClassName="w-72"
                              placeholder={field.placeholder}
                              maxDate={field.maxDate}
                              maxRangeDays={field.maxRangeDays}
                              error={errors[field.name]}
                              value={localValues[field.name] ?? ''}
                              onChange={(val) => {
                                setErrors((prev) => {
                                  if (!prev[field.name]) return prev;
                                  const next = { ...prev };
                                  delete next[field.name];
                                  return next;
                                });
                                setLocalValues((prev) => ({ ...prev, [field.name]: val }));
                              }}
                            />
                          ) : (
                            <DatePicker
                              size="md"
                              panelWidthClassName="w-72"
                              placeholder={field.placeholder ?? t('filter.all')}
                              maxDate={field.maxDate}
                              value={localValues[field.name] ?? ''}
                              onChange={(val) =>
                                setLocalValues((prev) => ({ ...prev, [field.name]: val }))
                              }
                            />
                          )
                        ) : field.type === 'textarea' ? (
                          <Textarea
                            size="md"
                            placeholder={field.placeholder || t('filter.all')}
                            value={localValues[field.name] ?? ''}
                            onChange={(e) =>
                              setLocalValues((prev) => ({ ...prev, [field.name]: e.target.value }))
                            }
                          />
                        ) : field.type === 'checkbox-group' ? (
                          <CheckboxGroup
                            size="md"
                            value={
                              localValues[field.name]
                                ? localValues[field.name].split(',').filter(Boolean)
                                : []
                            }
                            onChange={(vals) =>
                              setLocalValues((prev) => ({ ...prev, [field.name]: vals.join(',') }))
                            }
                            options={field.options ?? []}
                          />
                        ) : field.type === 'checkbox' ? (
                          <Checkbox
                            size="md"
                            value={localValues[field.name] === 'true'}
                            onChange={(val) =>
                              setLocalValues((prev) => ({
                                ...prev,
                                [field.name]: val ? 'true' : '',
                              }))
                            }
                            checkboxLabel={field.checkboxLabel}
                          />
                        ) : field.type === 'switch' ? (
                          <Toggle
                            size="md"
                            value={localValues[field.name] === 'true'}
                            onChange={(val) =>
                              setLocalValues((prev) => ({
                                ...prev,
                                [field.name]: val ? 'true' : '',
                              }))
                            }
                            checkedLabel={field.checkedLabel}
                            uncheckedLabel={field.uncheckedLabel}
                          />
                        ) : field.type === 'radio' ? (
                          <RadioButtonGroup
                            size="md"
                            value={localValues[field.name] ?? ''}
                            onChange={(val) =>
                              setLocalValues((prev) => ({ ...prev, [field.name]: val }))
                            }
                            options={field.options ?? []}
                          />
                        ) : (
                          <InputField
                            size="md"
                            placeholder={field.placeholder || t('filter.all')}
                            value={localValues[field.name] ?? ''}
                            clearable={field.clearable}
                            onChange={(e) =>
                              setLocalValues((prev) => ({ ...prev, [field.name]: e.target.value }))
                            }
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="wds-drawer__footer">
                  <Button
                    testId={testId ? `${testId}-reset` : undefined}
                    className="flex-1"
                    variant="secondary"
                    onClick={handleReset}
                  >
                    {t('common.reset')}
                  </Button>
                  <Button
                    testId={testId ? `${testId}-apply` : undefined}
                    className="flex-1"
                    onClick={handleApply}
                  >
                    {t('common.apply')}
                  </Button>
                </div>
              </aside>
            </div>,
            document.body,
          )}
      </div>
        {actions}
      </div>
    </div>
  );
}

export default TableToolbar;
