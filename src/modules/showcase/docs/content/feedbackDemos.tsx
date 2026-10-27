import { Children, Fragment, cloneElement, isValidElement, useState, type ComponentProps, type ReactNode } from 'react';
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

/** Tombol di footer contoh menutup panel (footer di data docs berupa fragment tombol statis). */
function closeFooter(footer: ReactNode, close: () => void): ReactNode {
  if (!isValidElement<{ children?: ReactNode }>(footer) || footer.type !== Fragment) return footer;
  return Children.map(footer.props.children, (child) => (isValidElement<{ onClick?: () => void }>(child) ? cloneElement(child, { onClick: close }) : child));
}

/** Demo Dialog: tombol "Open dialog" membuka dialog sungguhan (backdrop, Esc, tombol tutup). */
export function DialogDemo(props: Omit<ComponentProps<typeof Dialog>, 'open' | 'onClose' | 'static'>) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <Dialog {...props} footer={closeFooter(props.footer, close)} open={open} onClose={close} />
    </>
  );
}

/** Demo Drawer: tombol "Open drawer" membuka drawer sungguhan dari sisi kanan. */
export function DrawerDemo(props: Omit<ComponentProps<typeof Drawer>, 'open' | 'onClose' | 'static'>) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open drawer</Button>
      <Drawer {...props} footer={closeFooter(props.footer, close)} open={open} onClose={close} />
    </>
  );
}
