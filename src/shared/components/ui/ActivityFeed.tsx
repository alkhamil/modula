import type { ReactNode } from 'react';
import Avatar from './Avatar';

export interface ActivityItem {
  /** Nama pelaku (untuk inisial avatar bila `avatar` kosong). */
  name: string;
  /** Deskripsi singkat di bawah nama, mis. "uploaded a file". */
  action?: ReactNode;
  /** Waktu / meta. */
  time?: ReactNode;
  avatar?: ReactNode;
  /** Elemen di kanan header, mis. tombol menu titik tiga (Figma "Show Action"). */
  menu?: ReactNode;
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
              <div className="wds-feed__header">
                <p className="wds-feed__title">
                  <strong>{item.name}</strong>
                  {item.time && <span className="wds-feed__time">{item.time}</span>}
                </p>
                {item.menu}
              </div>
              {item.action && <p className="wds-feed__desc">{item.action}</p>}
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
