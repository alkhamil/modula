import type { ComponentDoc } from './types';
import { alertDoc } from './content/alert';
import { badgeDoc } from './content/badge';
import { accordionDoc } from './content/accordion';
import { avatarDoc } from './content/avatar';
import { bannerDoc } from './content/banner';
import { breadcrumbsDoc } from './content/breadcrumbs';
import { buttonDoc } from './content/button';
import { cardDoc } from './content/card';
import { checkboxDoc } from './content/checkbox';
import { pageHeaderDoc } from './content/pageHeader';
import { linkDoc } from './content/link';
import { moreDocs } from './content/moreDocs';
import { paginationDoc } from './content/pagination';
import { profileDoc } from './content/profile';
import { progressDoc } from './content/progress';
import { radioDoc } from './content/radio';
import { dialogDoc } from './content/dialog';
import { drawerDoc } from './content/drawer';
import { dividerDoc } from './content/divider';
import { emptyStateDoc } from './content/emptyState';
import { datePickerDoc } from './content/datePicker';
import { fileUploadDoc } from './content/fileUpload';
import { inputFieldDoc } from './content/inputField';
import { ratingDoc } from './content/rating';
import { searchBarDoc } from './content/searchBar';
import { segmentedControlDoc } from './content/segmentedControl';
import { selectDoc } from './content/select';
import { textareaDoc } from './content/textarea';
import { toggleDoc } from './content/toggle';
import { sideNavbarDoc } from './content/sideNavbar';
import { sliderDoc } from './content/slider';
import { stepperDoc } from './content/stepper';
import { tabsDoc } from './content/tabs';
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
  avatarDoc,
  pageHeaderDoc,
  profileDoc,
  sideNavbarDoc,
  dividerDoc,
  tabsDoc,
  breadcrumbsDoc,
  linkDoc,
  accordionDoc,
  progressDoc,
  bannerDoc,
  searchBarDoc,
  stepperDoc,
  sliderDoc,
  ratingDoc,
  segmentedControlDoc,
  ...moreDocs,
  checkboxDoc,
  datePickerDoc,
  fileUploadDoc,
  inputFieldDoc,
  radioDoc,
  selectDoc,
  textareaDoc,
  toggleDoc,
];

/** Kunci locale bersama di `docs.*`; slug dokumen tidak boleh sama agar teksnya tidak tertimpa. */
const RESERVED_KEYS = ['nav', 'index', 'header', 'notFound', 'sections', 'labels', 'playground', 'code', 'categories'];
for (const doc of docs) {
  if (RESERVED_KEYS.includes(doc.slug)) {
    throw new Error(`Slug dokumen "${doc.slug}" bentrok dengan kunci locale bersama docs.${doc.slug}`);
  }
}

export const findDoc = (slug: string | undefined): ComponentDoc | undefined =>
  docs.find((d) => d.slug === slug);
