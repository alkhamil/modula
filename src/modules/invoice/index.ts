export { default as InvoiceListPage } from './pages/InvoiceListPage';
export { default as InvoiceCreatePage } from './pages/InvoiceCreatePage';
export { default as InvoiceViewPage } from './pages/InvoiceViewPage';
export { default as InvoiceEditPage } from './pages/InvoiceEditPage';
import { addModuleLocales } from '../../shared/i18n';
import enInvoiceLocale from './i18n/en.json';
import idInvoiceLocale from './i18n/id.json';

addModuleLocales({ en: [enInvoiceLocale], id: [idInvoiceLocale] });
