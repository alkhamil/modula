import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce, useClickOutside, useSelectDropdown } from '../../../hooks';
import { stripNonAscii } from '../../../utils';
import { AltArrowDown, AltArrowUp, Check, CloseCircle } from '../../icons';
import type { FieldSize } from './fieldState';
import { MenuItem, MenuPanel, SelectSpinner } from './SelectParts';
import SelectMultiple, { type MultipleSelectProps } from './SelectMultiple';

export interface SelectOption {
  label: string;
  value: string;
  /** Id sumber opsi (mis. master) bila pemanggil butuh nilainya. */
  id?: number;
}

export type LoadOptionsFn = (search?: string, page?: number) => Promise<SelectOption[]>;

interface SingleSelectProps {
  /** Mode single (default). `multiple` memilih mode multiple. */
  multiple?: false;
  /** Ukuran WDS (token Size): xs | sm | md | lg | xl. */
  size?: FieldSize;
  /** Style WDS (mode "Select styles"): box (default) atau underline. */
  appearance?: 'box' | 'underline';
  disabled?: boolean;
  /** State read-only: tampil seperti disabled tetapi nilainya tetap terbaca. */
  readOnly?: boolean;
  /** Pesan error: state error + teks di slot hint (warna danger). */
  error?: string;
  /** Teks pendukung di bawah field (digantikan `error`). */
  hint?: React.ReactNode;
  /** Hanya dokumentasi: paksa state `selected` (terbuka) atau `focused` (cincin fokus). */
  'data-wds-state'?: string;
  placeholder?: string;
  options?: SelectOption[];
  loadOptions?: LoadOptionsFn;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  clearable?: boolean;
  searchable?: boolean;
  /**
   * Saat true, dropdown memuat halaman berikutnya otomatis saat scroll
   * mendekati bawah. `loadOptions(search, page)` dipanggil dengan page
   * 1-based; halaman 1 mengganti daftar, halaman > 1 menambahkan.
   * `hasMore` disimpulkan dari panjang hasil >= `pageSize`.
   */
  paginateOnScroll?: boolean;
  /** Ukuran halaman loader (default 20). */
  pageSize?: number;
  /** Teks saat dropdown tidak punya opsi (default "No options"). */
  emptyOptionsText?: string;
  /**
   * Saat search aktif & hasil pencarian kosong: false = jangan tampilkan
   * opsi yang sedang dipilih (yang dipertahankan label-nya), cukup teks
   * `emptyOptionsText`. Default true (perilaku lama).
   */
  showSelectedOptions?: boolean;
  testId?: string;
  'data-testid'?: string;
  /** Opsi yang return true akan dirender disabled (tidak bisa dipilih). */
  isOptionDisabled?: (option: SelectOption) => boolean;
  /**
   * Label yang sudah diketahui untuk `value` saat ini. Dipakai untuk
   * men-seed daftar opsi SEBELUM `loadOptions` selesai fetch, dan juga
   * dipertahankan kalau hasil fetch (initial load / hasil search) tidak
   * memuat item yang sedang dipilih — ini yang bikin mode edit sempat/terus
   * menampilkan value mentah alih-alih label.
   * Diabaikan kalau `loadOptions` tidak dipakai.
   */
  defaultOption?: SelectOption;
  /**
   * Saat true, trigger menampilkan `value` mentah (mis. code) alih-alih label
   * opsi. Daftar opsi di dropdown tetap menampilkan `label`.
   */
  showValueOnly?: boolean;
  /** Paksa state loading (mis. opsi di-fetch di luar komponen). */
  isLoading?: boolean;
}

