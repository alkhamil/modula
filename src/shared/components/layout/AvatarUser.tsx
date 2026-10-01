import { useState, useCallback } from 'react';
import { NavLink } from 'react-router';
import { useClickOutside } from '../../hooks';

export interface AvatarUserData {
  name: string;
  roleName?: string;
}

interface AvatarUserProps {
  user: AvatarUserData | null;
  onLogout?: () => void;
  profilePath?: string;
  profileLabel?: string;
  logoutLabel?: string;
  testId?: string;
}

function AvatarUser({
  user,
  onLogout,
  profilePath = '/profile',
  profileLabel = 'Profile',
  logoutLabel = 'Logout',
  testId,
}: AvatarUserProps) {
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
        className="flex items-center gap-3 rounded-lg p-1.5"
      >
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium leading-tight text-foreground">Hi, {firstName}</p>
          <p className="text-xs leading-tight text-muted-foreground">
            {user?.roleName ?? 'User'}
          </p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
          {initial}
        </div>
      </button>

      {dropdownOpen && (
        <div
          className={[
            'absolute right-0 z-50 min-w-44 rounded-lg border border-border bg-background py-1 shadow-xl',
            dropdownAbove ? 'bottom-full mb-2' : 'top-full mt-2',
          ].join(' ')}
        >
          <NavLink
            to={profilePath}
            end
            onClick={() => setDropdownOpen(false)}
            className={({ isActive }) =>
              [
                'block px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted',
                isActive ? 'bg-muted font-medium' : '',
              ].join(' ')
            }
          >
            {profileLabel}
          </NavLink>
          {onLogout && (
            <>
              <div className="my-1 border-t border-border" />
              <button
                onClick={onLogout}
                className="block w-full px-4 py-2 text-left text-sm text-foreground transition-colors hover:bg-muted"
              >
                {logoutLabel}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default AvatarUser;
