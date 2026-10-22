import Legend from './Legend';
import { RADAR_SERIES } from './palette';

interface RadarChartProps {
  axes: string[];
  series: { name: string; values: number[] }[];
  /** Nilai maksimum sumbu (default: nilai terbesar). */
  max?: number;
  size?: number;
  className?: string;
  testId?: string;
}

/** Radar Chart WDS (SVG): sumbu radial, poligon seri, dan legend. */
function RadarChart({ axes, series, max, size = 240, className = '', testId }: RadarChartProps) {
  const top = max ?? Math.max(1, ...series.flatMap((s) => s.values));
  const c = size / 2;
  const radius = size / 2 - 32;
  const n = axes.length;
  const point = (i: number, v: number) => {
    const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
    const rr = (v / top) * radius;
    return [c + rr * Math.cos(a), c + rr * Math.sin(a)] as const;
  };
  const ring = (f: number) => axes.map((_, i) => point(i, top * f).join(',')).join(' ');

  return (
    <figure data-testid={testId} className={`wds-chart wds-chart--radar ${className}`}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} role="img" aria-label="Radar chart">
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <polygon key={f} points={ring(f)} fill="none" className="wds-chart__grid" />
        ))}
        {axes.map((a, i) => {
          const [x, y] = point(i, top * 1.18);
          return (
            <text key={a} x={x} y={y + 4} textAnchor="middle" className="wds-chart__radar-label">
              {a}
            </text>
          );
        })}
        {series.map((s, si) => {
          const color = RADAR_SERIES[si % RADAR_SERIES.length]!;
          return (
            <polygon
              key={s.name}
              points={s.values.map((v, i) => point(i, v).join(',')).join(' ')}
              fill={color}
              fillOpacity={0.18}
              stroke={color}
              strokeWidth={2}
            />
          );
        })}
      </svg>
      <Legend items={series.map((s, i) => ({ label: s.name, color: RADAR_SERIES[i % RADAR_SERIES.length]! }))} />
    </figure>
  );
}

export default RadarChart;
