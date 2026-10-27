import { useEffect, useRef, useState, type DragEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload } from '../../icons';
import RowActionButton from '../RowActionButton';
import FileUploadCard from './FileUploadCard';

interface FileUploadProps {
  /** Ukuran WDS (token Size): xs | sm | md | lg | xl. */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  /** Pesan error: state error + teks di bawah area (warna danger, menggantikan `hint`). */
  error?: string;
  /** Figma "Supporting text": teks di dalam area (mis. format dan ukuran maks). */
  supportingText?: string;
  /** Figma "Show hint · Helper": teks bantu di bawah area (digantikan `error`). */
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
  supportingText,
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
        data-wds-size={size}
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
        <div className="wds-upload__content">
          <span className="wds-upload__icon">
            <Upload />
          </span>
          <span className="wds-upload__text">
            <span className="wds-upload__title">
              <span className="wds-upload__action">{t('upload.clickToUpload')}</span> {t('upload.orDragDrop')}
            </span>
            {supportingText && <span className="wds-upload__supporting">{supportingText}</span>}
          </span>
        </div>
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
      {(files.length > 0 || uploading) && (
        <div className="wds-upload__files">
          {uploading && (
            <FileUploadCard
              testId={resolvedTestId ? `${resolvedTestId}-progress` : undefined}
              name={pendingLabel ?? ''}
              status="uploading"
              progress={progress ?? 0}
            />
          )}
          {files.map((file, i) => (
            <FileUploadCard
              key={`${file.name}-${i}`}
              testId={resolvedTestId ? `${resolvedTestId}-file-${i}` : undefined}
              name={file.name}
              size={formatBytes(file.size)}
              status={disabled ? 'disabled' : 'filled'}
              removeLabel={t('upload.removeFile', { name: file.name })}
              removeTestId={resolvedTestId ? `${resolvedTestId}-delete-${i}` : undefined}
              extraActions={
                <RowActionButton
                  action="view"
                  testId={resolvedTestId ? `${resolvedTestId}-view-${i}` : undefined}
                  title={t('upload.viewFile', { name: file.name })}
                  onClick={() => handleView(file)}
                />
              }
              onRemove={() => handleRemove(multiple ? i : undefined)}
            />
          ))}
        </div>
      )}
      {(error || hint) && (
        <p
          data-testid={error && resolvedTestId ? `${resolvedTestId}-error` : undefined}
          className="wds-upload__helper"
          data-error={error ? 'true' : undefined}
          role={error ? 'alert' : undefined}
        >
          {error ?? hint}
        </p>
      )}
    </div>
  );
}

export default FileUpload;
