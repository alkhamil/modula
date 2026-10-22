import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce, useClickOutside, useSelectDropdown } from '../../../hooks';
import { stripNonAscii } from '../../../utils';
import type { SelectOption, LoadOptionsFn } from './Select';
import { AltArrowDown, AltArrowUp, Check, CloseCircle } from '../../icons';
import type { FieldSize } from './fieldState';
import { MenuItem, MenuPanel, SelectSpinner } from './SelectParts';

function dedupeByValue(list: SelectOption[]): SelectOption[] {
  const seen = new Set<string>();
  const out: SelectOption[] = [];
  for (const opt of list) {
    if (seen.has(opt.value)) continue;
    seen.add(opt.value);
    out.push(opt);
  }
  return out;
}

export interface MultipleSelectProps {
  /** Mode multiple (nilai `string[]`). */
  multiple: true;
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
  value: string[];
  onChange: (values: string[]) => void;
  className?: string;
  clearable?: boolean;
  searchable?: boolean;
  /**
   * Opsi awal yang sudah diketahui (misal dari detail) untuk value yang
   * sedang dipilih — dipakai men-seed daftar sebelum `loadOptions` selesai
   * dan dipertahankan kalau hasil fetch tidak memuatnya.
   */
  defaultOptions?: SelectOption[];
  /**
   * Saat true, dropdown memuat halaman berikutnya otomatis saat scroll
   * mendekati bawah. `loadOptions(search, page)` dipanggil dengan page
   * 1-based; halaman 1 mengganti daftar, halaman > 1 menambahkan.
   * `hasMore` disimpulkan dari panjang hasil >= `pageSize`.
   */
  paginateOnScroll?: boolean;
  /** Ukuran halaman loader (default 20). */
  pageSize?: number;
  /**
   * Saat search aktif & hasil pencarian kosong: false = jangan tampilkan
   * opsi yang sedang dipilih (yang dipertahankan label-nya), cukup teks
   * `emptyOptionsText`. Default true (perilaku lama).
   */
  showSelectedOptions?: boolean;
  emptyOptionsText?: string;
  /**
   * When true, selected items are summarized as a single "[n] items
   * selected" chip instead of individual chips (avoids wrapping when many
   * options are selected, e.g. inside table cells).
   */
  chipsSummary?: boolean;
  /** Format teks ringkasan saat chipsSummary aktif (default "[n] items selected"). */
  summaryFormat?: (count: number) => string;
  /** Menutup dropdown setelah satu pilihan (pick satu per satu). */
  closeOnSelect?: boolean;
  /** Sembunyikan checkbox pada opsi dropdown. */
  hideCheckBox?: boolean;
  /** Format teks chip terpilih (default = o.label). */
  chipLabel?: (option: SelectOption) => string;
  testId?: string;
  'data-testid'?: string;
  /** Opsi yang return true dirender disabled (tidak bisa dipilih). */
  isOptionDisabled?: (option: SelectOption) => boolean;
}

