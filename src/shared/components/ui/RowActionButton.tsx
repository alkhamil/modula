import { Eye, Pen, Restart, TrashBinTrash } from '../icons';

export type RowActionKind = 'view' | 'edit' | 'delete' | 'restore';

/** Warna ikon aksi: `default` = netral (Figma "Action icons": ikon abu-abu gelap); warna semantik hanya bila diminta. */
export type RowActionColor = 'default' | 'info' | 'warning' | 'danger' | 'success' | 'muted';

const ACTION_ICONS = {
  view: Eye,
  edit: Pen,
  delete: TrashBinTrash,
  restore: Restart,
} as const;

const NEUTRAL_ICON = 'text-(--wds-icons-secondary)';
const DEFAULT_ICON_COLORS: Record<RowActionKind, string> = {
  view: NEUTRAL_ICON,
  edit: NEUTRAL_ICON,
  delete: NEUTRAL_ICON,
  restore: NEUTRAL_ICON,
};

const COLOR_CLASSES: Record<Exclude<RowActionColor, 'default'>, string> = {
  info: 'text-info',
  warning: 'text-warning',
  danger: 'text-danger',
  success: 'text-success',
  muted: 'text-muted-foreground',
};

export interface RowActionButtonProps {
  action: RowActionKind;
  /** Ukuran ikon px (default 16). */
  iconSize?: number;
  /** Override warna ikon (default = netral). */
  color?: RowActionColor;
  title?: string;
  testId?: string;
  onClick?: () => void;
  disabled?: boolean;
}

/**
 * Tombol aksi baris tabel standar (lihat/ubah/hapus/restore):
 * tombol `h-7 w-7`, ikon memakai `iconSize` + warna netral (bisa di-override per aksi).
 */
function RowActionButton({
  action,
  iconSize = 16,
  color = 'default',
  title,
  testId,
  onClick,
  disabled = false,
}: RowActionButtonProps) {
  const Icon = ACTION_ICONS[action];
  const colorClass = color === 'default' ? DEFAULT_ICON_COLORS[action] : COLOR_CLASSES[color];
  return (
    <button
      type="button"
      data-testid={testId}
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`flex h-7 w-7 items-center justify-center rounded-md ${
        disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer hover:bg-muted'
      }`}
    >
      <Icon style={{ width: iconSize, height: iconSize }} className={colorClass} />
    </button>
  );
}

export default RowActionButton;
