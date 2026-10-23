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
import DateRange, { type RangeDatePickerProps } from './DateRangePicker';

interface SingleDatePickerProps {
  /** Mode satu tanggal (default). `range` memilih mode rentang tanggal. */
  range?: false;
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
  showTime?: boolean;
  minDate?: Date;
  maxDate?: Date;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  /** Tampilkan tombol X untuk mengosongkan tanggal (default: true). */
  clearable?: boolean;
  /** Lebar panel kalender (default: 'w-80' agar sel tanggal tidak melar). */
  panelWidthClassName?: string;
  testId?: string;
  'data-testid'?: string;
}

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

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
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function toIsoDateTime(date: Date): string {
  return `${toIso(date)} ${pad2(date.getHours())}:${pad2(date.getMinutes())}:00`;
}

function toDisplay(date: Date | null, showTime = false): string {
  if (!date) return '';
  const base = `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}/${date.getFullYear()}`;
  return showTime ? `${base} ${pad2(date.getHours())}:${pad2(date.getMinutes())}` : base;
}

function formatDisplay(value: string, showTime = false): string {
  if (!value) return '';
  return toDisplay(toDate(value), showTime) || value;
}

const timeSelectClasses = [
  'h-9 w-16 rounded-lg border border-border bg-background px-2 text-center text-sm text-foreground outline-none transition-colors',
  'focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/30',
  'disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground',
].join(' ');

