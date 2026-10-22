import { SERIES } from './palette';

interface ActivityGaugeProps {
  /** Nilai 0–100. */
  value: number;
  /** Teks di tengah (default: persen). */
  label?: string;
  size?: number;
  className?: string;
  testId?: string;
}

/** Activity Gauge WDS: cincin progres dengan nilai di tengah. */
function ActivityGauge({ value, label, size = 140, className = '', testId }: ActivityGaugeProps) {
  const v = Math.max(0, Math.min(100, value));
  const stroke = 12;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <figure data-testid={testId} className={`wds-chart wds-chart--gauge ${className}`}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} role="img" aria-label={`${v}%`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--wds-primary-50)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={SERIES[0]}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${(v / 100) * circ} ${circ}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" className="wds-chart__value">
          {label ?? `${Math.round(v)}%`}
        </text>
      </svg>
    </figure>
  );
}

export default ActivityGauge;
