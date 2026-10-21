import type { ComponentDoc } from './types';
import { buttonDoc } from './content/button';
import { checkboxDoc } from './content/checkbox';
import { radioDoc } from './content/radio';
import { toggleDoc } from './content/toggle';

/** Daftar dokumentasi komponen (tambahkan komponen baru di sini). */
export const docs: ComponentDoc[] = [buttonDoc, checkboxDoc, radioDoc, toggleDoc];

export const findDoc = (slug: string | undefined): ComponentDoc | undefined =>
  docs.find((d) => d.slug === slug);
