import { useTranslation } from 'react-i18next';
import { SelectField } from '../components/ui';
import { APP_LANGUAGES, setAppLanguage, type AppLanguage } from './index';

/** Pemilih bahasa aplikasi (EN/ID) — untuk header shell. */
function LanguageSwitcher({ testId }: { testId?: string }) {
  const { i18n } = useTranslation();
  const current = i18n.language?.startsWith('id') ? 'id' : 'en';
  return (
    <SelectField
      testId={testId ?? 'language-switcher'}
      size="sm"
      value={current}
      onChange={(next) => void setAppLanguage(next as AppLanguage)}
      options={APP_LANGUAGES}
      clearable={false}
    />
  );
}

export default LanguageSwitcher;
