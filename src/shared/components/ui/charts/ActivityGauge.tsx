import { useState } from 'react';
import ChartTip from './ChartTip';
import Legend from './Legend';
import { SERIES } from './palette';

/** Ukuran WDS activity gauge (Figma "Size"): xs 160, sm 200, md 240, lg 280. */
export type GaugeSize = 'xs' | 'sm' | 'md' | 'lg';
const SIZE_PX: Record<GaugeSize, number> = { xs: 160, sm: 200, md: 240, lg: 280 };

interface ActivityGaugeProps {
  /** Nilai 0–100 (satu cincin); dipakai bila `rings` kosong. */
  value?: number;
  /** Beberapa cincin konsentris, dari luar ke dalam. */
  rings?: { label: string; value: number }[];
  /** Ukuran WDS (Figma "Size"). */
  size?: GaugeSize;
  /** Teks di tengah (Figma "Label" = true): default persen cincin pertama; `showLabel={false}` menyembunyikan. */
  label?: string;
  showLabel?: boolean;
  /** Posisi legend (Figma "Legend"): bottom | right — tampil bila ada lebih dari satu cincin. */
  legend?: 'bottom' | 'right';
  className?: string;
  testId?: string;
}

/** Activity Gauge WDS: satu atau beberapa cincin progres konsentris; hover cincin menampilkan tooltip. */
function ActivityGauge({
  value = 0,
  rings: ringsProp,
  size = 'md',
  label,
  showLabel = true,
  legend = 'bottom',
  className = '',
  testId,
}: ActivityGaugeProps) {
  const [hover, setHover] = useState<number | null>(null);
  const px = SIZE_PX[size];
  const rings = ringsProp ?? [{ label: 'Value', value }];
  const stroke = Math.max(8, Math.min(14, px / (rings.length * 2 + 3)));
  const gap = 4;
  const first = Math.max(0, Math.min(100, rings[0]?.value ?? 0));
  const showLegend = rings.length > 1;
  const active = hover !== null ? rings[hover] : undefined;

  return (
    <figure data-testid={testId} data-legend={showLegend ? legend : undefined} className={`wds-chart wds-chart--gauge ${className}`}>
      <div className="wds-chart__plot wds-chart__plot--fixed" style={{ width: px, height: px }}>
        <svg viewBox={`0 0 ${px} ${px}`} width={px} height={px} role="img" aria-label={rings.map((r) => `${r.label} ${r.value}%`).join(', ')} onMouseLeave={() => setHover(null)}>
          {rings.map((ring, i) => {
            const r = (px - stroke) / 2 - i * (stroke + gap);
            const circ = 2 * Math.PI * r;
            const v = Math.max(0, Math.min(100, ring.value));
            return (
              <g key={ring.label} opacity={hover === null || hover === i ? 1 : 0.55}>
                <circle cx={px / 2} cy={px / 2} r={r} fill="none" stroke="var(--wds-primary-50)" strokeWidth={stroke} />
                <circle
                  cx={px / 2}
                  cy={px / 2}
                  r={r}
                  fill="none"
                  stroke={SERIES[i % SERIES.length]}
                  strokeWidth={hover === i ? stroke + 2 : stroke}
                  strokeLinecap="round"
                  strokeDasharray={`${(v / 100) * circ} ${circ}`}
                  transform={`rotate(-90 ${px / 2} ${px / 2})`}
                />
                <circle cx={px / 2} cy={px / 2} r={r} fill="none" stroke="transparent" strokeWidth={stroke + gap} onMouseEnter={() => setHover(i)} />
              </g>
            );
          })}
          {showLabel && (
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" className="wds-chart__value" pointerEvents="none">
              {label ?? `${Math.round(first)}%`}
            </text>
          )}
        </svg>
        {active && hover !== null && (
          <ChartTip left={px / 2} top={Math.max(0, px / 2 - ((px - stroke) / 2 - hover * (stroke + gap)) - 40)}>
            <span className="wds-chart__tip-row">
              <span className="wds-legend__dot" style={{ backgroundColor: SERIES[hover % SERIES.length] }} />
              {active.label}: {Math.round(active.value)}%
            </span>
          </ChartTip>
        )}
      </div>
      {showLegend && (
        <Legend
          direction={legend === 'right' ? 'vertical' : 'horizontal'}
          items={rings.map((r, i) => ({ label: r.label, color: SERIES[i % SERIES.length]! }))}
        />
      )}
    </figure>
  );
}

export default ActivityGauge;
