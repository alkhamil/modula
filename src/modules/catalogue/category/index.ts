export { default as CategoryListPage } from './pages/CategoryListPage';
export { default as CategoryCreatePage } from './pages/CategoryCreatePage';
export { default as CategoryViewPage } from './pages/CategoryViewPage';
export { default as CategoryEditPage } from './pages/CategoryEditPage';
import { addModuleLocales } from '../../../shared/i18n';
import enCategoryLocale from './i18n/en.json';
import idCategoryLocale from './i18n/id.json';

addModuleLocales({ en: [enCategoryLocale], id: [idCategoryLocale] });
