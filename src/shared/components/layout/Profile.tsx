import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';
import { AltArrowDown, AltArrowUp, Logout2, Settings } from '../icons';
import Avatar from '../ui/Avatar';
import { useClickOutside } from '../../hooks';
import LanguageSwitch from '../../i18n/LanguageSwitch';

export interface AvatarUserData {
  name: string;
  roleName?: string;
}

interface ProfileProps {
  user: AvatarUserData | null;
  /** Avatar di sebelah nama (Figma Profile: instance Avatar, bisa disembunyikan). Default tampil. */
  showAvatar?: boolean;
  onLogout?: () => void;
  settingsPath?: string;
  settingsLabel?: string;
  logoutLabel?: string;
  testId?: string;
}

function Profile({
  user,
  showAvatar = true,
  onLogout,
  settingsPath = '/settings',
  settingsLabel,
  logoutLabel,
  testId,
}: ProfileProps) {
  const { t } = useTranslation();
  const resolvedSettingsLabel = settingsLabel ?? t('settings.title');
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
        <div className="wds-profile__text text-center">
          <p className="wds-profile__title">Hi, {firstName}</p>
          <p className="wds-profile__support">{user?.roleName ?? 'User'}</p>
        </div>
        <span className="wds-profile__chevron">
          {dropdownOpen ? <AltArrowUp /> : <AltArrowDown />}
        </span>
      </button>

      {dropdownOpen && (
        <div
          className={[
            'wds-profile__menu absolute right-0 z-50 w-60',
            dropdownAbove ? 'bottom-full mb-2' : 'top-full mt-2',
          ].join(' ')}
        >
          <div className="flex items-center gap-3 px-4 py-3">
            <Avatar name={user?.name ?? initial} size="md" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-(--wds-text-primary)">{user?.name ?? 'User'}</p>
              <p className="truncate text-xs text-(--wds-text-secondary)">
                {user?.roleName ?? 'User'}
              </p>
            </div>
          </div>
          <div className="my-1 border-t border-(--wds-stroke-subtle)" />
          <div className="flex items-center justify-between gap-2 px-4 py-2">
            <span className="whitespace-nowrap text-sm text-(--wds-text-secondary)">{t('auth.language')}</span>
            <LanguageSwitch testId={testId ? `${testId}-language` : undefined} />
          </div>
          <div className="my-1 border-t border-(--wds-stroke-subtle)" />
          <NavLink
            to={settingsPath}
            end
            onClick={() => setDropdownOpen(false)}
            className={({ isActive }) =>
              [
                'flex items-center gap-2 px-4 py-2 text-sm text-(--wds-text-primary) transition-colors hover:bg-(--wds-bg-brand-subtle)',
                isActive ? 'bg-(--wds-bg-brand-subtle) font-medium' : '',
              ].join(' ')
            }
          >
            <Settings className="h-4 w-4 text-(--wds-text-secondary)" />
            {resolvedSettingsLabel}
          </NavLink>
          {onLogout && (
            <>
              <div className="my-1 border-t border-(--wds-stroke-subtle)" />
              <button
                onClick={onLogout}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-(--wds-text-primary) transition-colors hover:bg-(--wds-bg-brand-subtle)"
              >
                <Logout2 className="h-4 w-4 text-(--wds-text-secondary)" />
                {resolvedLogoutLabel}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Profile;
