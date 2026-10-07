export { default as ProductListPage } from './pages/ProductListPage';
export { default as ProductCreatePage } from './pages/ProductCreatePage';
export { default as ProductViewPage } from './pages/ProductViewPage';
export { default as ProductEditPage } from './pages/ProductEditPage';
import { addModuleLocales } from '../../shared/i18n';
import enProductLocale from './i18n/en.json';
import idProductLocale from './i18n/id.json';

addModuleLocales({ en: [enProductLocale], id: [idProductLocale] });
