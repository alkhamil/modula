import type { ReactNode } from 'react';

export interface StepItem {
  title: ReactNode;
  description?: ReactNode;
  /** Label kecil di atas judul, mis. "STEP 1" (Figma "Show label"). */
  label?: ReactNode;
  /** Badge status di bawah teks, mis. "In Progress" (Figma "Show badge"). */
  badge?: ReactNode;
  /** Paksa state langkah ini; default diturunkan dari `current`. */
  status?: 'upcoming' | 'current' | 'completed' | 'error';
}

interface StepperProps {
  steps: StepItem[];
  /** Indeks langkah aktif (0-based). */
  current: number;
  orientation?: 'horizontal' | 'vertical';
  /** Ukuran WDS (token Size): xs | sm | md | lg | xl. */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  testId?: string;
}

/** Stepper WDS: indikator langkah dengan konektor, label, judul, teks pendukung, dan badge status. */
function Stepper({ steps, current, orientation = 'horizontal', size = 'md', className = '', testId }: StepperProps) {
  return (
    <ol
      data-testid={testId}
      data-orientation={orientation}
      data-wds-size={size}
      className={`wds-stepper ${className}`}
    >
      {steps.map((step, i) => {
        const status = step.status ?? (i < current ? 'completed' : i === current ? 'current' : 'upcoming');
        const last = i === steps.length - 1;
        return (
          <li
            key={i}
            data-status={status}
            data-last={last || undefined}
            aria-current={status === 'current' ? 'step' : undefined}
            className="wds-step"
          >
            <div className="wds-step__head">
              <span className="wds-step__indicator">
                {status === 'completed' ? <span className="wds-step__check" /> : i + 1}
              </span>
              {!last && <span className="wds-step__connector" aria-hidden="true" />}
            </div>
            <div className="wds-step__text">
              {step.label && <span className="wds-step__label">{step.label}</span>}
              <span className="wds-step__title">{step.title}</span>
              {step.description && <span className="wds-step__desc">{step.description}</span>}
              {step.badge && <span className="wds-step__badge">{step.badge}</span>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default Stepper;
