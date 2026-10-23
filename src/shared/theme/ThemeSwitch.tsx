import { useTranslation } from 'react-i18next';
import { Moon, Sun } from '../components/icons';
import { useTheme } from './ThemeContext';
import type { ThemeName } from './theme';

const OPTIONS: { value: ThemeName; Icon: typeof Sun }[] = [
  { value: 'light', Icon: Sun },
  { value: 'dark', Icon: Moon },
];

/** Switch thema Light / Dark (ikon matahari / bulan) — untuk menu dropdown profil. */
function ThemeSwitch({ testId }: { testId?: string }) {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  return (
    <div data-testid={testId ?? 'theme-switch'} role="group" aria-label={t('theme.label')} className="wds-theme-switch">
      {OPTIONS.map(({ value, Icon }) => (
        <button
          key={value}
          type="button"
          data-testid={`${testId ?? 'theme-switch'}-${value}`}
          aria-pressed={theme === value}
          aria-label={t(`theme.${value}`)}
          title={t(`theme.${value}`)}
          onClick={() => setTheme(value)}
          className="wds-theme-switch__btn"
        >
          <Icon />
        </button>
      ))}
    </div>
  );
}

export default ThemeSwitch;
