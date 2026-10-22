import type { ReactNode } from 'react';

export interface StepItem {
  title: ReactNode;
  description?: ReactNode;
  /** Paksa state langkah ini; default diturunkan dari `current`. */
  status?: 'upcoming' | 'current' | 'completed' | 'error';
}

interface StepperProps {
  steps: StepItem[];
  /** Indeks langkah aktif (0-based). */
  current: number;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  testId?: string;
}

/** Stepper WDS: indikator langkah dengan state upcoming / current / completed / error. */
function Stepper({ steps, current, orientation = 'horizontal', className = '', testId }: StepperProps) {
  return (
    <ol
      data-testid={testId}
      data-orientation={orientation}
      className={`wds-stepper ${className}`}
    >
      {steps.map((step, i) => {
        const status = step.status ?? (i < current ? 'completed' : i === current ? 'current' : 'upcoming');
        return (
          <li
            key={i}
            data-status={status}
            aria-current={status === 'current' ? 'step' : undefined}
            className="wds-step"
          >
            <span className="wds-step__indicator">
              {status === 'completed' ? <span className="wds-step__check" /> : i + 1}
            </span>
            <span className="wds-step__text">
              <span className="wds-step__title">{step.title}</span>
              {step.description && <span className="wds-step__desc">{step.description}</span>}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export default Stepper;
