import type { ComponentProps } from 'react';
import { Alert, Button, Dialog, Drawer, Tooltip } from '../../../../shared/components/ui';

/** Demo Tooltip: pemicu berupa tombol; tooltip tampil saat hover/fokus/klik. */
export function TooltipDemo(props: Omit<ComponentProps<typeof Tooltip>, 'children'>) {
  return (
    <Tooltip {...props}>
      <Button hierarchy="secondary">Hover me</Button>
    </Tooltip>
  );
}

/** Demo Alert: lebar tetap agar tidak mengecil mengikuti isi di preview yang diposisikan center. */
export function AlertDemo(props: ComponentProps<typeof Alert>) {
  return (
    <div className="w-[min(100%,420px)]">
      <Alert {...props} />
    </div>
  );
}

/** Demo Dialog: panel inline (static) agar tampil di preview tanpa backdrop. */
export function DialogDemo(props: Omit<ComponentProps<typeof Dialog>, 'open' | 'onClose' | 'static'>) {
  return (
    <div className="w-[min(100%,440px)]">
      <Dialog {...props} open static onClose={() => {}} maxWidth="md" />
    </div>
  );
}

/** Demo Drawer: panel inline setinggi kotak preview. */
export function DrawerDemo(props: Omit<ComponentProps<typeof Drawer>, 'open' | 'onClose' | 'static'>) {
  return (
    <div className="flex h-[210px] w-full justify-end overflow-hidden">
      <Drawer {...props} open static onClose={() => {}} />
    </div>
  );
}
