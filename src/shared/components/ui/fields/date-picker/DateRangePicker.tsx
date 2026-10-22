import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createPortal } from 'react-dom';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DatePicker.css';
import { useSelectDropdown } from '../../../../hooks';
import DatePickerHeader, { YEAR_ITEM_COUNT, type PickerView } from './DatePickerHeader';
import { DateFieldShell, DateIcons, dateFieldState } from './DateFieldShell';
import type { FieldSize } from '../fieldState';

export interface RangeDatePickerProps {
  /** Mode rentang tanggal (`value` = "awal,akhir"). */
  range: true;
  /** Ukuran WDS (token Size): xs | sm | md | lg | xl. */
  size?: FieldSize;
  /** Style WDS (mode "Date Picker styles"): box (default) atau underline. */
  appearance?: 'box' | 'underline';
  disabled?: boolean;
  /** State read-only: tampil seperti disabled; kalender tidak bisa dibuka. */
  readOnly?: boolean;
  /** Pesan error: state error + teks di slot hint (warna danger). */
  error?: string;
  /** Teks pendukung di bawah field (digantikan `error`). */
  hint?: React.ReactNode;
  /** Hanya dokumentasi: paksa state `selected` (terbuka) atau `focused` (cincin fokus). */
  'data-wds-state'?: string;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  maxRangeDays?: number;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  /** Lebar panel kalender (default: 'w-80' agar sel tanggal tidak melar). */
  panelWidthClassName?: string;
  testId?: string;
  'data-testid'?: string;
}

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

function toDate(value: string): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

