import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  /** Teks pendukung di bawah judul. */
  description?: ReactNode;
  /** Ilustrasi / ikon di atas judul (Figma "illustration"). */
  illustration?: ReactNode;
  /** Tombol aksi di bawah teks. */
  actions?: ReactNode;
  /** Ukuran WDS (token Size): xs | sm | md | lg | xl. */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  testId?: string;
}

/** Empty State WDS: ilustrasi, judul, teks pendukung, dan aksi — rata tengah. */
function EmptyState({ title, description, illustration, actions, size = 'md', className = '', testId }: EmptyStateProps) {
  return (
    <div data-testid={testId} data-wds-size={size} className={`wds-empty-state ${className}`}>
      <div className="wds-empty-state__illustration">{illustration}</div>
      <div className="wds-empty-state__text">
        <p className="wds-empty-state__title">{title}</p>
        {description && <p className="wds-empty-state__description">{description}</p>}
      </div>
      {actions && <div className="wds-empty-state__actions">{actions}</div>}
    </div>
  );
}

export default EmptyState;
