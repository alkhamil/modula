import type { ReactNode } from 'react';

/** Tooltip hover chart WDS: ditempatkan absolut di dalam `.wds-chart__plot` (px dari kiri/atas plot). */
function ChartTip({ left, top, children }: { left: number | string; top?: number | string; children: ReactNode }) {
  return (
    <div className="wds-chart__tip" style={{ left, ...(top !== undefined ? { top } : {}) }} role="status">
      {children}
    </div>
  );
}

export default ChartTip;
