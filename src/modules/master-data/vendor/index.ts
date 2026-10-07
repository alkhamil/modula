export { default as VendorListPage } from './pages/VendorListPage';
export { default as VendorCreatePage } from './pages/VendorCreatePage';
export { default as VendorViewPage } from './pages/VendorViewPage';
export { default as VendorEditPage } from './pages/VendorEditPage';
import { addModuleLocales } from '../../../shared/i18n';
import enVendorLocale from './i18n/en.json';
import idVendorLocale from './i18n/id.json';

addModuleLocales({ en: [enVendorLocale], id: [idVendorLocale] });
