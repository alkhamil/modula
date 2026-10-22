import type { ComponentDoc } from './types';
import { alertDoc } from './content/alert';
import { badgeDoc } from './content/badge';
import { buttonDoc } from './content/button';
import { cardDoc } from './content/card';
import { checkboxDoc } from './content/checkbox';
import { paginationDoc } from './content/pagination';
import { radioDoc } from './content/radio';
import { dialogDoc } from './content/dialog';
import { drawerDoc } from './content/drawer';
import { emptyStateDoc } from './content/emptyState';
import { datePickerDoc } from './content/datePicker';
import { inputFieldDoc } from './content/inputField';
import { selectDoc } from './content/select';
import { textareaDoc } from './content/textarea';
import { toggleDoc } from './content/toggle';
import { tableDoc } from './content/table';
import { tableToolbarDoc } from './content/tableToolbar';
import { tooltipDoc } from './content/tooltip';

/** Daftar dokumentasi komponen (tambahkan komponen baru di sini). */
export const docs: ComponentDoc[] = [
  buttonDoc,
  alertDoc,
  badgeDoc,
  tooltipDoc,
  dialogDoc,
  drawerDoc,
  paginationDoc,
  tableDoc,
  tableToolbarDoc,
  cardDoc,
  emptyStateDoc,
  checkboxDoc,
  datePickerDoc,
  inputFieldDoc,
  radioDoc,
  selectDoc,
  textareaDoc,
  toggleDoc,
];

export const findDoc = (slug: string | undefined): ComponentDoc | undefined =>
  docs.find((d) => d.slug === slug);
