export { default as TypographyPage } from './pages/TypographyPage';
export { default as ColorsPage } from './pages/ColorsPage';
export { default as IconsPage } from './pages/IconsPage';
export { default as UiPage } from './pages/UiPage';
export { default as ComponentsIndexPage } from './pages/ComponentsIndexPage';
export { default as ComponentDocPage } from './pages/ComponentDocPage';
import { addModuleLocales } from '../../shared/i18n';
import enShowcaseLocale from './i18n/en.json';
import idShowcaseLocale from './i18n/id.json';

addModuleLocales({ en: [enShowcaseLocale], id: [idShowcaseLocale] });
