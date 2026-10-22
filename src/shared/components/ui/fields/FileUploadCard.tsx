import type { ReactNode } from 'react';
import { DangerCircle, FileText, Restart, TrashBinTrash } from '../../icons';

interface FileUploadCardProps {
  name: string;
  /** Ukuran file terformat, mis. "200 KB". */
  size?: string;
  /** State WDS (File Upload Cards states): uploading | uploaded | error | filled | disabled. */
  status?: 'uploading' | 'uploaded' | 'error' | 'filled' | 'disabled';
  /** Progres 0–100 (state uploading). */
  progress?: number;
  /** Teks status (default: "File uploaded" / "Upload failed, please try again"). */
  statusText?: ReactNode;
  /** Tipe progres WDS: bar (di bawah teks) | fill (latar terisi). */
  progressType?: 'bar' | 'fill';
  onRetry?: () => void;
  onRemove?: () => void;
  /** Aksi tambahan sebelum tombol hapus (mis. lihat file). */
  extraActions?: ReactNode;
  removeLabel?: string;
  removeTestId?: string;
  retryLabel?: string;
  className?: string;
  testId?: string;
}

/** File Upload Card WDS: kartu file dengan progres, status, coba lagi, dan hapus. */
function FileUploadCard({
  name,
  size,
  status = 'filled',
  progress = 0,
  statusText,
  progressType = 'bar',
  onRetry,
  onRemove,
  extraActions,
  removeLabel = 'Remove',
  removeTestId,
  retryLabel = 'Retry',
  className = '',
  testId,
}: FileUploadCardProps) {
  const sub =
    status === 'uploading' || status === 'filled' || status === 'disabled'
      ? size
      : (statusText ?? (status === 'uploaded' ? 'File uploaded' : 'Upload failed, please try again'));
  return (
    <div
      data-testid={testId}
      data-status={status}
      data-progress-type={progressType}
      style={status === 'uploading' && progressType === 'fill' ? { ['--fu-pct' as string]: `${progress}%` } : undefined}
      className={`wds-file-card ${className}`}
    >
      <span className="wds-file-card__icon">{status === 'error' ? <DangerCircle /> : <FileText />}</span>
      <div className="wds-file-card__body">
        <p className="wds-file-card__name" title={name}>
          {name}
        </p>
        {sub && <p className="wds-file-card__meta">{sub}</p>}
        {status === 'uploading' && progressType === 'bar' && (
          <div className="wds-file-card__progress">
            <div className="wds-upload__track" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
              <div className="wds-upload__fill" style={{ width: `${progress}%` }} />
            </div>
            <span className="wds-file-card__pct">{progress}%</span>
          </div>
        )}
      </div>
      {status === 'uploading' && progressType === 'fill' && <span className="wds-file-card__pct">{progress}%</span>}
      {extraActions}
      {status === 'error' && onRetry && (
        <button type="button" aria-label={retryLabel} onClick={onRetry} className="wds-file-card__btn">
          <Restart />
        </button>
      )}
      {onRemove && status !== 'disabled' && (
        <button type="button" data-testid={removeTestId} aria-label={removeLabel} onClick={onRemove} className="wds-file-card__btn" data-danger>
          <TrashBinTrash />
        </button>
      )}
    </div>
  );
}

export default FileUploadCard;
