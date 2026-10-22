import Legend from './Legend';
import { SERIES } from './palette';

interface ActivityGaugeProps {
  /** Nilai 0–100 (satu cincin); dipakai bila `rings` kosong. */
  value?: number;
  /** Beberapa cincin konsentris, dari luar ke dalam. */
  rings?: { label: string; value: number }[];
  /** Teks di tengah (default: persen cincin pertama). */
  label?: string;
  size?: number;
  className?: string;
  testId?: string;
}

/** Activity Gauge WDS: satu atau beberapa cincin progres konsentris dengan nilai di tengah. */
function ActivityGauge({ value = 0, rings: ringsProp, label, size = 140, className = '', testId }: ActivityGaugeProps) {
  const rings = ringsProp ?? [{ label: 'Value', value }];
  const stroke = Math.max(8, Math.min(14, size / (rings.length * 2 + 3)));
  const gap = 4;
  const first = Math.max(0, Math.min(100, rings[0]?.value ?? 0));
  return (
    <figure data-testid={testId} className={`wds-chart wds-chart--gauge ${className}`}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} role="img" aria-label={rings.map((r) => `${r.label} ${r.value}%`).join(', ')}>
        {rings.map((ring, i) => {
          const r = (size - stroke) / 2 - i * (stroke + gap);
          const circ = 2 * Math.PI * r;
          const v = Math.max(0, Math.min(100, ring.value));
          return (
            <g key={ring.label}>
              <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--wds-primary-50)" strokeWidth={stroke} />
              <circle
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke={SERIES[i % SERIES.length]}
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={`${(v / 100) * circ} ${circ}`}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
              />
            </g>
          );
        })}
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" className="wds-chart__value">
          {label ?? `${Math.round(first)}%`}
        </text>
      </svg>
      {rings.length > 1 && <Legend items={rings.map((r, i) => ({ label: r.label, color: SERIES[i % SERIES.length]! }))} />}
    </figure>
  );
}

export default ActivityGauge;
