export { default as DefaultRecordListPage } from './pages/DefaultRecordListPage';
export { default as DefaultRecordCreatePage } from './pages/DefaultRecordCreatePage';
export { default as DefaultRecordViewPage } from './pages/DefaultRecordViewPage';
export { default as DefaultRecordEditPage } from './pages/DefaultRecordEditPage';
import { addModuleLocales } from '../../../shared/i18n';
import enDefaultRecordLocale from './i18n/en.json';
import idDefaultRecordLocale from './i18n/id.json';

addModuleLocales({ en: [enDefaultRecordLocale], id: [idDefaultRecordLocale] });
