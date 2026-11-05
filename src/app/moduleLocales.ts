/**
 * Locale per modul (`<modul>/i18n/<lang>.json`) digabung ke namespace
 * `general` saat startup. File ini milik lapis `app` supaya arah
 * dependensi (`app` → `modules`, `shared` ↛ `modules`) terjaga.
 */
import { addModuleLocales } from '../shared/i18n';
import enCreator from '../modules/creator/i18n/en.json';
import idCreator from '../modules/creator/i18n/id.json';
import enGenerator from '../modules/generator/i18n/en.json';
import idGenerator from '../modules/generator/i18n/id.json';

addModuleLocales({
  en: [enCreator, enGenerator],
  id: [idCreator, idGenerator],
});
