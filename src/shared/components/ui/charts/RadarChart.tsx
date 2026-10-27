import { useState } from 'react';
import ChartTip from './ChartTip';
import Legend from './Legend';
import { RADAR_SERIES } from './palette';

interface RadarChartProps {
  axes: string[];
  /** 1–3 seri (Figma "Series"). */
  series: { name: string; values: number[] }[];
  /** Nilai maksimum sumbu (default: nilai terbesar). */
  max?: number;
  size?: number;
  /** Posisi legend (Figma "Legend"): bottom | right. */
  legend?: 'bottom' | 'right';
  className?: string;
  testId?: string;
}

/** Radar Chart WDS (SVG): sumbu radial, poligon seri, hover sumbu menampilkan tooltip, dan legend. */
function RadarChart({ axes, series, max, size = 240, legend = 'bottom', className = '', testId }: RadarChartProps) {
  const [hover, setHover] = useState<number | null>(null);
  const top = max ?? Math.max(1, ...series.flatMap((s) => s.values));
  const c = size / 2;
  const radius = size / 2 - 32;
  const n = axes.length;
  const angleOf = (i: number) => -Math.PI / 2 + (i / n) * Math.PI * 2;
  const point = (i: number, v: number) => {
    const a = angleOf(i);
    const rr = (v / top) * radius;
    return [c + rr * Math.cos(a), c + rr * Math.sin(a)] as const;
  };
  const ring = (f: number) => axes.map((_, i) => point(i, top * f).join(',')).join(' ');
  const half = Math.PI / n;
  const wedge = (i: number) => {
    const a = angleOf(i);
    const rr = radius * 1.25;
    const p = (ang: number) => `${c + rr * Math.cos(ang)},${c + rr * Math.sin(ang)}`;
    return `${c},${c} ${p(a - half)} ${p(a + half)}`;
  };

  return (
    <figure data-testid={testId} data-legend={legend} className={`wds-chart wds-chart--radar ${className}`}>
      <div className="wds-chart__plot wds-chart__plot--fixed" style={{ width: size, height: size }}>
        <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} role="img" aria-label="Radar chart" onMouseLeave={() => setHover(null)}>
          {[0.25, 0.5, 0.75, 1].map((f) => (
            <polygon key={f} points={ring(f)} fill="none" className="wds-chart__grid" />
          ))}
          {axes.map((a, i) => {
            const [x, y] = point(i, top * 1.18);
            return (
              <text key={a} x={x} y={y + 4} textAnchor="middle" className="wds-chart__radar-label" fontWeight={hover === i ? 600 : undefined}>
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
          {hover !== null &&
            series.map((s, si) => {
              const [x, y] = point(hover, s.values[hover] ?? 0);
              return <circle key={s.name} cx={x} cy={y} r={4} fill="var(--wds-bg-surface)" stroke={RADAR_SERIES[si % RADAR_SERIES.length]} strokeWidth={2} />;
            })}
          {axes.map((a, i) => (
            <polygon key={`hit-${a}`} points={wedge(i)} fill="transparent" onMouseEnter={() => setHover(i)} />
          ))}
        </svg>
        {hover !== null && (
          <ChartTip left={Math.min(size - 60, Math.max(60, point(hover, top)[0]))} top={Math.max(0, point(hover, top)[1] - 12)}>
            <strong>{axes[hover]}</strong>
            {series.map((s, si) => (
              <span key={s.name} className="wds-chart__tip-row">
                <span className="wds-legend__dot" style={{ backgroundColor: RADAR_SERIES[si % RADAR_SERIES.length] }} />
                {s.name}: {s.values[hover] ?? 0}
              </span>
            ))}
          </ChartTip>
        )}
      </div>
      <Legend
        direction={legend === 'right' ? 'vertical' : 'horizontal'}
        items={series.map((s, i) => ({ label: s.name, color: RADAR_SERIES[i % RADAR_SERIES.length]! }))}
      />
    </figure>
  );
}

export default RadarChart;
