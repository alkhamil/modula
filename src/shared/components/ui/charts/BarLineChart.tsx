import Legend from './Legend';
import { SERIES } from './palette';

interface Datum {
  label: string;
  value: number;
}

interface BarLineChartProps {
  data: Datum[];
  type?: 'bar' | 'line';
  height?: number;
  /** Nama seri untuk legend. */
  seriesName?: string;
  className?: string;
  testId?: string;
}

const W = 480;
const PAD = { top: 12, right: 16, bottom: 28, left: 40 };

/** Line / Bar Chart WDS (SVG): grid, label sumbu, dan legend. */
function BarLineChart({ data, type = 'bar', height = 220, seriesName = 'Series', className = '', testId }: BarLineChartProps) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const niceMax = Math.ceil(max / 5) * 5 || 5;
  const innerW = W - PAD.left - PAD.right;
  const innerH = height - PAD.top - PAD.bottom;
  const step = data.length > 0 ? innerW / data.length : innerW;
  const x = (i: number) => PAD.left + step * i + step / 2;
  const y = (v: number) => PAD.top + innerH - (v / niceMax) * innerH;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(niceMax * t));
  const points = data.map((d, i) => `${x(i)},${y(d.value)}`).join(' ');
  const area = data.length > 0 ? `${x(0)},${PAD.top + innerH} ${points} ${x(data.length - 1)},${PAD.top + innerH}` : '';

  return (
    <figure data-testid={testId} className={`wds-chart ${className}`}>
      <svg viewBox={`0 0 ${W} ${height}`} role="img" aria-label={seriesName} className="wds-chart__svg">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} className="wds-chart__grid" />
            <text x={PAD.left - 8} y={y(t) + 4} textAnchor="end" className="wds-chart__axis">
              {t}
            </text>
          </g>
        ))}
        {type === 'bar'
          ? data.map((d, i) => {
              const bw = Math.min(28, step * 0.5);
              return (
                <rect
                  key={d.label}
                  x={x(i) - bw / 2}
                  y={y(d.value)}
                  width={bw}
                  height={PAD.top + innerH - y(d.value)}
                  rx={4}
                  fill={SERIES[0]}
                />
              );
            })
          : data.length > 0 && (
              <>
                <polygon points={area} fill={SERIES[1]} opacity={0.15} />
                <polyline points={points} fill="none" stroke={SERIES[0]} strokeWidth={2} strokeLinejoin="round" />
                {data.map((d, i) => (
                  <circle key={d.label} cx={x(i)} cy={y(d.value)} r={3.5} fill="var(--wds-bg-surface)" stroke={SERIES[0]} strokeWidth={2} />
                ))}
              </>
            )}
        {data.map((d, i) => (
          <text key={d.label} x={x(i)} y={height - 8} textAnchor="middle" className="wds-chart__axis">
            {d.label}
          </text>
        ))}
      </svg>
      <Legend items={[{ label: seriesName, color: SERIES[0]! }]} />
    </figure>
  );
}

export default BarLineChart;
