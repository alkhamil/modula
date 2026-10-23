import type { ReactNode } from 'react';
import { AltArrowLeft, AltArrowRight } from '../../../icons';

export type PickerView = 'date' | 'month' | 'year';

export const YEAR_ITEM_COUNT = 12;

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function yearPageStart(year: number): number {
  return Math.floor(year / YEAR_ITEM_COUNT) * YEAR_ITEM_COUNT;
}

interface DatePickerHeaderProps {
  view: PickerView;
  cursor: Date;
  onNavigate: (delta: number) => void;
  onViewChange: (view: PickerView) => void;
  testId?: string;
}

function DatePickerHeader({
  view,
  cursor,
  onNavigate,
  onViewChange,
  testId,
}: DatePickerHeaderProps) {
  const titleClasses = 'wds-cal__title';
  const id = (suffix: string) => (testId ? `${testId}-${suffix}` : undefined);
  let title: ReactNode;

  if (view === 'date') {
    // Figma: "Month & Year" = dua title button terpisah (bulan → tampilan bulan, tahun → tampilan tahun).
    title = (
      <>
        <button type="button" data-testid={id('month-label')} className={titleClasses} onClick={() => onViewChange('month')}>
          {MONTH_NAMES[cursor.getMonth()]!.slice(0, 3)}
        </button>
        <button type="button" data-testid={id('year-button')} className={titleClasses} onClick={() => onViewChange('year')}>
          {cursor.getFullYear()}
        </button>
      </>
    );
  } else if (view === 'month') {
    title = (
      <button type="button" data-testid={id('year-label')} className={titleClasses} onClick={() => onViewChange('year')}>
        {cursor.getFullYear()}
      </button>
    );
  } else {
    const start = yearPageStart(cursor.getFullYear());
    title = <span className={titleClasses}>{`${start} - ${start + YEAR_ITEM_COUNT - 1}`}</span>;
  }

  return (
    <div data-testid={id('header')} className="wds-cal__header">
      <button type="button" data-testid={id('prev')} className="wds-cal__nav" onClick={() => onNavigate(-1)} aria-label="Previous">
        <AltArrowLeft />
      </button>
      <div className="wds-cal__titles">{title}</div>
      <button type="button" data-testid={id('next')} className="wds-cal__nav" onClick={() => onNavigate(1)} aria-label="Next">
        <AltArrowRight />
      </button>
    </div>
  );
}

export default DatePickerHeader;
