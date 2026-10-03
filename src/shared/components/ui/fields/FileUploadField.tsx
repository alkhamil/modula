import { useEffect, useRef, useState, type DragEvent } from 'react';
import { FieldErrorIcon } from '../../icons';

interface FileUploadFieldProps {
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  error?: string;
  accept?: string;
  multiple?: boolean;
  value: File | File[] | null;
  onChange: (files: File | File[] | null) => void;
  className?: string;
  testId?: string;
  'data-testid'?: string;
}

const zoneSizeStyles: Record<string, string> = {
  sm: 'p-4 text-xs',
  md: 'p-6 text-sm',
  lg: 'p-8 text-base',
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FileUploadField({
  size = 'md',
  disabled = false,
  error,
  accept,
  multiple = false,
  value,
  onChange,
  className = '',
  testId,
  'data-testid': dataTestId,
}: FileUploadFieldProps) {
  const resolvedTestId = dataTestId ?? testId;
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  // Progress simulasi client-side (mock-only: tanpa upload nyata).
  const [progress, setProgress] = useState<number | null>(null);
  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (progressTimer.current) clearInterval(progressTimer.current);
    };
  }, []);

  function startProgress() {
    if (progressTimer.current) clearInterval(progressTimer.current);
    setProgress(0);
    progressTimer.current = setInterval(() => {
      setProgress((current) => {
        if (current === null) return null;
        const next = current + 25;
        if (next >= 100) {
          if (progressTimer.current) clearInterval(progressTimer.current);
          progressTimer.current = null;
          return null;
        }
        return next;
      });
    }, 150);
  }

  function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    if (multiple) {
      const existing = Array.isArray(value) ? value : [];
      onChange([...existing, ...Array.from(fileList)]);
    } else {
      onChange(fileList[0]);
    }
    startProgress();
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

  function handleRemove(e: React.MouseEvent, index?: number) {
    e.stopPropagation();
    if (multiple && Array.isArray(value) && index !== undefined) {
      const rest = value.filter((_, i) => i !== index);
      onChange(rest.length > 0 ? rest : null);
      return;
    }
    onChange(null);
  }

  const files: File[] = multiple
    ? ((value as File[] | null) ?? [])
    : value
      ? [value as File]
      : [];
  const hasFile = files.length > 0;
  const uploading = progress !== null && hasFile;

  return (
    <div data-testid={resolvedTestId} className={className}>
      <div
        onClick={() => !disabled && !uploading && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={[
          'relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors',
          error
            ? 'border-danger'
            : dragging
              ? 'border-primary bg-primary/10'
              : 'border-border hover:border-muted-foreground',
          disabled || uploading ? 'cursor-not-allowed bg-muted' : '',
          zoneSizeStyles[size],
        ].join(' ')}
      >
        {error && (
          <span className="absolute top-2 right-3">
            <FieldErrorIcon className="h-3.5 w-3.5" />
          </span>
        )}
        {uploading ? (
          <div className="flex w-full flex-col items-center gap-2">
            <span className="text-foreground">
              Mengunggah {files.length > 1 ? `${files.length} file` : (files[0]?.name ?? '')}…
            </span>
            <div
              data-testid={resolvedTestId ? `${resolvedTestId}-progress` : undefined}
              className="h-2 w-full max-w-xs overflow-hidden rounded-full bg-muted"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full rounded-full bg-primary transition-[width]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">{progress}%</span>
          </div>
        ) : hasFile ? (
          <div className="flex w-full flex-col items-center gap-2">
            {files.map((file, i) => (
              <div
                key={`${file.name}-${i}`}
                className="flex w-full max-w-xs items-center justify-between gap-2 rounded-md border border-border bg-surface px-3 py-1.5"
              >
                <span className="min-w-0 truncate text-foreground" title={file.name}>
                  {file.name}
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {formatBytes(file.size)}
                </span>
                {!disabled && (
                  <button
                    type="button"
                    onClick={(e) => handleRemove(e, multiple ? i : undefined)}
                    className="shrink-0 text-xs font-medium text-danger hover:text-danger/80"
                    aria-label={`Hapus ${file.name}`}
                  >
                    Hapus
                  </button>
                )}
              </div>
            ))}
            {multiple && !disabled && (
              <span className="text-xs text-muted-foreground">
                Klik atau drop untuk menambah file
              </span>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1 text-muted-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-8 w-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 16.5V9.75m0 0l-3 3m3-3l3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
              />
            </svg>
            <span>Drop file atau klik untuk mengunggah</span>
          </div>
        )}
      </div>
      <input
        data-testid={resolvedTestId ? `${resolvedTestId}-input` : undefined}
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />
      {error && (
        <p
          data-testid={resolvedTestId ? `${resolvedTestId}-error` : undefined}
          className="mt-1 text-xs text-danger"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default FileUploadField;
