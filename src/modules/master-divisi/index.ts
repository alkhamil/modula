export { default as MasterDivisiListPage } from './pages/MasterDivisiListPage';
export { default as MasterDivisiCreatePage } from './pages/MasterDivisiCreatePage';
export { default as MasterDivisiViewPage } from './pages/MasterDivisiViewPage';
export { default as MasterDivisiEditPage } from './pages/MasterDivisiEditPage';
import { addModuleLocales } from '../../shared/i18n';
import enMasterDivisiLocale from './i18n/en.json';
import idMasterDivisiLocale from './i18n/id.json';

addModuleLocales({ en: [enMasterDivisiLocale], id: [idMasterDivisiLocale] });
