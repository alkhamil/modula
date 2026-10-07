export { default as PriceListPage } from './pages/PriceListPage';
export { default as PriceCreatePage } from './pages/PriceCreatePage';
export { default as PriceViewPage } from './pages/PriceViewPage';
export { default as PriceEditPage } from './pages/PriceEditPage';
import { addModuleLocales } from '../../../shared/i18n';
import enPriceLocale from './i18n/en.json';
import idPriceLocale from './i18n/id.json';

addModuleLocales({ en: [enPriceLocale], id: [idPriceLocale] });
