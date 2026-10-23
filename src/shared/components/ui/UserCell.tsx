import type { ReactNode } from 'react';
import Avatar from './Avatar';

interface UserCellProps {
  name: string;
  /** Teks pendukung di bawah nama, mis. email. */
  supporting?: ReactNode;
  src?: string;
  online?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  testId?: string;
}

/** User Cell WDS: avatar + nama + teks pendukung, dipakai di sel Table dan daftar. */
function UserCell({ name, supporting, src, online, size = 'sm', className = '', testId }: UserCellProps) {
  return (
    <div data-testid={testId} className={`wds-user-cell ${className}`}>
      <Avatar name={name} src={src} online={online} size={size} />
      <div className="wds-user-cell__text">
        <span className="wds-user-cell__name">{name}</span>
        {supporting && <span className="wds-user-cell__support">{supporting}</span>}
      </div>
    </div>
  );
}

export default UserCell;
