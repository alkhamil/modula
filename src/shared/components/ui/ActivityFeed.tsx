import type { ReactNode } from 'react';
import Avatar from './Avatar';

export interface ActivityItem {
  /** Nama pelaku (untuk inisial avatar bila `avatar` kosong). */
  name: string;
  /** Aksi singkat, mis. "uploaded a file". */
  action?: ReactNode;
  /** Waktu / meta. */
  time?: ReactNode;
  avatar?: ReactNode;
  /** Tipe konten (Activity feed types): default | file | labels | text | chat. */
  type?: 'default' | 'file' | 'labels' | 'text' | 'chat';
  /** File terlampir (type file). */
  file?: { name: string; size?: string };
  /** Label (type labels). */
  labels?: ReactNode[];
  /** Isi teks atau pesan (type text / chat). */
  text?: ReactNode;
}

interface ActivityFeedProps {
  items: ActivityItem[];
  className?: string;
  testId?: string;
}

/** Activity Feed WDS: linimasa aktivitas dengan avatar, konektor, dan konten per tipe. */
function ActivityFeed({ items, className = '', testId }: ActivityFeedProps) {
  return (
    <ol data-testid={testId} className={`wds-feed ${className}`}>
      {items.map((item, i) => {
        const type = item.type ?? 'default';
        return (
          <li key={i} data-last={i === items.length - 1 || undefined} className="wds-feed__item">
            <div className="wds-feed__avatar">{item.avatar ?? <Avatar name={item.name} size="sm" />}</div>
            <div className="wds-feed__body">
              <p className="wds-feed__title">
                <strong>{item.name}</strong> {item.action}
              </p>
              {item.time && <p className="wds-feed__hint">{item.time}</p>}
              {type === 'file' && item.file && (
                <div className="wds-feed__file">
                  <span className="wds-feed__file-name">{item.file.name}</span>
                  {item.file.size && <span className="wds-feed__hint">{item.file.size}</span>}
                </div>
              )}
              {type === 'labels' && item.labels && <div className="wds-feed__labels">{item.labels}</div>}
              {(type === 'text' || type === 'chat') && item.text && (
                <div className="wds-feed__text" data-chat={type === 'chat' || undefined}>
                  {item.text}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default ActivityFeed;
