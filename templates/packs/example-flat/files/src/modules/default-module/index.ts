export { default as DefaultModuleListPage } from './pages/DefaultModuleListPage';
export { default as DefaultModuleCreatePage } from './pages/DefaultModuleCreatePage';
export { default as DefaultModuleViewPage } from './pages/DefaultModuleViewPage';
export { default as DefaultModuleEditPage } from './pages/DefaultModuleEditPage';
import { addModuleLocales } from '../../shared/i18n';
import enDefaultModuleLocale from './i18n/en.json';
import idDefaultModuleLocale from './i18n/id.json';

addModuleLocales({ en: [enDefaultModuleLocale], id: [idDefaultModuleLocale] });
