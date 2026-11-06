import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';
import { AltArrowDown, AltArrowUp, Logout2, Settings } from '../icons';
import Avatar from '../ui/Avatar';
import { useClickOutside } from '../../hooks';
import LanguageSwitch from '../../i18n/LanguageSwitch';
import ThemeSwitch from '../../theme/ThemeSwitch';

export interface AvatarUserData {
  name: string;
  roleName?: string;
}

interface ProfileProps {
  user: AvatarUserData | null;
  /** Avatar di sebelah nama (Figma Profile: instance Avatar, bisa disembunyikan). Default disembunyikan, seperti di Figma. */
  showAvatar?: boolean;
  onLogout?: () => void;
  settingsPath?: string;
  settingsLabel?: string;
  logoutLabel?: string;
  testId?: string;
}

function Profile({
  user,
  showAvatar = false,
  onLogout,
  settingsPath = '/settings',
  settingsLabel,
  logoutLabel,
  testId,
}: ProfileProps) {
  const { t } = useTranslation();
  const resolvedSettingsLabel = settingsLabel ?? t('settings.title', { defaultValue: t('auth.settings', { defaultValue: 'Pengaturan' }) });
  const resolvedLogoutLabel = logoutLabel ?? t('auth.logout');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownAbove, setDropdownAbove] = useState(false);
  const dropdownRef = useClickOutside<HTMLDivElement>(
    useCallback(() => setDropdownOpen(false), []),
  );

  const firstName = user?.name.split(' ')[0] ?? 'User';
  const initial = user ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div data-testid={testId} className="relative" ref={dropdownRef}>
      <button
        onClick={() => {
          if (!dropdownOpen && dropdownRef.current) {
            const rect = dropdownRef.current.getBoundingClientRect();
            setDropdownAbove(window.innerHeight - rect.bottom < 200);
          }
          setDropdownOpen(!dropdownOpen);
        }}
        type="button"
        aria-expanded={dropdownOpen}
        data-state={dropdownOpen ? 'active' : undefined}
        className="wds-profile"
      >
        {showAvatar && <Avatar name={user?.name ?? initial} size="md" />}
        <div className="wds-profile__text text-right">
          <p className="wds-profile__title">Hi, {firstName}</p>
          <p className="wds-profile__support">{user?.roleName ?? 'User'}</p>
        </div>
        <span className="wds-profile__chevron">
          {dropdownOpen ? <AltArrowUp /> : <AltArrowDown />}
        </span>
      </button>

      {dropdownOpen && (
        <div
          role="menu"
          className={[
            'wds-menu wds-profile__menu absolute right-0 z-50 w-60',
            dropdownAbove ? 'bottom-full mb-2' : 'top-full mt-2',
          ].join(' ')}
        >
          <NavLink
            to={settingsPath}
            end
            role="menuitem"
            onClick={() => setDropdownOpen(false)}
            data-state="default"
            className={({ isActive }) => `wds-menu__item ${isActive ? 'wds-menu__item--current' : ''}`}
          >
            <span className="wds-menu__icon">
              <Settings />
            </span>
            <span className="wds-menu__text">{resolvedSettingsLabel}</span>
          </NavLink>
          <div className="wds-profile__language">
            <span>{t('auth.language')}</span>
            <LanguageSwitch testId={testId ? `${testId}-language` : undefined} />
          </div>
          <div className="wds-profile__language">
            <span>{t('theme.label')}</span>
            <ThemeSwitch testId={testId ? `${testId}-theme` : undefined} />
          </div>
          {onLogout && (
            <button type="button" role="menuitem" data-state="destructive" onClick={onLogout} className="wds-menu__item">
              <span className="wds-menu__icon">
                <Logout2 />
              </span>
              <span className="wds-menu__text">{resolvedLogoutLabel}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default Profile;
