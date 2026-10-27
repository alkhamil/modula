import { useState } from 'react';
import ChartTip from './ChartTip';
import Legend from './Legend';
import { SERIES } from './palette';

/** Ukuran WDS pie chart (Figma "Size"): xxs 120, xs 160, sm 200, md 240, lg 280. */
export type PieSize = 'xxs' | 'xs' | 'sm' | 'md' | 'lg';
const SIZE_PX: Record<PieSize, number> = { xxs: 120, xs: 160, sm: 200, md: 240, lg: 280 };

interface PieChartProps {
  data: { label: string; value: number }[];
  /** Ukuran WDS (Figma "Size"). */
  size?: PieSize;
  /** Lubang tengah dalam persen diameter (Figma "Hole"): 0 = pie penuh. */
  hole?: 0 | 25 | 50 | 75;
  /** Tampilkan legend di kanan (Figma "Legend"). */
  legend?: boolean;
  className?: string;
  testId?: string;
}

/** Pie / Donut Chart WDS (SVG): hover irisan menampilkan tooltip, dengan legend opsional. */
function PieChart({ data, size = 'md', hole = 0, legend = true, className = '', testId }: PieChartProps) {
  const [hover, setHover] = useState<number | null>(null);
  const px = SIZE_PX[size];
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = px / 2;
  const inner = r * (hole / 100);
  let angle = -Math.PI / 2;
  const slices = data.map((d, i) => {
    const sweep = (d.value / total) * Math.PI * 2;
    const start = angle;
    angle += sweep;
    const mid = start + sweep / 2;
    const large = sweep > Math.PI ? 1 : 0;
    const p = (a: number, rad: number) => `${r + rad * Math.cos(a)} ${r + rad * Math.sin(a)}`;
    const outer = data.length === 1
      ? `M ${r} 0 A ${r} ${r} 0 1 1 ${r - 0.01} 0`
      : `M ${p(start, r)} A ${r} ${r} 0 ${large} 1 ${p(angle, r)}`;
    const path = inner > 0
      ? `${outer} L ${p(angle, inner)} A ${inner} ${inner} 0 ${large} 0 ${p(start, inner)} Z`
      : `${outer} L ${r} ${r} Z`;
    const tipR = inner > 0 ? (r + inner) / 2 : r * 0.62;
    return {
      path,
      color: SERIES[i % SERIES.length]!,
      label: d.label,
      value: d.value,
      pct: Math.round((d.value / total) * 100),
      tipX: r + tipR * Math.cos(mid),
      tipY: r + tipR * Math.sin(mid),
      dx: Math.cos(mid) * 4,
      dy: Math.sin(mid) * 4,
    };
  });
  const active = hover !== null ? slices[hover] : undefined;

  return (
    <figure data-testid={testId} data-legend={legend ? 'right' : undefined} className={`wds-chart wds-chart--pie ${className}`}>
      <div className="wds-chart__plot wds-chart__plot--fixed" style={{ width: px, height: px }}>
        <svg viewBox={`0 0 ${px} ${px}`} width={px} height={px} role="img" aria-label="Pie chart" onMouseLeave={() => setHover(null)}>
          {slices.map((s, i) => (
            <path
              key={s.label}
              d={s.path}
              fill={s.color}
              stroke="var(--wds-bg-surface)"
              strokeWidth={1}
              opacity={hover === null || hover === i ? 1 : 0.55}
              transform={hover === i ? `translate(${s.dx} ${s.dy})` : undefined}
              onMouseEnter={() => setHover(i)}
            />
          ))}
        </svg>
        {active && (
          <ChartTip left={active.tipX} top={Math.max(0, active.tipY - 44)}>
            <span className="wds-chart__tip-row">
              <span className="wds-legend__dot" style={{ backgroundColor: active.color }} />
              {active.label}: {active.value} ({active.pct}%)
            </span>
          </ChartTip>
        )}
      </div>
      {legend && <Legend direction="vertical" items={slices.map((s) => ({ label: s.label, color: s.color }))} />}
    </figure>
  );
}

export default PieChart;
