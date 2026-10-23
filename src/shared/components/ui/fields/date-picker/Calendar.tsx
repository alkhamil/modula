import { useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import DatePickerHeader, { YEAR_ITEM_COUNT, type PickerView } from './DatePickerHeader';

interface CalendarProps {
  value: Date | null;
  /** Dipanggil saat tanggal dipilih. */
  onChange: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  /** Figma "Type": tampilan awal — date | month | year. */
  type?: PickerView;
  /** Ukuran WDS (token Size): xs | sm | md | lg | xl. */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
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
  className = '',
  testId,
}: CalendarProps) {
  const [view, setView] = useState<PickerView>(type);
  const [cursor, setCursor] = useState<Date>(value ?? new Date());

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
    onChange(date);
  }

  return (
    <div data-testid={testId} data-appearance="box" data-wds-size={size} className={`wds-cal w-80 shrink-0 ${className}`}>
      <div className="datepicker-inline-reset">
        <ReactDatePicker
          key={`${view}-${cursor.getTime()}`}
          inline
          calendarStartDay={1}
          fixedHeight
          selected={value ?? undefined}
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
    </div>
  );
}

export default Calendar;
