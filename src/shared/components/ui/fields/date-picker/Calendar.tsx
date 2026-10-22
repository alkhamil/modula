import { useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import DatePickerHeader, { YEAR_ITEM_COUNT, type PickerView } from './DatePickerHeader';

interface CalendarProps {
  value: Date | null;
  onChange: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  /** Style WDS (Calendar styles): box | underline. */
  appearance?: 'box' | 'underline';
  className?: string;
  testId?: string;
}

/** Calendar WDS: kalender mandiri (tanpa field) dengan tampilan hari / bulan / tahun. */
function Calendar({ value, onChange, minDate, maxDate, appearance = 'box', className = '', testId }: CalendarProps) {
  const [view, setView] = useState<PickerView>('date');
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
    <div
      data-testid={testId}
      data-appearance={appearance}
      data-wds-size="md"
      className={`wds-cal w-80 shrink-0 ${className}`}
    >
      <div className="datepicker-inline-reset pt-1">
        <ReactDatePicker
          key={`${view}-${cursor.getTime()}`}
          inline
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
