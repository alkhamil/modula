/**
 * Locale per modul (`<modul>/i18n/<lang>.json`) digabung ke namespace
 * `general` saat startup. File ini milik lapis `app` supaya arah dependensi
 * (`app` → `modules`, `shared` ↛ `modules`) terjaga.
 */
import { addModuleLocales } from '../shared/i18n';
import enDashboard from '../modules/dashboard/i18n/en.json';
import idDashboard from '../modules/dashboard/i18n/id.json';
// __LOCALE_IMPORTS__

addModuleLocales({
  en: [
    enDashboard,
    // __LOCALES_EN__
  ],
  id: [
    idDashboard,
    // __LOCALES_ID__
  ],
});