function SelectMultiple({
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
  // Nilai bisa `undefined` saat form induk belum memberi default (mis.
  // pratinjau kanvas) — normalisasi ke array agar `.length`/`.includes`
  // tidak melempar TypeError.
  value = [],
  onChange,
  className = '',
  clearable = true,
  searchable = false,
  defaultOptions,
  paginateOnScroll = false,
  pageSize = 20,
  showSelectedOptions = true,
  emptyOptionsText,
  chipsSummary = false,
  summaryFormat = (count) => `${count} items selected`,
  closeOnSelect = false,
  hideCheckBox = false,
  chipLabel,
  testId,
  'data-testid': dataTestId,
  isOptionDisabled,
}: Omit<MultipleSelectProps, 'multiple'>) {
  const { t } = useTranslation();
  const resolvedEmptyText = emptyOptionsText ?? t('fields.noOptions');
  const [isOpen, setIsOpen] = useState(false);
  const [loadedOptions, setLoadedOptions] = useState<SelectOption[]>(
    dedupeByValue(defaultOptions ?? []),
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
  // chip tidak ikut tampil (kalau kosong → emptyOptionsText).
  const listOptions =
    hasAppliedSearch && !showSelectedOptions
      ? options.filter((o) => fetchIds?.has(o.value))
      : displayOptions;

  const valueRef = useRef(value);
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  // chipsSummary: only collapse to "[n] items selected" when the selected
  // chips would overflow the trigger's available width; otherwise show them.
  const [summaryOverflow, setSummaryOverflow] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  const applyMeasurement = useCallback(() => {
    const content = contentRef.current;
    const measure = measureRef.current;
    if (!content || !measure) return;
    const available = content.clientWidth - (searchable ? 64 : 0);
    setSummaryOverflow(measure.offsetWidth > available);
  }, [searchable]);

  useLayoutEffect(() => {
    if (!chipsSummary || value.length === 0) {
      // Measuring chips width is external-DOM sync; a render after
      // measurement is required. The resize observer handles container
      // resizes (window/table scroll changes).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSummaryOverflow(false);
      return;
    }
    applyMeasurement();
    const content = contentRef.current;
    if (!content) return;
    const ro = new ResizeObserver(applyMeasurement);
    ro.observe(content);
    return () => ro.disconnect();
  }, [value, chipsSummary, applyMeasurement]);

  const showChipsSummary = chipsSummary && value.length > 0 && summaryOverflow;
  const chipClasses = 'wds-field__tag';

  const selectedOptions = options.filter((o) => value.includes(o.value));

  const renderChips = selectedOptions.map((opt) => (
    <span key={opt.value} className={chipClasses}>
      <span className="wds-field__tag-label">{chipLabel ? chipLabel(opt) : opt.label}</span>
      <button
        type="button"
        aria-label="Remove"
        onClick={(e) => {
          if (disabled || readOnly) return;
          removeValue(opt.value, e);
        }}
        className="wds-field__tag-remove"
        tabIndex={-1}
      >
        <CloseCircle />
      </button>
    </span>
  ));

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
          const currentValues = valueRef.current;
          if (!currentValues.length) return dedupeByValue(data);
          // Pertahankan entry terpilih yang tidak ada di hasil fetch/search
          // supaya tag-nya tidak hilang saat dropdown dalam mode search.
          const selected = prev.filter(
            (o) => currentValues.includes(o.value) && !data.some((d) => d.value === o.value),
          );
          return dedupeByValue([...selected, ...data]);
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

  function toggleOption(opt: SelectOption) {
    if (value.includes(opt.value)) {
      onChange(value.filter((v) => v !== opt.value));
    } else {
      onChange([...value, opt.value]);
    }
    setSearchTerm('');
    if (closeOnSelect) setIsOpen(false);
  }

  function removeValue(val: string, e: React.MouseEvent) {
    e.stopPropagation();
    onChange(value.filter((v) => v !== val));
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
  // (abaikan closeOnSelect) supaya user bisa mengetik ulang untuk pencarian
  // berikutnya. Saat tidak ada hasil, dropdown juga tetap terbuka.
  function handleSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!isOpen) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      setSearchTerm('');
      setHighlightedIndex(null);
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
    if (value.includes(target.value)) {
      onChange(value.filter((v) => v !== target.value));
    } else {
      onChange([...value, target.value]);
    }
    setSearchTerm('');
    setHighlightedIndex(null);
    setHasAppliedSearch(false);
  }

  function clearAll(e: React.MouseEvent) {
    e.stopPropagation();
    onChange([]);
  }

  const invalid = Boolean(error);
  const slot = error ?? hint;
  const open = isOpen || forcedState === 'selected';
  const filled = value.length > 0;
  const state = disabled
    ? 'disabled'
    : readOnly
      ? 'read-only'
      : invalid
        ? filled
          ? 'error-filled'
          : 'error-empty'
        : open
          ? 'selected'
          : filled
            ? 'filled'
            : 'default';
  const interactive = !disabled && !readOnly;

  function handleToggle() {
    if (interactive) toggle();
  }

  const showClear = !loading && interactive && clearable && filled;

  const triggerContent = (
    <>
      <div ref={contentRef} className="wds-field__tags">
        {showChipsSummary ? (
          <span className={chipClasses}>
            <span className="wds-field__tag-label">{summaryFormat(value.length)}</span>
          </span>
        ) : (
          filled && renderChips
        )}
        {searchable ? (
          <input
            ref={searchInputRef}
            type="text"
            value={searchTerm}
            onChange={handleSearchInput}
            onKeyDown={handleSearchKeyDown}
            onFocus={() => {
              if (!isOpen && interactive) toggle();
            }}
            onClick={(e) => e.stopPropagation()}
            placeholder={filled ? '' : placeholder}
            disabled={disabled}
            readOnly={readOnly}
            aria-invalid={invalid ? true : undefined}
            className="wds-field__input min-w-15"
          />
        ) : !filled ? (
          <span className="wds-field__value">{placeholder}</span>
        ) : null}
      </div>
      {loading && (
        <span className="wds-field__icon">
          <SelectSpinner />
        </span>
      )}
      {showClear && (
        <>
          <button
            type="button"
            onClick={clearAll}
            aria-label="Clear"
            tabIndex={-1}
            className="wds-field__icon wds-field__action"
          >
            <CloseCircle />
          </button>
          <span className="wds-field__divider" aria-hidden="true" />
        </>
      )}
      <span className="wds-field__icon" aria-hidden="true">
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
          <div className="wds-field__content" onClick={handleToggle}>
            {triggerContent}
          </div>
        ) : (
          <button
            type="button"
            onClick={handleToggle}
            disabled={disabled}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-invalid={invalid ? true : undefined}
            className="wds-field__content wds-field__trigger"
          >
            {triggerContent}
          </button>
        )}
        {chipsSummary && filled && (
          <div
            ref={measureRef}
            aria-hidden="true"
            className="pointer-events-none invisible absolute top-0 left-[-9999px] flex w-max flex-nowrap items-center gap-1"
          >
            {renderChips}
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
          {loading && loadedOptions.length === 0 ? (
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
          ) : !loading && listOptions.length === 0 ? (
            <p className="wds-menu__empty">{resolvedEmptyText}</p>
          ) : (
            <>
              {listOptions.map((opt, index) => {
                const isSelected = value.includes(opt.value);
                const optionDisabled = isOptionDisabled?.(opt) ?? false;
                return (
                  <MenuItem
                    key={opt.value}
                    index={index}
                    disabled={optionDisabled}
                    selected={isSelected && hideCheckBox}
                    highlighted={highlightedIndex === index && !(isSelected && hideCheckBox)}
                    leading={
                      !hideCheckBox ? (
                        <span className="wds-menu__check" data-checked={isSelected ? 'true' : 'false'}>
                          {isSelected && <Check />}
                        </span>
                      ) : undefined
                    }
                    onClick={() => toggleOption(opt)}
                    onMouseMove={() => {
                      if (!optionDisabled) setHighlightedIndex(index);
                    }}
                  >
                    {opt.label}
                  </MenuItem>
                );
              })}
              {loading && (
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
        <p
          data-testid={error && (dataTestId ?? testId) ? `${dataTestId ?? testId}-error` : undefined}
          className="wds-field__hint"
          role={error ? 'alert' : undefined}
        >
          {slot}
        </p>
      )}
    </div>
  );
}

export default SelectMultiple;