function SelectSingle({
  size = 'md',
  appearance = 'box',
  disabled = false,
  readOnly = false,
  error,
  hint,
  'data-wds-state': forcedState,
  placeholder = 'Select...',
  options: staticOptions,
  loadOptions,
  value,
  onChange,
  className = '',
  clearable = true,
  searchable = false,
  paginateOnScroll = false,
  pageSize = 20,
  emptyOptionsText,
  showSelectedOptions = true,
  testId,
  'data-testid': dataTestId,
  defaultOption,
  showValueOnly = false,
  isLoading = false,
  isOptionDisabled,
}: Omit<SingleSelectProps, 'multiple'>) {
  const { t } = useTranslation();
  const resolvedEmptyText = emptyOptionsText ?? t('fields.noOptions');
  const [isOpen, setIsOpen] = useState(false);
  const [loadedOptions, setLoadedOptions] = useState<SelectOption[]>(
    defaultOption ? [defaultOption] : [],
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const options = loadOptions ? loadedOptions : (staticOptions ?? []);
  const displayOptions =
    searchable && searchTerm && !loadOptions
      ? options.filter((o) => o.label.toLowerCase().includes(searchTerm.toLowerCase()))
      : options;
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  // Loading internal (loadOptions) atau dari pemanggil (mis. query eksternal).
  const showLoading = loading || isLoading;
  const searchInputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useClickOutside<HTMLDivElement>(useCallback(() => setIsOpen(false), []));
  const { position: dropdownPosition, dropdownRef } = useSelectDropdown(isOpen, wrapperRef);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const listRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef(1);
  const hasMoreRef = useRef(false);
  const appliedSearchRef = useRef<string | undefined>(undefined);
  // id yang benar-benar berasal dari hasil fetch (bukan entry preserve),
  // + flag search yang sedang aktif — dipakai saat showSelectedOptions=false.
  const [fetchIds, setFetchIds] = useState<Set<string> | null>(null);
  const [hasAppliedSearch, setHasAppliedSearch] = useState(false);

  // Saat search aktif dan showSelectedOptions=false, daftar dropdown hanya
  // menampilkan hasil fetch — entry terpilih yang dipertahankan untuk label
  // chip/trigger tidak ikut tampil (kalau kosong → emptyOptionsText).
  const listOptions =
    hasAppliedSearch && !showSelectedOptions
      ? displayOptions.filter((o) => fetchIds?.has(o.value))
      : displayOptions;

  const selectedLabel = showValueOnly
    ? value
    : (options.find((o) => o.value === value)?.label ?? value);

  // Sinkron ke ref supaya `load` tidak perlu depend ke `value` langsung
  // (kalau iya, effect debounced-search di bawah akan retrigger tiap kali
  // value berubah, bukan cuma saat search term berubah).
  const valueRef = useRef(value);
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const load = useCallback(
    async (search?: string, page?: number) => {
      if (!loadOptions) return;
      const nextPage = page ?? 1;
      appliedSearchRef.current = search;
      hasMoreRef.current = false;
      setLoading(true);
      setLoadError(null);
      try {
        const data = await loadOptions(search, nextPage);
        pageRef.current = nextPage;
        hasMoreRef.current = data.length >= pageSize;
        if (nextPage === 1) setHighlightedIndex(null);
        setFetchIds((prev) =>
          nextPage > 1 && prev
            ? new Set([...prev, ...data.map((o) => o.value)])
            : new Set(data.map((o) => o.value)),
        );
        setHasAppliedSearch(!!search);
        setLoadedOptions((prev) => {
          if (nextPage > 1) {
            const seen = new Set(data.map((o) => o.value));
            return [...prev.filter((o) => !seen.has(o.value)), ...data];
          }
          const currentValue = valueRef.current;
          if (!currentValue) return data;
          // Kalau item yang sedang dipilih tidak ada di halaman hasil ini
          // (umum terjadi: API cuma balikin N item teratas / hasil search),
          // pertahankan entry lama untuk value itu supaya label-nya tidak
          // hilang / jatuh balik ke raw id.
          if (data.some((o) => o.value === currentValue)) return data;
          const existing = prev.find((o) => o.value === currentValue);
          return existing ? [existing, ...data] : data;
        });
      } catch (err) {
        setLoadError(err instanceof Error ? err.message : t('fields.loadFailed'));
      } finally {
        setLoading(false);
      }
    },
    [loadOptions, pageSize, setLoading, setLoadError],
  );

  const initialLoadDone = useRef(false);

  useEffect(() => {
    if (loadOptions && !initialLoadDone.current) {
      initialLoadDone.current = true;
      load();
    }
  }, [loadOptions, load]);

  function handleSearchInput(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(stripNonAscii(e.target.value));
  }

  const debounceLoaded = useRef(false);

  useEffect(() => {
    if (!loadOptions) return;
    if (!debounceLoaded.current) {
      debounceLoaded.current = true;
      return;
    }
    load(debouncedSearchTerm || undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm]);

  const handleListScroll = useCallback(() => {
    if (!paginateOnScroll || !loadOptions || loading || !hasMoreRef.current) return;
    const el = listRef.current;
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 24) {
      load(appliedSearchRef.current, pageRef.current + 1);
    }
  }, [paginateOnScroll, loadOptions, loading, load]);

  function toggle() {
    if (disabled) return;
    if (!isOpen && wrapperRef.current) {
      if (searchable) {
        setSearchTerm('');
        if (loadOptions) load();
        setTimeout(() => searchInputRef.current?.focus(), 50);
      }
    }
    setIsOpen((prev) => !prev);
  }

  function select(opt: SelectOption) {
    onChange(opt.value);
    setIsOpen(false);
    setSearchTerm('');
  }

  function clear(e: React.MouseEvent) {
    e.stopPropagation();
    onChange('');
    setIsOpen(false);
  }

  // Opsi pertama yang bisa dipilih (lewati yang disabled).
  function firstEnabledOption(): SelectOption | null {
    return listOptions.find((o) => !(isOptionDisabled?.(o) ?? false)) ?? null;
  }

  function nearestEnabledIndex(from: number, dir: 1 | -1): number | null {
    const len = listOptions.length;
    let i = from;
    while (i >= 0 && i < len) {
      if (!(isOptionDisabled?.(listOptions[i]) ?? false)) return i;
      i += dir;
    }
    return null;
  }

  // Navigasi arrow: pindah highlight opsi. Saat arrow down menyentuh 2 item
  // terbawah dan masih ada halaman berikutnya (paginateOnScroll), muat halaman
  // berikutnya.
  function moveHighlight(dir: 1 | -1) {
    if (listOptions.length === 0) return;
    const start =
      highlightedIndex == null ? (dir === 1 ? -1 : listOptions.length) : highlightedIndex;
    const target = nearestEnabledIndex(start + dir, dir);
    if (target == null) return;
    setHighlightedIndex(target);
    listRef.current
      ?.querySelector(`[data-focused-index="${target}"]`)
      ?.scrollIntoView({ block: 'nearest' });
    if (
      dir === 1 &&
      paginateOnScroll &&
      !loading &&
      hasMoreRef.current &&
      target >= listOptions.length - 2
    ) {
      load(appliedSearchRef.current, pageRef.current + 1);
    }
  }

  // Enter saat konteks search: jangan submit form — pilih opsi yang sedang
  // di-highlight (fallback opsi teratas) dan biarkan dropdown tetap terbuka
  // supaya user bisa mengetik ulang untuk pencarian berikutnya. Saat tidak ada
  // hasil, dropdown juga tetap terbuka.
  function handleSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!isOpen) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      setHighlightedIndex(null);
      setSearchTerm('');
      searchInputRef.current?.blur();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      moveHighlight(1);
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      moveHighlight(-1);
      return;
    }
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const target =
      highlightedIndex != null && listOptions[highlightedIndex]
        ? listOptions[highlightedIndex]
        : firstEnabledOption();
    if (!target) return;
    onChange(target.value);
    setSearchTerm('');
    setHighlightedIndex(null);
    setHasAppliedSearch(false);
  }

  const inputValue = searchable && isOpen ? searchTerm : value ? selectedLabel : '';

  const invalid = Boolean(error);
  const slot = error ?? hint;
  const open = isOpen || forcedState === 'selected';
  const state = disabled
    ? 'disabled'
    : readOnly
      ? 'read-only'
      : invalid
        ? value
          ? 'error-filled'
          : 'error-empty'
        : open
          ? 'selected'
          : value
            ? 'filled'
            : 'default';
  const interactive = !disabled && !readOnly;

  function handleToggle() {
    if (interactive) toggle();
  }

  const icons = (
    <>
      {showLoading ? (
        <span className="wds-field__icon">
          <SelectSpinner />
        </span>
      ) : value && interactive && clearable ? (
        <button
          type="button"
          onClick={clear}
          aria-label="Clear"
          tabIndex={-1}
          className="wds-field__icon wds-field__action"
        >
          <CloseCircle />
        </button>
      ) : null}
      <span className="wds-field__icon" onClick={searchable ? undefined : handleToggle} aria-hidden="true">
        {open ? <AltArrowUp /> : <AltArrowDown />}
      </span>
    </>
  );

  return (
    <div
      data-testid={dataTestId ?? testId}
      className={['wds-field', className].filter(Boolean).join(' ')}
      data-kind="select"
      data-appearance={appearance}
      data-state={state}
      data-wds-size={size}
      data-wds-state={forcedState}
    >
      <div ref={wrapperRef} className="wds-field__box">
        {searchable ? (
          <div className="wds-field__content">
            <input
              ref={searchInputRef}
              type="text"
              value={inputValue}
              onChange={handleSearchInput}
              onKeyDown={handleSearchKeyDown}
              onFocus={() => {
                if (!isOpen && interactive) toggle();
              }}
              placeholder={placeholder}
              disabled={disabled}
              readOnly={readOnly}
              aria-invalid={invalid ? true : undefined}
              className="wds-field__input"
            />
            {icons}
          </div>
        ) : (
          <div className="wds-field__content">
            <button
              type="button"
              onClick={handleToggle}
              disabled={disabled}
              aria-haspopup="listbox"
              aria-expanded={isOpen}
              aria-invalid={invalid ? true : undefined}
              className="wds-field__trigger"
            >
              <span className="wds-field__value">{value ? selectedLabel : placeholder}</span>
            </button>
            {icons}
          </div>
        )}
      </div>

      {isOpen && dropdownPosition && (
        <MenuPanel
          dropdownRef={dropdownRef}
          position={dropdownPosition}
          size={size}
          listRef={listRef}
          onScroll={handleListScroll}
        >
          {showLoading && loadedOptions.length === 0 ? (
            <div className="flex items-center justify-center py-6 text-[var(--wds-icons-secondary)]">
              <span className="wds-field__icon">
                <SelectSpinner />
              </span>
            </div>
          ) : loadError ? (
            <div className="flex flex-col items-center gap-2 p-4">
              <span className="wds-menu__empty !p-0 !text-[var(--wds-text-danger)]">{loadError}</span>
              <button
                type="button"
                data-state="default"
                onClick={() => load(searchTerm || undefined)}
                className="wds-menu__item !w-auto"
              >
                Retry
              </button>
            </div>
          ) : !showLoading && listOptions.length === 0 ? (
            <p className="wds-menu__empty">{resolvedEmptyText}</p>
          ) : (
            <>
              {listOptions.map((opt, index) => (
                <MenuItem
                  key={opt.value}
                  index={index}
                  disabled={isOptionDisabled?.(opt) ?? false}
                  selected={opt.value === value}
                  highlighted={highlightedIndex === index && opt.value !== value}
                  trailing={opt.value === value ? <Check /> : undefined}
                  onClick={() => select(opt)}
                  onMouseMove={() => {
                    if (!(isOptionDisabled?.(opt) ?? false)) setHighlightedIndex(index);
                  }}
                >
                  {opt.label}
                </MenuItem>
              ))}
              {showLoading && (
                <div className="flex items-center justify-center py-2 text-[var(--wds-icons-secondary)]">
                  <span className="wds-field__icon">
                    <SelectSpinner />
                  </span>
                </div>
              )}
            </>
          )}
        </MenuPanel>
      )}

      {slot && (
        <p className="wds-field__hint" role={error ? 'alert' : undefined} data-testid={error && (dataTestId ?? testId) ? `${dataTestId ?? testId}-error` : undefined}>
          {slot}
        </p>
      )}
    </div>
  );
}

