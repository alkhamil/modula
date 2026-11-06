import type { UiStyle } from '../../shared/theme';

/** Gaya tampilan di wizard. `ready: false` tampil sebagai "segera hadir" dan tidak bisa dipilih. */
export const UI_STYLE_OPTIONS: { id: UiStyle; ready: boolean }[] = [
  { id: 'classic', ready: true },
  { id: 'light', ready: true },
  { id: 'top', ready: false },
  { id: 'rail', ready: false },
  { id: 'floating', ready: false },
];
