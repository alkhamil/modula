import Legend from './Legend';
import { SERIES } from './palette';

interface PieChartProps {
  data: { label: string; value: number }[];
  /** Lubang tengah (donut). */
  donut?: boolean;
  size?: number;
  className?: string;
  testId?: string;
}

/** Pie / Donut Chart WDS (SVG) dengan legend. */
function PieChart({ data, donut = false, size = 180, className = '', testId }: PieChartProps) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = size / 2;
  let angle = -Math.PI / 2;
  const slices = data.map((d, i) => {
    const sweep = (d.value / total) * Math.PI * 2;
    const start = angle;
    angle += sweep;
    const large = sweep > Math.PI ? 1 : 0;
    const p = (a: number) => `${r + r * Math.cos(a)} ${r + r * Math.sin(a)}`;
    const path = data.length === 1
      ? `M ${r} 0 A ${r} ${r} 0 1 1 ${r - 0.01} 0 Z`
      : `M ${r} ${r} L ${p(start)} A ${r} ${r} 0 ${large} 1 ${p(angle)} Z`;
    return { path, color: SERIES[i % SERIES.length]!, label: d.label };
  });

  return (
    <figure data-testid={testId} className={`wds-chart wds-chart--pie ${className}`}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} role="img" aria-label="Pie chart">
        {slices.map((s) => (
          <path key={s.label} d={s.path} fill={s.color} stroke="var(--wds-bg-surface)" strokeWidth={1} />
        ))}
        {donut && <circle cx={r} cy={r} r={r * 0.58} fill="var(--wds-bg-surface)" />}
      </svg>
      <Legend direction="vertical" items={slices.map((s) => ({ label: s.label, color: s.color }))} />
    </figure>
  );
}

export default PieChart;
