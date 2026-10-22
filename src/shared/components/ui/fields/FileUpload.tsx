import { useEffect, useRef, useState, type DragEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Upload } from '../../icons';
import RowActionButton from '../RowActionButton';

interface FileUploadProps {
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  error?: string;
  /** Teks pendukung di bawah area (mis. format dan ukuran maks). */
  hint?: string;
  accept?: string;
  multiple?: boolean;
  value: File | File[] | null;
  onChange: (files: File | File[] | null) => void;
  className?: string;
  testId?: string;
  'data-testid'?: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FileUpload({
  size = 'md',
  disabled = false,
  error,
  hint,
  accept,
  multiple = false,
  value,
  onChange,
  className = '',
  testId,
  'data-testid': dataTestId,
}: FileUploadProps) {
  const { t } = useTranslation();
  const resolvedTestId = dataTestId ?? testId;
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  // Progress simulasi client-side (mock-only: tanpa upload nyata).
  const [progress, setProgress] = useState<number | null>(null);
  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  // Counter sinkron (updater setState berjalan saat render, jadi tak bisa dipakai deteksi selesai).
  const progressValue = useRef<number>(0);
  // Object URL untuk view file (direvoke saat unmount / kedaluwarsa).
  const objectUrls = useRef<string[]>([]);
  // Label file yang sedang diunggah (kartu baru ditempel setelah progress beres).
  const [pendingLabel, setPendingLabel] = useState<string | null>(null);
  // Ref nilai terkini agar commit setelah upload tak menghidupkan file yang sempat dihapus.
  const valueRef = useRef(value);

  useEffect(() => {
    const urls = objectUrls.current;
    return () => {
      if (progressTimer.current) clearInterval(progressTimer.current);
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  function startProgress(onDone: () => void) {
    if (progressTimer.current) clearInterval(progressTimer.current);
    progressValue.current = 0;
    setProgress(0);
    progressTimer.current = setInterval(() => {
      const next = progressValue.current + 25;
      if (next >= 100) {
        if (progressTimer.current) clearInterval(progressTimer.current);
        progressTimer.current = null;
        progressValue.current = 0;
        setProgress(null);
        setPendingLabel(null);
        onDone();
        return;
      }
      progressValue.current = next;
      setProgress(next);
    }, 150);
  }

  function handleFiles(fileList: FileList | null) {
    // Abaikan file baru selama upload sebelumnya belum beres.
    if (!fileList || fileList.length === 0 || disabled || progressTimer.current) return;
    const incoming = Array.from(fileList);
    setPendingLabel(
      incoming.length > 1
        ? t('upload.fileCount', { count: incoming.length })
        : (incoming[0]?.name ?? ''),
    );
    startProgress(() => {
      if (multiple) {
        const existing = Array.isArray(valueRef.current) ? valueRef.current : [];
        onChange([...existing, ...incoming]);
      } else {
        const first = incoming[0];
        if (first) onChange(first);
      }
    });
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    handleFiles(e.dataTransfer.files);
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    if (!disabled) setDragging(true);
  }

  function handleDragLeave() {
    setDragging(false);
  }

  function handleRemove(index?: number) {
    if (multiple && Array.isArray(value) && index !== undefined) {
      const rest = value.filter((_, i) => i !== index);
      onChange(rest.length > 0 ? rest : null);
      return;
    }
    onChange(null);
  }

  function handleView(file: File) {
    const url = URL.createObjectURL(file);
    objectUrls.current.push(url);
    window.open(url, '_blank', 'noopener');
    // Revoke tertunda agar tab baru sempat memuat; unmount merevoke sisanya.
    window.setTimeout(() => {
      URL.revokeObjectURL(url);
      objectUrls.current = objectUrls.current.filter((u) => u !== url);
    }, 60000);
  }

  const files: File[] = multiple
    ? ((value as File[] | null) ?? [])
    : value
      ? [value as File]
      : [];
  const uploading = progress !== null;

  return (
    <div data-testid={resolvedTestId} className={className}>
      <div
        role="button"
        tabIndex={disabled || uploading ? -1 : 0}
        aria-disabled={disabled || undefined}
        data-wds-size={size === 'lg' ? 'lg' : size === 'sm' ? 'sm' : 'md'}
        data-state={disabled ? 'disabled' : error ? 'error' : dragging ? 'hover' : 'default'}
        onClick={() => !disabled && !uploading && inputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !disabled && !uploading) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className="wds-upload"
      >
        {uploading ? (
          <div className="flex w-full flex-col items-center gap-2">
            <span className="wds-upload__title">
              {t('upload.uploading', { target: pendingLabel ?? '' })}
            </span>
            <div
              data-testid={resolvedTestId ? `${resolvedTestId}-progress` : undefined}
              className="wds-upload__track"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div className="wds-upload__fill" style={{ width: `${progress}%` }} />
            </div>
            <span className="wds-upload__hint">{progress}%</span>
          </div>
        ) : (
          <>
            <span className="wds-upload__icon">
              <Upload />
            </span>
            <span className="wds-upload__title">{t('upload.dropHint')}</span>
            {hint && <span className="wds-upload__hint">{hint}</span>}
          </>
        )}
      </div>
      <input
        data-testid={resolvedTestId ? `${resolvedTestId}-input` : undefined}
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = '';
        }}
        className="hidden"
      />
      {files.length > 0 && (
        <div className="wds-upload__files">
          {files.map((file, i) => (
            <div
              key={`${file.name}-${i}`}
              data-testid={resolvedTestId ? `${resolvedTestId}-file-${i}` : undefined}
              className="wds-file-card"
            >
              <span className="wds-file-card__icon">
                <FileText />
              </span>
              <div className="min-w-0 flex-1">
                <p className="wds-file-card__name" title={file.name}>
                  {file.name}
                </p>
                <p className="wds-file-card__meta">{formatBytes(file.size)}</p>
              </div>
              <RowActionButton
                action="view"
                testId={resolvedTestId ? `${resolvedTestId}-view-${i}` : undefined}
                title={t('upload.viewFile', { name: file.name })}
                onClick={() => handleView(file)}
              />
              {!disabled && (
                <RowActionButton
                  action="delete"
                  testId={resolvedTestId ? `${resolvedTestId}-delete-${i}` : undefined}
                  title={t('upload.removeFile', { name: file.name })}
                  onClick={() => handleRemove(multiple ? i : undefined)}
                />
              )}
            </div>
          ))}
        </div>
      )}
      {error && (
        <p
          data-testid={resolvedTestId ? `${resolvedTestId}-error` : undefined}
          className="wds-upload__error"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default FileUpload;