function toIso(date: Date | null): string {
  if (!date) return '';
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

function toDisplay(date: Date | null): string {
  if (!date) return '';
  return `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}/${date.getFullYear()}`;
}

function parseRange(value: string): [Date | null, Date | null] {
  if (!value) return [null, null];
  const parts = value.split(',');
  return [toDate(parts[0]), toDate(parts[1] ?? '')];
}

function formatRange(start: Date | null, end: Date | null): string {
  if (!start) return '';
  if (!end) return toIso(start);
  return `${toIso(start)},${toIso(end)}`;
}

function formatDisplay(value: string): string {
  if (!value) return '';
  const [start, end] = parseRange(value);
  if (start && end) return `${toDisplay(start)} - ${toDisplay(end)}`;
  return toDisplay(start);
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  d.setDate(d.getDate() + days);
  return d;
}

function DateRangePicker({
  size = 'md',
  appearance = 'box',
  disabled = false,
  readOnly = false,
  error,
  hint,
  'data-wds-state': forcedState,
  placeholder = 'Select date range',
  minDate,
  maxDate,
  maxRangeDays,
  value,
  onChange,
  className = '',
  panelWidthClassName = 'w-80',
  testId,
  'data-testid': dataTestId,
}: Omit<RangeDatePickerProps, 'range'>) {
  const resolvedTestId = dataTestId ?? testId;
  const { t } = useTranslation();
  const resolvedPlaceholder = placeholder ?? t('fields.selectDateRange');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<PickerView>('date');
  const [cursor, setCursor] = useState(() => new Date());
  const [draftStart, setDraftStart] = useState<Date | null>(null);
  const [draftEnd, setDraftEnd] = useState<Date | null>(null);
  const { position: dropdownPosition, dropdownRef: panelRef } = useSelectDropdown(
    open,
    wrapperRef,
    320,
    380,
  );

  useEffect(() => {
    if (!open) return;
    function handleMouseDown(e: MouseEvent) {
      const target = e.target as Node;
      if (wrapperRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      setOpen(false);
    }
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [open, panelRef]);

  const [startDate, endDate] = parseRange(value);

  const activeStart = open ? draftStart : startDate;
  const activeEnd = open ? draftEnd : endDate;

  const isSelectingEnd = !!maxRangeDays && !!activeStart && !activeEnd;
  const rangeMinDate = isSelectingEnd ? addDays(activeStart, -maxRangeDays) : undefined;
  const rangeMaxDate = isSelectingEnd ? addDays(activeStart, maxRangeDays) : undefined;
  const effectiveMinDate =
    rangeMinDate && minDate ? (rangeMinDate > minDate ? rangeMinDate : minDate) : (rangeMinDate ?? minDate);
  const effectiveMaxDate =
    rangeMaxDate && maxDate
      ? rangeMaxDate < maxDate
        ? rangeMaxDate
        : maxDate
      : (rangeMaxDate ?? maxDate);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  function openPanel() {
    if (disabled || readOnly) return;
    const [committedStart, committedEnd] = parseRange(value);
    setDraftStart(committedStart);
    setDraftEnd(committedEnd);
    setCursor(committedStart ?? new Date());
    setView('date');
    setOpen(true);
  }

  function handleClear() {
    onChange('');
    setDraftStart(null);
    setDraftEnd(null);
    setOpen(false);
  }

  function navigate(delta: number) {
    setCursor((prev) => {
      if (view === 'date') {
        return new Date(prev.getFullYear(), prev.getMonth() + delta, 1);
      }
      if (view === 'month') {
        return new Date(prev.getFullYear() + delta, prev.getMonth(), 1);
      }
      return new Date(prev.getFullYear() + delta * YEAR_ITEM_COUNT, prev.getMonth(), 1);
    });
  }

  function handleChange(dates: [Date | null, Date | null]) {
    const [start, end] = dates;
    if (view !== 'date') {
      const picked = start ?? end;
      if (picked) {
        setCursor(
          view === 'month'
            ? new Date(picked.getFullYear(), picked.getMonth(), 1)
            : new Date(picked.getFullYear(), cursor.getMonth(), 1),
        );
        setView(view === 'month' ? 'date' : 'month');
      }
      return;
    }
    setDraftStart(start);
    setDraftEnd(end);
    // Rentang lengkap (awal + akhir) langsung diterapkan dan kalender ditutup — tanpa tombol Apply.
    if (start && end) {
      onChange(formatRange(start, end));
      setOpen(false);
    }
  }

  const fieldStateValue = dateFieldState({ disabled, readOnly, error, open, hasValue: Boolean(value), forced: forcedState });
  const interactive = !disabled && !readOnly;

  const panelNode =
    open && dropdownPosition
      ? createPortal(
            <div
              ref={panelRef}
              data-testid={resolvedTestId ? `${resolvedTestId}-panel` : undefined}
              data-appearance={appearance}
              data-wds-size={size}
              onMouseDown={(e) => e.stopPropagation()}
              style={{
                position: 'fixed',
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                width: panelWidthClassName === 'w-full' ? dropdownPosition.width : undefined,
                zIndex: 9999,
              }}
              className={[
                'wds-cal',
                panelWidthClassName === 'w-full' ? '' : panelWidthClassName,
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <div className="datepicker-inline-reset pt-1">
                <ReactDatePicker
                  key={`${view}-${cursor.getTime()}`}
                  inline
                  selectsRange
                  swapRange
                  startDate={activeStart ?? undefined}
                  endDate={activeEnd ?? undefined}
                  openToDate={cursor}
                  disabled={disabled}
                  minDate={effectiveMinDate}
                  maxDate={effectiveMaxDate}
                  showMonthYearPicker={view === 'month'}
                  showYearPicker={view === 'year'}
                  onChange={(dates: [Date | null, Date | null]) => handleChange(dates)}
                  renderCustomHeader={() => (
                    <DatePickerHeader
                      view={view}
                      cursor={cursor}
                      onNavigate={navigate}
                      onViewChange={setView}
                      testId={resolvedTestId}
                    />
                  )}
                />
              </div>
            </div>,
            document.body,
          )
      : null;

  return (
    <DateFieldShell
      wrapperRef={wrapperRef}
      className={className}
      appearance={appearance}
      size={size}
      state={fieldStateValue}
      forcedState={forcedState}
      error={error}
      hint={hint}
      testId={resolvedTestId}
      panel={panelNode}
    >
      <input
        type="text"
        readOnly
        value={formatDisplay(value)}
        placeholder={resolvedPlaceholder}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        onClick={() => (open ? setOpen(false) : openPanel())}
        data-testid={resolvedTestId}
        className={['wds-field__input', interactive ? 'cursor-pointer' : ''].filter(Boolean).join(' ')}
      />
      <DateIcons hasValue={Boolean(value)} interactive={interactive} clearable onClear={handleClear} />
    </DateFieldShell>
  );
}

export default DateRangePicker;