function DateSingle({
  size = 'md',
  appearance = 'box',
  disabled = false,
  readOnly = false,
  error,
  hint,
  'data-wds-state': forcedState,
  placeholder,
  showTime = false,
  minDate,
  maxDate,
  value,
  onChange,
  className = '',
  clearable = true,
  panelWidthClassName = 'w-80',
  testId,
  'data-testid': dataTestId,
}: Omit<SingleDatePickerProps, 'range'>) {
  const resolvedTestId = dataTestId ?? testId;
  const { t } = useTranslation();
  const resolvedPlaceholder = placeholder ?? t('fields.selectDate');
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<PickerView>('date');
  const [cursor, setCursor] = useState(() => new Date());
  const [draftDate, setDraftDate] = useState<Date | null>(null);
  const [draftHour, setDraftHour] = useState('00');
  const [draftMinute, setDraftMinute] = useState('00');
  const { position: dropdownPosition, dropdownRef: panelRef } = useSelectDropdown(
    open,
    wrapperRef,
    320, // min-width: kalender w-80 = 320px
    380, // estimatedHeight: tinggi kalender + tombol ≈ 380px
  );

  // Click-outside: useSelectDropdown tidak tahu tentang wrapperRef kita,
  // jadi kita tambahkan handler manual agar klik di trigger menutup panel.
  // Klik di dalam panel sudah di-handle via onMouseDown stopPropagation di bawah.
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

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  const fieldStateValue = dateFieldState({ disabled, readOnly, error, open, hasValue: Boolean(value), forced: forcedState });
  const interactive = !disabled && !readOnly;

  function openPanel() {
    if (disabled || readOnly) return;
    const parsed = toDate(value);
    setDraftDate(parsed);
    setDraftHour(parsed ? pad2(parsed.getHours()) : '00');
    setDraftMinute(parsed ? pad2(parsed.getMinutes()) : '00');
    setCursor(parsed ?? new Date());
    setView('date');
    setOpen(true);
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

  function handlePick(date: Date) {
    if (view === 'month') {
      setCursor(new Date(date.getFullYear(), date.getMonth(), 1));
      setView('date');
      return;
    }
    if (view === 'year') {
      setCursor(new Date(date.getFullYear(), cursor.getMonth(), 1));
      setView('month');
      return;
    }
    setDraftDate(date);
    commit(date, draftHour, draftMinute);
    // Tanpa waktu: memilih hari langsung menutup kalender; dengan waktu tetap terbuka untuk atur jam.
    if (!showTime) setOpen(false);
  }

  /** Terapkan tanggal + jam langsung ke `onChange` (tanpa tombol Apply). */
  function commit(date: Date, hour: string, minute: string) {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate(), Number(hour), Number(minute), 0, 0);
    onChange(showTime ? toIsoDateTime(d) : toIso(d));
  }

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
                  calendarStartDay={1}
                  fixedHeight
                  selected={draftDate ?? undefined}
                  openToDate={cursor}
                  disabled={disabled}
                  minDate={minDate}
                  maxDate={maxDate}
                  showMonthYearPicker={view === 'month'}
                  showYearPicker={view === 'year'}
                  onChange={(d: Date | null) => {
                    if (d) handlePick(d);
                  }}
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
              {showTime && (
                <div
                  data-testid={resolvedTestId ? `${resolvedTestId}-time` : undefined}
                  className="flex items-center justify-center gap-2 px-4 pb-3"
                >
                  <select
                    data-testid={resolvedTestId ? `${resolvedTestId}-hour` : undefined}
                    value={draftHour}
                    disabled={disabled}
                    onChange={(e) => {
                      setDraftHour(e.target.value);
                      if (draftDate) commit(draftDate, e.target.value, draftMinute);
                    }}
                    className={timeSelectClasses}
                    aria-label={t('fields.hour')}
                  >
                    {HOURS.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                  <span className="text-sm font-medium text-muted-foreground">:</span>
                  <select
                    data-testid={resolvedTestId ? `${resolvedTestId}-minute` : undefined}
                    value={draftMinute}
                    disabled={disabled}
                    onChange={(e) => {
                      setDraftMinute(e.target.value);
                      if (draftDate) commit(draftDate, draftHour, e.target.value);
                    }}
                    className={timeSelectClasses}
                    aria-label={t('fields.minute')}
                  >
                    {MINUTES.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>,
            document.body,
          )
      : null;

  function renderSinglePicker() {
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
          ref={inputRef}
          type="text"
          readOnly
          value={formatDisplay(value, showTime)}
          placeholder={resolvedPlaceholder}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          onClick={() => (open ? setOpen(false) : openPanel())}
          data-testid={resolvedTestId}
          className={['wds-field__input', interactive ? 'cursor-pointer' : ''].filter(Boolean).join(' ')}
        />
        <DateIcons
          hasValue={Boolean(value)}
          interactive={interactive}
          clearable={clearable}
          onClear={() => {
            onChange('');
            setOpen(false);
          }}
        />
      </DateFieldShell>
    );
  }

  return renderSinglePicker();
}

export type DatePickerProps = SingleDatePickerProps | RangeDatePickerProps;

/**
 * Props longgar untuk pemanggil generik (`FormItem component={DatePicker}`): props mode satu tanggal
 * dan rentang tersedia, `range` memilih mode. Pemakaian langsung memakai overload yang ketat.
 */
type DatePickerLooseProps = Omit<SingleDatePickerProps, 'range'> &
  Partial<Omit<RangeDatePickerProps, 'range' | keyof SingleDatePickerProps>> & { range?: boolean };

/**
 * Date Picker WDS. Satu tanggal (default, opsional `showTime`); `range` memilih rentang tanggal
 * ("awal,akhir"): klik pertama = awal, klik kedua = akhir lalu diterapkan.
 */
function DatePicker(props: SingleDatePickerProps): React.ReactElement;
function DatePicker(props: RangeDatePickerProps): React.ReactElement;
function DatePicker(props: DatePickerLooseProps): React.ReactElement;
function DatePicker(props: DatePickerLooseProps): React.ReactElement {
  const { range, ...rest } = props;
  if (range) return <DateRange {...(rest as Omit<RangeDatePickerProps, 'range'>)} />;
  return <DateSingle {...(rest as Omit<SingleDatePickerProps, 'range'>)} />;
}

export default DatePicker;
