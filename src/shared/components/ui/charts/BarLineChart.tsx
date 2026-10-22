import { useState } from 'react';
import Legend from './Legend';
import { SERIES } from './palette';

interface Datum {
  label: string;
  value: number;
}

interface SeriesDatum {
  name: string;
  values: number[];
}

interface BarLineChartProps {
  /** Satu seri sederhana; dipakai bila `series` kosong. */
  data?: Datum[];
  /** Beberapa seri; `labels` memberi label sumbu X. */
  series?: SeriesDatum[];
  labels?: string[];
  type?: 'bar' | 'line';
  /** Bar bertumpuk (hanya `type="bar"` dengan banyak seri). */
  stacked?: boolean;
  height?: number;
  /** Nama seri untuk legend (mode `data`). */
  seriesName?: string;
  className?: string;
  testId?: string;
}

const W = 480;
const PAD = { top: 12, right: 16, bottom: 28, left: 40 };

/** Line / Bar Chart WDS (SVG): banyak seri, bar bertumpuk, area gradien, grid, tooltip hover, dan legend. */
function BarLineChart({
  data,
  series: seriesProp,
  labels: labelsProp,
  type = 'bar',
  stacked = false,
  height = 220,
  seriesName = 'Series',
  className = '',
  testId,
}: BarLineChartProps) {
  const [hover, setHover] = useState<number | null>(null);
  const series: SeriesDatum[] = seriesProp ?? [{ name: seriesName, values: (data ?? []).map((d) => d.value) }];
  const labels = labelsProp ?? (data ?? []).map((d) => d.label);
  const n = labels.length;
  const totals = labels.map((_, i) =>
    stacked && type === 'bar' ? series.reduce((s, x) => s + (x.values[i] ?? 0), 0) : Math.max(0, ...series.map((x) => x.values[i] ?? 0)),
  );
  const niceMax = Math.ceil(Math.max(1, ...totals) / 5) * 5 || 5;
  const innerW = W - PAD.left - PAD.right;
  const innerH = height - PAD.top - PAD.bottom;
  const step = n > 0 ? innerW / n : innerW;
  const x = (i: number) => PAD.left + step * i + step / 2;
  const y = (v: number) => PAD.top + innerH - (v / niceMax) * innerH;
  const base = PAD.top + innerH;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(niceMax * t));
  const gid = `wds-area-${series.length}`;

  return (
    <figure data-testid={testId} className={`wds-chart ${className}`}>
      <div className="wds-chart__plot">
        <svg viewBox={`0 0 ${W} ${height}`} role="img" aria-label={series.map((s) => s.name).join(', ')} className="wds-chart__svg">
          <defs>
            <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--wds-primary-400)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="var(--wds-primary-400)" stopOpacity={0} />
            </linearGradient>
          </defs>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} className="wds-chart__grid" />
              <text x={PAD.left - 8} y={y(t) + 4} textAnchor="end" className="wds-chart__axis">
                {t}
              </text>
            </g>
          ))}
          {type === 'bar'
            ? labels.map((_, i) => {
                const groupW = Math.min(36, step * 0.6);
                const bw = stacked ? groupW : groupW / series.length;
                let acc = 0;
                return series.map((s, si) => {
                  const v = s.values[i] ?? 0;
                  const top = stacked ? y(acc + v) : y(v);
                  const h = stacked ? y(acc) - y(acc + v) : base - y(v);
                  const left = stacked ? x(i) - groupW / 2 : x(i) - groupW / 2 + si * bw;
                  acc += v;
                  return (
                    <rect
                      key={`${i}-${si}`}
                      x={left}
                      y={top}
                      width={Math.max(2, bw - (stacked ? 0 : 2))}
                      height={Math.max(0, h)}
                      rx={stacked ? 0 : 4}
                      fill={SERIES[si % SERIES.length]}
                      opacity={hover === null || hover === i ? 1 : 0.55}
                    />
                  );
                });
              })
            : series.map((s, si) => {
                const pts = s.values.map((v, i) => `${x(i)},${y(v)}`).join(' ');
                return (
                  <g key={s.name}>
                    {si === 0 && s.values.length > 0 && (
                      <polygon points={`${x(0)},${base} ${pts} ${x(s.values.length - 1)},${base}`} fill={`url(#${gid})`} />
                    )}
                    <polyline points={pts} fill="none" stroke={SERIES[si % SERIES.length]} strokeWidth={2} strokeLinejoin="round" />
                    {s.values.map((v, i) => (
                      <circle key={i} cx={x(i)} cy={y(v)} r={hover === i ? 5 : 3.5} fill="var(--wds-bg-surface)" stroke={SERIES[si % SERIES.length]} strokeWidth={2} />
                    ))}
                  </g>
                );
              })}
          {labels.map((label, i) => (
            <g key={label}>
              <text x={x(i)} y={height - 8} textAnchor="middle" className="wds-chart__axis">
                {label}
              </text>
              <rect
                x={x(i) - step / 2}
                y={PAD.top}
                width={step}
                height={innerH}
                fill="transparent"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              />
            </g>
          ))}
        </svg>
        {hover !== null && (
          <div className="wds-chart__tip" style={{ left: `${(x(hover) / W) * 100}%` }} role="status">
            <strong>{labels[hover]}</strong>
            {series.map((s, si) => (
              <span key={s.name} className="wds-chart__tip-row">
                <span className="wds-legend__dot" style={{ backgroundColor: SERIES[si % SERIES.length] }} />
                {s.name}: {s.values[hover] ?? 0}
              </span>
            ))}
          </div>
        )}
      </div>
      <Legend items={series.map((s, si) => ({ label: s.name, color: SERIES[si % SERIES.length]! }))} />
    </figure>
  );
}

export default BarLineChart;
