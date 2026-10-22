import type { ComponentProps } from 'react';
import { Card, EmptyState } from '../../../../shared/components/ui';

/** Demo Card: lebar tetap agar tidak mengecil di preview yang diposisikan center. */
export function CardDemo(props: ComponentProps<typeof Card>) {
  return (
    <div className="w-[min(100%,420px)]">
      <Card {...props} />
    </div>
  );
}

export function EmptyStateDemo(props: ComponentProps<typeof EmptyState>) {
  return (
    <div className="w-[min(100%,420px)]">
      <EmptyState {...props} />
    </div>
  );
}
