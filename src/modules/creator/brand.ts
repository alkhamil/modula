import type { BrandAsset } from './engine/compose';
import { wdsPrimitives } from '../../shared/theme/wds.generated';

/** Batas ukuran file logo (byte). */
export const MAX_BRAND_BYTES = 512 * 1024;

const EXT_BY_MIME: Record<string, string> = {
  'image/svg+xml': 'svg',
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
};

export const BRAND_ACCEPT = '.svg,.png,.jpg,.jpeg,.webp,image/svg+xml,image/png,image/jpeg,image/webp';

/** Ekstensi logo yang valid (`svg|png|jpg|webp`) dari tipe/nama file, atau null bila tidak didukung. */
export function brandExtension(file: Pick<File, 'type' | 'name'>): string | null {
  const byMime = EXT_BY_MIME[file.type];
  if (byMime) return byMime;
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (ext === 'jpeg') return 'jpg';
  return ext && ['svg', 'png', 'jpg', 'webp'].includes(ext) ? ext : null;
}

/** Kunci i18n error validasi (`creator.wizard.projectStep.*`), atau null bila file valid. */
export function validateBrandFile(file: File): 'errorType' | 'errorSize' | null {
  if (!brandExtension(file)) return 'errorType';
  if (file.size > MAX_BRAND_BYTES) return 'errorSize';
  return null;
}

/** Baca file logo menjadi aset biner untuk arsip. */
export async function readBrandAsset(file: File): Promise<BrandAsset> {
  const ext = brandExtension(file);
  if (!ext) throw new Error(`Unsupported brand file: ${file.name}`);
  return { ext, bytes: new Uint8Array(await file.arrayBuffer()) };
}

/** Pilihan warna primary dari primitif WDS (`''` = warna brand WDS bawaan). */
export const PRIMARY_PRESETS: { id: string; color: string }[] = [
  { id: 'default', color: '' },
  { id: 'secondary', color: wdsPrimitives['secondary.500'] },
  { id: 'tertiary', color: wdsPrimitives['tertiary.500'] },
  { id: 'success', color: wdsPrimitives['success.500'] },
  { id: 'info', color: wdsPrimitives['info.500'] },
  { id: 'warning', color: wdsPrimitives['warning.500'] },
  { id: 'danger', color: wdsPrimitives['danger.500'] },
  { id: 'neutral', color: wdsPrimitives['neutral.500'] },
];

export const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;
