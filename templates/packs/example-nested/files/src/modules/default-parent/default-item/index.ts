export { default as DefaultItemListPage } from './pages/DefaultItemListPage';
export { default as DefaultItemCreatePage } from './pages/DefaultItemCreatePage';
export { default as DefaultItemViewPage } from './pages/DefaultItemViewPage';
export { default as DefaultItemEditPage } from './pages/DefaultItemEditPage';
import { addModuleLocales } from '../../../shared/i18n';
import enDefaultItemLocale from './i18n/en.json';
import idDefaultItemLocale from './i18n/id.json';

addModuleLocales({ en: [enDefaultItemLocale], id: [idDefaultItemLocale] });
