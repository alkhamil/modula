import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AltArrowLeft,
  AltArrowRight,
  DoubleAltArrowLeft,
  DoubleAltArrowRight,
} from '../icons';
import Select from './fields/Select';

function buildPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  // Lampiran A (7-slot window): awal 1-4, akhir T-3..T, selain itu tengah.
  if (current <= 4) {
    return [1, 2, 3, 4, 5, 'ellipsis', total];
  }
  if (current >= total - 3) {
    return [1, 'ellipsis', total - 4, total - 3, total - 2, total - 1, total];
  }
  return [1, 'ellipsis', current - 1, current, current + 1, 'ellipsis', total];
}

interface PaginationProps {
  page: number;
  totalPages: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  /** Ukuran WDS (token Size): xs | sm | md | lg | xl. */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Style WDS (Pagination styles): square | round. */
  appearance?: 'square' | 'round';
  /** Tombol halaman pertama / terakhir (Figma "first-last"). */
  showFirstLast?: boolean;
  /** Label "Previous" / "Next" di tombol navigasi (Figma "labels"). */
  showLabels?: boolean;
  /** Pemilih jumlah baris per halaman. */
  showRowsPerPage?: boolean;
  pageSizeOptions?: number[];
  testId?: string;
}

function Pagination({
  page,
  totalPages,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  appearance = 'square',
  size = 'md',
  showFirstLast = false,
  showLabels = false,
  showRowsPerPage = true,
  pageSizeOptions = [10, 20, 50, 100],
  testId,
}: PaginationProps) {
  const { t } = useTranslation();
  const pages = useMemo(() => buildPageNumbers(page, totalPages), [page, totalPages]);
  const atStart = page <= 1;
  const atEnd = page >= totalPages;

  return (
    <div data-testid={testId} data-appearance={appearance} data-wds-size={size} className="wds-pagination">
      {showRowsPerPage && onPageSizeChange ? (
        <div className="wds-pagination__rows">
          <Select
            clearable={false}
            value={String(pageSize)}
            onChange={(val) => onPageSizeChange(Number(val))}
            options={pageSizeOptions.map((n) => ({ label: String(n), value: String(n) }))}
            className="w-20"
          />
          <span>{t('table.rowsPerPage')}</span>
        </div>
      ) : (
        <span />
      )}

      <nav aria-label="Pagination" className="wds-pagination__nav">
        {showFirstLast && (
          <button
            type="button"
            data-testid="pagination-first"
            aria-label={t('table.firstPage', { defaultValue: 'First page' })}
            onClick={() => onPageChange(1)}
            disabled={atStart}
            className="wds-pagination__btn wds-pagination__nav-btn"
          >
            <DoubleAltArrowLeft />
          </button>
        )}
        <button
          type="button"
          data-testid="pagination-prev"
          aria-label={t('table.previousPage', { defaultValue: 'Previous page' })}
          onClick={() => onPageChange(page - 1)}
          disabled={atStart}
          className="wds-pagination__btn wds-pagination__nav-btn"
        >
          <AltArrowLeft />
          {showLabels && <span>{t('table.previous', { defaultValue: 'Previous' })}</span>}
        </button>

        {pages.map((p, i) =>
          p === 'ellipsis' ? (
            <span key={`e-${i}`} data-testid="pagination-ellipsis" className="wds-pagination__ellipsis">
              …
            </span>
          ) : (
            <button
              type="button"
              key={p}
              data-testid={`pagination-page-${p}`}
              aria-current={p === page ? 'page' : undefined}
              data-current={p === page || undefined}
              onClick={() => {
                if (p !== page) onPageChange(p);
              }}
              className="wds-pagination__btn wds-pagination__page"
            >
              {p}
            </button>
          ),
        )}

        <button
          type="button"
          data-testid="pagination-next"
          aria-label={t('table.nextPage', { defaultValue: 'Next page' })}
          onClick={() => onPageChange(page + 1)}
          disabled={atEnd}
          className="wds-pagination__btn wds-pagination__nav-btn"
        >
          {showLabels && <span>{t('table.next', { defaultValue: 'Next' })}</span>}
          <AltArrowRight />
        </button>
        {showFirstLast && (
          <button
            type="button"
            data-testid="pagination-last"
            aria-label={t('table.lastPage', { defaultValue: 'Last page' })}
            onClick={() => onPageChange(totalPages)}
            disabled={atEnd}
            className="wds-pagination__btn wds-pagination__nav-btn"
          >
            <DoubleAltArrowRight />
          </button>
        )}
      </nav>
    </div>
  );
}

export default Pagination;
