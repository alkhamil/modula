import { useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import { useTranslation } from 'react-i18next';
import Button from '../../Button';
import DatePickerHeader, { YEAR_ITEM_COUNT, type PickerView } from './DatePickerHeader';

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

interface CalendarProps {
  value: Date | null;
  /** Dipanggil saat tanggal dipilih; dengan `showApply`, baru saat tombol Apply ditekan. */
  onChange: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  /** Figma "Type": tampilan awal — date | month | year. */
  type?: PickerView;
  /** Ukuran WDS (token Size): xs | sm | md | lg | xl. */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Figma "Time picker": kolom jam & menit di tampilan tanggal. */
  timePicker?: boolean;
  /** Figma "Apply button": footer Cancel / Apply; pilihan jadi draf sampai Apply. */
  showApply?: boolean;
  onCancel?: () => void;
  className?: string;
  testId?: string;
}

/** Calendar WDS: kalender mandiri (tanpa field) dengan tampilan hari / bulan / tahun. */
function Calendar({
  value,
  onChange,
  minDate,
  maxDate,
  type = 'date',
  size = 'md',
  timePicker = false,
  showApply = false,
  onCancel,
  className = '',
  testId,
}: CalendarProps) {
  const { t } = useTranslation();
  const [view, setView] = useState<PickerView>(type);
  const [cursor, setCursor] = useState<Date>(value ?? new Date());
  const [draft, setDraft] = useState<Date | null>(value);
  const [hour, setHour] = useState(value ? String(value.getHours()).padStart(2, '0') : '00');
  const [minute, setMinute] = useState(value ? String(value.getMinutes()).padStart(2, '0') : '00');
  const selected = showApply ? draft : value;

  function withTime(date: Date, h = hour, m = minute): Date {
    return timePicker ? new Date(date.getFullYear(), date.getMonth(), date.getDate(), Number(h), Number(m)) : date;
  }

  function navigate(delta: number) {
    setCursor((prev) => {
      if (view === 'date') return new Date(prev.getFullYear(), prev.getMonth() + delta, 1);
      if (view === 'month') return new Date(prev.getFullYear() + delta, prev.getMonth(), 1);
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
    const next = withTime(date);
    if (showApply) setDraft(next);
    else onChange(next);
  }

  function changeTime(h: string, m: string) {
    setHour(h);
    setMinute(m);
    const base = selected ?? null;
    if (!base) return;
    const next = new Date(base.getFullYear(), base.getMonth(), base.getDate(), Number(h), Number(m));
    if (showApply) setDraft(next);
    else onChange(next);
  }

  function cancel() {
    setDraft(value);
    onCancel?.();
  }

  const showTime = timePicker && view === 'date';
  const showFooter = showApply && view === 'date';

  return (
    <div data-testid={testId} data-appearance="box" data-wds-size={size} className={`wds-cal w-80 shrink-0 ${className}`}>
      <div className="datepicker-inline-reset">
        <ReactDatePicker
          key={`${view}-${cursor.getTime()}`}
          inline
          calendarStartDay={1}
          fixedHeight
          selected={selected ?? undefined}
          openToDate={cursor}
          minDate={minDate}
          maxDate={maxDate}
          showMonthYearPicker={view === 'month'}
          showYearPicker={view === 'year'}
          onChange={(d: Date | null) => {
            if (d) handlePick(d);
          }}
          renderCustomHeader={() => (
            <DatePickerHeader view={view} cursor={cursor} onNavigate={navigate} onViewChange={setView} testId={testId} />
          )}
        />
      </div>
      {(showTime || showFooter) && (
        <div className="wds-cal__bottom">
          {showTime && (
            <div className="wds-cal__time" data-testid={testId ? `${testId}-time` : undefined}>
              <select
                className="wds-cal__time-select"
                aria-label={t('fields.hour')}
                value={hour}
                onChange={(e) => changeTime(e.target.value, minute)}
              >
                {HOURS.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
              <span>:</span>
              <select
                className="wds-cal__time-select"
                aria-label={t('fields.minute')}
                value={minute}
                onChange={(e) => changeTime(hour, e.target.value)}
              >
                {MINUTES.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          )}
          {showFooter && (
            <div className="wds-cal__actions">
              <Button size="sm" hierarchy="secondary" onClick={cancel}>
                {t('common.cancel')}
              </Button>
              <Button size="sm" disabled={!draft} onClick={() => draft && onChange(draft)}>
                {t('common.apply')}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Calendar;
