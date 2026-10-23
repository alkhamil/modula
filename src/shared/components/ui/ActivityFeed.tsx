import type { ReactNode } from 'react';
import { FileText, MenuDotsVertical } from '../icons';
import Avatar from './Avatar';

export interface ActivityItem {
  /** Nama pelaku (untuk inisial avatar bila `avatar` kosong). */
  name: string;
  /** Waktu, mis. "30 mins ago" (di samping nama). */
  time?: ReactNode;
  /** Deskripsi di bawah nama. */
  description?: ReactNode;
  /** Foto profil; tanpa ini avatar berinisial. */
  avatarSrc?: string;
  /** Titik online di avatar. */
  online?: boolean;
  /** Tipe konten (Activity feed type): default | text | file | labels | chat. */
  type?: 'default' | 'text' | 'file' | 'labels' | 'chat';
  /** File terlampir (type file); `icon` menimpa ikon file bawaan. */
  file?: { name: string; size?: string; icon?: ReactNode };
  /** Label / badge (type labels). */
  labels?: ReactNode[];
  /** Isi teks (type text) atau pesan (type chat). */
  text?: ReactNode;
  /** Ganti aksi di kanan (default: tombol titik tiga). */
  action?: ReactNode;
  onAction?: () => void;
}

interface ActivityFeedProps {
  items: ActivityItem[];
  /** Garis putus-putus yang menghubungkan entri (Figma "Show Connector"). */
  showConnector?: boolean;
  /** Titik status di samping entri (Figma "Show _Dot"). */
  showDot?: boolean;
  /** Aksi di akhir entri (Figma "Show Action"). */
  showAction?: boolean;
  /** Style avatar (Figma "Avatar style"): default | rounded. */
  avatarStyle?: 'default' | 'rounded';
  /** Ukuran WDS (token Size): xs | sm | md | lg | xl. */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  testId?: string;
}

/** Activity Feed WDS: linimasa aktivitas dengan avatar, konektor, titik status, aksi, dan konten per tipe. */
function ActivityFeed({
  items,
  showConnector = true,
  showDot = true,
  showAction = true,
  avatarStyle = 'default',
  size = 'md',
  className = '',
  testId,
}: ActivityFeedProps) {
  return (
    <ol data-testid={testId} data-wds-size={size} className={`wds-feed ${className}`}>
      {items.map((item, i) => {
        const type = item.type ?? 'default';
        const last = i === items.length - 1;
        return (
          <li key={i} data-connector={(showConnector && !last) || undefined} className="wds-feed__item">
            <div className="wds-feed__avatar">
              <Avatar name={item.name} src={item.avatarSrc} online={item.online} appearance={avatarStyle} size="md" />
            </div>
            <div className="wds-feed__body">
              <div className="wds-feed__header">
                <div className="wds-feed__heading">
                  <p className="wds-feed__title">
                    <strong>{item.name}</strong>
                    {item.time && <span className="wds-feed__time">{item.time}</span>}
                  </p>
                  {item.description && <p className="wds-feed__desc">{item.description}</p>}
                </div>
                <div className="wds-feed__end">
                  {showDot && <span className="wds-feed__dot" aria-hidden="true" />}
                  {showAction &&
                    (item.action ?? (
                      <button type="button" aria-label="Actions" onClick={item.onAction} className="wds-feed__action">
                        <MenuDotsVertical />
                      </button>
                    ))}
                </div>
              </div>
              {type === 'file' && item.file && (
                <div className="wds-feed__file">
                  <span className="wds-feed__file-icon">{item.file.icon ?? <FileText />}</span>
                  <span className="wds-feed__file-text">
                    <span className="wds-feed__file-name">{item.file.name}</span>
                    {item.file.size && <span className="wds-feed__hint">{item.file.size}</span>}
                  </span>
                </div>
              )}
              {type === 'labels' && item.labels && <div className="wds-feed__labels">{item.labels}</div>}
              {type === 'text' && item.text && <p className="wds-feed__text">{item.text}</p>}
              {type === 'chat' && item.text && <div className="wds-feed__chat">{item.text}</div>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default ActivityFeed;