export type SelectProps = SingleSelectProps | MultipleSelectProps;

/**
 * Props longgar untuk pemanggil generik (`FormItem component={Select}`): semua props mode single
 * dan multiple tersedia, `multiple` memilih mode. Pemakaian langsung memakai overload yang ketat.
 */
type SelectLooseProps = Omit<SingleSelectProps, 'multiple' | 'value' | 'onChange'> &
  Partial<Omit<MultipleSelectProps, 'multiple' | 'value' | 'onChange' | keyof SingleSelectProps>> & {
    multiple?: boolean;
    value: string | string[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange: (value: any) => void;
  };

/**
 * Select WDS. Mode single (default) memilih satu opsi; `multiple` memilih banyak opsi
 * (tag, tombol hapus, checkbox di opsi) — sama seperti mode "Select modes" di Figma.
 */
function Select(props: SingleSelectProps): React.ReactElement;
function Select(props: MultipleSelectProps): React.ReactElement;
function Select(props: SelectLooseProps): React.ReactElement;
function Select(props: SelectLooseProps): React.ReactElement {
  const { multiple, ...rest } = props;
  if (multiple) return <SelectMultiple {...(rest as Omit<MultipleSelectProps, 'multiple'>)} />;
  return <SelectSingle {...(rest as Omit<SingleSelectProps, 'multiple'>)} />;
}

export default Select;
